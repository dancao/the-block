using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using theblock_apis.Configurations;
using theblock_apis.Services;
using theblock_apis.Services.Interfaces;
using theblock_apis.ViewModels;

namespace theblock_apis.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class BiddingController : ControllerBase
    {
        private readonly IBiddingService _biddingService;

        public BiddingController(IBiddingService biddingService)
        { 
            _biddingService = biddingService;
        }

        [HttpPost]
        [Route("placebid")]
        public async Task<IActionResult> PlaceBid(BidRequest bidRequest)
        {
            if (bidRequest == null || string.IsNullOrEmpty(bidRequest.UserEmail) || string.IsNullOrEmpty(bidRequest.VehicleId))
            {
                return BadRequest("Request is invalid");
            }

            try
            {
                var bidResult = await _biddingService.PlaceBidAsync(bidRequest.UserEmail, bidRequest.VehicleId, bidRequest.BidAmount);
                return Ok(bidResult);
            }
            catch (ArgumentException argEx)
            {
                return BadRequest(argEx.Message);
            }
            catch (UnauthorizedAccessException unauthEx)
            { 
                return Unauthorized(unauthEx.Message);
            }
        }

        [HttpPost]
        [Route("buynow")]
        public async Task<IActionResult> BuyNow(BidRequest bidRequest)
        {
            if (bidRequest == null || string.IsNullOrEmpty(bidRequest.UserEmail) || string.IsNullOrEmpty(bidRequest.VehicleId))
            {
                return BadRequest("Request is invalid");
            }

            try
            {
                await _biddingService.BuyNowAsync(bidRequest.UserEmail, bidRequest.VehicleId);
                return Ok();
            }
            catch (ArgumentException argEx)
            {
                return BadRequest(argEx.Message);
            }
            catch (UnauthorizedAccessException unauthEx)
            {
                return Unauthorized(unauthEx.Message);
            }
        }
    }
}
