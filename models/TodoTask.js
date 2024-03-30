const mongoose = require('mongoose');
const todoTaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  isRecurringTask: {
    type: Boolean,
    default: false
  },
  recurrence: {
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
  }
})
module.exports = mongoose.model('TodoTask',todoTaskSchema);

// https://medium.com/@diogo.fg.pinheiro/simple-to-do-list-app-with-node-js-and-mongodb-chapter-2-3780a1c5b039