import User from '../models/User.js';
import Student from '../models/Student.js';
import Trainer from '../models/Trainer.js';
import PlacementOfficer from '../models/PlacementOfficer.js';
import { ROLES } from '../config/constants.js';

// @desc    Get all users across all roles with pagination and search
// @route   GET /api/admin/users
// @access  Private (Super Admin)
export const getAllUsers = async (req, res, next) => {
  try {
    const { role, search } = req.query;

    let query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a user account (Admin direct provision)
// @route   POST /api/admin/users
// @access  Private (Super Admin)
export const createUserAdmin = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, course, department, specialization } = req.body;

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(409).json({ success: false, message: 'User with this email already exists.' });
    }

    const passwordHash = await User.hashPassword(password || 'Password@123');
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: role || ROLES.STUDENT,
      phone: phone || '',
    });

    if (user.role === ROLES.STUDENT) {
      await Student.create({
        userId: user._id,
        course: course || 'Computer Science Engineering',
        department: department || 'Engineering',
      });
    } else if (user.role === ROLES.TRAINER) {
      await Trainer.create({
        userId: user._id,
        department: department || 'Technical Training',
        specialization: specialization || 'Full-Stack Development',
      });
    } else if (user.role === ROLES.PLACEMENT) {
      await PlacementOfficer.create({
        userId: user._id,
        department: department || 'Placement Cell',
      });
    }

    return res.status(201).json({
      success: true,
      message: 'User account provisioned successfully.',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user active/inactive status
// @route   PUT /api/admin/users/:id/status
// @access  Private (Super Admin)
export const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    user.isActive = !user.isActive;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `User status changed to ${user.isActive ? 'Active' : 'Inactive'}.`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user account
// @route   DELETE /api/admin/users/:id
// @access  Private (Super Admin)
export const deleteUserAdmin = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Clean up role profile
    if (user.role === ROLES.STUDENT) await Student.findOneAndDelete({ userId: user._id });
    if (user.role === ROLES.TRAINER) await Trainer.findOneAndDelete({ userId: user._id });
    if (user.role === ROLES.PLACEMENT) await PlacementOfficer.findOneAndDelete({ userId: user._id });

    return res.status(200).json({
      success: true,
      message: 'User account and associated profile deleted.',
    });
  } catch (error) {
    next(error);
  }
};
