const request = require('supertest');
const app = require('../index');
const TodoTask = require('../models/TodoTask');

describe('Recurring Task Interval Display', () => {
    it('should display the task only if the current date is past or on the specific interval', async () => {
        const startDate = new Date().toISOString();
        // Creating task that will repeat every 3 days
        const recurringTask = new TodoTask({title: 'Recurring Task with Interval', isRecurring: true, recurrence: {frequency: 'daily', interval: 3, startBy: startDate, endBy: null, isPaused: false}});
        await recurringTask.save();

        // Rendering page with tasks on it
        let response = await request(app).get('/');

        // Checking if task made earlier is showing up on page
        expect(response.text).toContain('Recurring Task with Interval');

        // Marking task as completed for this specific interval
        await request(app).patch(`/complete/${recurringTask._id}`);

        jest.useFakeTimers({ doNotFake: ['nextTick', 'setImmediate'] }).setSystemTime(new Date())
        // Advancing time by a day
        jest.advanceTimersByTime(86400000);

        // Calling new response to check if task showing up
        response = await request(app).get('/');

        // Checking if task made earlier is not showing up
        expect(response.text).not.toContain('Recurring Task with Interval');

        // Advancing time by two days
        jest.advanceTimersByTime(86400000 * 2);

        // Calling new response to check if task showing up
        response = await request(app).get('/');

        // Checking if task made earlier is showing up since it has been 3 days
        expect(response.text).toContain('Recurring Task with Interval');
    });
});