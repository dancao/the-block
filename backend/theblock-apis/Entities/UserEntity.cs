namespace theblock_apis.Entities
{
    public class UserEntity
    {
        public string Id { get; set; } = "";
        public string UserEmail { get; set; } = "";
        public string FirstName { get; set; } = "";
        public string LastName { get; set; } = "";
        public string PasswordHash { get; set; } = "";

        public List<VehicleBidEntity> VehicleBidEntities { get; set; } = [];
    }
}
