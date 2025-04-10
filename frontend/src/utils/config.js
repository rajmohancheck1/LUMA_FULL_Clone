const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const UPLOADS_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://luwitch.onrender.com/uploads'
    : `${API_URL}/uploads`;

export { API_URL, UPLOADS_URL };
