const mongoose = require('mongoose');
const request = require('supertest');
const { app, server, main } = require('../index.js');

const Users = require("../models/UserData");

const dotenv = require('dotenv');
dotenv.config();

describe('Password hashing', () => {
    it('hashes a password', async () => {
        let user = new Users();
        user.username = "test";
        user.setPassword("test");
        expect(user.hash).toBeDefined();
        expect(user.salt).toBeDefined();
        expect(user.hash).not.toEqual("test");
    });
});

describe('Password validation', () => {
    it('validates a password', async () => {
        let user = new Users();
        user.username = "test";
        user.setPassword("test");
        expect(user.validatePassword("test")).toBe(true);
        expect(user.validatePassword("wrong")).toBe(false);
    });
});

describe('Storing user data', () => {
    it('stores user data securely', async () => {
        await main();
        const res = await request(app)
            .post('/create-account')
            .send({
                username: 'test',
                password: 'test'
            })
            .expect(200);
        expect(res.body.success).toBe(true);
        
        const user = await Users.findOne({ username: 'test' });
        expect(user).toBeDefined();
        expect(user.username).toBe('test');
        expect(user.hash).toBeDefined();
        expect(user.salt).toBeDefined();
        expect(user.hash).not.toEqual('test');
    });

    afterAll(async () => {    
        await server.close();
        await mongoose.connection.close();
    }, 10000);
});