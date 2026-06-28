using AutoMapper;
using theblock_apis.Entities;
using theblock_apis.ViewModels;

namespace theblock_apis.Commons
{
    public class MappingProfile: Profile
    {
        public MappingProfile() 
        { 
            CreateMap<VehicleEntity, VehicleViewModel>().ReverseMap();
        }
    }
}
