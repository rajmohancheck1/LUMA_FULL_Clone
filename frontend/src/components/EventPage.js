import React, { useState } from 'react';
import { MapPin, User } from 'lucide-react';
import { Button } from './components/ui/button';

export default function Preview() {
  const mockData = {
    eventTitle: "New Year Celebration 2025",
    date: {
      month: "JAN",
      day: "2",
      fullDate: "Thursday, January 2",
      time: "10:00 PM - 11:00 PM",
    },
    user: {
      name: "Isaac Jeddiah",
      email: "isaacjeddiah@gmail.com",
    },
    hasManageAccess: true,
  };

  return (
    <EventRegistration
      {...mockData}
      onRegister={() => {}}
      onCreateEvent={() => {}}
      onManage={() => {}}
      onContactHost={() => {}}
    />
  );
}

const EventRegistration = ({
  eventTitle,
  date,
  user,
  hasManageAccess,
  onRegister,
  onManage,
  onContactHost,
}) => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showHostForm, setShowHostForm] = useState(false);
  const [contactMessage, setContactMessage] = useState("");

  const handleRegister = () => {
    setIsRegistered(true);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 5000);
  };

  return (
    <div className="min-h-screen bg-[#121212] flex justify-center items-center text-white">
      <div className="max-w-5xl w-full p-6 bg-[#1f1f1f] rounded-lg shadow-lg">
        <div className="flex gap-6">
          {/* Event Image */}
          <div className="w-1/3 h-64 rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-red-500"></div>

          {/* Event Details */}
          <div className="flex-1 space-y-4">
            <h1 className="text-3xl font-bold">{eventTitle}</h1>

            <div className="flex items-start space-x-4">
              <div className="bg-neutral-700 rounded-lg p-2 text-center">
                <span className="text-xs text-neutral-400 uppercase">{date.month}</span>
                <div className="text-xl font-bold">{date.day}</div>
              </div>
              <div>
                <div className="font-medium">{date.fullDate}</div>
                <div className="text-neutral-400">{date.time}</div>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-neutral-400">
              <MapPin className="w-5 h-5" />
              <span>Register to See Address</span>
            </div>

            <div className="p-4 bg-[#2a2a2a] rounded-lg flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="font-medium">{user.name}</div>
                <div className="text-sm">{user.email}</div>
              </div>
            </div>

            {!isRegistered ? (
              <Button
                onClick={handleRegister}
                className="w-full bg-[#916c1b] hover:bg-[#7d5d17] text-white py-3 rounded-lg"
              >
                Register for Event
              </Button>
            ) : (
              <div className="p-4 bg-teal-600 border border-teal-500 text-white rounded-lg">
                <p>You have successfully registered!</p>
              </div>
            )}

            {hasManageAccess && (
              <div className="mt-4 p-4 border border-brown-500 bg-brown-700 text-white rounded-lg">
                <p>You have access to manage this event.</p>
                <Button
                  onClick={onManage}
                  className="mt-2 bg-brown-800 text-white hover:bg-brown-900"
                >
                  Manage →
                </Button>
              </div>
            )}

            <div className="p-4 bg-yellow-800 rounded-lg">
              <p className="text-yellow-100 font-medium">5 People are Going to this Event!</p>
            </div>

            <Button
              onClick={() => setShowHostForm(true)}
              className="w-full bg-[#2b2b2b] hover:bg-[#3a3a3a] text-neutral-400 py-3 rounded-lg"
            >
              Contact the Host
            </Button>
          </div>
        </div>
      </div>

      {/* Floating Popup */}
      {showPopup && (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-green-600 text-white py-2 px-4 rounded-lg shadow-lg">
          Successfully Registered!
        </div>
      )}

      {/* Contact Host Form */}
      {showHostForm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center">
          <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-medium mb-4">Contact the Host</h3>
            <textarea
              value={contactMessage}
              onChange={(e) => setContactMessage(e.target.value)}
              className="w-full p-3 border border-neutral-600 rounded-lg mb-4 bg-[#121212] text-white"
              rows="4"
              placeholder="Write your message here..."
            ></textarea>
            <div className="flex justify-between">
              <Button
                onClick={() => setShowHostForm(false)}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  alert(`Message sent: ${contactMessage}`);
                  setShowHostForm(false);
                }}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Send Message
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
