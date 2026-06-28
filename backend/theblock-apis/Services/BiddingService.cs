using Microsoft.EntityFrameworkCore;
using theblock_apis.Commons;
using theblock_apis.Data;
using theblock_apis.Entities;
using theblock_apis.Services.Interfaces;
using theblock_apis.ViewModels;

namespace theblock_apis.Services
{
    public class BiddingService : IBiddingService
    {
        private readonly AppDbContext _dbContext;

        public BiddingService(AppDbContext context)
        {
            _dbContext = context;
        }

        public async Task BuyNowAsync(string userEmail, string vehicleId)
        {
            var bidUser = await _dbContext.Users.FirstOrDefaultAsync(u => u.UserEmail == userEmail);
            if (bidUser == null) throw new UnauthorizedAccessException($"{userEmail} is not registered yet.");

            var isVehicleNotAvail = await _dbContext.VehicleBids.AnyAsync(x => x.VehicleId == vehicleId && x.BidStatus == BidStatus.Accepted);
            var bidVehicle = await _dbContext.VehicleEntities.Where(x => x.Id == vehicleId).FirstOrDefaultAsync();
            if (bidVehicle == null || bidVehicle.BidStatus == BidStatus.Accepted || isVehicleNotAvail)
            {
                throw new ArgumentException("Vehicle is not available to buy.");
            }

            bidVehicle.BidStatus = BidStatus.Accepted;
            bidVehicle.buy_now_user_email = userEmail;
            await _dbContext.SaveChangesAsync();
        }

        public async Task<BidResult> PlaceBidAsync(string userEmail, string vehicleId, decimal bidAmount)
        {
            var bidResult = new BidResult() { Status = PlaceBidStatus.Accepted };

            var bidUser = await _dbContext.Users.FirstOrDefaultAsync(u => u.UserEmail == userEmail);
            if(bidUser == null) throw new UnauthorizedAccessException($"{userEmail} is not registered yet.");

            var isVehicleNotAvail = await _dbContext.VehicleBids.AnyAsync(x => x.VehicleId == vehicleId && x.BidStatus == BidStatus.Accepted);
            var bidVehicle = await _dbContext.VehicleEntities.Where(x => x.Id == vehicleId).FirstOrDefaultAsync();
            if (bidVehicle == null || bidVehicle.BidStatus == BidStatus.Accepted || isVehicleNotAvail)
            {
                bidResult.Status = PlaceBidStatus.VehicleIsNotAvailable;
                bidResult.Message = PlaceBidStatus.VehicleIsNotAvailable.ToString();
                return bidResult;
            }

            if (bidVehicle != null && bidVehicle.reserve_price > 0 && bidVehicle.reserve_price > bidAmount)
            {
                bidResult.Status = PlaceBidStatus.YourBidIsLowerThanReservePrice;
                bidResult.Message = PlaceBidStatus.YourBidIsLowerThanReservePrice.ToString();
                return bidResult;
            }

            var currentBidsQuery = _dbContext.VehicleBids.Where(x => x.UserId == bidUser.Id && x.VehicleId == vehicleId);
            if (currentBidsQuery != null && currentBidsQuery.Count() > Constants.MaxBid)
            {
                bidResult.Status = PlaceBidStatus.TooManyBid;
                bidResult.Message = PlaceBidStatus.TooManyBid.ToString();
                return bidResult;
            }

            decimal maxBid = 0;
            var listBids = await _dbContext.VehicleBids.Where(x => x.VehicleId == vehicleId).Select(x => x.BidAmount).ToListAsync();
            foreach (var bid in listBids) if (bid > maxBid) maxBid = bid; // SQLite cannot apply aggregate operator 'Max' on expressions of type 'decimal'
            if (maxBid > 0 && maxBid >= bidAmount) 
            {
                bidResult.Status = PlaceBidStatus.LowerThanCurrentBid;
                bidResult.Message = PlaceBidStatus.LowerThanCurrentBid.ToString();
                return bidResult;
            }

            if (bidVehicle != null)
            {
                bidVehicle.BidStatus = BidStatus.Pending;
                bidVehicle.BidCount += 1;
                bidVehicle.current_bid = bidAmount;
            }
            var newBid = new VehicleBidEntity()
            {
                Id = Guid.NewGuid().ToString(),
                UserId = bidUser.Id,
                VehicleId = vehicleId,
                BidAmount = bidAmount,
                BidStatus = BidStatus.Pending
            };
            _dbContext.VehicleBids.Add(newBid);
            await _dbContext.SaveChangesAsync();
            
            return bidResult;
        }
    }
}
