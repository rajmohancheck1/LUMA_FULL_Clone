import { useState } from 'react';

const SearchFilters = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    date: '',
    location: ''
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleReset = () => {
    setFilters({
      category: '',
      priceRange: '',
      date: '',
      location: ''
    });
    onFilter({});
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              name="category"
              value={filters.category}
              onChange={handleChange}
              className="form-input"
            >
              <option value="">All Categories</option>
              <option value="conference">Conference</option>
              <option value="seminar">Seminar</option>
              <option value="workshop">Workshop</option>
              <option value="concert">Concert</option>
              <option value="exhibition">Exhibition</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
            <select
              name="priceRange"
              value={filters.priceRange}
              onChange={handleChange}
              className="form-input"
            >
              <option value="">Any Price</option>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
              <option value="under50">Under $50</option>
              <option value="50to100">$50 - $100</option>
              <option value="over100">Over $100</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              name="date"
              value={filters.date}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={filters.location}
              onChange={handleChange}
              placeholder="Enter location"
              className="form-input"
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end space-x-3">
          <button type="button" onClick={handleReset} className="btn btn-secondary">
            Reset
          </button>
          <button type="submit" className="btn btn-primary">
            Apply Filters
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchFilters;
