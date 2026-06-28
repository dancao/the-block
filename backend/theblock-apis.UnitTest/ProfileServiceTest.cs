using Microsoft.EntityFrameworkCore;
using MockQueryable.Moq;
using Moq;
using theblock_apis.Commons;
using theblock_apis.Data;
using theblock_apis.Entities;
using theblock_apis.Services;
using theblock_apis.ViewModels;

namespace theblock_apis.UnitTest
{
    [TestClass]
    public sealed class ProfileServiceTest
    {
        [TestInitialize]
        public void Setup()
        {
        }

        [TestMethod]
        [DataRow("Huy Dan", "Cao", "dc@dc.com", "111")]
        public async Task RegisterUserAsync_Success(string firstName, string lastName, string email, string pass)
        {
            // arrange
            UserViewModel userViewModel = new UserViewModel()
            {
                FirstName = firstName,
                LastName = lastName,
                Email = email,
                Password = pass
            };
            var testUsers = new List<UserEntity>();
            var mockDBSetUsers = testUsers.BuildMockDbSet();
            var mockContext = new Mock<AppDbContext>();
            mockContext.Setup(c => c.Users).Returns(mockDBSetUsers.Object);

            int saveChangesCallCount = 0;
            mockContext
                .Setup(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()))
                .Callback(() => saveChangesCallCount++)
                .ReturnsAsync(1);

            // Act
            var service = new ProfilesService(mockContext.Object);
            await service.RegisterUserAsync(userViewModel);

            // Assert
            mockContext.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once());
        }
    }
}
