using Newtonsoft.Json;

namespace theblock_apis.ViewModels
{
    public class BidRequest
    {
        [JsonProperty("userEmail")]
        public string UserEmail { get; set; } = string.Empty;
        [JsonProperty("vehicleId")]
        public string VehicleId { get; set; } = string.Empty;
        [JsonProperty("bidAmount")]
        public decimal BidAmount { get; set; } = 0;
    }
}
