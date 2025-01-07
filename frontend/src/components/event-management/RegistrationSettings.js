import { useState, useEffect } from 'react';
import Button from '../Button';
import { useNotification } from '../../context/NotificationContext';
import api from '../../utils/api';
import Modal from '../Modal';
import {
  PlusIcon,
  TrashIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

const RegistrationSettings = ({ event, onUpdate }) => {
  const { showNotification } = useNotification();
  const [settings, setSettings] = useState({
    ticketTypes: event.ticketTypes || [],
    customQuestions: event.customQuestions || [],
    requireApproval: event.requireApproval || false,
    waitlist: event.waitlist || false,
    registrationDeadline: event.registrationDeadline || '',
    maxTicketsPerOrder: event.maxTicketsPerOrder || 4
  });

  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({
    name: '',
    price: 0,
    capacity: 1,
    description: ''
  });

  const [isNewQuestionModalOpen, setIsNewQuestionModalOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    type: 'text',
    required: false,
    options: ['']
  });

  const handleSave = async () => {
    try {
      await onUpdate({ ...settings });
      showNotification('Registration settings updated successfully', 'success');
    } catch (error) {
      showNotification('Failed to update registration settings', 'error');
    }
  };

  const handleAddTicketType = () => {
    setSettings(prev => ({
      ...prev,
      ticketTypes: [...prev.ticketTypes, newTicket]
    }));
    setIsNewTicketModalOpen(false);
    setNewTicket({
      name: '',
      price: 0,
      capacity: 1,
      description: ''
    });
  };

  const handleRemoveTicketType = (index) => {
    setSettings(prev => ({
      ...prev,
      ticketTypes: prev.ticketTypes.filter((_, i) => i !== index)
    }));
  };

  const handleAddQuestion = () => {
    setSettings(prev => ({
      ...prev,
      customQuestions: [...prev.customQuestions, newQuestion]
    }));
    setIsNewQuestionModalOpen(false);
    setNewQuestion({
      question: '',
      type: 'text',
      required: false,
      options: ['']
    });
  };

  const handleRemoveQuestion = (index) => {
    setSettings(prev => ({
      ...prev,
      customQuestions: prev.customQuestions.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-8">
      {/* Ticket Types Section */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Ticket Types</h2>
          <Button
            onClick={() => setIsNewTicketModalOpen(true)}
            className="flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Ticket Type
          </Button>
        </div>

        <div className="space-y-4">
          {settings.ticketTypes.map((ticket, index) => (
            <div
              key={index}
              className="bg-gray-700 rounded-lg p-4 flex items-center justify-between"
            >
              <div>
                <h3 className="font-medium">{ticket.name}</h3>
                <div className="mt-1 text-sm text-gray-400">
                  ${ticket.price} • {ticket.capacity} available
                </div>
                {ticket.description && (
                  <p className="mt-1 text-sm text-gray-400">{ticket.description}</p>
                )}
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleRemoveTicketType(index)}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Questions Section */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Custom Questions</h2>
          <Button
            onClick={() => setIsNewQuestionModalOpen(true)}
            className="flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Question
          </Button>
        </div>

        <div className="space-y-4">
          {settings.customQuestions.map((question, index) => (
            <div
              key={index}
              className="bg-gray-700 rounded-lg p-4 flex items-center justify-between"
            >
              <div>
                <div className="flex items-center">
                  <h3 className="font-medium">{question.question}</h3>
                  {question.required && (
                    <span className="ml-2 text-xs bg-red-900 text-red-200 px-2 py-1 rounded-full">
                      Required
                    </span>
                  )}
                </div>
                <div className="mt-1 text-sm text-gray-400">
                  Type: {question.type}
                  {question.type !== 'text' && (
                    <span className="ml-2">
                      Options: {question.options.join(', ')}
                    </span>
                  )}
                </div>
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleRemoveQuestion(index)}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* General Settings */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">General Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={settings.requireApproval}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  requireApproval: e.target.checked
                }))}
                className="h-4 w-4 bg-gray-700 border-gray-600 rounded"
              />
              <label className="ml-2 text-sm text-gray-300">
                Require approval for registrations
              </label>
            </div>
            <QuestionMarkCircleIcon className="h-5 w-5 text-gray-400" title="Enable manual approval for each registration" />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={settings.waitlist}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  waitlist: e.target.checked
                }))}
                className="h-4 w-4 bg-gray-700 border-gray-600 rounded"
              />
              <label className="ml-2 text-sm text-gray-300">
                Enable waitlist
              </label>
            </div>
            <QuestionMarkCircleIcon className="h-5 w-5 text-gray-400" title="Allow registrations after capacity is reached" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              Registration Deadline
            </label>
            <input
              type="datetime-local"
              value={settings.registrationDeadline}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                registrationDeadline: e.target.value
              }))}
              className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              Maximum Tickets Per Order
            </label>
            <input
              type="number"
              min="1"
              value={settings.maxTicketsPerOrder}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                maxTicketsPerOrder: parseInt(e.target.value)
              }))}
              className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md text-white"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave}>
          Save Changes
        </Button>
      </div>

      {/* New Ticket Modal */}
      <Modal
        isOpen={isNewTicketModalOpen}
        onClose={() => setIsNewTicketModalOpen(false)}
        title="Add Ticket Type"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Name</label>
            <input
              type="text"
              value={newTicket.name}
              onChange={(e) => setNewTicket({ ...newTicket, name: e.target.value })}
              className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Price ($)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={newTicket.price}
              onChange={(e) => setNewTicket({ ...newTicket, price: parseFloat(e.target.value) })}
              className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Capacity</label>
            <input
              type="number"
              min="1"
              value={newTicket.capacity}
              onChange={(e) => setNewTicket({ ...newTicket, capacity: parseInt(e.target.value) })}
              className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Description</label>
            <textarea
              value={newTicket.description}
              onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
              className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md text-white"
              rows={3}
            />
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setIsNewTicketModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTicketType}>
              Add Ticket Type
            </Button>
          </div>
        </div>
      </Modal>

      {/* New Question Modal */}
      <Modal
        isOpen={isNewQuestionModalOpen}
        onClose={() => setIsNewQuestionModalOpen(false)}
        title="Add Custom Question"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Question</label>
            <input
              type="text"
              value={newQuestion.question}
              onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
              className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Type</label>
            <select
              value={newQuestion.type}
              onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value })}
              className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md text-white"
            >
              <option value="text">Text</option>
              <option value="select">Select</option>
              <option value="checkbox">Checkbox</option>
            </select>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={newQuestion.required}
              onChange={(e) => setNewQuestion({ ...newQuestion, required: e.target.checked })}
              className="h-4 w-4 bg-gray-700 border-gray-600 rounded"
            />
            <label className="ml-2 text-sm text-gray-300">Required</label>
          </div>
          {newQuestion.type !== 'text' && (
            <div>
              <label className="block text-sm font-medium text-gray-300">Options</label>
              <div className="space-y-2">
                {newQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...newQuestion.options];
                        newOptions[index] = e.target.value;
                        setNewQuestion({ ...newQuestion, options: newOptions });
                      }}
                      className="flex-1 bg-gray-700 border-gray-600 rounded-md text-white"
                    />
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => {
                        setNewQuestion({
                          ...newQuestion,
                          options: newQuestion.options.filter((_, i) => i !== index)
                        });
                      }}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setNewQuestion({
                      ...newQuestion,
                      options: [...newQuestion.options, '']
                    });
                  }}
                >
                  Add Option
                </Button>
              </div>
            </div>
          )}
          <div className="mt-6 flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setIsNewQuestionModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddQuestion}>
              Add Question
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RegistrationSettings; 