import mongoose from 'mongoose';
(async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://douglasvallinhos:20mata20@igti.wxcpa.gcp.mongodb.net/grades?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
  } catch (error) {
    console.log(error);
  }
})();

const studentSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  subject: {
    type: String,
    require: true,
  },
  type: {
    type: String,
    require: true,
  },
  value: {
    type: Number,
    require: true,
  },
  lastModified: {
    type: Date,
    default: Date.now,
  },
});

mongoose.model('student', studentSchema, 'student');

const student = mongoose.model('student');

new student({
  name: 'Maria',
  subject: 'portugues',
  type: 'trabalho pratico',
  value: 12.5,
})
  .save()
  .then(() => console.log('Sucesso!'))
  .catch((error) => console.log(error));

//mongoose.disconnect();
