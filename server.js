const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
});

mongoose.connect('mongodb+srv://test:test@cluster0.feeli.mongodb.net/cluster0?retryWrites=true&w=majority',{
  useNewUrlParser: true,
  useUnifiedTopology: true
  });
console.log(mongoose.connection.readyState);

const exercisesSchema = new mongoose.Schema({
  idd: {type: String},
  description: {type : String, require: true},
  duration: {type : Number, require: true},
  date: {type: String}
});

const userSchema = new mongoose.Schema({ 
  username : {type: String, require: true},
});

const Exercises = mongoose.model('Exercises', exercisesSchema);
const User = mongoose.model('User', userSchema);

app.use(bodyParser.urlencoded({ extended: false}));

app.post('/api/users', (req, res) => {
  const input = req.body.username
  const newUser = new User({username: input})

  newUser.save((err, data) => {
    res.json({
      username: data.username,
      _id: data._id
    })
  });
});

app.post('/api/users/:id/exercises',(req, res) => {
  
  const id = req.params.id
  const date = new Date(req.body.date)
  User.findById(id, (err, data) => {

    if(err) {
      res.json({error:"Invalid Id"})
    }else{
      if(date == 'Invalid Date'){
        let d = Date().toString()
        const newexercises = new Exercises({
          idd: id,
          description: req.body.description,
          duration: parseInt(req.body.duration),
          date : d.slice(0,15)
        })
        newexercises.save((err,date) => {
          if(err){console.log(err)}
        });
        res.json({
          _id : data.id,
          username: data.username,
          date: d.slice(0,15),
          duration: parseInt(req.body.duration),
          description: req.body.description
        });
      }else{
        const newexercises = new Exercises({
          idd: id,
          description: req.body.description,
          duration: parseInt(req.body.duration),
          date : date.toDateString()
        })
        newexercises.save((err,date) => {
          if(err){console.log(err)}
        });
        res.json({
          _id : data.id,
          username: data.username,
          date: date.toDateString(),
          duration: parseInt(req.body.duration),
          description: req.body.description
        });  
      }
    };
  })
});

app.get('/api/users', (req, res) => {
  User.find({idd:id}, (err, allusers) =>{
    res.send(allusers)
  });
});

app.get('/api/users/:_id/logs',(req, res) =>{
  const id = req.params.id;
  Exercises.findById( id,(err,data) => {
    res.json(data)
  });
})

