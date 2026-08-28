const express = require('express');
const router = express.Router();
const multer = require('multer');

// 1. Auth Middleware Import
const { protect, authorize } = require('../middleware/authMiddleware');

// 2. Candidate Controller Import
const {
  createCandidate,
  getCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
} = require('../controllers/candidateController');

// 3. Multer Setup (Resume PDF Upload ke liye)
const upload = multer({ dest: 'uploads/' });

// 4. Routes Definition

// Root Routes: GET (Fetch candidates) & POST (Create candidate with file upload)
router
  .route('/')
  .get(
    protect, 
    authorize('RECRUITER', 'ADMIN'), 
    getCandidates
  )
  .post(
    protect, 
    authorize('CANDIDATE', 'RECRUITER', 'ADMIN'), 
    upload.single('resume'), // Multer middleware form-data aur file parse karega
    createCandidate
  );

// ID-based Routes: GET (Single candidate), PUT (Update candidate with file upload), DELETE
router
  .route('/:id')
  .get(
    protect, 
    authorize('CANDIDATE', 'RECRUITER', 'ADMIN'), 
    getCandidateById
  )
  .put(
    protect, 
    authorize('CANDIDATE', 'RECRUITER', 'ADMIN'), 
    upload.single('resume'), // Multer middleware update request ke liye
    updateCandidate
  )
  .delete(
    protect, 
    authorize('ADMIN'), 
    deleteCandidate
  );

module.exports = router;