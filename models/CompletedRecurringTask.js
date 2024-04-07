const mongoose = require('mongoose');
const TodoTask = require("./TodoTask");

const completedRecurringTaskSchema = new mongoose.Schema({
    ...TodoTask.schema.obj,
    dateCompleted: {type: Date, required: true}
})

module.exports = mongoose.model('CompletedRecurringTask',completedRecurringTaskSchema);