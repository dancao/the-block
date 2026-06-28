
export interface ProductFilterModel {
  filterType: string;
  vin?: string;
  make?: string;
  model?: string;
}

interface ProductFilterProps {
  filter: ProductFilterModel;
  onChange: (filter: ProductFilterModel) => void;
  onFilter: () => void;
}

export default function VehicleFilter({
  filter,
  onChange,
  onFilter
}: ProductFilterProps) {

  const handleFilter = () => {
    if (filter.filterType === "Vin" && !filter.vin) {
      alert("Please enter a VIN.");
      return;
    }
    if (filter.filterType === "MakeModel" && !filter.make && !filter.model) {
      alert("Please enter Make or Model.");
      return;
    }
    onFilter();
  };
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filter, filterType: e.target.value });
  };

  return (

    <div className="rounded-lg bg-white p-6 shadow">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {/* Filter Type */}
        <div>
          <label className="mb-2 block font-medium">
            Search Type
          </label>
          <select z-index="1000"
            value={filter.filterType}
            onChange={handleSelectChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
          >
            <option value="All">
              Show All
            </option>
            <option value="Vin">
              VIN
            </option>
            <option value="MakeModel">
              Make/Model
            </option>

          </select>

        </div>

        {/* VIN */}

        {filter.filterType === "Vin" && (

          <div className="md:col-span-2">

            <label className="mb-2 block font-medium">
              VIN
            </label>

            <input
              type="text"
              placeholder="Enter VIN..."
              value={filter.vin}
              onChange={(e) => onChange({ ...filter, vin: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />

          </div>

        )}

        {/* Make / Model */}

        {filter.filterType === "MakeModel" && (
          <>
            <div>

              <label className="mb-2 block font-medium">
                Make
              </label>

              <input
                type="text"
                placeholder="Toyota"
                value={filter.make}
                onChange={(e) => onChange({ ...filter, make: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              />

            </div>

            <div>

              <label className="mb-2 block font-medium">
                Model
              </label>

              <input
                type="text"
                placeholder="Camry"
                value={filter.model}
                onChange={(e) => onChange({ ...filter, model: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              />

            </div>
          </>
        )}
        <div className="flex items-end gap-2">
          <button
            onClick={handleFilter}
            className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
          >
            Go
          </button>
        </div>
      </div>
    </div>
  );
};

//export default VehicleFilter;