
const Candidate = require('../models/candidateModel');
const User = require('../models/userModel');


const createCandidate = async (req, res) => {
  try {
    const { phone, location, experience, skills, education, resumeUrl, status, userId } = req.body;

   
    const targetUserId = (req.user.role === 'ADMIN' || req.user.role === 'RECRUITER') && userId
      ? userId
      : req.user._id;


    const existingCandidate = await Candidate.findOne({ user: targetUserId });
    if (existingCandidate) {
      return res.status(400).json({
        success: false,
        message: 'Candidate profile already exists for this user',
      });
    }

    
    const formattedSkills = Array.isArray(skills)
      ? skills.map(s => s.trim())
      : skills.split(',').map(s => s.trim());

    const candidate = await Candidate.create({
      user: targetUserId,
      phone,
      location: location.toLowerCase().trim(),
      experience: Number(experience),
      skills: formattedSkills,
      education,
      resumeUrl,
      status: status ? status.toUpperCase() : 'APPLIED',
    });

    const populatedCandidate = await candidate.populate('user', 'username email role');

    res.status(201).json({
      success: true,
      data: populatedCandidate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error while creating candidate profile',
    });
  }
};


const getCandidates = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      skills,
      minExp,
      maxExp,
      location,
      status,
      education,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    
    const query = {};

    
    if (search) {
      query.$text = { $search: search };
    }

    
    if (skills) {
      const skillsArray = Array.isArray(skills)
        ? skills
        : skills.split(',').map((s) => s.trim());
      query.skills = { $in: skillsArray.map((s) => new RegExp(`^${s}$`, 'i')) };
    }

   
    if (minExp !== undefined || maxExp !== undefined) {
      query.experience = {};
      if (minExp !== undefined) query.experience.$gte = Number(minExp);
      if (maxExp !== undefined) query.experience.$lte = Number(maxExp);
    }

    
    if (location) {
      query.location = { $regex: location.trim(), $options: 'i' };
    }

    
    if (status) {
      query.status = status.toUpperCase().trim();
    }

   
    if (education) {
      query.$or = [
        { 'education.degree': { $regex: education.trim(), $options: 'i' } },
        { 'education.institution': { $regex: education.trim(), $options: 'i' } },
      ];
    }

    
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

  
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

   
    const candidates = await Candidate.find(query)
      .populate('user', 'username email role')
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    const total = await Candidate.countDocuments(query);

    res.status(200).json({
      success: true,
      count: candidates.length,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        limit: limitNum,
      },
      data: candidates,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error while fetching candidates',
    });
  }
};


const getCandidateById = async (req, res) => {
  try {
    let candidate = await Candidate.findById(req.params.id).populate('user', 'username email role');

   
    if (!candidate) {
      candidate = await Candidate.findOne({ user: req.params.id }).populate('user', 'username email role');
    }

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate profile not found',
      });
    }

    
    if (req.user.role === 'CANDIDATE' && candidate.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only view your own profile',
      });
    }

    res.status(200).json({
      success: true,
      data: candidate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error while fetching candidate details',
    });
  }
};


const updateCandidate = async (req, res) => {
  try {
    let candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate profile not found',
      });
    }

   
    if (req.user.role === 'CANDIDATE' && candidate.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only update your own profile',
      });
    }

    
    const { phone, location, experience, skills, education, status, resumeUrl } = req.body;

    const fieldsToUpdate = {};
    if (phone) fieldsToUpdate.phone = phone;
    if (location) fieldsToUpdate.location = location.toLowerCase().trim();
    if (experience !== undefined) fieldsToUpdate.experience = Number(experience);
    if (skills) {
      fieldsToUpdate.skills = Array.isArray(skills)
        ? skills.map(s => s.trim())
        : skills.split(',').map(s => s.trim());
    }
    if (education) fieldsToUpdate.education = education;
    if (resumeUrl) fieldsToUpdate.resumeUrl = resumeUrl;
    
    
    if (status && (req.user.role === 'ADMIN' || req.user.role === 'RECRUITER')) {
      fieldsToUpdate.status = status.toUpperCase().trim();
    }

    candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      { $set: fieldsToUpdate },
      { new: true, runValidators: true }
    ).populate('user', 'username email role');

    res.status(200).json({
      success: true,
      data: candidate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error while updating candidate profile',
    });
  }
};


const deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate profile not found',
      });
    }

    await candidate.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Candidate profile deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error while deleting candidate profile',
    });
  }
};

module.exports = {
  createCandidate,
  getCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
};