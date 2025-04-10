import { useState, useEffect } from 'react';
import api from '../../utils/api';
import Button from '../Button';
import { format } from 'date-fns';
import { useNotification } from '../../context/NotificationContext';
import Modal from '../Modal';
import {
  UserGroupIcon,
  QrCodeIcon,
  UserPlusIcon,
  ArrowDownTrayIcon,
  ShareIcon,
  ClipboardDocumentIcon,
  EnvelopeIcon,
  UsersIcon,
  PlusIcon,
  XMarkIcon,
  ArrowRightIcon,
  LinkIcon
} from '@heroicons/react/24/outline';
import { GoogleIcon } from '../../components/icons';
import { Tab } from '@headlessui/react';
import { TwitterIcon, FacebookIcon, LinkedInIcon } from '../../components/icons';

const GuestList = ({ eventId }) => {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [inviteEmails, setInviteEmails] = useState('');
  const [remainingInvites, setRemainingInvites] = useState(15);
  const { showNotification } = useNotification();

  const rsvpLink = `${window.location.origin}/events/${eventId}`;

  useEffect(() => {
    fetchGuests();
  }, [eventId]);

  const fetchGuests = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/events/${eventId}/rsvp`);
      setGuests(res.data.data);
    } catch (error) {
      showNotification('Failed to fetch guests', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(rsvpLink);
    showNotification('RSVP link copied to clipboard', 'success');
  };

  const handleExportCSV = () => {
    const headers = ['Name', 'Email', 'Ticket Type', 'Status', 'Registration Date'];
    const csvData = guests.map(guest => [
      guest.user.name,
      guest.user.email,
      guest.ticketType,
      guest.status,
      format(new Date(guest.createdAt), 'PPP')
    ]);

    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'guest-list.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-8">
      {/* At a Glance Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">At a Glance</h2>
        <div className="text-gray-400">
          <span className="text-2xl text-white">{guests.length}</span> guests
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Invite Guests Card */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div
            className="flex flex-col items-center justify-center space-y-4 cursor-pointer"
            onClick={() => setIsShareModalOpen(true)}
          >
            <div className="p-3 bg-blue-600 rounded-full">
              <UserPlusIcon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-medium text-white">Invite Guests</h3>
          </div>
        </div>

        {/* Check In Card */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div
            className="flex flex-col items-center justify-center space-y-4 cursor-pointer"
            onClick={() => setIsCheckInModalOpen(true)}
          >
            <div className="p-3 bg-green-600 rounded-full">
              <QrCodeIcon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-medium text-white">Check In Guests</h3>
          </div>
        </div>

        {/* Guest List Card */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="p-3 bg-yellow-600 rounded-full">
              <UserGroupIcon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-medium text-white">Guest List</h3>
            <p className="text-sm text-gray-400 text-center">Shown to guests</p>
          </div>
        </div>
      </div>

      {/* Guest List Section */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Guest List</h2>
          <div className="flex space-x-3">
            <Button
              variant="secondary"
              onClick={handleExportCSV}
              icon={<ArrowDownTrayIcon className="w-5 h-5" />}
            >
              Export
            </Button>
            <Button
              variant="secondary"
              onClick={() => setIsShareModalOpen(true)}
              icon={<ShareIcon className="w-5 h-5" />}
            >
              Share
            </Button>
          </div>
        </div>

        {guests.length === 0 ? (
          <div className="text-center py-12 bg-gray-800 rounded-lg">
            <UserGroupIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No Guests Yet</h3>
            <p className="text-gray-400">Share the event or invite people to get started!</p>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Ticket Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Registration Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {guests.map(guest => (
                  <tr key={guest._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{guest.user.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{guest.user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-900 text-blue-200">
                        {guest.ticketType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full
                        ${
                          guest.status === 'attending'
                            ? 'bg-green-900 text-green-200'
                            : guest.status === 'pending'
                            ? 'bg-yellow-900 text-yellow-200'
                            : guest.status === 'cancelled'
                            ? 'bg-red-900 text-red-200'
                            : 'bg-gray-900 text-gray-200'
                        }`}
                      >
                        {guest.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">
                        {format(new Date(guest.createdAt), 'MMM d, yyyy')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => {
                          /* Add edit functionality */
                        }}
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      <Modal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title="Invite Guests"
      >
        <div className="space-y-6">
          {/* RSVP Link Section */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-300 mb-4">RSVP Link</h3>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={rsvpLink}
                readOnly
                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              />
              <Button
                variant="secondary"
                onClick={handleCopyLink}
                icon={<ClipboardDocumentIcon className="w-5 h-5" />}
              >
                Copy
              </Button>
            </div>
          </div>

          {/* Share Options */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-300 mb-4">Share Options</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() =>
                  window.open(
                    `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                      rsvpLink
                    )}&text=${encodeURIComponent('Join me at this event!')}`,
                    '_blank'
                  )
                }
                className="flex items-center justify-center space-x-2 bg-[#1DA1F2] text-white p-2 rounded-lg hover:bg-opacity-90"
              >
                <TwitterIcon className="w-5 h-5" />
                <span>Twitter</span>
              </button>
              <button
                onClick={() =>
                  window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(rsvpLink)}`,
                    '_blank'
                  )
                }
                className="flex items-center justify-center space-x-2 bg-[#1877F2] text-white p-2 rounded-lg hover:bg-opacity-90"
              >
                <FacebookIcon className="w-5 h-5" />
                <span>Facebook</span>
              </button>
              <button
                onClick={() =>
                  window.open(
                    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                      rsvpLink
                    )}`,
                    '_blank'
                  )
                }
                className="flex items-center justify-center space-x-2 bg-[#0A66C2] text-white p-2 rounded-lg hover:bg-opacity-90"
              >
                <LinkedInIcon className="w-5 h-5" />
                <span>LinkedIn</span>
              </button>
              <button
                onClick={() =>
                  window.open(
                    `mailto:?subject=Join me at this event!&body=${encodeURIComponent(rsvpLink)}`,
                    '_blank'
                  )
                }
                className="flex items-center justify-center space-x-2 bg-gray-600 text-white p-2 rounded-lg hover:bg-opacity-90"
              >
                <EnvelopeIcon className="w-5 h-5" />
                <span>Email</span>
              </button>
            </div>
          </div>

          {/* Manual Email Input */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-300 mb-4">Send Invites</h3>
            <textarea
              value={inviteEmails}
              onChange={e => setInviteEmails(e.target.value)}
              placeholder="Enter email addresses separated by commas"
              className="w-full h-32 bg-gray-700 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400"
            />

            <div className="text-center mt-4">
              <div className="text-gray-400 mb-2">or</div>
              <button
                className="flex items-center justify-center space-x-2 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                onClick={() => {
                  /* Implement Google import */
                }}
              >
                <GoogleIcon className="w-5 h-5" />
                <span>Import from Google</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setIsShareModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              disabled={!inviteEmails.trim()}
              onClick={() => {
                /* Implement send invites */
              }}
            >
              Send Invites
            </Button>
          </div>
        </div>
      </Modal>

      {/* Check In Modal */}
      <Modal
        isOpen={isCheckInModalOpen}
        onClose={() => setIsCheckInModalOpen(false)}
        title="Check In Guests"
      >
        <div className="p-4">
          <div className="text-center py-8">
            <QrCodeIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-300">QR code scanner functionality coming soon...</p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default GuestList;
