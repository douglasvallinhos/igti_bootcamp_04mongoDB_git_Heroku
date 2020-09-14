import { db } from '../models/index.js';

const gradesSchema = db.mongoose.Schema({
  name: {
    type: String,
    requerid: true,
  },
  subject: {
    type: String,
    requerid: true,
  },
  type: {
    type: String,
    requerid: true,
  },
  value: {
    type: Number,
    requerid: true,
  },
  lastModified: {
    type: Date,
    default: Date.now,
  },
});

const Grades = db.mongoose.model('grades', gradesSchema, 'grades');

export default Grades;
