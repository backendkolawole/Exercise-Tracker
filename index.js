const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env['MONGO_URI'], { useNewUrlParser: true, useUnifiedTopology: true });

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true },
  log: [{
    _id: false,
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    date: String
  }]
});

const User = mongoose.model('User', userSchema);

app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users', function (req, res) {
  const username = req.body.username;
  let newUser = new User({ username: username });
  newUser.save(function (err, user) {
    if (err) res.send("Couldn't add new user");
    res.send({ username: user.username, _id: user._id });
  });
});

app.get('/api/users', function (req, res) {
  User.find({})
    .select('username _id')
    .exec(function (err, users) {
      if (err) res.send("No users found");
      res.send(users);
    });
});

app.post('/api/users/:_id/exercises', function (req, res) {
  const id = req.params._id;
  User.findById(id, function (err, user) {
    if (err) res.send("No user found for that ID");
    const description = req.body.description;
    const duration = req.body.duration && !Number.isNaN(Number(req.body.duration)) ? Number(req.body.duration) : res.send(`Enter a valid input for 'duration'`);
    // if no input for date, date is today
    const date = !req.body.date ? new Date().toDateString() : isValidDateInput(req.body.date) ? new Date(req.body.date).toDateString() : res.send(`Enter a valid input for 'date'`);
    let newExercise = {
      description: description,
      duration: duration,
      date: date
    };
    user.log.push(newExercise);
    user.save((err, data) => {
      if (err) res.send("Couldn't add exercise");
      res.send({ username: user.username, description: description, duration: duration, date: date, _id: id });
    });
  });
});

app.get('/api/users/:_id/logs', function (req, res) {
  const id = req.params._id;
  User.findById(id, function (err, user) {
    if (err) res.send("No user found for that ID");
    const from = req.query.from;
    const to = req.query.to;
    const limit = req.query.limit;
    let logs = user.log;
    if (isValidDateInput(from)) {
      logs = logs.filter(log => Date.parse(log.date) >= Date.parse(from));
    }
    else if (from) {
      res.send(`Enter a valid input for 'from'`);
    }
    if (isValidDateInput(to)) {
      logs = logs.filter(log => Date.parse(log.date) <= Date.parse(to));
    }
    else if (to) {
      res.send(`Enter a valid input for 'to'`);
    }
    if (limit && Number.isInteger(Number(limit)) && limit > 0) {
      logs = logs.slice(0, limit);
    }
    else if (limit) {
      res.send(`Enter a valid input for 'limit'`);
    }
    res.send({ username: user.username, count: user.log.length, _id: id, log: logs });
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

const isValidDateInput = function (date) {
  const dateRegex = /\d{4}-\d{2}-\d{2}/;
  return dateRegex.test(date) && new Date(date) != null;
};