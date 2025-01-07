export const validateEmail = email => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = password => {
  return password.length >= 6;
};

export const validateEventForm = formData => {
  const errors = {};
  const currentDate = new Date();
  const eventDate = new Date(formData.date);

  if (!formData.title?.trim()) {
    errors.title = 'Title is required';
  } else if (formData.title.length > 100) {
    errors.title = 'Title cannot exceed 100 characters';
  }

  if (eventDate < currentDate) {
    errors.date = 'Event date cannot be in the past';
  }

  if (!formData.description?.trim()) {
    errors.description = 'Description is required';
  }

  if (!formData.time) {
    errors.time = 'Time is required';
  }

  if (!formData.location?.trim()) {
    errors.location = 'Location is required';
  }

  if (!formData.category) {
    errors.category = 'Category is required';
  }

  if (formData.price < 0) {
    errors.price = 'Price cannot be negative';
  }

  if (!formData.capacity || formData.capacity < 1) {
    errors.capacity = 'Capacity must be at least 1';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
