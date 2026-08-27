const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');


const {
  createCandidate,
  getCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
} = require('../controllers/candidateController');


router
  .route('/')
  .get(protect, authorize('RECRUITER', 'ADMIN'), getCandidates)
  .post(protect, authorize('CANDIDATE', 'RECRUITER', 'ADMIN'), createCandidate);

router
  .route('/:id')
  .get(protect, authorize('CANDIDATE', 'RECRUITER', 'ADMIN'), getCandidateById)
  .put(protect, authorize('CANDIDATE', 'RECRUITER', 'ADMIN'), updateCandidate)
  .delete(protect, authorize('ADMIN'), deleteCandidate);

module.exports = router;