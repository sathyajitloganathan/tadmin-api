import request from 'supertest';
import sinon from 'sinon';

import app from '../src/app';

const mockRequest = () => {
    return {
        users: [],
    };
};

const mockResponse = () => {
    const res: any = {};
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns(res);
    return res;
};

describe('Sample Test', () => {
    it('should test that true === true', () => {
        expect(true).toBe(true);
    });
});

describe('Test Health Endpoint', () => {
    it('expect health to return 200', async () => {
        const response = await request(app).get('/v1/health');
        expect(response.status).toEqual(200);
    });
});