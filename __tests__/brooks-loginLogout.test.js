const request = require("supertest");
const mongoose = require("mongoose");
const { app, server, main } = require('../index');

describe("User Creation", () => {
  // Connect to MongoDB memory server before running any tests
  beforeAll(async () => {
    // URI used only for testing purposes
    await mongoose.connect(
      process.env.URI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
  });

  // Close MongoDB connection after all tests
  afterAll(async () => {
    await server.close();
    await mongoose.disconnect();
    console.log("database disconnected");
  }, 10000);

  it("should start", async () => {
    const response = await request(app).get("/");

    expect(response.body).toBeDefined();
  });

  it("should create a new user with correct input", async () => {
    console.warn("userCreation 1 start");
    const userData = {
      username: "test",
      password: "test", // Ensure password field is included
    };
    console.log(userData);

    const response = await request(app)
      .post("/create-account")
      .send(`username=${userData.username}&password=${userData.password}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("User created successfully");
  });

  it("should return error if user already exists", async () => {
    console.warn("userCreation 2 start");
    const existingUser = {
      username: "test",
      password: "test", // Ensure password field is included
    };

    const response = await request(app)
      .post("/create-account")
      .send(
        `username=${existingUser.username}&password=${existingUser.password}`
      )
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Username already exists");
  });
});

describe("Login", () => {
  // Connect to MongoDB memory server before running any tests
  beforeAll(async () => {
    // URI used only for testing purposes
    await mongoose.connect(
      process.env.URI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
  });

  // Close MongoDB connection after all tests
  afterAll(async () => {
    await server.close();
    await mongoose.disconnect();
    console.log("database disconnected");
  }, 10000);

  it("should start", async () => {
    const response = await request(app).get("/");

    expect(response.body).toBeDefined();
  });

  it("should allow users to login when given correct credentials", async () => {
    const userData = {
      username: "test",
      password: "test", // Ensure password field is included
    };

    // Create an account to log in to
    await request(app)
      .post("/create-account")
      .send(`username=${userData.username}&password=${userData.password}`)
      .expect(200);

    const response = await request(app)
      .post("/login")
      .send(`username=${userData.username}&password=${userData.password}`)
      .expect(200);

    expect(response.body.success).toBe(true);
  });

  it("should not allow users to log in with incorrect user information", async () => {
    const userData = {
      username: "incorrectUserInformation",
      password: "test", // Ensure password field is included
    };

    const response = await request(app)
      .post("/login")
      .send(`username=${userData.username}&password=${userData.password}`)
      .expect(200)

    expect(response.body.success).toBe(false);
  });
});