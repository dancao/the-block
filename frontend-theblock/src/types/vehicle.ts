export interface Vehicle {
  id: string;
  vin: string;
  make: string;
  model: string;
  trim: string;
  images: string[];
  odometer_km: number;
  buy_now_price: number;
  current_bid: number;
  starting_bid: number;
  reserve_price: number;
  year: number;
  color: string;
  location: string;
  auctionEndDate: string;
  auctionStartDate: string;
  fuel_type: string;
  engine: string;
  transmission: string;
  exterior_color: string;
  interior_color: string;
  selling_dealership: string;
  title_status: string;
  condition_report: string;
  body_style: string;
  damage_notes: string[];
  buy_now_user_email: string;
}

export interface VehicleResponse {
  items: Vehicle[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
} 
