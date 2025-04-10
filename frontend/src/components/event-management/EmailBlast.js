import { useState, useEffect } from 'react';
import Button from '../Button';
import { useNotification } from '../../context/NotificationContext';
import api from '../../utils/api';
import Modal from '../Modal';
import {
  EnvelopeIcon,
  ClockIcon,
  ChevronDownIcon,
  StarIcon,
  BellIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';

const EmailBlast = ({ event }) => {
  const { showNotification } = useNotification();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isManageReminderModalOpen, setIsManageReminderModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  const [reminderSettings, setReminderSettings] = useState({
    enabled: true,
    schedule: [
      { type: 'day_before', enabled: true },
      { type: 'hour_before', enabled: true }
    ]
  });

  const [scheduleData, setScheduleData] = useState({
    subject: '',
    message: '',
    scheduledFor: '',
    recipients: 'all'
  });

  const handleUpdateReminders = async () => {
    try {
      await api.put(`/api/events/${event._id}/reminders`, reminderSettings);
      showNotification('Reminder settings updated successfully', 'success');
      setIsManageReminderModalOpen(false);
    } catch (error) {
      showNotification('Failed to update reminder settings', 'error');
    }
  };

  const handleScheduleBlast = async () => {
    try {
      // Validate schedule date
      const scheduleDate = new Date(scheduleData.scheduledFor);
      if (scheduleDate < new Date()) {
        showNotification('Schedule date must be in the future', 'error');
        return;
      }

      await api.post(`/api/events/${event._id}/email-blasts`, scheduleData);
      showNotification('Email blast scheduled successfully', 'success');
      setIsScheduleModalOpen(false);
      setScheduleData({
        subject: '',
        message: '',
        scheduledFor: '',
        recipients: 'all'
      });
    } catch (error) {
      showNotification('Failed to schedule email blast', 'error');
    }
  };

  return (
    <div className="space-y-6 text-white">
      {/* Event Reminders Section */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <BellIcon className="w-6 h-6 text-gray-400" />
            <div>
              <h4 className="font-medium text-white">Event Reminders</h4>
              <p className="text-sm text-gray-400">
                Automatic reminders sent to registered attendees
              </p>
            </div>
          </div>
          <Button variant="secondary" onClick={() => setIsManageReminderModalOpen(true)}>
            Manage
          </Button>
        </div>
      </div>

      {/* Schedule Email Blast Section */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <ClockIcon className="w-6 h-6 text-gray-400" />
            <div>
              <h4 className="font-medium text-white">Schedule Email Blast</h4>
              <p className="text-sm text-gray-400">Schedule emails to be sent at a specific time</p>
            </div>
          </div>
          <Button variant="secondary" onClick={() => setIsScheduleModalOpen(true)}>
            Schedule
          </Button>
        </div>
      </div>

      {/* Manage Reminders Modal */}
      <Modal
        isOpen={isManageReminderModalOpen}
        onClose={() => setIsManageReminderModalOpen(false)}
        title="Manage Event Reminders"
      >
        <div className="space-y-6 text-white">
          <div className="flex items-center justify-between bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <BellIcon className="w-5 h-5 text-gray-400" />
              <label className="text-white font-medium">Enable Event Reminders</label>
            </div>
            <input
              type="checkbox"
              checked={reminderSettings.enabled}
              onChange={e =>
                setReminderSettings({
                  ...reminderSettings,
                  enabled: e.target.checked
                })
              }
              className="w-5 h-5 rounded border-gray-400 text-blue-600 focus:ring-blue-500 bg-gray-700"
            />
          </div>

          {reminderSettings.enabled && (
            <div className="space-y-4">
              {reminderSettings.schedule.map((reminder, index) => (
                <div
                  key={reminder.type}
                  className="flex items-center justify-between bg-gray-700 p-4 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <ClockIcon className="w-5 h-5 text-gray-400" />
                    <label className="text-white">
                      {reminder.type === 'day_before'
                        ? 'Send reminder 24 hours before event'
                        : 'Send reminder 1 hour before event'}
                    </label>
                  </div>
                  <input
                    type="checkbox"
                    checked={reminder.enabled}
                    onChange={e => {
                      const newSchedule = [...reminderSettings.schedule];
                      newSchedule[index].enabled = e.target.checked;
                      setReminderSettings({
                        ...reminderSettings,
                        schedule: newSchedule
                      });
                    }}
                    className="w-5 h-5 rounded border-gray-400 text-blue-600 focus:ring-blue-500 bg-gray-700"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setIsManageReminderModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleUpdateReminders}>
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      {/* Schedule Email Modal */}
      <Modal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        title="Schedule Email Blast"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Subject</label>
            <input
              type="text"
              value={scheduleData.subject}
              onChange={e =>
                setScheduleData({
                  ...scheduleData,
                  subject: e.target.value
                })
              }
              className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Message</label>
            <textarea
              rows={6}
              value={scheduleData.message}
              onChange={e =>
                setScheduleData({
                  ...scheduleData,
                  message: e.target.value
                })
              }
              className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Schedule For</label>
            <input
              type="datetime-local"
              value={scheduleData.scheduledFor}
              onChange={e =>
                setScheduleData({
                  ...scheduleData,
                  scheduledFor: e.target.value
                })
              }
              className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Recipients</label>
            <select
              value={scheduleData.recipients}
              onChange={e =>
                setScheduleData({
                  ...scheduleData,
                  recipients: e.target.value
                })
              }
              className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md text-white"
            >
              <option value="all">All Attendees</option>
              <option value="confirmed">Confirmed Only</option>
              <option value="pending">Pending Only</option>
            </select>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setIsScheduleModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleScheduleBlast}>Schedule Blast</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EmailBlast;
