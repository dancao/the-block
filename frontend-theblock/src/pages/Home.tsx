import { useEffect, useState } from "react";
import { usePageTitle } from "../hooks/usePageTitle";
import api from "../lib/axios";
import type { VehicleResponse } from "../types/vehicle";
//import VehicleFilter from "../components/vehiclefilter/VehicleFilter";
import VehicleCard from "../components/VehicleCard/VehicleCard";
import VehicleFilter, { type ProductFilterModel } from "../components/VehicleFilter/VehicleFilter";
import Pagination from "../components/Pagination/Pagination";

const Home: React.FC = () => {
  usePageTitle('Home - The Block');

  const [data, setData] = useState<VehicleResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filter, setFilter] = useState<ProductFilterModel>({
    filterType: "All",
    vin: "",
    make: "",
    model: ""
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await api.get<VehicleResponse>('/vehicle/search?searchType=0&keyword=Mazda');
        setData(response.data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load data');
        console.error('API error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <>
      <div className="bg-gray-100 p-8">
        <VehicleFilter
          filter={filter}
          onChange={setFilter}          
          onFilter={() => {
            console.log('Filter applied:', filter);
            setPage(1);
            const makeModel = filter.make || filter.model ? `${filter.make}@${filter.model}` : '';
            const searchType = filter.filterType === 'All' ? 0 : filter.filterType === 'Vin' ? 1 : 2;
            const keyword = searchType === 0 ? '' : searchType === 1 ? filter.vin || '' : makeModel;
            const fetchDashboardData = async () => {
              try {
                setLoading(true);
                const url = `/vehicle/search?searchType=${searchType}&keyword=${keyword}&pageNumber=${1}&pageSize=${pageSize}`;
                const response = await api.get<VehicleResponse>(url);
                setData(response.data);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
              } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to load data');
                console.error('API error:', err);
              } finally {
                setLoading(false);
              }
            };

            fetchDashboardData();
          }} />
      </div>
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {data && data.items && data.items.map(vehicle => (
            <VehicleCard key={vehicle.id} product={vehicle} />
          ))}
        </div>
      </div>
      <Pagination
        currentPage={page}
        pageSize={pageSize}
        totalItems={data ? data.totalCount : 0}
        onPageChange={(page) => {
          setPage(page);
          const fetchDashboardData = async () => {
            try {
              setLoading(true);
              const url = `/vehicle/search?searchType=0&keyword=Mazda&pageNumber=${page}&pageSize=${pageSize}`;
              const response = await api.get<VehicleResponse>(url);
              setData(response.data);
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
              setError(err.response?.data?.message || 'Failed to load data');
              console.error('API error:', err);
            } finally {
              setLoading(false);
            }
          };

          fetchDashboardData();
        }}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
          const fetchDashboardData = async () => {
            try {
              setLoading(true);
              const url = `/vehicle/search?searchType=0&keyword=Mazda&pageNumber=${1}&pageSize=${size}`;
              const response = await api.get<VehicleResponse>(url);
              setData(response.data);
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
              setError(err.response?.data?.message || 'Failed to load data');
              console.error('API error:', err);
            } finally {
              setLoading(false);
            }
          };

          fetchDashboardData();
        }}
      />
    </>

  );
}

export default Home;