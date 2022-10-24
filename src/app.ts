import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import httpStatus from 'http-status';
import config from './config/config';
import morgan from './config/morgan';
import routes from './routes';

import ApiError from './utils/apiError.util';
import { errorConverter, errorHandler } from './middlewares/error.middleware';

const app = express();

if (config.env !== "test") {
    app.use(morgan.successHandler);
    app.use(morgan.errorHandler);
}

// set security HTTP headers
// app.use(helmet({ contentSecurityPolicy: (config.env === 'production') ? undefined : false }));¿
app.use(
    helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false })
); // Adding this solved graphql not loading issue

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
// app.use(xss());
// app.use(mongoSanitize());

// gzip compression
// app.use(compression());

// enable cors
app.use(cors());
// app.options('*', cors());

// Setup routes
// v1 api routes
app.use('/v1', routes);
app.get('/health', (req, res) => res.send('Welcome'))

// jwt authentication
// app.use(passport.initialize());
// passport.use('jwt', jwtStrategy);

// limit repeated failed requests to auth endpoints
// if (config.env === 'production') {
//     app.use('/v1/auth', authLimiter);
// }

// send back a 404 error for any unknown api request
app.use((req: Request, res: Response, next: NextFunction) => {
    next(new ApiError(httpStatus.NOT_FOUND, "Couldnt Find"));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

export default app;