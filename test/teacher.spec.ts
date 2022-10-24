import request from 'supertest';
import app from '../src/app';

describe('POST /v1/api/register', () => {
    it('Should enroll students to teacher', async () => {
        const res = await request(app)
            .post('/v1/api/register')
            .set('Accept', 'application/json')
            .send({
                teacher: 'asd2@gmail.com',
                students: ['l@gmail.com', 'h@gmail.com'],
            });
        expect(res.statusCode).toEqual(204);
        // expect(res.body).toHaveProperty('post');
    });
});

describe('POST /v1/api/commonstudents', () => {
    it('Get common students for provided teachers', async () => {
        const res = await request(app)
            .get('/v1/api/commonstudents?teacher=asd2%40gmail.com&teacher=asd2%40gmail.com');
        expect(res.statusCode).toEqual(200);
        // expect(res.body).toHaveProperty('post');
    });
});

// describe('Register students to teachers', () => {
//     it('Should enroll students to teacher', async () => {
//         const res = await request(app)
//             .post('/v1/api/register')
//             .send({
//                 teacher: 'asd@gmail.com',
//                 students: ['a@gmail.com', 'b@gmail.com', 'c@gmail.com'],
//             });
//         expect(res.statusCode).toEqual(204);
//         // expect(res.body).toHaveProperty('post');
//     });
// });
