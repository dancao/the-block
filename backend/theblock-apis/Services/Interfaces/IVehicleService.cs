using theblock_apis.Commons;
using theblock_apis.ViewModels;

namespace theblock_apis.Services.Interfaces
{
    public interface IVehicleService
    {
        public Task<PagedResult<VehicleViewModel>> SearchVehiclesAsync(SearchType searchType, string keyword, int pageNumber, int pageSize);
        public Task<VehicleViewModel?> GetVehicleByIdAsync(string id);
    }
}
