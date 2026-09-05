import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Student from '../models/Student.js';
import Trainer from '../models/Trainer.js';
import PlacementOfficer from '../models/PlacementOfficer.js';
import { ROLES } from '../config/constants.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'skillbridge_super_secret_jwt_key_2026_hackathon', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public (or Super Admin)
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, course, department, specialization } = req.body;

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(409).json({ success: false, message: 'User already exists with this email address.' });
    }

    const passwordHash = await User.hashPassword(password);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: role || ROLES.STUDENT,
      phone: phone || '',
    });

    // Create role profile
    if (user.role === ROLES.STUDENT) {
      await Student.create({
        userId: user._id,
        course: course || 'Full Stack Software Engineering',
        department: department || 'Computer Science & Engineering',
      });
    } else if (user.role === ROLES.TRAINER) {
      await Trainer.create({
        userId: user._id,
        department: department || 'Technical Training',
        specialization: specialization || 'Full Stack & Cloud Development',
      });
    } else if (user.role === ROLES.PLACEMENT) {
      await PlacementOfficer.create({
        userId: user._id,
        department: department || 'Corporate Placement Cell',
      });
    }

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'User account created successfully.',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Your account has been deactivated. Please contact support.' });
    }

    // Retrieve role-specific profile details
    let profileData = null;
    if (user.role === ROLES.STUDENT) {
      profileData = await Student.findOne({ userId: user._id }).populate('assignedTrainerId');
    } else if (user.role === ROLES.TRAINER) {
      profileData = await Trainer.findOne({ userId: user._id });
    } else if (user.role === ROLES.PLACEMENT) {
      profileData = await PlacementOfficer.findOne({ userId: user._id });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Authentication successful.',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profile: profileData,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    let profileData = null;

    if (user.role === ROLES.STUDENT) {
      profileData = await Student.findOne({ userId: user._id }).populate({
        path: 'assignedTrainerId',
        populate: { path: 'userId', select: 'name email phone' },
      });
    } else if (user.role === ROLES.TRAINER) {
      profileData = await Trainer.findOne({ userId: user._id }).populate({
        path: 'assignedStudents',
        populate: { path: 'userId', select: 'name email phone' },
      });
    } else if (user.role === ROLES.PLACEMENT) {
      profileData = await PlacementOfficer.findOne({ userId: user._id });
    }

    return res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        isActive: user.isActive,
        profile: profileData,
      },
    });
  } catch (error) {
    next(error);
  }
};
