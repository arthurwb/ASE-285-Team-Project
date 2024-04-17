const mongoose = require('mongoose');

const completionSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  }
});

const todoTaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  date: {
    type: Date
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurrence: {
    isPaused: {
      type: Boolean,
      default: false
    },
    frequency: {
      type: String,
      enum: ['none', 'daily', 'weekly', 'monthly', 'yearly'],
      default: 'none'
    },
    interval: {
      type: Number,
      default: 1
    },
    dayOfWeek: {
      type: Number
    },
    dayOfMonth: {
      type: Number
    },
    startBy: {
      type: Date,
      default: Date.now
    },
    endBy: {
      type: Date
    }
  },
  completions: [completionSchema],

  subtasks: [
    {
      subtaskTitle: {
        type: String,
        required: true
      },
      subtaskDate: {
        type: Date,
        default: Date.now
      },
      subtaskCompleted: {
        type: Boolean,
        default: false
      }
    }
  ],
  tag: {
    type: String,
    default: "Misc"
  }
})

module.exports = mongoose.model('TodoTask',todoTaskSchema);

// https://medium.com/@diogo.fg.pinheiro/simple-to-do-list-app-with-node-js-and-mongodb-chapter-2-3780a1c5b039