// /server/controllers/streamController.js
const streamService = require('../services/streamService');

const createStream = (req, res) => {
  try {
    const { title, streamerId } = req.body;
    const stream = streamService.createStream(title, streamerId);
    
    res.status(201).json({ 
      success: true,
      stream 
    });
  } catch (error) {
    console.error('Error creating stream:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to create stream' 
    });
  }
};

const getStreams = (req, res) => {
  try {
    const streams = streamService.getAllStreams();
    
    res.json({ 
      success: true,
      streams 
    });
  } catch (error) {
    console.error('Error fetching streams:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch streams' 
    });
  }
};

const endStream = (req, res) => {
  try {
    const { streamId } = req.params;
    const result = streamService.endStream(streamId);
    
    res.json({ 
      success: true,
      result 
    });
  } catch (error) {
    console.error('Error ending stream:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to end stream' 
    });
  }
};

const deleteStream=(req,res)=>{
  try {
    const { streamId } = req.params;
    const result = streamService.deleteStream(streamId);
    
    res.json({ 
      success: true,
      result 
    });
  } catch (error) {
    console.error('Error deleting stream:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to delete stream' 
    });
  }
};

module.exports = {
  createStream,
  getStreams,
  endStream,
  deleteStream
  
};