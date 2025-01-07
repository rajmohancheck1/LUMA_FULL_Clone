import { useState } from 'react';
import { format } from 'date-fns';
import Button from '../Button';
import { useNotification } from '../../context/NotificationContext';
import Modal from '../Modal';
import {
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  CurrencyDollarIcon,
  TagIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

const EventOverview = ({ event, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState({
    title: event.title,
    description: event.description,
    date: format(new Date(event.date), 'yyyy-MM-dd'),
    time: event.time,
    location: event.location,
    isVirtual: event.isVirtual || false,
    virtualLink: event.virtualLink || '',
    price: event.price,
    capacity: event.capacity,
    category: event.category,
    status: event.status
  });

  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      if (image) {
        formDataToSend.append('image', image);
      }
      await onUpdate(formDataToSend);
      setIsEditing(false);
      showNotification('Event updated successfully', 'success');
    } catch (error) {
      showNotification('Failed to update event', 'error');
    }
  };

  const renderStatCard = (title, value, icon) => (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center">
        {icon}
        <h3 className="ml-3 text-lg font-medium text-gray-300">{title}</h3>
      </div>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {renderStatCard('Total Registrations', 
          event.rsvps?.length || 0,
          <UsersIcon className="h-6 w-6 text-blue-500" />
        )}
        {renderStatCard('Available Capacity',
          event.capacity - (event.rsvps?.length || 0),
          <UsersIcon className="h-6 w-6 text-green-500" />
        )}
        {renderStatCard('Revenue',
          `$${(event.rsvps?.length || 0) * event.price}`,
          <CurrencyDollarIcon className="h-6 w-6 text-yellow-500" />
        )}
      </div>

      {/* Event Details */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">{event.title}</h2>
              <div className="mt-2 flex items-center text-gray-400">
                <CalendarIcon className="h-5 w-5 mr-2" />
                <span>{format(new Date(event.date), 'PPP')} at {event.time}</span>
              </div>
              <div className="mt-2 flex items-center text-gray-400">
                {event.isVirtual ? (
                  <>
                    <GlobeAltIcon className="h-5 w-5 mr-2" />
                    <span>Virtual Event</span>
                  </>
                ) : (
                  <>
                    <MapPinIcon className="h-5 w-5 mr-2" />
                    <span>{event.location}</span>
                  </>
                )}
              </div>
            </div>
            <Button onClick={() => setIsEditing(true)}>
              Edit Event
            </Button>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium">Description</h3>
            <p className="mt-2 text-gray-400">{event.description}</p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium">Event Details</h3>
              <dl className="mt-2 space-y-3">
                <div className="flex justify-between">
                  <dt className="text-gray-400">Category</dt>
                  <dd className="font-medium">
                    <span className="px-2 py-1 rounded-full bg-blue-600 text-sm">
                      {event.category}
                    </span>
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-400">Price</dt>
                  <dd className="font-medium">${event.price}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-400">Status</dt>
                  <dd>
                    <span className={`px-2 py-1 rounded-full text-sm
                      ${event.status === 'published' ? 'bg-green-600' : 
                        event.status === 'draft' ? 'bg-gray-600' : 'bg-red-600'}`}>
                      {event.status}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>

            <div>
              <h3 className="text-lg font-medium">Event Image</h3>
              <div className="mt-2">
                <img
                  src={event.imageUrl || '/default-event.jpg'}
                  alt={event.title}
                  className="rounded-lg object-cover h-48 w-full"
                />
                <Button
                  variant="secondary"
                  className="mt-2"
                  onClick={() => setIsImageModalOpen(true)}
                >
                  Change Image
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title="Edit Event"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md text-white"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Time</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md text-white"
              required
            >
              <option value="conference">Conference</option>
              <option value="seminar">Seminar</option>
              <option value="workshop">Workshop</option>
              <option value="concert">Concert</option>
              <option value="exhibition">Exhibition</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300">Price ($)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md text-white"
                min="0"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300">Capacity</label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md text-white"
                min="1"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isVirtual}
                onChange={(e) => setFormData({ ...formData, isVirtual: e.target.checked })}
                className="h-4 w-4 bg-gray-700 border-gray-600 rounded"
              />
              <label className="ml-2 text-sm text-gray-300">Virtual Event</label>
            </div>
            {formData.isVirtual && (
              <input
                type="url"
                value={formData.virtualLink}
                onChange={(e) => setFormData({ ...formData, virtualLink: e.target.value })}
                placeholder="Virtual Event Link"
                className="mt-2 block w-full bg-gray-700 border-gray-600 rounded-md text-white"
              />
            )}
          </div>

          {!formData.isVirtual && (
            <div>
              <label className="block text-sm font-medium text-gray-300">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md text-white"
                required={!formData.isVirtual}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md text-white"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Image Modal */}
      <Modal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        title="Change Event Image"
      >
        <div className="space-y-4">
          <div className="mt-2">
            <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-400">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md font-medium text-blue-500 hover:text-blue-400"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={(e) => setImage(e.target.files[0])}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>

          {image && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-300">Preview</h4>
              <div className="mt-2">
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  className="rounded-lg object-cover h-48 w-full"
                />
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end space-x-3">
            <Button 
              variant="secondary" 
              onClick={() => {
                setImage(null);
                setIsImageModalOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                if (image) {
                  const formDataToSend = new FormData();
                  formDataToSend.append('image', image);
                  try {
                    await onUpdate(formDataToSend);
                    setIsImageModalOpen(false);
                    setImage(null);
                    showNotification('Image updated successfully', 'success');
                  } catch (error) {
                    showNotification('Failed to update image', 'error');
                  }
                }
              }}
              disabled={!image}
            >
              Upload
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EventOverview; 