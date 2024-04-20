const request = require('supertest');
const { app, server} = require('../index');
const TodoTask = require('../models/TodoTask');
const mongoose = require("mongoose");

describe('Tag Search Feature', () => {
    // Close MongoDB connection after all tests
    afterAll(async () => {
      await server.close();
      await mongoose.disconnect();
      console.log("database disconnected");
    }, 10000);

  it('should return tasks associated with the specified tag', async () => {
    // Create some test tasks with different tags
    const task1 = new TodoTask({ title: 'Task 1', tag: 'Work', user: "ABC"});
    const task2 = new TodoTask({ title: 'Task 2', tag: 'Personal', user: "ABC"});
    const task3 = new TodoTask({ title: 'Task 3', tag: 'Work', user: "ABC"});
    await Promise.all([task1.save(), task2.save(), task3.save()]);

    // Perform a search for tasks with the 'Work' tag
    const response = await request(app) // Makes a request to the Express app
  .post('/tag') // Specifies the endpoint to send the POST request to
  .send({ tag: 'Work', isTest: true}) // Sends a JSON payload with the specified data
  .set('Content-Type', 'application/json') // Sets the Content-Type header to JSON
  .set('Accept', 'application/json'); // Sets the Accept header to JSON
  console.log(response.text);
    // Assert that the response contains the expected tasks
    expect(response.status).toBe(200);
    expect(response.text).toContain("Work");
    expect(response.text).toContain("Task 1");
    expect(response.text).toContain("Task 3");
    expect(response.text).not.toContain("Task 2");

  });
});
