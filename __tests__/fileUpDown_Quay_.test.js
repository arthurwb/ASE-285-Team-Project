const request = require('supertest');
const { app, server} = require('../index');
const TodoTask = require('../models/TodoTask');
const mongoose = require("mongoose");
const fs = require('fs');

const fileOut = fs.readFileSync(__dirname + '/file_for_fileUpDown_test.txt', 'utf-8');

describe("Testing of uploading and downloading a file", () => {   

  afterAll(async () => {
    await TodoTask.findOneAndDelete({ title: 'Task 1' });

    await server.close();
    await mongoose.disconnect();
    console.log("database disconnected");
  }, 10000);


    it("uplaod and download file", async () => {

    const task1 = new TodoTask({ title: 'Task 1', tag: 'Work', user: "ABC" });
    await task1.save();
    const target = await TodoTask.findOne({ title: 'Task 1', tag: 'Work', user: "ABC" });
    const id = target._id;

    // Upload the file
    const upload = await request(app)
      .post(`/upload/${id}`)
      .set('Content-Type', 'multipart/form-data')
      .attach('file', __dirname + '/file_for_fileUpDown_test.txt'); // Make sure the file path is correct

    // Download the file
    const res = await request(app).get(`/download/${id}`);
    expect(res.text).toBe(fileOut);
    });
  });
