using Newtonsoft.Json;
using theblock_apis.Entities;

namespace theblock_apis.Services
{
    public class VehicleDataService
    {
        public List<VehicleEntity> VehicleEntities { get; } = [];

        public VehicleDataService(List<VehicleEntity> data)
        {
            VehicleEntities = data ?? throw new ArgumentNullException(nameof(data));
        }
    }
}
