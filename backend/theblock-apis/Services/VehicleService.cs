using AutoMapper;
using Microsoft.EntityFrameworkCore;
using theblock_apis.Commons;
using theblock_apis.Data;
using theblock_apis.Services.Interfaces;
using theblock_apis.ViewModels;

namespace theblock_apis.Services
{
    public class VehicleService : IVehicleService
    {
        //private readonly VehicleDataService _dataService;
        private readonly AppDbContext _dbContext;
        private readonly IMapper _mapper;

        public VehicleService(IMapper mapper, AppDbContext dbContext) 
        {
            _mapper = mapper;
            _dbContext = dbContext;
        }

        public async Task<VehicleViewModel?> GetVehicleByIdAsync(string id)
        {
            if(string.IsNullOrWhiteSpace(id)) throw new ArgumentNullException(nameof(id));

            var vehicle = await _dbContext.VehicleEntities.FirstOrDefaultAsync(v => v.Id == id);
            if (vehicle == null) return null;
            return _mapper.Map<VehicleViewModel>(vehicle);
        }

        public async Task<PagedResult<VehicleViewModel>> SearchVehiclesAsync(SearchType searchType, string keyword, int pageNumber, int pageSize)
        {
            IQueryable<VehicleViewModel> query = _dbContext.VehicleEntities.Where(x => searchType == SearchType.All)
                .Select(_mapper.Map<VehicleViewModel>).AsQueryable();

            if (searchType == SearchType.VIN)
            {
                query = _dbContext.VehicleEntities.Where(x => string.Equals(x.Vin, keyword, StringComparison.OrdinalIgnoreCase))
                .Select(_mapper.Map<VehicleViewModel>).AsQueryable();
            }
            else if (searchType == SearchType.MakeOrModel)
            {
                var makeValue = keyword;
                var modelValue = "";
                if (searchType == SearchType.MakeOrModel)
                {
                    var arr = keyword.Split('@', 2);
                    makeValue = arr[0];
                    modelValue = arr[1];
                }
                query = _dbContext.VehicleEntities.Where(x => 
                    (string.IsNullOrEmpty(makeValue) || x.Make.Contains(makeValue, StringComparison.OrdinalIgnoreCase)) &&
                    (string.IsNullOrEmpty(modelValue) || x.Model.Contains(modelValue, StringComparison.OrdinalIgnoreCase)))
                .Select(_mapper.Map<VehicleViewModel>).AsQueryable();
            }

            if (pageNumber < 1) pageNumber = 1;
            if (pageSize < 1 || pageSize > 50) pageSize = Constants.PageSize;
            var totalCount = query.Count();
            var records = query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();

            var vehicles = new PagedResult<VehicleViewModel>
            {
                Items = records,
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
            };

            return await Task.FromResult(vehicles);
        }
    }
}
