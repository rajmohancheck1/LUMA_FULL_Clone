const EmailTemplate = require('../models/EmailTemplate');

exports.createTemplate = async (req, res) => {
  try {
    // Validate required fields
    const { name, subject, message, category } = req.body;
    
    if (!name || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, subject and message'
      });
    }

    const template = await EmailTemplate.create({
      name,
      subject,
      message,
      category: category || 'general',
      creator: req.user._id,
      variables: extractVariables(message) // Helper function to extract template variables
    });

    res.status(201).json({
      success: true,
      data: template
    });
  } catch (error) {
    console.error('Create template error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating email template'
    });
  }
};

// Helper function to extract variables from template
const extractVariables = (message) => {
  const regex = /{{\s*([^}]+)\s*}}/g;
  const variables = [];
  let match;
  
  while ((match = regex.exec(message)) !== null) {
    variables.push(match[1].trim());
  }
  
  return [...new Set(variables)]; // Remove duplicates
};

exports.getTemplates = async (req, res) => {
  try {
    const templates = await EmailTemplate.find({
      creator: req.user._id
    }).sort('-createdAt');

    res.json({
      success: true,
      data: templates
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching email templates'
    });
  }
};

exports.updateTemplate = async (req, res) => {
  try {
    const template = await EmailTemplate.findOneAndUpdate(
      {
        _id: req.params.id,
        creator: req.user._id
      },
      req.body,
      { new: true }
    );

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    res.json({
      success: true,
      data: template
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating email template'
    });
  }
};

exports.deleteTemplate = async (req, res) => {
  try {
    const template = await EmailTemplate.findOneAndDelete({
      _id: req.params.id,
      creator: req.user._id
    });

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting email template'
    });
  }
}; 