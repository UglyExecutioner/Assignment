require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const route = require('./routes/routes');

mongoose.connect(`mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0.e550i.mongodb.net/${process.env.DATABASE}?retryWrites=true&w=majority`).then(()=>{
  console.log("Connection Successful");
}).catch((e)=>{
  console.log("Error connecting to database",e);
});



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//To avoid CORS error while api calling

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers",
  "Origin,X-Requested-With, Content-Type, Accept");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.use('/', route);




module.exports = app;