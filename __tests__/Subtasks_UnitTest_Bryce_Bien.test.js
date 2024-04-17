const mongoose = require('mongoose');
const request = require('supertest');
const { app, server, main } = require('../index.js');

const todoTask = require('../models/TodoTask.js');

const dotenv = require('dotenv');
dotenv.config();

(async () => {
    await mongoose.connect(process.env.URI);
})();

describe('POST /', () => {
    it('creates a new task', async () => {
        const res = await request(app)
            .post('/')
            .send({
                title: 'test task'
            });
        console.log(res.statusCode);
        expect(res.statusCode).toBe(500);
    });

    afterAll(async () => {
        await server.close();
        await mongoose.connection.close();
    });
});

describe('GET /', () => {
    it('gets all tasks', async () => {
        await main();
        const res = await request(app)
            .get('/');
        expect(res.statusCode).toBe(200);
    });

    afterAll(async () => {      
        await server.close();
        await mongoose.connection.close();
    }); 
});

describe('POST /subtask', () => {
    it('creates a new subtask', async () => {
        await main();
        let task = await todoTask.find({});
        const res = await request(app)
            .post(`/subtask/${task[0]._id}`)
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
        let task = await todoTask.find({});
        const res = await request(app)
            .get(`/subtask/${task[0]._id}`);
        expect(res.statusCode).toBe(200);
    });

    afterAll(async () => {
        await server.close();
        await mongoose.connection.close();
    });
});

const subtask = async () => {await todoTask.find({})};

describe('POST /subtaskEdit', () => {
    it('edits a subtask', async () => {
        await main();
        let task = await todoTask.find({});
        //do the operation
        const res = await request(app)
            .post(`/subtaskEdit/${task[0].subtasks[0]._id}`)
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
        let task = await todoTask.find({});
        //do the operation
        const res = await request(app)
            .get(`/subtaskComplete/${task[0].subtasks[0]._id}`);
        
        //check the correct status code was given
        expect(res.statusCode).toBe(302);
    });
});

describe('GET /subtaskRemove', () => {
    it('removes a subtask', async () => {
        await main();      
        let task = await todoTask.find({});
        //do the operation
        const res = await request(app)
            .get(`/subtaskRemove/${task[0].subtasks[0]._id}`);
        
        //check the correct status code was given
        expect(res.statusCode).toBe(302);
    });

    afterAll(async () => {    
        await server.close();
        await mongoose.connection.close();
    }, 10000);
});

