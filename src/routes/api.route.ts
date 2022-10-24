import express from 'express';
import teacherValidation from '../validations/teacher.validation';
import * as teacherController from '../controllers/teacher.controller';
import validate from '../middlewares/validate.middleware';

const router = express.Router();

router
    .route('/register')
    .post(validate(teacherValidation.registerStudents), teacherController.registerStudents)

router
    .route('/commonstudents')
    .get(validate(teacherValidation.getCommonStudents), teacherController.getCommonStudents);

router
    .route('/suspend')
    .post(validate(teacherValidation.suspendStudent), teacherController.suspendStudent);

router
    .route('/retrievefornotifications')
    .post(validate(teacherValidation.retrieveNotificationRecipients), teacherController.retrieveNotificationRecipients);

export default router;
