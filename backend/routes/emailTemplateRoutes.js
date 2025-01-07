const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  createTemplate,
  getTemplates,
  updateTemplate,
  deleteTemplate
} = require('../controllers/emailTemplateController');

router.use(protect);
router.use(authorize('organizer', 'admin'));

router
  .route('/')
  .post(createTemplate)
  .get(getTemplates);

router
  .route('/:id')
  .put(updateTemplate)
  .delete(deleteTemplate);

module.exports = router; 