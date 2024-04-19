const request = require('supertest');
const {app, server, main} = require('../index');
const TodoTask = require('../models/TodoTask');
const UserData = require('../models/UserData')
const randomDate = require('../randomDate');
const testUsername = 'test@test.com';
const testPassword = 'password123!!';

describe('Test Suite for Recurring Tasks and Search by Date', () => {
    let agent;

    beforeEach(async () => {
        agent = request.agent(app);
        // Creating test account and logging in
        await agent.post('/create-account').send({ username: testUsername, password: testPassword });
        await agent.post('/login').send({ username: testUsername, password: testPassword });
    });

    afterEach(async () => {
        // Deleting test account
        await UserData.findOneAndDelete({ username: testUsername });
    });

    describe('Recurring Task Interval Display', () => {
        it('should display the task only if the current date is past or on the specific interval', async () => {
            const testDate = new Date();
            const startDate = new Date().toISOString();
            const millisecondsPerDay = 86400000;
            // Creating task that will repeat every 3 days
            const recurringTask = new TodoTask({title: 'Recurring Task with Interval', date: testDate, isRecurring: true, recurrence: {frequency: 'daily', interval: 3, startBy: startDate, endBy: null, isPaused: false}});
            await recurringTask.save();
    
            // Rendering page with tasks on it
            let response = await agent.get('/');
    
            // Checking if task made earlier is showing up on page
            expect(response.text).toContain('Recurring Task with Interval');
    
            // Marking task as completed for this specific interval
            await agent.patch(`/complete/${recurringTask._id}`);
    
            jest.useFakeTimers({ doNotFake: ['nextTick', 'setImmediate'] }).setSystemTime(new Date());
            // Advancing time by a day
            jest.advanceTimersByTime(millisecondsPerDay);
    
            // Calling new response to check if task showing up
            response = await agent.get('/');
    
            // Checking if task made earlier is not showing up
            expect(response.text).not.toContain('Recurring Task with Interval');
    
            // Advancing time by two days
            jest.advanceTimersByTime(millisecondsPerDay * 2);
    
            // Calling new response to check if task showing up
            response = await agent.get('/');
    
            // Checking if task made earlier is showing up since it has been 3 days
            expect(response.text).toContain('Recurring Task with Interval');
            
            // Deleting test documents from database
            await TodoTask.findByIdAndDelete(recurringTask._id);
        });
    });
    
    describe('Recurring Task Start By and End By Date', () => {
        it('should only show the task if it is on or past the start by date and should not show if past end by date', async () => {
            jest.useFakeTimers({ doNotFake: ['nextTick', 'setImmediate'] }).setSystemTime(new Date());
            const currentDate = new Date();
            const millisecondsPerDay = 86400000;
            const millisecondsPerWeek = millisecondsPerDay * 7;
            const startDate = new Date(currentDate.getTime() + millisecondsPerWeek);
            const endDate = new Date(startDate.getTime() + millisecondsPerWeek);
            // Creating task with a startby date and endby date
            const recurringTask = new TodoTask({title: 'Recurring Task with Startby and Endby dates', date: currentDate, isRecurring: true, recurrence: {frequency: 'daily', interval: 3, startBy: startDate, endBy: endDate, isPaused: false}});
            await recurringTask.save();
    
            // Rendering page with tasks on it
            let response = await agent.get('/');
    
            // Checking if task made earlier is not showing up on page since it is not start date yet
            expect(response.text).not.toContain('Recurring Task with Startby and Endby dates');
    
            // Advancing time by week
            jest.advanceTimersByTime(millisecondsPerWeek);
    
            // Calling new response to check if task showing up
            response = await agent.get('/');
    
            // Checking is task made earlier is showing up on page since it is past start date
            expect(response.text).toContain('Recurring Task with Startby and Endby dates');
    
            // Advancing time by week
            jest.advanceTimersByTime(millisecondsPerWeek);
    
            // Calling new response to check if task showing up
            response = await agent.get('/');
    
            // Checking if task made earlier is not showing up on page since it is past end date
            expect(response.text).not.toContain('Recurring Task with Startby and Endby dates');
    
            // Deleting test documents from database
            await TodoTask.findByIdAndDelete(recurringTask._id);
        });
    });
    
    describe('Search by Specific Date', () => {
        it('should show task(s) made on a specific date inputted by user', async () => {
            // Creating task with a specific date to be searched
            const testDate = randomDate();
            const testTask = new TodoTask({title: 'Test Task with Random Date', date: testDate});
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
            const testTask = new TodoTask({title: 'Test Task with Random Date', date: testDate});
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