using Microsoft.AspNetCore.Identity;
using theblock_apis.Entities;
using theblock_apis.ViewModels;

namespace theblock_apis.Commons
{
    public sealed class Helpers
    {
        private readonly PasswordHasher<string> _hasher = new();
        private static readonly Lazy<Helpers> _instance = new Lazy<Helpers>(() => new Helpers());

        private Helpers()
        {
        }

        public static Helpers Instance => _instance.Value;

        //public VehicleViewModel MapVehicleEntityToViewMode(VehicleEntity vehicleEntity)
        //{
        //    if (vehicleEntity == null) throw new ArgumentNullException(nameof(vehicleEntity));

        //    var result = new VehicleViewModel
        //    {
        //        Id = vehicleEntity.Id,
        //        Vin = vehicleEntity.Vin,
        //        Make = vehicleEntity.Make,
        //        Model = vehicleEntity.Model,
        //        Trim = vehicleEntity.Trim,
        //        body_style = vehicleEntity.body_style,
        //        selling_dealership = vehicleEntity.selling_dealership,
        //        Year = vehicleEntity.Year,
        //        Transmission = vehicleEntity.Transmission,
        //        reserve_price = vehicleEntity.reserve_price,
        //        condition_report = vehicleEntity.condition_report,
        //        buy_now_price = vehicleEntity.buy_now_price,
        //        current_bid = vehicleEntity.current_bid,
        //        starting_bid = vehicleEntity.starting_bid,
        //        Images = vehicleEntity.Images,
        //        BidStatus = vehicleEntity.BidStatus,
        //        buy_now_user_email = vehicleEntity.buy_now_user_email,
        //        exterior_color = vehicleEntity.exterior_color,
        //        interior_color = vehicleEntity.interior_color,
        //        Engine = vehicleEntity.Engine,
        //        fuel_type = vehicleEntity.fuel_type,
        //        odometer_km = vehicleEntity.odometer_km,
        //    };
        //    return result;
        //}

        public string HashPassword(string email, string plainPassword)
        {
            return _hasher.HashPassword(email, plainPassword);
        }

        public bool VerifyPassword(string email, string plainPassword, string storedHash)
        {
            var result = _hasher.VerifyHashedPassword(email, storedHash, plainPassword);
            return result == PasswordVerificationResult.Success
                || result == PasswordVerificationResult.SuccessRehashNeeded;
        }
    }
}
