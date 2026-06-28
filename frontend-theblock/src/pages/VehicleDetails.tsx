import { useNavigate, useParams } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle";
import type { Vehicle } from "../types/vehicle";
import { useEffect, useState } from "react";
import api from "../lib/axios";
import { convertKmToMiles } from "../utils/convertKmToMiles";
import { useAuthStore } from "../store/authStore";

const VehicleDetails: React.FC = () => {
  usePageTitle('Vehicle Details - The Block');
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { accessToken } = useAuthStore.getState();
  const navigate = useNavigate();
  const [bid, setBid] = useState(0);
  const [currentBid, setCurrentBid] = useState(0);
  const [isAvail, setIsAvail] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get<Vehicle>(`/vehicle/${id}`);
        setVehicle(response.data);
        setSelectedImageIndex(0); // Set the first image as the default selected image
        setSelectedImage(response.data.images[0]);
        setCurrentBid(response.data.current_bid);
        setIsAvail(response.data.buy_now_user_email === "");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load data');
        console.error('API error:', err);
      }
    };

    fetchData();
  }, [id]);


  const getBuyNowPrice = () => {
    const buyNowPrice = !Number.isNaN(vehicle?.buy_now_price) ? vehicle?.buy_now_price : vehicle?.current_bid;
    return buyNowPrice?.toLocaleString();
  };

  const placeBid = async (placeType: number) => {
    if (vehicle == null) return;

    if (!accessToken) {
      navigate("/signin", { replace: true });
      return;
    }

    if (placeType === 0) {
      if (bid <= vehicle.current_bid || bid < vehicle.starting_bid) {
        if (vehicle.current_bid && vehicle.current_bid > 0) {
          alert(`Bid is invalid, please provide more than current bid`);
        } else {
          alert(`Starting Bid is ${vehicle.starting_bid.toLocaleString()}`);
        }
        return;
      }

      try {
        const response = await api.post('/bidding/placebid', {
          userEmail: localStorage.getItem('loggedEmail'),
          vehicleId: vehicle.id,
          bidAmount: bid
        });

        const bidResult = response.data;
        if (bidResult.status !== 0) {
          alert(`Place bid failed. Message: ${bidResult.message}`);
        } else {
          setCurrentBid(bid);
          setBid(0);
          alert(`Place bid successful.`);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error('API error:', err);
        alert('Failed to place bid, please try again later or contact Admin.');
      }
    } else {
      if (confirm(`Are you sure you want to buy this as $${getBuyNowPrice()}?`)) {
        try {
          await api.post('/bidding/buynow', {
            userEmail: localStorage.getItem('loggedEmail'),
            vehicleId: vehicle.id
          });

          setBid(0);
          setIsAvail(false);
          alert(`Updated successful.`);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          console.error('API error:', err);
          alert('Failed to update, please try again later or contact Admin.');
        }
      }

    }
  };

  const showPreviousImage = () => {
    if (vehicle == null) return;
    setSelectedImageIndex((current) =>
      current === 0
        ? 0
        : current - 1
    );

    setSelectedImage(vehicle.images[selectedImageIndex]);
  };

  const showNextImage = () => {
    if (vehicle == null) return;
    setSelectedImageIndex((current) =>
      current === vehicle.images.length - 1
        ? vehicle.images.length - 1
        : current + 1
    );
    setSelectedImage(vehicle.images[selectedImageIndex]);
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-left mb-8">
        {vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : "Vehicle Details"}
      </h1>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {
        vehicle && (
          <div className="min-h-screen bg-gray-100">
            <div className="mx-auto max-w-7xl p-8">
              <div className="grid gap-8 lg:grid-cols-2">
                <div>
                  <div className="relative overflow-hidden rounded-xl bg-white shadow">
                    <img
                      src={selectedImage}
                      className="h-[520px] w-full object-cover"
                      alt=""
                    />
                  </div>

                  <div className="mt-6 flex items-center gap-3">
                    <button
                      onClick={showPreviousImage}
                      className="
                          rounded-full
                          border
                          bg-white
                          p-3
                          shadow
                          hover:bg-gray-100
                      "
                    >
                      ◀
                    </button>
                    <div className="flex flex-1 gap-3 overflow-x-auto">
                      {vehicle.images.map((image, index) => (
                        <img
                          key={image}
                          src={image}
                          onClick={() => {
                            setSelectedImage(image);
                            setSelectedImageIndex(index);
                          }}
                          className={`
                                        h-24
                                        w-32
                                        cursor-pointer
                                        rounded-lg
                                        border-4
                                        object-cover
                                        transition
                                        ${selectedImage === image
                              ? "border-blue-600"
                              : "border-transparent hover:border-gray-300"}
                                    `}
                          alt=""
                        />

                      ))}
                    </div>
                    <button
                      onClick={showNextImage}
                      className="
                          rounded-full
                          border
                          bg-white
                          p-3
                          shadow
                          hover:bg-gray-100
                      "
                    >
                      ▶
                    </button>
                  </div>

                </div>

                <div className="space-y-6">
                  {/* Bid Card */}
                  <div className="rounded-xl bg-white p-6 shadow">
                    <div className="mb-3 text-2xl font-bold text-blue-700">
                      Current Bid
                    </div>
                    <div className="mb-5 text-4xl font-bold">
                      ${currentBid?.toLocaleString()}
                    </div>

                    <div className="flex gap-3">
                      <input
                        type="number"
                        min="0"
                        value={bid}
                        onChange={(e) => setBid(Number(e.target.value))}
                        placeholder="Enter your bid"
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-3"
                      />
                      <button
                        onClick={() => { placeBid(0) }}
                        disabled={!isAvail}
                        className="rounded-lg bg-green-600 px-6 text-white hover:bg-green-700 disabled:bg-gray-400 transition"
                      >
                        Place Bid
                      </button>
                      <button onClick={() => { placeBid(1) }}
                        className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 disabled:bg-gray-400 transition"
                        disabled={Number.isNaN(vehicle.buy_now_price) || vehicle.buy_now_price === null || !isAvail}
                      >
                        Buy Now
                      </button>
                    </div>
                    <div className="text-2xl text-blue-500">
                      Buy Now: ${getBuyNowPrice()}
                    </div>
                  </div>

                  <div className="rounded-xl bg-white p-6 shadow">
                    <h2 className="mb-6 text-2xl font-bold">
                      Vehicle Information
                    </h2>

                    <div className="grid grid-cols-2 gap-y-4">

                      <div className="font-semibold">VIN</div>
                      <div>{vehicle.vin}</div>

                      <div className="font-semibold">Year</div>
                      <div>{vehicle.year}</div>

                      <div className="font-semibold">Make</div>
                      <div>{vehicle.make}</div>

                      <div className="font-semibold">Model</div>
                      <div>{vehicle.model}</div>

                      <div className="font-semibold">Trim</div>
                      <div>{vehicle.trim}</div>

                      <div className="font-semibold">Title Status</div>
                      <div>{vehicle.title_status}</div>

                      <div className="font-semibold">Exterior Color</div>
                      <div>{vehicle.exterior_color}</div>

                      <div className="font-semibold">Interior Color</div>
                      <div>{vehicle.interior_color}</div>

                      <div className="font-semibold">Mileage</div>
                      <div>{vehicle.odometer_km && convertKmToMiles(vehicle.odometer_km, 0)}</div>

                      <div className="font-semibold">Engine</div>
                      <div>{vehicle.engine}</div>

                      <div className="font-semibold">Transmission</div>
                      <div>{vehicle.transmission}</div>

                      <div className="font-semibold">Fuel Type</div>
                      <div>{vehicle.fuel_type}</div>

                      <div className="font-semibold">Condition Report</div>
                      <div>{vehicle.condition_report}</div>

                      {vehicle.damage_notes && vehicle.damage_notes.length > 0 && (
                        <>
                          <div className="font-semibold">Damage Notes</div>
                          <div>{vehicle.damage_notes && vehicle.damage_notes.join('; ')}</div>
                        </>
                      )}

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </>

  );
}

export default VehicleDetails;