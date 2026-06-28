using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using theblock_apis.Configurations;
using theblock_apis.Services.Interfaces;
using theblock_apis.ViewModels;

namespace theblock_apis.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ProfilesController : ControllerBase
    {
        private readonly JwtSettings _jwtSettings;
        private readonly IProfilesService _profilesService;

        public ProfilesController(IConfiguration configuration, IProfilesService profilesService)
        {
            _jwtSettings = configuration.GetSection(JwtSettings.JwtSettingsName).Get<JwtSettings>()!;
            _profilesService = profilesService;
        }

        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login(UserViewModel userViewModel)
        {
            if (userViewModel == null || string.IsNullOrEmpty(userViewModel.Email) || string.IsNullOrEmpty(userViewModel.Password))
            {
                return BadRequest("userViewModel is invalid");
            }

            try
            {
                var isValid = await _profilesService.SigninAsync(userViewModel);
                if (!isValid)
                {
                    return Unauthorized("Invalid email or password.");
                }

                var claims = new[]
                {
                    new Claim(ClaimTypes.Name, userViewModel.Email),
                    new Claim(ClaimTypes.Role, "User")
                };

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.SecretKey));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var token = new JwtSecurityToken(
                    issuer: _jwtSettings.Issuer,
                    audience: _jwtSettings.Audience,
                    claims: claims,
                    expires: DateTime.Now.AddMinutes(_jwtSettings.ExpiryMinutes),
                    signingCredentials: creds
                );

                //TODO: Add refresh token logic here if needed
                return Ok(new
                {
                    token = new JwtSecurityTokenHandler().WriteToken(token),
                    expires = token.ValidTo
                });
            }
            catch (InvalidOperationException invalidEx)
            {
                return BadRequest(invalidEx.Message);
            }
        }

        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> Register(UserViewModel userViewModel)
        {
            if (userViewModel == null || string.IsNullOrEmpty(userViewModel.Email) || string.IsNullOrEmpty(userViewModel.Password))
            {
                return BadRequest("userViewModel is invalid");
            }

            try
            {
                await _profilesService.RegisterUserAsync(userViewModel);

                var claims = new[]
                {
                    new Claim(ClaimTypes.Name, userViewModel.Email),
                    new Claim(ClaimTypes.Role, "User")
                };

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.SecretKey));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var token = new JwtSecurityToken(
                    issuer: _jwtSettings.Issuer,
                    audience: _jwtSettings.Audience,
                    claims: claims,
                    expires: DateTime.Now.AddMinutes(_jwtSettings.ExpiryMinutes),
                    signingCredentials: creds
                );

                //TODO: Add refresh token logic here if needed
                return Ok(new
                {
                    token = new JwtSecurityTokenHandler().WriteToken(token),
                    expires = token.ValidTo
                });
            }
            catch (InvalidOperationException invalidEx)
            {
                return BadRequest(invalidEx.Message);
            }
        }
    }
}
