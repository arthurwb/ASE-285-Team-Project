const request = require('supertest');
const app = require('../index'); // Assuming your Express app is in app.js
const TodoTask = require('../models/TodoTask');

describe('Tag Search Feature', () => {
  it('should return tasks associated with the specified tag', async () => {
    // Create some test tasks with different tags
    const task1 = new TodoTask({ title: 'Task 1', tag: 'Work' });
    const task2 = new TodoTask({ title: 'Task 2', tag: 'Personal' });
    const task3 = new TodoTask({ title: 'Task 3', tag: 'Work' });
    await Promise.all([task1.save(), task2.save(), task3.save()]);

    // Perform a search for tasks with the 'Work' tag
    const response = await request(app).post('/tag').send({ tag: 'Work' }).set('Content-Type', 'application/json').set('Accept', 'application/json');
    console.log(response)
    // Assert that the response contains the expected tasks
    expect(response.status).toBe(200);
    expect(response.text).toContain("Work");
    expect(response.text).toContain("Task 1");
    expect(response.text).toContain("Task 3");
    expect(response.text).not.toContain("Task 2");

  });
});
