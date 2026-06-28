
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using theblock_apis.Commons;

namespace theblock_apis.Entities
{
    public class VehicleEntity
    {
        [JsonProperty("id")]
        public string Id { get; set; } = "";

        [JsonProperty("vin")]
        public string Vin { get; set; } = "";

        [JsonProperty("year")]
        public int Year { get; set; }

        [JsonProperty("make")]
        public string Make { get; set; } = "";

        [JsonProperty("model")]
        public string Model { get; set; } = "";

        [JsonProperty("trim")]
        public string Trim { get; set; } = "";

        [JsonProperty("body_style")]
        public string body_style { get; set; } = "";

        [JsonProperty("exterior_color")]
        public string exterior_color { get; set; } = "";

        [JsonProperty("interior_color")]
        public string interior_color { get; set; } = "";

        [JsonProperty("engine")]
        public string Engine { get; set; } = "";

        [JsonProperty("transmission")]
        public string Transmission { get; set; } = "";

        [JsonProperty("drivetrain")]
        public string Drivetrain { get; set; } = "";

        [JsonProperty("odometer_km")]
        public int odometer_km { get; set; }

        [JsonProperty("fuel_type")]
        public string fuel_type { get; set; } = "";

        [JsonProperty("condition_grade")]
        public int ConditionGrade { get; set; }

        [JsonProperty("condition_report")]
        public string condition_report { get; set; } = "";

        [JsonProperty("damage_notes")]
        public List<string> damage_notes { get; set; } = new List<string>();

        [JsonProperty("title_status")]
        public string title_status { get; set; } = "";

        [JsonProperty("province")]
        public string Province { get; set; } = "";

        [JsonProperty("city")]
        public string City { get; set; } = "";

        [JsonProperty("auction_start")]
        public DateTime auction_start { get; set; }

        [JsonProperty("starting_bid")]
        public int starting_bid { get; set; }

        [JsonProperty("reserve_price")]
        public int? reserve_price { get; set; }

        [JsonProperty("buy_now_price")]
        public int? buy_now_price { get; set; } = null;

        [JsonProperty("images")]
        public List<string> Images { get; set; } = new List<string>();

        [JsonProperty("selling_dealership")]
        public string selling_dealership { get; set; } = "";

        [JsonProperty("lot")]
        public string Lot { get; set; } = "";

        [JsonProperty("current_bid")]
        public decimal? current_bid { get; set; }

        [JsonProperty("bid_count")]
        public int BidCount { get; set; }

        [JsonProperty("bidStatus")]
        [JsonConverter(typeof(StringEnumConverter))]
        public BidStatus BidStatus { get; set; } = BidStatus.Pending;
        [JsonProperty("buy_now_user_email")]
        public string buy_now_user_email { get; set; } = "";

        public List<VehicleBidEntity> VehicleBidEntities { get; set; } = [];
    }
}
