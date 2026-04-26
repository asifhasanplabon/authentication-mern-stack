import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import cloudinary from '../config/cloudinary.js';

// @route GET /api/students   — get all students (admin) or own profile
export const getStudents = asyncHandler(async (req, res) => {
  const filter = req.user.role === 'admin' ? { role: 'student' } : { _id: req.user._id };
  const students = await User.find(filter).select('-password').sort('-createdAt');
  res.json(students);
});

// @route GET /api/students/:id
export const getStudent = asyncHandler(async (req, res) => {
  const student = await User.findById(req.params.id).select('-password');
  if (!student) { res.status(404); throw new Error('Student not found'); }
  res.json(student);
});

// @route PUT /api/students/:id
export const updateStudent = asyncHandler(async (req, res) => {
  const student = await User.findById(req.params.id);
  if (!student) { res.status(404); throw new Error('Student not found'); }

  // Only admin or the student themselves can update
  if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
    res.status(403); throw new Error('Not authorized');
  }

  // Update photo on cloudinary if new one uploaded
  let photoUrl = student.photo;
  if (req.file) {
    if (student.photo) {
      const publicId = student.photo.split('/').slice(-2).join('/').split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    }
    photoUrl = req.file.path;
  }

  const { name, gender, session, dept, phone } = req.body;
  student.name    = name    || student.name;
  student.gender  = gender  || student.gender;
  student.session = session || student.session;
  student.dept    = dept    || student.dept;
  student.phone   = phone   || student.phone;
  student.photo   = photoUrl;

  const updated = await student.save();
  res.json({ message: 'Updated successfully', student: updated });
});

// @route DELETE /api/students/:id   (admin only)
export const deleteStudent = asyncHandler(async (req, res) => {
  const student = await User.findById(req.params.id);
  if (!student) { res.status(404); throw new Error('Student not found'); }

  if (student.photo) {
    const publicId = student.photo.split('/').slice(-2).join('/').split('.')[0];
    await cloudinary.uploader.destroy(publicId);
  }
  await student.deleteOne();
  res.json({ message: 'Student deleted' });
});