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

const AppRoutes = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/events/:id/manage" element={
          <PrivateRoute roles={['organizer', 'admin']}>
            <EventManagement />
          </PrivateRoute>
        } />
        <Route path="/" element={
          
            <BrowseEvents />
          
        } />
        <Route path="/events" element={
          <div className="min-h-screen bg-gray-900 text-white">
            <Home />
          </div>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/create-event" element={
          <PrivateRoute roles={['organizer', 'admin']}>
            <CreateEvent />
          </PrivateRoute>
        } />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <div className="min-h-screen bg-gray-900 text-white">
              <Dashboard />
            </div>
          </PrivateRoute>
        } />
        <Route path="/calender" element={
          <PrivateRoute>
            <CalendarView/>
            
          </PrivateRoute>
        } />
      </Routes>
    </>
  );
};

export default AppRoutes; 