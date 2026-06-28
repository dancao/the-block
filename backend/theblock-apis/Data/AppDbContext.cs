using Microsoft.EntityFrameworkCore;
using theblock_apis.Entities;

namespace theblock_apis.Data
{
    public class AppDbContext: DbContext
    {
        public virtual DbSet<UserEntity> Users { get; set; }
        public virtual DbSet<VehicleBidEntity> VehicleBids { get; set; }

        public virtual DbSet<VehicleEntity> VehicleEntities { get; set; }

        // Parameterless constructor required by the mocking framework
        public AppDbContext() { }
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserEntity>()
                .HasMany(u => u.VehicleBidEntities)
                .WithOne(v => v.User)
                .HasForeignKey(v => v.UserId)
                .OnDelete(DeleteBehavior.Cascade)
                ;

            modelBuilder.Entity<VehicleEntity>()
                .HasMany(vb => vb.VehicleBidEntities)
                .WithOne(ve => ve.Vehicle)
                .HasForeignKey(v => v.VehicleId)
                .OnDelete(DeleteBehavior.Cascade)
                ;
        }
    }
}
