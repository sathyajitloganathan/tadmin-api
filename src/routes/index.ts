import express from 'express';
import apiRouter from './api.route';
import teacherRouter from './teacher.route';
import healthRouter from './health.route';

const router = express.Router();

const defaultRoutes = [
    {
        path: '/health',
        route: healthRouter,
    },
    {
        path: '/api',
        route: apiRouter,
    },
    {
        path: '/teacher',
        route: teacherRouter,
    },
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;
