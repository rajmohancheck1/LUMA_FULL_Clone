import { useState } from 'react';
import { useNotification } from '../../context/NotificationContext';
import Modal from '../Modal';
import Button from '../Button';
import api from '../../utils/api';
import {
  EnvelopeIcon,
  ClockIcon,
  BellIcon,
  StarIcon,
} from '@heroicons/react/24/outline';

const Blasts = ({ eventId }) => {
  const [message, setMessage] = useState('');
  const [isAdvancedModalOpen, setIsAdvancedModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const { showNotification } = useNotification();
  
  const [reminderSettings, setReminderSettings] = useState({
    enabled: true,
    schedule: [
      { type: '24h', enabled: true },
      { type: '1h', enabled: true }
    ]
  });

  const [feedbackSettings, setFeedbackSettings] = useState({
    enabled: false,
    delay: '24', // hours after event
    template: 'default'
  });

  const [advancedData, setAdvancedData] = useState({
    recipients: 'going',
    subject: '',
    message: '',
  });

  // Handle Event Reminders
  const handleUpdateReminders = async () => {
    try {
      await api.put(`/api/events/${eventId}/reminders`, reminderSettings);
      showNotification('Reminder settings updated successfully', 'success');
      setIsReminderModalOpen(false);
    } catch (error) {
      showNotification('Failed to update reminder settings', 'error');
    }
  };

  // Handle Post-Event Feedback
  const handleUpdateFeedback = async () => {
    try {
      await api.put(`/api/events/${eventId}/feedback`, feedbackSettings);
      showNotification('Feedback settings updated successfully', 'success');
      setIsFeedbackModalOpen(false);
    } catch (error) {
      showNotification('Failed to update feedback settings', 'error');
    }
  };

  // Handle Send Blast
  const handleSendBlast = async () => {
    try {
      await api.post(`/api/events/${eventId}/blasts`, {
        message,
      });
      showNotification('Blast sent successfully', 'success');
      setMessage('');
    } catch (error) {
      showNotification('Failed to send blast', 'error');
    }
  };

  // Handle Advanced Blast
  const handleAdvancedBlast = async () => {
    try {
      await api.post(`/api/events/${eventId}/blasts`, advancedData);
      showNotification('Blast sent successfully', 'success');
      setIsAdvancedModalOpen(false);
      setAdvancedData({
        recipients: 'going',
        subject: '',
        message: '',
      });
    } catch (error) {
      showNotification('Failed to send blast', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Blast Input */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
              <EnvelopeIcon className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div className="flex-grow">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Send a blast to your guests..."
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 min-h-[100px]"
            />
            <div className="mt-3 flex justify-between items-center">
              <button
                onClick={() => setIsAdvancedModalOpen(true)}
                className="text-gray-400 hover:text-white text-sm"
              >
                Advanced
              </button>
              <Button onClick={handleSendBlast}>Send</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Send Blasts Info */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-2">Send Blasts</h3>
        <p className="text-gray-400">
          Share updates with your guests via email, SMS, and push notifications.
        </p>
        <div className="mt-4 flex space-x-4">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <EnvelopeIcon className="w-6 h-6 text-blue-400" />
          </div>
          <div className="p-2 bg-green-500/20 rounded-lg">
            <BellIcon className="w-6 h-6 text-green-400" />
          </div>
          <div className="p-2 bg-yellow-500/20 rounded-lg">
            <StarIcon className="w-6 h-6 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* System Messages */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">System Messages</h3>
        
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <ClockIcon className="w-6 h-6 text-gray-400" />
              <div>
                <h4 className="font-medium text-white">Event Reminders</h4>
                <p className="text-sm text-gray-400">
                  Reminders are sent automatically via email, SMS, and push notification.
                </p>
              </div>
            </div>
            <Button 
              variant="secondary"
              onClick={() => setIsReminderModalOpen(true)}
            >
              Manage
            </Button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <StarIcon className="w-6 h-6 text-gray-400" />
              <div>
                <h4 className="font-medium text-white">Post-Event Feedback</h4>
                <p className="text-sm text-gray-400">
                  Schedule a feedback email to go out after the event.
                </p>
              </div>
            </div>
            <Button 
              variant="secondary"
              onClick={() => setIsFeedbackModalOpen(true)}
            >
              Schedule
            </Button>
          </div>
        </div>
      </div>

      {/* Advanced Modal */}
      <Modal
        isOpen={isAdvancedModalOpen}
        onClose={() => setIsAdvancedModalOpen(false)}
        title="Send Blast"
      >
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-300 mb-4">
              Guests will receive the blast via email, SMS or in-app notification. 
              It will also be shown on the event page.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Recipients</label>
            <select
              value={advancedData.recipients}
              onChange={(e) => setAdvancedData({ ...advancedData, recipients: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white"
            >
              <option value="going">Going</option>
              <option value="all">All</option>
              <option value="maybe">Maybe</option>
              <option value="invited">Invited</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Subject (Optional)</label>
            <input
              type="text"
              value={advancedData.subject}
              onChange={(e) => setAdvancedData({ ...advancedData, subject: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
            <textarea
              value={advancedData.message}
              onChange={(e) => setAdvancedData({ ...advancedData, message: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white min-h-[100px]"
            />
          </div>

          <div className="flex justify-between mt-6">
            <Button variant="secondary" onClick={() => setIsAdvancedModalOpen(false)}>
              Cancel
            </Button>
            <div className="space-x-3">
              <Button variant="secondary">Schedule</Button>
              <Button onClick={() => {/* Handle send blast */}}>Send</Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Reminder Settings Modal */}
      <Modal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        title="Manage Event Reminders"
      >
        <div className="space-y-6 p-4">
          {/* Main Enable Switch */}
          <div className="flex items-center justify-between bg-gray-700/50 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <BellIcon className="w-5 h-5 text-gray-400" />
              <div>
                <h3 className="text-white font-medium">Enable Event Reminders</h3>
                <p className="text-sm text-gray-400">Send automatic reminders to guests</p>
              </div>
            </div>
            <div className="relative inline-block">
              <input
                type="checkbox"
                checked={reminderSettings.enabled}
                onChange={(e) => setReminderSettings({
                  ...reminderSettings,
                  enabled: e.target.checked
                })}
                className="w-5 h-5 bg-gray-700 border-2 border-gray-500 rounded checked:bg-blue-500 checked:border-blue-500"
              />
            </div>
          </div>

          {/* Reminder Options */}
          {reminderSettings.enabled && (
            <div className="space-y-4">
              {reminderSettings.schedule.map((reminder, index) => (
                <div 
                  key={reminder.type}
                  className="flex items-center justify-between bg-gray-700/50 p-4 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <ClockIcon className="w-5 h-5 text-gray-400" />
                    <div>
                      <h3 className="text-white font-medium">
                        {reminder.type === '24h' ? '24 hours before event' : '1 hour before event'}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {reminder.type === '24h' ? 'Day-before reminder' : 'Hour-before reminder'}
                      </p>
                    </div>
                  </div>
                  <div className="relative inline-block">
                    <input
                      type="checkbox"
                      checked={reminder.enabled}
                      onChange={(e) => {
                        const newSchedule = [...reminderSettings.schedule];
                        newSchedule[index].enabled = e.target.checked;
                        setReminderSettings({
                          ...reminderSettings,
                          schedule: newSchedule
                        });
                      }}
                      className="w-5 h-5 bg-gray-700 border-2 border-gray-500 rounded checked:bg-blue-500 checked:border-blue-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
            <Button
              variant="secondary"
              onClick={() => setIsReminderModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleUpdateReminders}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      {/* Feedback Settings Modal */}
      <Modal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        title="Schedule Post-Event Feedback"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-white">Enable Feedback Email</label>
            <input
              type="checkbox"
              checked={feedbackSettings.enabled}
              onChange={(e) => setFeedbackSettings({
                ...feedbackSettings,
                enabled: e.target.checked
              })}
              className="form-checkbox h-5 w-5 text-blue-600 bg-gray-700 border-gray-600 rounded"
            />
          </div>

          {feedbackSettings.enabled && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Send After Event
                </label>
                <select
                  value={feedbackSettings.delay}
                  onChange={(e) => setFeedbackSettings({
                    ...feedbackSettings,
                    delay: e.target.value
                  })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white"
                >
                  <option value="24">24 hours</option>
                  <option value="48">48 hours</option>
                  <option value="72">72 hours</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Template
                </label>
                <select
                  value={feedbackSettings.template}
                  onChange={(e) => setFeedbackSettings({
                    ...feedbackSettings,
                    template: e.target.value
                  })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white"
                >
                  <option value="default">Default Template</option>
                  <option value="simple">Simple Template</option>
                  <option value="detailed">Detailed Template</option>
                </select>
              </div>
            </>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="secondary" onClick={() => setIsFeedbackModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateFeedback}>
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Blasts; 