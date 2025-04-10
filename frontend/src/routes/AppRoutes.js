import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import EventDetails from '../pages/EventDetails';
//import CreateEvent from '../pages/CreateEvent';
import Dashboard from '../pages/Dashboard';
import PrivateRoute from '../components/PrivateRoute';
import EventManagement from '../pages/EventManagement';
import BrowseEvents from '../components/BrowseEvent/BrowseEvents';
import CreateEvent from '../components/CreateEvent/CreateEvent';
import CalendarView from '../components/Calender/CalendarPage';
import CreateStreamPage from '../components/Streams/CreateStreamPage';
import ViewStreamPage from '../components/Streams/ViewStreamPage';

const AppRoutes = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/events/:id/manage"
          element={
            <PrivateRoute>
              <EventManagement />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<BrowseEvents />} />
        <Route
          path="/events"
          element={
            <div className="min-h-screen bg-gray-900 text-white">
              <Home />
            </div>
          }
        />

        {/* Create Stream Page */}
        <Route
          path="/create-stream/:eventId"
          element={
            <PrivateRoute>
              <CreateStreamPage />
            </PrivateRoute>
          }
        />

        {/* View Stream Page */}
        <Route path="/view-stream/:eventId" element={<ViewStreamPage />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route
          path="/create-event"
          element={
            <PrivateRoute>
              <CreateEvent />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <div className="min-h-screen bg-gray-900 text-white">
                <Dashboard />
              </div>
            </PrivateRoute>
          }
        />
        <Route
          path="/calender"
          element={
            <PrivateRoute>
              <CalendarView />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
};

export default AppRoutes;
