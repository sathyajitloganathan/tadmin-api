import { Prisma } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

import ApiError from '../utils/apiError.util';
import { prisma } from '../common/prisma.client';
import response from '../helpers/response.helper';

export const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const teacherEmail = req.body.teacher.toLowerCase();

        const existingTeacher = await prisma.teacher.findFirst({
            where: {
                email: teacherEmail,
            },
        });
        if (existingTeacher) throw new ApiError(httpStatus.NOT_FOUND, 'Email already exists');

        const teacher = await prisma.teacher.create({
            data: {
                email: teacherEmail,
                createdAt: new Date(),
            },
        });

        return response(res, httpStatus.OK, 'Created teacher account', teacher);
    } catch (err) {
        next(err);
    }
};

export const registerStudents = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const teacherEmail = req.body.teacher.toLowerCase();
        const studentEmails: string[] = Array.from(new Set(req.body.students.map((s: string) => s.toLowerCase())));

        const studentEmailsWithAccounts = (
            await prisma.student.findMany({
                where: {
                    OR: [...studentEmails.map((s) => ({ email: s }))],
                },
                select: {
                    email: true,
                },
            })
        ).map((s) => s.email);

        const noAccountStudentEmails = studentEmails.filter((s) => !studentEmailsWithAccounts.includes(s));

        let existingTeacher = await prisma.teacher.findFirst({
            where: {
                email: teacherEmail,
            },
        });

        if (!existingTeacher) {
            existingTeacher = await prisma.teacher.create({
                data: {
                    email: teacherEmail,
                    createdAt: new Date(),
                },
            });
        }

        if (noAccountStudentEmails.length != 0) {
            const studentAccounts = await prisma.student.createMany({
                data: noAccountStudentEmails.map((s) => {
                    return {
                        email: s,
                        createdAt: new Date(),
                    };
                }),
            });
        }

        const studentEnrollments = await prisma.enrollment.findMany({
            where: {
                teacher: {
                    email: teacherEmail,
                },
                student: {
                    OR: [...studentEmails.map((s) => ({ email: s }))],
                },
            },
            select: {
                teacher: {
                    select: {
                        email: true,
                    },
                },
                student: {
                    select: {
                        email: true,
                    },
                },
            },
        });

        const enrolledStudentEmails = studentEnrollments.map((s) => s.student.email);

        const studentEmailsToBeEnrolled = studentEmails.filter((s) => !enrolledStudentEmails.includes(s));

        const studentIdsToBeEnrolled = await prisma.student.findMany({
            where: {
                OR: [...studentEmailsToBeEnrolled.map((s) => ({ email: s }))],
            },
            select: {
                id: true,
            },
        });

        const newlyEnrolledStudents = await prisma.enrollment.createMany({
            data: [
                ...studentIdsToBeEnrolled.map((s) => {
                    return {
                        teacherId: existingTeacher.id,
                        studentId: s.id,
                    };
                }),
            ],
        });

        return response(res, httpStatus.NO_CONTENT, 'Registered and enrolled students', null);
    } catch (err) {
        next(err);
    }
};

export const getCommonStudents = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const teacherEmails = Array.isArray(req.query.teacher)
            ? Array.from(new Set(req.query.teacher.map((s) => s.toLowerCase())))
            : [String(req.query.teacher || "")];

        const getNestedQuery = (nestedQuery: string, email: string) => {
            return `
                SELECT e.studentId 
                FROM Enrollment e, Teacher t
                WHERE t.id = e.teacherId 
                AND t.email='${email}'
                AND e.studentId in (${nestedQuery})
            `;
        };

        let nestedIntersectionQuery = `
            SELECT e.studentId 
            FROM Enrollment e, Teacher t
            WHERE t.id = e.teacherId 
            AND t.email='${teacherEmails[0]}'
        `;

        for (let i = 1; i < teacherEmails.length; i++) {
            nestedIntersectionQuery = getNestedQuery(nestedIntersectionQuery, teacherEmails[i]);
        }

        const commonStudentIds = (await prisma.$queryRawUnsafe(`${nestedIntersectionQuery};`) as Array<any>).map(s => s.studentId);
        const commonStudentEmails = await prisma.student.findMany({
            where: {
                id: {
                    in: commonStudentIds
                }
            },
            select: {
                email: true
            }
        })

        return response(res, httpStatus.OK, 'Fetched common students', {
            students: commonStudentEmails.map(s => s.email),
        });
    } catch (err) {
        next(err);
    }
};

export const suspendStudent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const studentEmail = req.body.student.toLowerCase();

        const existingStudent = await prisma.student.findFirst({
            where: {
                email: studentEmail
            }
        });
        if(!existingStudent) throw new ApiError(httpStatus.NOT_FOUND, 'Student not found');
        if(existingStudent.isSuspended == true) throw new ApiError(httpStatus.CONFLICT, 'Student is already suspended');

        const suspendedStudent = await prisma.student.update({
            where: {
                id: existingStudent.id
            },
            data: {
                isSuspended: true
            }
        })

        return response(res, httpStatus.NO_CONTENT, 'Suspended student', null);
    } catch (err) {
        next(err);
    }
};

export const retrieveNotificationRecipients = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const teacherEmail = String(req.body.teacher).toLowerCase();
        const notificationMessage = String(req.body.notification);

        const mentionedEmails = Array.from(new Set(notificationMessage.split(" ").filter(token => token[0] == '@').map(mention => mention.slice(1))));

        const mentionedStudents = await prisma.student.findMany({
            where: {
                OR: [...mentionedEmails.map((s) => ({ email: s }))],
            }
        });
        if(mentionedStudents.length != mentionedEmails.length) throw new ApiError(httpStatus.NOT_FOUND, 'Mentioned email not found');

        const existingTeacher = await prisma.teacher.findFirst({
            where: {
                email: teacherEmail,
            },
        });
        if (!existingTeacher) throw new ApiError(httpStatus.NOT_FOUND, 'Teacher not found');

        const mentionedUnsuspendedStudentEmails = mentionedStudents.filter(s => s.isSuspended == false).map(s => s.email);

        const enrolledUnsuspendedStudents = await prisma.enrollment.findMany({
            where: {
                teacher: {
                    email: teacherEmail
                },
                student: {
                    isSuspended: false
                }
            },
            select: {
                student: {
                    select: {
                        email: true
                    }
                }
            }
        });

        const enrolledUnsuspendedStudentEmails = enrolledUnsuspendedStudents.map(s => s.student.email);

        const recipients = Array.from(new Set([...enrolledUnsuspendedStudentEmails, ...mentionedUnsuspendedStudentEmails]));

        return response(res, httpStatus.OK, 'Fetched notification recipient list', {
            recipients: recipients
        });
    } catch (err) {
        next(err);
    }
};
