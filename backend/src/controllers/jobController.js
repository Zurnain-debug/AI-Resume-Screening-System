const Job = require('../models/Job');

const createJob = async (req, res) => {
  try {
    const { title, description, requiredSkills, experienceLevel, salary, department, location } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    // Process requiredSkills - if it's a string, split by comma
    let skillsArray = [];
    if (requiredSkills) {
      if (Array.isArray(requiredSkills)) {
        skillsArray = requiredSkills;
      } else if (typeof requiredSkills === 'string') {
        skillsArray = requiredSkills.split(',').map(skill => skill.trim()).filter(skill => skill);
      }
    }

    const job = await Job.create({
      title,
      description,
      requiredSkills: skillsArray,
      experienceLevel: experienceLevel || 'Mid',
      salary: salary || {},
      department,
      location,
      createdBy: req.user.id
    });

    res.status(201).json({
      message: 'Job created successfully',
      job
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getJobs = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const jobs = await Job.find(filter).populate('createdBy', 'name email company');
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('createdBy', 'name email company');
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.createdBy.toString() !== req.user.id && req.user.role !== 'HR') {
      return res.status(403).json({ error: 'Not authorized to update this job' });
    }

    // Process requiredSkills if provided
    const updateData = { ...req.body };
    if (updateData.requiredSkills && typeof updateData.requiredSkills === 'string') {
      updateData.requiredSkills = updateData.requiredSkills.split(',').map(skill => skill.trim()).filter(skill => skill);
    }

    job = await Job.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({
      message: 'Job updated successfully',
      job
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.createdBy.toString() !== req.user.id && req.user.role !== 'HR') {
      return res.status(403).json({ error: 'Not authorized to delete this job' });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createJob, getJobs, getJobById, updateJob, deleteJob };
