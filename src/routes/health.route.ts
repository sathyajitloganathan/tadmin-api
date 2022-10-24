import express, { Response, Request } from 'express';
import httpStatus from 'http-status';

import response from '../helpers/response.helper';

const router = express.Router();

router.route('/').get((req: Request, res: Response) => {
    return response(res, httpStatus.OK, 'Server running', null);
});

export default router;
