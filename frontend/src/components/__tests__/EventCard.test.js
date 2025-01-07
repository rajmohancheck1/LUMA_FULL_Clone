import { render, screen } from '../utils/test-utils';
import EventCard from '../components/EventCard';

const mockEvent = {
  _id: '1',
  title: 'Test Event',
  description: 'Test Description',
  date: '2024-01-01',
  time: '14:00',
  location: 'Test Location',
  price: 99.99,
  category: 'conference',
  image: 'test-image.jpg'
};

describe('EventCard', () => {
  it('renders event details correctly', () => {
    render(<EventCard event={mockEvent} />);

    expect(screen.getByText(mockEvent.title)).toBeInTheDocument();
    expect(screen.getByText(/Test Location/)).toBeInTheDocument();
    expect(screen.getByText(/\$99.99/)).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', mockEvent.image);
  });

  it('shows default image when no image provided', () => {
    const eventWithoutImage = { ...mockEvent, image: null };
    render(<EventCard event={eventWithoutImage} />);

    expect(screen.getByRole('img')).toHaveAttribute('src', '/default-event.jpg');
  });
});
