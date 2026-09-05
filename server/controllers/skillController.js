import Skill from '../models/Skill.js';
import { SKILL_CATEGORIES } from '../config/constants.js';

// @desc    Get all skills with search and category filtering
// @route   GET /api/skills
// @access  Private
export const getSkills = async (req, res, next) => {
  try {
    const { search, category } = req.query;

    let query = {};
    if (category) {
      query.category = category;
    }
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const skills = await Skill.find(query).sort({ category: 1, name: 1 });

    return res.status(200).json({
      success: true,
      categories: SKILL_CATEGORIES,
      data: skills,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single skill by ID
// @route   GET /api/skills/:id
// @access  Private
export const getSkillById = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill entity not found.' });
    }

    return res.status(200).json({
      success: true,
      data: skill,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new skill
// @route   POST /api/skills
// @access  Private (Admin, Placement, Trainer)
export const createSkill = async (req, res, next) => {
  try {
    const { name, category, description } = req.body;

    if (!name || !category) {
      return res.status(400).json({ success: false, message: 'Skill name and category are required.' });
    }

    const exists = await Skill.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (exists) {
      return res.status(409).json({ success: false, message: 'A skill with this name already exists.' });
    }

    const skill = await Skill.create({
      name,
      category,
      description: description || '',
    });

    return res.status(201).json({
      success: true,
      message: 'Skill registered successfully.',
      data: skill,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update existing skill
// @route   PUT /api/skills/:id
// @access  Private (Admin, Placement)
export const updateSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Skill updated successfully.',
      data: skill,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete skill
// @route   DELETE /api/skills/:id
// @access  Private (Admin)
export const deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Skill deleted.',
    });
  } catch (error) {
    next(error);
  }
};
