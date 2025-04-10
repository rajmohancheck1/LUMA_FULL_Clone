import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    location: '',
    isVirtual: false,
    virtualLink: '',
    category: '',
    price: 'free',
    capacity: 'unlimited',
    requireApproval: false,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleChange = e => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      setLoading(true);

      const eventFormData = new FormData();

      // Format dates and times
      const startDateTime = `${formData.startDate}T${formData.startTime}`;
      const endDateTime = `${formData.endDate}T${formData.endTime}`;

      // Append all form fields
      eventFormData.append('title', formData.title);
      eventFormData.append('description', formData.description);
      eventFormData.append('startDateTime', startDateTime);
      eventFormData.append('endDateTime', endDateTime);
      eventFormData.append('location', formData.location);
      eventFormData.append('isVirtual', formData.isVirtual);
      eventFormData.append('virtualLink', formData.virtualLink);
      eventFormData.append('category', formData.category);
      eventFormData.append('price', formData.price);
      eventFormData.append('capacity', formData.capacity);
      eventFormData.append('requireApproval', formData.requireApproval);
      eventFormData.append('timezone', formData.timezone);

      if (image) {
        eventFormData.append('image', image);
      }

      const res = await api.post('/api/events', eventFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      navigate(`/events/${res.data.data._id}`);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Event Name */}
        <div>
          <input
            type="text"
            name="title"
            placeholder="Event Name"
            className="w-full p-2 text-2xl border-none focus:outline-none focus:ring-0"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <div className="mt-1 flex items-center space-x-4">
            <div className="flex-shrink-0">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-64 w-full object-cover rounded-lg"
                />
              ) : (
                <div className="h-64 w-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">Add Event Image</span>
                </div>
              )}
            </div>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Upload Image
          </label>
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start</label>
            <input
              type="date"
              name="startDate"
              className="mt-1 block w-full rounded-md border-gray-300"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
            <input
              type="time"
              name="startTime"
              className="mt-1 block w-full rounded-md border-gray-300"
              value={formData.startTime}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End</label>
            <input
              type="date"
              name="endDate"
              className="mt-1 block w-full rounded-md border-gray-300"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
            <input
              type="time"
              name="endTime"
              className="mt-1 block w-full rounded-md border-gray-300"
              value={formData.endTime}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="isVirtual"
              id="isVirtual"
              checked={formData.isVirtual}
              onChange={handleChange}
              className="rounded border-gray-300"
            />
            <label htmlFor="isVirtual">This is a virtual event</label>
          </div>
          {formData.isVirtual ? (
            <input
              type="url"
              name="virtualLink"
              placeholder="Virtual event link"
              className="mt-2 block w-full rounded-md border-gray-300"
              value={formData.virtualLink}
              onChange={handleChange}
            />
          ) : (
            <input
              type="text"
              name="location"
              placeholder="Add Event Location"
              className="mt-2 block w-full rounded-md border-gray-300"
              value={formData.location}
              onChange={handleChange}
            />
          )}
        </div>

        {/* Description */}
        <div>
          <textarea
            name="description"
            placeholder="Add Event Description"
            rows="4"
            className="mt-1 block w-full rounded-md border-gray-300"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        {/* Event Options */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tickets</label>
            <select
              name="price"
              className="mt-1 block w-full rounded-md border-gray-300"
              value={formData.price}
              onChange={handleChange}
            >
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Capacity</label>
            <select
              name="capacity"
              className="mt-1 block w-full rounded-md border-gray-300"
              value={formData.capacity}
              onChange={handleChange}
            >
              <option value="unlimited">Unlimited</option>
              <option value="limited">Limited</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="requireApproval"
              id="requireApproval"
              checked={formData.requireApproval}
              onChange={handleChange}
              className="rounded border-gray-300"
            />
            <label htmlFor="requireApproval">Require Approval</label>
          </div>
        </div>

        {error && <div className="text-red-600">{error}</div>}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;
