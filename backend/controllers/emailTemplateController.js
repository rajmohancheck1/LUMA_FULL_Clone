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
      creator: req.user.id,
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
      creator: req.user.id
    }).sort('-createdAt');

    res.json({
      success: true,
      count: templates.length,
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
    let template = await EmailTemplate.findById(req.params.id);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    // Check if user owns this template
    if (template.creator.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this template'
      });
    }

    template = await EmailTemplate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

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
    const template = await EmailTemplate.findById(req.params.id);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    // Check if user owns this template
    if (template.creator.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this template'
      });
    }

    await template.remove();

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