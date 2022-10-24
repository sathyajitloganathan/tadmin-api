import express from 'express';
import teacherValidation from '../validations/teacher.validation';
import * as teacherController from '../controllers/teacher.controller';
import validate from '../middlewares/validate.middleware';

const router = express.Router();

router
    .route('/')
    .post(teacherController.create)

export default router;
