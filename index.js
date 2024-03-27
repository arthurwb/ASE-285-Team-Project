const mongoose = require("mongoose");
const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

const TodoTask = require("./models/TodoTask");

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.URI);
  console.log("Connected to db!");
  app.listen(3000, () => console.log("Server Up and running"));
}

app.set("view engine", "ejs");
app.use("/static", express.static("public"));
app.use(express.urlencoded({ extended: true }));

// CRUD processing

app.route("/").get(async (req, res) => {
  try {
    const tasks = await TodoTask.find({})
    res.render("todo.ejs", { todoTasks: tasks });
  }
  catch (err) {
    console.error(err);
  }
}).post(async (req, res) => {
  const todoTask = new TodoTask({
      title: req.body.title
  });
  try {
    await todoTask.save();
    res.redirect("/");
  } catch (err) {
    res.send(500, err);
  }
});

/* app.get("/", async (req, res) => {
  try {
    const tasks = await TodoTask.find({})
    res.render("todo.ejs", { todoTasks: tasks });
  }
  catch (err) {
    console.error(err);
  }
});

app.post('/', async (req, res) => {
    const todoTask = new TodoTask({
        title: req.body.title
    });
    try {
      await todoTask.save();
      res.redirect("/");
    } catch (err) {
      res.send(500, err);
    }
});
*/
//UPDATE
app.route("/edit/:id")
.get(async (req, res) => {
  const id = req.params.id;
  try {
    let tasks = await TodoTask.find({});
    res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
  } catch (err) {
    res.send(500, err);
  }
})
.post(async (req, res) => {
  const id = req.params.id;
  try {
    const { title, date } = req.body;
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      throw new Error('Invalid date format.');
    }
    // Perform the update
    await TodoTask.findByIdAndUpdate(id, {
      title: title,
      date: parsedDate
    });
    res.redirect("/");
  } catch (err) {
    // If there's an error, send the error message back to the client
    res.send(500, err.message);
  }
});

//DELETE
app.route("/remove/:id").get(async (req, res) => {
  const id = req.params.id;
  try {
    await TodoTask.findByIdAndRemove(id)
    res.redirect("/");
  } catch (err) {
    res.send(500, err);
  }
});

//SUBTASKS
app.route("/subtask/:id").get(async (req, res) => {
  const id = req.params.id;
  try {
    let tasks = await TodoTask.find({_id: id});
    res.render("todoSubtask.ejs", { todoTask: tasks });
  } catch (err) {
    res.send(500, err);
  }
})
.post(async (req, res) => {
  const id = req.params.id;
  try {
    const subtask = req.body;
    // Perform the update
    await TodoTask.findByIdAndUpdate(id, {
      $push: {
        subtasks: subtask,
      },
    });
    res.redirect(`/subtask/${id}`);
  } catch (err) {
    // If there's an error, send the error message back to the client
    res.send(500, err.message);
  }
});

//SUBTASK EDIT
app.route("/subtaskEdit/:id").get(async (req, res) => {
  const id = req.params.id;
  try {
    let task = await TodoTask.find({"subtasks._id": id});
    res.render("subtaskEdit.ejs", { todoTask: task, idSubtask: id });
  } catch (err) {
    res.send(500, err.message);
  }
})
.post();

//GETJSON
app.get('/json', async (req, res) => {
  try {
    const tasks = await TodoTask.find({});
    res.render('json.ejs', { tasks: JSON.stringify(tasks, null, 2) });
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while fetching tasks.' );
  }
});
