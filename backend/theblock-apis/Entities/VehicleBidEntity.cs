using theblock_apis.Commons;

namespace theblock_apis.Entities
{
    public class VehicleBidEntity
    {
        public string Id { get; set; } = "";
        public string VehicleId { get; set; } = "";
        public string UserId { get; set; } = "";
        public decimal BidAmount { get; set; }
        public BidStatus BidStatus { get; set; } = BidStatus.Pending;

        public UserEntity User { get; set; } = null!;
        public VehicleEntity Vehicle { get; set; } = null!;
    }
}
