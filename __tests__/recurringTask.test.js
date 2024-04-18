const request = require('supertest');
const {app, server, main} = require('../index');
const TodoTask = require('../models/TodoTask');

describe('Recurring Task Interval Display', () => {
    it('should display the task only if the current date is past or on the specific interval', async () => {
        const startDate = new Date().toISOString();
        const millisecondsPerDay = 86400000;
        // Creating task that will repeat every 3 days
        const recurringTask = new TodoTask({title: 'Recurring Task with Interval', isRecurring: true, recurrence: {frequency: 'daily', interval: 3, startBy: startDate, endBy: null, isPaused: false}});
            // await recurringTask.save();

        let cookies;
        await request(app)
            .post('/create-account')
            .send(`username=test2&password=test2`)

        await request(app)
            .post('/login')
            .send({ username: 'test2', password: 'test2' })
            .then(res => {
                cookies = res.headers['set-cookie'];
            });

        // Rendering page with tasks on it
        await request(app)
            .post('/')
            .set('Cookie', cookies)
            .send(
                {
                title: 'Recurring Task with Interval',
                isRecurring: true,
                frequency: 'daily',
                interval: 3,
                startBy: startDate,
                endBy: null,
                isPaused: false
            });

        let response = await request(app).get('/').set('Cookie', cookies);

        // Checking if task made earlier is showing up on page
        expect(response.text).toContain('Recurring Task with Interval');

        // Marking task as completed for this specific interval
        await request(app).patch(`/complete/${recurringTask._id}`);

        jest.useFakeTimers({ doNotFake: ['nextTick', 'setImmediate'] }).setSystemTime(new Date());
        // Advancing time by a day
        jest.advanceTimersByTime(millisecondsPerDay);

        // Calling new response to check if task showing up
        response = await request(app).get('/').set('Cookie', cookies);;

        // Checking if task made earlier is not showing up
        expect(response.text).toContain('Recurring Task with Interval');

        // Advancing time by two days
        jest.advanceTimersByTime(millisecondsPerDay * 2);

        // Calling new response to check if task showing up
        response = await request(app).get('/').set('Cookie', cookies);

        // Checking if task made earlier is showing up since it has been 3 days
        expect(response.text).toContain('Recurring Task with Interval');
    });
    afterAll(async () => {
        await server.close();
        console.log("database disconnected");
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
        const recurringTask = new TodoTask({title: 'Recurring Task with Startby and Endby dates', isRecurring: true, recurrence: {frequency: 'daily', interval: 3, startBy: startDate, endBy: endDate, isPaused: false}});

        let cookies;
        await request(app)
            .post('/login')
            .send({ username: 'test2', password: 'test2' })
            .then(res => {
                cookies = res.headers['set-cookie'];
            });

        await request(app)
            .post('/')
            .set('Cookie', cookies)
            .send(
                {
                title: 'Recurring Task with Startby and Endby dates',
                isRecurring: true,
                frequency: 'daily',
                interval: 3,
                startBy: startDate,
                endBy: endDate,
                isPaused: false
            });

        // Rendering page with tasks on it
        let response = await request(app).get('/').set('Cookie', cookies);

        // Checking if task made earlier is not showing up on page since it is not start date yet
        expect(response.text).not.toContain('Recurring Task with Startby and Endby dates');

        // Advancing time by week
        jest.advanceTimersByTime(millisecondsPerWeek);

        // Calling new response to check if task showing up
        response = await request(app).get('/').set('Cookie', cookies);

        // Checking is task made earlier is showing up on page since it is past start date
        expect(response.text).toContain('Recurring Task with Startby and Endby dates');

        // Advancing time by week
        jest.advanceTimersByTime(millisecondsPerWeek);

        // Calling new response to check if task showing up
        response = await request(app).get('/');

        // Checking if task made earlier is not showing up on page since it is past end date
        expect(response.text).not.toContain('Recurring Task with Startby and Endby dates');
    });
    afterAll(async () => {
        await server.close();
        console.log("database disconnected");
    });
});