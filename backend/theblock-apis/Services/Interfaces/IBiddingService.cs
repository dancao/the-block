using theblock_apis.ViewModels;

namespace theblock_apis.Services.Interfaces
{
    public interface IBiddingService
    {
        Task<BidResult> PlaceBidAsync(string userEmail, string vehicleId, decimal bidAmount);
        Task BuyNowAsync(string userEmail, string vehicleId);
    }
}
