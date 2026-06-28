using Microsoft.AspNetCore.Mvc;
using theblock_apis.Commons;
using theblock_apis.Services.Interfaces;

namespace theblock_apis.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class VehicleController : ControllerBase
    {
        private readonly IVehicleService _vehicleService;

        public VehicleController(IVehicleService vehicleService)
        {
            _vehicleService = vehicleService;
        }

        [HttpGet]
        [Route("search")]
        public async Task<IActionResult> SearchVehicles(SearchType searchType, string keyword="", int pageNumber = 1, int pageSize = 10)
        {
            if (searchType != SearchType.All && string.IsNullOrWhiteSpace(keyword))
            {
                return BadRequest("Keyword is missing.");
            }
            var result = await _vehicleService.SearchVehiclesAsync(searchType, keyword, pageNumber, pageSize);
            return Ok(result);
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<IActionResult> GetVehicleById(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                return BadRequest("Id is missing.");
            }
            var result = await _vehicleService.GetVehicleByIdAsync(id);
            if(result == null) return NotFound($"Vehicle with Id '{id}' not found.");
            return Ok(result);
        }
    }
}
