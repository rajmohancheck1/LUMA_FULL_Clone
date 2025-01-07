import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { NotificationProvider } from '../context/NotificationContext';

const AllTheProviders = ({ children }) => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>{children}</BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
};

const customRender = (ui, options) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
