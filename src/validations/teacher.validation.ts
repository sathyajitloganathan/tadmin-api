import Joi from 'joi';

export default {
    registerStudents: {
        body: {
            teacher: Joi.string().email().required(),
            students: Joi.array().items(Joi.string().email()),
        },
    },
    getCommonStudents: {
        query: {
            teacher: Joi.alternatives().try(Joi.array().items(Joi.string().email().required()), Joi.string().email().required())
        }
    },
    suspendStudent: {
        body: {
            student: Joi.string().email().required()
        }
    },
    retrieveNotificationRecipients: {
        body: {
            teacher: Joi.string().email().required(),
            notification: Joi.string().required(),
        }
    },
};
