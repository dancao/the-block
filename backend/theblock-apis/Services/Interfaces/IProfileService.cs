using theblock_apis.ViewModels;

namespace theblock_apis.Services.Interfaces
{
    public interface IProfilesService
    {
        Task RegisterUserAsync(UserViewModel userViewModel);
        Task<bool> SigninAsync(UserViewModel userViewModel);
    }
}
