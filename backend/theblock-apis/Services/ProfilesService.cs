using Microsoft.EntityFrameworkCore;
using theblock_apis.Commons;
using theblock_apis.Data;
using theblock_apis.Entities;
using theblock_apis.Services.Interfaces;
using theblock_apis.ViewModels;

namespace theblock_apis.Services
{
    public class ProfilesService : IProfilesService
    {
        private readonly AppDbContext _dbContext;

        public ProfilesService(AppDbContext context) 
        {
            _dbContext = context;
        }

        public async Task RegisterUserAsync(UserViewModel userViewModel)
        {
            if(userViewModel == null || string.IsNullOrEmpty(userViewModel.Email)) throw new ArgumentNullException(nameof(userViewModel), "UserViewModel cannot be null or empty.");

            var existedUser = await GetUserByEmailAsync(userViewModel.Email);
            if(existedUser != null) throw new InvalidOperationException($"A user with the email '{userViewModel.Email}' already exists.");

            var userEntity = new UserEntity
            {
                UserEmail = userViewModel.Email,
                FirstName = userViewModel.FirstName,
                LastName = userViewModel.LastName,
                Id = Guid.NewGuid().ToString(),
                PasswordHash = Helpers.Instance.HashPassword(userViewModel.Email, userViewModel.Password)
            };
            _dbContext.Users.Add(userEntity);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<bool> SigninAsync(UserViewModel userViewModel)
        {
            if (userViewModel == null || string.IsNullOrEmpty(userViewModel.Email)) throw new ArgumentNullException(nameof(userViewModel), "UserViewModel cannot be null or empty.");

            var existedUser = await GetUserByEmailAsync(userViewModel.Email);
            return existedUser == null
                ? throw new InvalidOperationException($"No user found with the email '{userViewModel.Email}'.")
                : Helpers.Instance.VerifyPassword(userViewModel.Email, userViewModel.Password, existedUser.PasswordHash);
        }

        private async Task<UserEntity?> GetUserByEmailAsync(string email)
        {
            if (string.IsNullOrWhiteSpace(email)) return null;
            return await _dbContext.Users.FirstOrDefaultAsync(u => u.UserEmail == email);
        }
    }
}
