import request from 'supertest';
import app from '../src/app';

describe('Register students under teacher', () => {
    it('Enroll students to teacher', async () => {
        const res = await request(app)
            .post('/v1/api/register')
            .set('Accept', 'application/json')
            .send({
                teacher: 'asd@gmail.com',
                students: ['a@gmail.com', 'b@gmail.com', 'c@gmail.com', 'd@gmail.com'],
            });
        expect(res.statusCode).toEqual(204);
        // expect(res.body).toHaveProperty('post');
    });
});

describe('Test fetch common students', () => {
    it('Should register three students under 1 teacher', async () => {
        const res = await request(app)
            .post('/v1/api/register')
            .set('Accept', 'application/json')
            .send({
                teacher: 'teacher1@gmail.com',
                students: ['a@gmail.com', 'b@gmail.com', 'c@gmail.com'],
            });
        expect(res.statusCode).toEqual(204);
        // expect(response.headers["Content-Type"]).toMatch(/json/);
        // expect(res.body).toEqual('foo@bar.com');
        // expect(res.body).toHaveProperty('post');
    });

    it('Should register two students under another teacher', async () => {
        const res = await request(app)
            .post('/v1/api/register')
            .set('Accept', 'application/json')
            .send({
                teacher: 'teacher2@gmail.com',
                students: ['b@gmail.com', 'c@gmail.com'],
            });
        expect(res.statusCode).toEqual(204);
        // expect(response.headers["Content-Type"]).toMatch(/json/);
        // expect(res.body).toEqual('foo@bar.com');
        // expect(res.body).toHaveProperty('post');
    });

    it('Should fetch common students for teacher 1 and 2', async () => {
        const res = await request(app)
            .get('/v1/api/commonstudents?teacher=teacher1%40gmail.com&teacher=teacher2%40gmail.com')
            .set('Accept', 'application/json')
        expect(res.statusCode).toEqual(200);
        expect(res.body.body.students.sort()).toEqual(['b@gmail.com', 'c@gmail.com'].sort());
        // expect(response.headers["Content-Type"]).toMatch(/json/);
        // expect(res.body).toEqual('foo@bar.com');
        // expect(res.body).toHaveProperty('post');
    });
});

describe('Test fetch notification recipients (without suspended students)', () => {

    it('Should return all recipients under provided teacher excluding suspended', async () => {
        const res = await request(app)
            .post('/v1/api/retrievefornotifications')
            .set('Accept', 'application/json')
            .send({
                teacher: "teacher1@gmail.com",
                notification: "Hello students!"
            })
        expect(res.statusCode).toEqual(200);
        expect(res.body.body.recipients.sort()).toEqual(['a@gmail.com', 'b@gmail.com', 'c@gmail.com'].sort());
    });
});

describe('Suspend student', () => {
    it('Should suspend student', async () => {
        const res = await request(app)
            .post('/v1/api/suspend')
            .set('Accept', 'application/json')
            .send({
                student: 'a@gmail.com',
            });
        expect(res.statusCode).toEqual(204);
    });
});

describe('Test fetch notification recipients (with suspended students)', () => {
    it('Should return all recipients under provided teacher exluding suspended', async () => {
        const res = await request(app)
            .post('/v1/api/retrievefornotifications')
            .set('Accept', 'application/json')
            .send({
                teacher: "teacher1@gmail.com",
                notification: "Hello students!"
            })
        expect(res.statusCode).toEqual(200);
        expect(res.body.body.recipients.sort()).toEqual(['b@gmail.com', 'c@gmail.com'].sort());
        // expect(response.headers["Content-Type"]).toMatch(/json/);
        // expect(res.body).toEqual('foo@bar.com');
        // expect(res.body).toHaveProperty('post');
    });
});

describe('Test fetch notification recipients (should include mentions)', () => {
    it('Should return all recipients under provided teacher including mentions', async () => {
        const res = await request(app)
            .post('/v1/api/retrievefornotifications')
            .set('Accept', 'application/json')
            .send({
                teacher: "teacher1@gmail.com",
                notification: "Hello students! @d@gmail.com"
            })
        expect(res.statusCode).toEqual(200);
        expect(res.body.body.recipients.sort()).toEqual(['b@gmail.com', 'c@gmail.com', 'd@gmail.com'].sort());
    });
});

describe('Test fetch notification recipients (should not send duplicates when enrolled student mentioned)', () => {
    it('Should return all deduplicated recipients', async () => {
        const res = await request(app)
            .post('/v1/api/retrievefornotifications')
            .set('Accept', 'application/json')
            .send({
                teacher: "teacher1@gmail.com",
                notification: "Hello students! @c@gmail.com"
            })
        expect(res.statusCode).toEqual(200);
        expect(res.body.body.recipients.sort()).toEqual(['b@gmail.com', 'c@gmail.com'].sort());
    });
});

describe('Test fetch notification recipients (should exclude mentions if suspended)', () => {
    it('Should return correct recipients', async () => {
        const res = await request(app)
            .post('/v1/api/retrievefornotifications')
            .set('Accept', 'application/json')
            .send({
                teacher: "teacher1@gmail.com",
                notification: "Hello students! @a@gmail.com"
            })
        expect(res.statusCode).toEqual(200);
        expect(res.body.body.recipients.sort()).toEqual(['b@gmail.com', 'c@gmail.com'].sort());
    });
});
