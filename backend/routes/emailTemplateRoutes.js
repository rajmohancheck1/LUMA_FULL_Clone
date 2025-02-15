const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createTemplate,
  getTemplates,
  updateTemplate,
  deleteTemplate
} = require('../controllers/emailTemplateController');

// All routes require authentication
router.use(protect);

router.route('/')
  .post(createTemplate)
  .get(getTemplates);

router.route('/:id')
  .put(updateTemplate)
  .delete(deleteTemplate);

module.exports = router;