const request = require("supertest");
const mongoose = require("mongoose");
const { app, server, main } = require('../index');

describe('Session Variables', () => {
    // Connect to MongoDB memory server before running any tests
    beforeAll(async () => {
      // URI used only for testing purposes
      await mongoose.connect(
        "mongodb+srv://admin:admin@qb3cluster.sknm95g.mongodb.net/mongoTodoapp?retryWrites=true&w=majority",
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }
      );
    });
  
    // Close MongoDB connection after all tests
    afterAll(async () => {
      await mongoose.connection.dropDatabase();
      await mongoose.disconnect();
      console.log("database disconnected");
    });
  
    it('should be able to log in and create / view posts', async () => {
      let cookies;
      await request(app)
        .post("/create-account")
        .send(`username=test&password=test`)
        .expect(200);
      await request(app)
        .post('/login')
        .send({ username: 'test', password: 'test' })
        .expect(200)
        .then(res => {
          cookies = res.headers['set-cookie'];
        });
      await request(app)
        .post('/')
        .set('Cookie', cookies)
        .send({ title: 'Test Post', isRecurring: false })
        .expect(302);
  
      const response = await request(app)
        .get('/')
        .set('Cookie', cookies)
        .expect(200);
  
      expect(response.text).toContain('Test Post');
    });
  
    it('should not display posts from other users', async () => {
      let cookies;
      await request(app)
        .post("/create-account")
        .send(`username=test2&password=test2`)
        .expect(200);
      await request(app)
        .post('/login')
        .send({ username: 'test2', password: 'test2' })
        .expect(200)
        .then(res => {
          cookies = res.headers['set-cookie'];
        });
      await request(app)
        .post('/')
        .set('Cookie', cookies)
        .send({ title: 'Another Post', isRecurring: false })
        .expect(302);
  
      const response = await request(app)
        .get('/')
        .set('Cookie', cookies)
        .expect(200);
  
      expect(response.text).toContain('Another Post');
      expect(response.text).not.toContain('Test Post');
    });
  });