const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://0.0.0.0:27017/form');
const userRouter = require('./routes/user');

const app = express();
app.use(bodyParser());
app.use('/user',userRouter);

app.listen('3070', console.log("server running port 3070"));