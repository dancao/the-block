import { Link, useNavigate } from "react-router-dom";
import type { Vehicle } from "../../types/vehicle";
import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import api from "../../lib/axios";

interface Props {
  product: Vehicle;
}

export default function VehicleCard({ product }: Props) {
  const navigate = useNavigate();
  const { accessToken } = useAuthStore.getState();  
  const [bidValue, setBidValue] = useState(0);  
  const [currentBid, setCurrentBid] = useState(product.current_bid);
  const [isAvail, setIsAvail] = useState(product.buy_now_user_email === '');

  const getBuyNowPrice = () => {
    const buyNowPrice = !Number.isNaN(product?.buy_now_price) ? product?.buy_now_price : product?.current_bid;
    return buyNowPrice?.toLocaleString();
  };
  const placeBid = async (placeType: number) => {
    if (product == null) return;

    if (!accessToken) {
      navigate("/signin", { replace: true });
      return;
    }

    if (placeType === 0) {
      if (bidValue <= product.current_bid || bidValue < product.starting_bid) {
        if (product.current_bid && product.current_bid > 0) {
          alert(`Bid is invalid, please provide more than current bid`);
        } else {
          alert(`Starting Bid is ${product.starting_bid.toLocaleString()}`);
        }
        return;
      }

      try {
        const response = await api.post('/bidding/placebid', {
          userEmail: localStorage.getItem('loggedEmail'),
          vehicleId: product.id,
          bidAmount: bidValue
        });
        const bidResult = response.data;
        if (bidResult.status !== 0) {
          alert(`Place bid failed. Message: ${bidResult.message}`);
        } else {
          setCurrentBid(bidValue);
          setBidValue(0);
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
            vehicleId: product.id
          });
          setBidValue(0);
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

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border hover:shadow-xl transition">
      <Link to={`/vehicle/${product.id}`} className="block">
        <img
          src={product.images[0]}
          alt={product.vin}
          className="h-52 w-full object-cover" />
      </Link>

      <div className="p-4">

        <h2 className="text-xl font-semibold">
          {product.year} {product.make} {product.model}
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          VIN: {product.vin}
        </p>

        <div className="mt-3 flex justify-between items-center">
          <span className="text-2xl font-bold text-blue-600">
            Buy now: ${product.buy_now_price && product.buy_now_price.toLocaleString()}
          </span>
        </div>
        <div className="mt-3 flex justify-between items-center">
          <span className="text-2xl font-bold text-blue-600">
            Current Bid: ${currentBid && currentBid.toLocaleString()}
          </span>
        </div>

        <div className="mt-5 flex gap-2 items-center">
          <div className="mb-5">
            <input
              type="number"
              placeholder="Enter your bid"
              value={bidValue} min="0"
              onChange={(e) => setBidValue(Number(e.target.value))}
              className="border rounded-lg px-2 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-5">
            <button className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition"
              disabled={!isAvail}
              onClick={() => { placeBid(0) }}>
              Place Bid
            </button>
          </div>
        </div>
        <div className="mt-5 flex gap-2">
          <button className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 disabled:bg-gray-400 transition"
            disabled={Number.isNaN(product.buy_now_price) || product.buy_now_price === null || !isAvail}
            onClick={() => { placeBid(1) }}>
            Buy Now
          </button>
          <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"          
            onClick={() => {
              navigate(`/vehicle/${product.id}`);
            }}>
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}