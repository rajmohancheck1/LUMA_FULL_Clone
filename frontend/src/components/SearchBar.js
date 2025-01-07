import { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    price: '',
    date: ''
  });

  const handleChange = e => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSearch(filters);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-0 md:flex md:space-x-4">
      <input
        type="text"
        name="search"
        placeholder="Search events..."
        className="w-full md:w-1/3 p-2 border border-gray-300 rounded-md"
        value={filters.search}
        onChange={handleChange}
      />

      <select
        name="category"
        className="w-full md:w-1/4 p-2 border border-gray-300 rounded-md"
        value={filters.category}
        onChange={handleChange}
      >
        <option value="">All Categories</option>
        <option value="conference">Conference</option>
        <option value="seminar">Seminar</option>
        <option value="workshop">Workshop</option>
        <option value="concert">Concert</option>
        <option value="exhibition">Exhibition</option>
      </select>

      <input
        type="number"
        name="price"
        placeholder="Max price"
        className="w-full md:w-1/6 p-2 border border-gray-300 rounded-md"
        value={filters.price}
        onChange={handleChange}
      />

      <input
        type="date"
        name="date"
        className="w-full md:w-1/6 p-2 border border-gray-300 rounded-md"
        value={filters.date}
        onChange={handleChange}
      />

      <button
        type="submit"
        className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
