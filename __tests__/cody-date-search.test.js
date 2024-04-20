const request = require('supertest');
const mongoose = require('mongoose');
const { app, server } = require('../index');
const TodoTask = require('../models/TodoTask');
const UserData = require('../models/UserData');
const randomDate = require('../randomDate');
const testUsername = 'test@test.com';
const testPassword = 'password123!!';

describe('Test Suite for Date Search', () => {
    let agent;

    beforeEach(async () => {
        agent = request.agent(app);
        await agent.post('/create-account').send({ username: testUsername, password: testPassword });
        await agent.post('/login').send({ username: testUsername, password: testPassword });
    });

    afterEach(async () => {
        await UserData.findOneAndDelete({ username: testUsername });
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await server.close();
    });

    describe('Search by Specific Date', () => {
        it('should show task(s) made on a specific date inputted by user', async () => {
            // Creating task with a specific date to be searched
            const testDate = randomDate();
            const testTask = new TodoTask({title: 'Test Task with Random Date', date: testDate, user: testUsername});
            await testTask.save();
    
            // Creating date that does not match test date since it is before 2024 (test date created is after 2024)
            const wrongTestDate = new Date(2023, 3, 15);
    
            // Sending POST request to date route to search for task with specific date
            let response = await agent.post('/date').send({ date: testDate.toISOString(), endDate: '' });
    
            // Checking if response contains the task created earlier
            expect(response.text).toContain('Test Task with Random Date');
    
            // Sending POST request to date route to search for task with wrong date
            response = await agent.post('/date').send({ date: wrongTestDate.toISOString(), endDate: '' });
    
            // Checking if response does not contain task with invalid date
            expect(response.text).not.toContain('Test Task with Random Date');
    
            // Deleting test documents from database
            await TodoTask.findByIdAndDelete(testTask._id);
        });
    });
    
    describe('Search Within Range of Dates', () => {
        it('should show task(s) made within a specific range of dates', async () => {
            // Creating task with a specific date to be searched and creating dates around that date
            const testDate = randomDate();
            let testDateNextDay = new Date(testDate);
            testDateNextDay.setDate(testDateNextDay.getDate() + 1);
            let testDatePreviousDay = new Date(testDate);
            testDatePreviousDay.setDate(testDatePreviousDay.getDate() - 1);
            const testTask = new TodoTask({title: 'Test Task with Random Date', date: testDate, user: testUsername});
            await testTask.save();
    
            // Creating dates that will not match task to test
            const wrongTestDate1 = new Date(testDate.setDate(testDate.getDate() + 5));
            const wrongTestDate2 = new Date(testDate.setDate(testDate.getDate() + 15));
    
            // Sending POST request to date route to search for task in specific range
            let response = await agent.post('/date').send({ date: testDatePreviousDay.toISOString(), endDate: testDateNextDay.toISOString() });
    
            // Checking if response contains task created earlier
            expect(response.text).toContain('Test Task with Random Date');
    
            // Sending POST request to date route to search for task in wrong range
            response = await agent.post('/date').send({ date: wrongTestDate1.toISOString(), endDate: wrongTestDate2.toISOString() });
    
            // Checking if response does not contain task with invalid date
            expect(response.text).not.toContain('Test Task with Random Date');
    
            // Deleting test documents from database
            await TodoTask.findByIdAndDelete(testTask._id);
        });
    });
});
