const request = require('supertest');
const { app, server} = require('../index');
const TodoTask = require('../models/TodoTask');
const UserData = require('../models/UserData');
const mongoose = require("mongoose");
const testUsername = 'test@test.com';
const testPassword = 'password123!!';

describe('Tag Search Feature', () => {
  beforeEach(async () => {
      agent = request.agent(app);
      await agent.post('/create-account').send({ username: testUsername, password: testPassword });
      await agent.post('/login').send({ username: testUsername, password: testPassword });
  });

  afterEach(async () => {
    await UserData.findOneAndDelete({ username: testUsername });
  });

    // Close MongoDB connection after all tests
    afterAll(async () => {
      await server.close();
      await mongoose.disconnect();
      console.log("database disconnected");
    }, 10000);

  it('should return tasks associated with the specified tag', async () => {
    // Create some test tasks with different tags
    var currentDate = new Date();

    const task1 = new TodoTask({ title: 'Task 1', tag: 'Work', user: testUsername, date: currentDate});
    const task2 = new TodoTask({ title: 'Task 2', tag: 'Personal', user: testUsername, date: currentDate});
    const task3 = new TodoTask({ title: 'Task 3', tag: 'Work', user: testUsername, date: currentDate});
    await Promise.all([task1.save(), task2.save(), task3.save()]);

    // Perform a search for tasks with the 'Work' tag
    const response = await agent // Makes a request to the Express app
  .post('/tag') // Specifies the endpoint to send the POST request to
  .send({ tag: 'Work'}) // Sends a JSON payload with the specified data
    // Assert that the response contains the expected tasks
    expect(response.status).toBe(200);
    expect(response.text).toContain("Work");
    expect(response.text).toContain("Task 3");
    expect(response.text).not.toContain("Task 2");

    // Deleting test documents from database
    await TodoTask.findByIdAndDelete(task1._id);
    await TodoTask.findByIdAndDelete(task2._id);
    await TodoTask.findByIdAndDelete(task3._id);
  });
});