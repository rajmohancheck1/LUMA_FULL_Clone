const Queue = require('bull');
const EmailBlast = require('../models/EmailBlast');
const { sendEmailBlast } = require('../controllers/emailBlastController');

// Create email queue
const emailQueue = new Queue('email-queue', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
  }
});

// Process scheduled emails
emailQueue.process(async (job) => {
  const { blastId } = job.data;
  await sendEmailBlast(blastId);
});

// Schedule email blast
exports.scheduleEmailBlast = async (blastId, scheduledFor) => {
  await emailQueue.add(
    { blastId },
    { 
      delay: new Date(scheduledFor) - new Date(),
      jobId: blastId 
    }
  );
};

// Handle failed jobs
emailQueue.on('failed', async (job, err) => {
  console.error('Email job failed:', err);
  const { blastId } = job.data;
  await EmailBlast.findByIdAndUpdate(blastId, {
    status: 'failed',
    metadata: { error: err.message }
  });
});

module.exports = emailQueue; 