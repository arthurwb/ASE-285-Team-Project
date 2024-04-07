const mongoose = require('mongoose');
const request = require('supertest');
const { app, server, main } = require('../index.js');

describe('POST /', () => {
    it('creates a new task', async () => {
        const res = await request(app)
            .post('/')
            .send({
                title: 'test task'
            });
        console.log(res.statusCode);
        expect(res.statusCode).toBe(302);
    });

    afterAll(async () => {
        await server.close();
        await mongoose.connection.close();
    });
});

var postId = '';
describe('GET /', () => {
    it('gets all tasks', async () => {
        await main();
        const res = await request(app)
            .get('/');
        expect(res.statusCode).toBe(200);
        expect(res.body[0].title).toBe("test task");
        postId = res.body[0]._id;
    });

    afterAll(async () => {      
        await server.close();
        await mongoose.connection.close();
    }); 
});

describe('POST /subtask', () => {
    it('creates a new subtask', async () => {
        await main();
        const res = await request(app)
            .post(`/subtask/${postId}`)
            .send({
                subtaskTitle: 'test subtask'
            });
        expect(res.statusCode).toBe(302);
    });

    afterAll(async () => {    
        await server.close();
        await mongoose.connection.close();
    });
});

describe('GET /subtask', () => {
    it('gets all subtasks', async () => {
        await main();
        const res = await request(app)
            .get(`/subtask/${postId}`);
        expect(res.statusCode).toBe(200);
    });

    afterAll(async () => {
        await server.close();
        await mongoose.connection.close();
    });
});

describe('POST /subtaskEdit', () => {
    it('edits a subtask', async () => {
        await main();
        
        // get the subtask
        const task = await request(app)
            .get('/')
        const subtask = task.body[0].subtasks[0];
        
        //do the operation
        const res = await request(app)
            .post(`/subtaskEdit/${subtask._id}`)
            .send({
                subtaskTitle: 'edited subtask'
            });
        
        //check the correct status code was given
        expect(res.statusCode).toBe(302);
    });

    afterAll(async () => {    
        await server.close();
        await mongoose.connection.close();
    });
});

describe('GET /subtaskComplete', () => {
    it('completes a subtask', async () => {
        await main();
        
        // get the subtask
        const task = await request(app)
            .get('/')
        const subtask = task.body[0].subtasks[0];
        
        //do the operation
        const res = await request(app)
            .get(`/subtaskComplete/${subtask._id}`);
        
        //check the correct status code was given
        expect(res.statusCode).toBe(302);
    });
});

describe('GET /subtaskRemove', () => {
    it('removes a subtask', async () => {
        await main();
        
        // get the subtask
        const task = await request(app)
            .get('/')
        const subtask = task.body[0].subtasks[0];
        
        //do the operation
        const res = await request(app)
            .get(`/subtaskRemove/${subtask._id}`);
        
        //check the correct status code was given
        expect(res.statusCode).toBe(302);
    });

    afterAll(async () => {    
        await server.close();
        await mongoose.connection.close();
    });
});