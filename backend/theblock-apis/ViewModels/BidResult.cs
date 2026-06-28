using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using theblock_apis.Commons;

namespace theblock_apis.ViewModels
{
    public class BidResult
    {
        [JsonProperty("status")]
        [JsonConverter(typeof(StringEnumConverter))]
        public PlaceBidStatus Status { get; set; } = PlaceBidStatus.Accepted;
        [JsonProperty("message")]
        public string Message { get; set; } = "";
    }
}
