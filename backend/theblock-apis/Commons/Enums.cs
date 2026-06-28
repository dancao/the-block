namespace theblock_apis.Commons
{
    public enum BidStatus
    {
        Pending, // allow bidding
        Accepted,
        Rejected
    }

    public enum SearchType
    {   
        All,
        VIN,
        MakeOrModel,
    }

    public enum PlaceBidStatus
    {
        Accepted,
        LowerThanCurrentBid,
        TooManyBid,
        VehicleIsNotAvailable,
        YourBidIsLowerThanReservePrice
    }
}
