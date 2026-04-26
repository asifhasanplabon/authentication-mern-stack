import express from 'express';
import { adminOnly, protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import { deleteStudent, getStudent, getStudents, updateStudent } from '../controllers/studentController.js';

const router=express.Router();

router.get('/',protect,getStudents);
router.get('/:id',protect,getStudent);
router.put('/:id',protect,upload.single('photo'),updateStudent);
router.delete('/:id',protect,adminOnly,deleteStudent);

export default router;
