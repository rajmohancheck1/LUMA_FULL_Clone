import { format, formatDistance, formatRelative, isToday, isTomorrow } from 'date-fns';

export const formatEventDate = date => {
  const eventDate = new Date(date);

  if (isToday(eventDate)) {
    return `Today at ${format(eventDate, 'h:mm a')}`;
  }

  if (isTomorrow(eventDate)) {
    return `Tomorrow at ${format(eventDate, 'h:mm a')}`;
  }

  return format(eventDate, 'PPP');
};

export const formatRelativeTime = date => {
  return formatDistance(new Date(date), new Date(), { addSuffix: true });
};

export const formatDateTime = (date, time) => {
  const dateTime = new Date(`${date}T${time}`);
  return format(dateTime, 'PPPp');
};

export const getRelativeDatetime = date => {
  return formatRelative(new Date(date), new Date());
};
