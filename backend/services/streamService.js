// /server/services/streamService.js
const streams = require('../models/streamModel');


const createStream = (title, streamerId) => {
  // Check if there's already an active stream for this event
  const existingStream = Array.from(streams.values())
    .find(s => s.streamerId === streamerId && s.isLive);

  if (existingStream) {
    return existingStream;
  }

  const streamId = Math.random().toString(36).substr(2, 9);
  const newStream = {
    id: streamId,
    title,
    streamerId,
    isLive: true,
    viewers: 0,
    createdAt: new Date().toISOString()
  };
  
  streams.set(streamId, newStream);
  return newStream;
};

const getAllStreams = () => {
  return Array.from(streams.values())
    .map(stream => ({
      ...stream,
      isLive: Boolean(stream.isLive),
      viewerCount: stream.viewers || 0
    }));
};

const getStreamById = (streamId) => {
  return streams.get(streamId);
};

const updateStream = (streamId, updates) => {
  const stream = streams.get(streamId);
  if (stream) {
    Object.assign(stream, updates);
    return stream;
  }
  return null;
};

const endStream = (streamId) => {
  const stream = streams.get(streamId);
  
  if (!stream) {
    return { success: false, message: "Stream not found" };
  }
  
  if (!stream.isLive) {
    return { success: false, message: "Stream is already ended" };
  }
  
  // Update the stream to mark it as not live
  stream.isLive = false;
  stream.endedAt = new Date().toISOString();
  streams.set(streamId, stream);
  
  return { success: true, message: "Stream ended successfully", stream };
};

const deleteStream = (streamId) => {
  const stream = streams.get(streamId);
  
  if (!stream) {
    return { success: false, message: "Stream not found" };
  }
  
  streams.delete(streamId);
  return { success: true, message: "Stream deleted successfully" };
};

module.exports = {
  createStream,
  getAllStreams,
  getStreamById,
  updateStream,
  endStream,
  deleteStream,
  streams
};