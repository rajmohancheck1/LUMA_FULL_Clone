import React, { useState } from 'react';
import { AlertCircle, X, Plus, Mail, Check } from 'lucide-react';

// Custom Switch Component
const Switch = ({ checked, onChange }) => (
  <button
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
      checked ? 'bg-blue-500' : 'bg-gray-600'
    }`}
    onClick={() => onChange(!checked)}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        checked ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);

// Custom Modal Component
const Modal = ({ open, onClose, title, children, footer }) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/70" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-gray-800 rounded-lg shadow-xl max-w-lg w-full border border-gray-700">
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-300">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4">{children}</div>
          {footer && <div className="p-4 border-t border-gray-700">{footer}</div>}
        </div>
      </div>
    </div>
  );
};

// Custom Button Component
const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-colors';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-700 border border-gray-600 text-white hover:bg-gray-600',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

// Toast Notification Component
const Toast = ({ message, type = 'success' }) => (
  <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
    <div className={`px-6 py-3 rounded-lg shadow-lg ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white flex items-center gap-2`}>
      <Check className="w-4 h-4" />
      {message}
    </div>
  </div>
);

// Ticket Component
const TicketType = ({ ticket, onDelete }) => (
  <div className="bg-white rounded-lg border p-4 mb-4">
    <div className="flex justify-between items-center">
      <div>
        <span className="font-medium">{ticket.name}</span>
        <span className="text-gray-500 ml-2">{ticket.price === 0 ? 'Free' : `$${ticket.price}`}</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-gray-500">{ticket.registered} registered</span>
        <button onClick={() => onDelete(ticket.id)} className="text-red-500 hover:text-red-700">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
);

// Question Component
const Question = ({ question, onToggle, onDelete }) => (
  <div className="bg-white rounded-lg border p-4 mb-4">
    <div className="flex justify-between items-center">
      <div>
        <span className="font-medium">{question.label}</span>
        <span className="text-gray-500 ml-2">{question.required ? 'Required' : 'Optional'}</span>
      </div>
      <div className="flex items-center gap-4">
        <Switch checked={question.enabled} onChange={() => onToggle(question.id)} />
        <button onClick={() => onDelete(question.id)} className="text-red-500 hover:text-red-700">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
);

const EventRegistration = () => {
  // State management
  const [tickets, setTickets] = useState([
    { id: 1, name: 'Standard', price: 0, registered: 1 }
  ]);
  const [questions, setQuestions] = useState([
    { id: 1, label: 'Name', type: 'text', required: true, enabled: true },
    { id: 2, label: 'Email', type: 'email', required: true, enabled: true },
    { id: 3, label: 'Phone', type: 'tel', required: false, enabled: false },
  ]);
  const [emailContent, setEmailContent] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Modals state
  const [modals, setModals] = useState({
    registration: false,
    capacity: false,
    group: false,
    email: false,
    newTicket: false,
    newQuestion: false,
  });

  // Settings state
  const [settings, setSettings] = useState({
    isRegistrationOpen: true,
    capacity: 50,
    allowWaitlist: false,
    allowGroupRegistration: false,
  });

  // Toast helper
  const showTemporaryToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Ticket handlers
  const addTicket = (ticketData) => {
    const newTicket = {
      id: tickets.length + 1,
      ...ticketData,
      registered: 0,
    };
    setTickets([...tickets, newTicket]);
    showTemporaryToast('New ticket type added');
  };

  // Question handlers
  const addQuestion = (questionData) => {
    const newQuestion = {
      id: questions.length + 1,
      ...questionData,
      enabled: true,
    };
    setQuestions([...questions, newQuestion]);
    showTemporaryToast('New question added');
  };

  const toggleQuestion = (id) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, enabled: !q.enabled } : q
    ));
  };

  // Email handlers
  const updateEmail = (content) => {
    setEmailContent(content);
    showTemporaryToast('Email template updated');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-3xl mx-auto p-6">
        {/* Top Controls */}
        <div className="flex gap-4 mb-8">
          <Button
            onClick={() => setModals({ ...modals, registration: true })}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <span className={`w-2 h-2 rounded-full ${
              settings.isRegistrationOpen ? 'bg-green-500' : 'bg-red-500'
            }`} />
            Registration
          </Button>

          <Button
            onClick={() => setModals({ ...modals, capacity: true })}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4" />
            Event Capacity
          </Button>

          <Button
            onClick={() => setModals({ ...modals, group: true })}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4" />
            Group Registration
          </Button>
        </div>

        {/* Tickets Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Tickets</h2>
            <Button
              variant="secondary"
              onClick={() => setModals({ ...modals, newTicket: true })}
            >
              <Plus className="w-4 h-4 mr-2" /> New Ticket Type
            </Button>
          </div>
          {tickets.map(ticket => (
            <TicketType
              key={ticket.id}
              ticket={ticket}
              onDelete={(id) => {
                setTickets(tickets.filter(t => t.id !== id));
                showTemporaryToast('Ticket type removed');
              }}
            />
          ))}
        </div>

        {/* Registration Email Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Registration Email</h2>
          <p className="text-gray-600 mb-4">
            Upon registration, we send guests a confirmation email that includes a calendar invite.
            You can add a custom message to the email.
          </p>
          <Button
            variant="secondary"
            onClick={() => setModals({ ...modals, email: true })}
            className="flex items-center gap-2"
          >
            <Mail className="w-4 h-4" /> Customize Email
          </Button>
        </div>

        {/* Questions Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Registration Questions</h2>
          {questions.map(question => (
            <Question
              key={question.id}
              question={question}
              onToggle={toggleQuestion}
              onDelete={(id) => {
                setQuestions(questions.filter(q => q.id !== id));
                showTemporaryToast('Question removed');
              }}
            />
          ))}
          <Button
            variant="secondary"
            onClick={() => setModals({ ...modals, newQuestion: true })}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Question
          </Button>
        </div>

        {/* Modals */}
        {/* Registration Modal */}
        <Modal
          open={modals.registration}
          onClose={() => setModals({ ...modals, registration: false })}
          title="Registration Settings"
          footer={
            <div className="flex justify-end">
              <Button
                onClick={() => {
                  setModals({ ...modals, registration: false });
                  showTemporaryToast('Registration settings updated');
                }}
              >
                Confirm
              </Button>
            </div>
          }
        >
          <div className="flex items-center justify-between mb-4">
            <span>Accept Registration</span>
            <Switch
              checked={settings.isRegistrationOpen}
              onChange={(checked) => setSettings({ ...settings, isRegistrationOpen: checked })}
            />
          </div>
        </Modal>

        {/* New Ticket Modal */}
        <Modal
          open={modals.newTicket}
          onClose={() => setModals({ ...modals, newTicket: false })}
          title="Add New Ticket Type"
          footer={
            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => setModals({ ...modals, newTicket: false })}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  addTicket({
                    name: 'VIP Ticket',
                    price: 99,
                  });
                  setModals({ ...modals, newTicket: false });
                }}
              >
                Add Ticket
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Ticket Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded-lg"
                placeholder="Enter ticket name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price</label>
              <input
                type="number"
                className="w-full p-2 border rounded-lg"
                placeholder="0"
              />
            </div>
          </div>
        </Modal>

        {/* Email Modal */}
        <Modal
          open={modals.email}
          onClose={() => setModals({ ...modals, email: false })}
          title="Customize Registration Email"
          footer={
            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => setModals({ ...modals, email: false })}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  updateEmail('Thank you for registering!');
                  setModals({ ...modals, email: false });
                }}
              >
                Update Email
              </Button>
            </div>
          }
        >
          <textarea
            className="w-full p-4 border rounded-lg min-h-[200px]"
            placeholder="Enter your custom email message..."
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
          />
        </Modal>
     
  {/* New Question Modal */}
  <Modal
    open={modals.newQuestion}
    onClose={() => setModals({ ...modals, newQuestion: false })}
    title="Add Question"
    footer={
      <div className="flex justify-end gap-2">
        <Button
          variant="secondary"
          onClick={() => setModals({ ...modals, newQuestion: false })}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            addQuestion({
              label: 'Company Name',
              type: 'text',
              required: false,
            });
            setModals({ ...modals, newQuestion: false });
          }}
        >
          Add Question
        </Button>
      </div>
    }
  >
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Question Type</label>
        <select className="w-full p-2 border rounded-lg">
          <option>Text</option>
          <option>Options</option>
          <option>Social Profile</option>
          <option>Company</option>
          <option>Checkbox</option>
          <option>Terms</option>
          <option>Website</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Question Label</label>
        <input
          type="text"
          className="w-full p-2 border rounded-lg"
          placeholder="Enter question label"
        />
      </div>
      <div className="flex items-center justify-between">
        <span>Required</span>
        <Switch checked={false} onChange={() => {}} />
      </div>
    </div>
  </Modal>

  {/* Capacity Modal */}
  <Modal
    open={modals.capacity}
    onClose={() => setModals({ ...modals, capacity: false })}
    title="Event Capacity"
    footer={
      <div className="flex justify-end gap-2">
        <Button
          variant="secondary"
          onClick={() => setModals({ ...modals, capacity: false })}
        >
          Remove Limit
        </Button>
        <Button
          onClick={() => {
            setSettings({ ...settings, capacity: 50 });
            setModals({ ...modals, capacity: false });
            showTemporaryToast('Capacity updated');
          }}
        >
          Set Limit
        </Button>
      </div>
    }
  >
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Capacity</label>
        <input
          type="number"
          className="w-full p-2 border rounded-lg"
          value={settings.capacity}
          onChange={(e) => setSettings({ ...settings, capacity: parseInt(e.target.value) })}
        />
      </div>
      <div className="flex items-center justify-between">
        <span>Over-Capacity Waitlist</span>
        <Switch
          checked={settings.allowWaitlist}
          onChange={(checked) => setSettings({ ...settings, allowWaitlist: checked })}
        />
      </div>
    </div>
  </Modal>

  {/* Group Registration Modal */}
  <Modal
    open={modals.group}
    onClose={() => setModals({ ...modals, group: false })}
    title="Group Registration"
    footer={
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setSettings({ ...settings, allowGroupRegistration: !settings.allowGroupRegistration });
            setModals({ ...modals, group: false });
            showTemporaryToast('Group registration settings updated');
          }}
        >
          Confirm
        </Button>
      </div>
    }
  >
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span>Allow Group Registration</span>
        <Switch
          checked={settings.allowGroupRegistration}
          onChange={(checked) => setSettings({ ...settings, allowGroupRegistration: checked })}
        />
      </div>
      <p className="text-sm text-gray-600">
        If turned on, guests will be able to get multiple tickets at once.
        <a href="#" className="text-blue-500 ml-1">Learn more about group registration ↗</a>
      </p>
    </div>
  </Modal>

  {/* Toast Notification */}
  {showToast && (
    <Toast message={toastMessage} />
  )}
</div>
</div>
);
};

export default EventRegistration;