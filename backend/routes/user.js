const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');

router.get('/login', (req, res)=>{
    const body = req.body;
    const email = body && body.email;
    const password = body && body.password;
    let userDoc;
    return User.find({email})
        .then((doc)=>{
            if(doc){
                userDoc = doc[0]._doc;
                return bcrypt.compare(password, userDoc.password)
            }else{
                return res.send({success: false, message: 'User not found'})
            }
        }).then((result)=>{
            if(result){
                return jwt.sign({
                    data: email
                  }, 'secret', { expiresIn: '1h' })
                // return res.send({success: true, result: userDoc})
            }else{
                return res.send({success: false, message: "Give correct credentials"})
            }
        }).then((token)=>{
            userDoc.token = token;
            return res.status(200).send({success: true, result: userDoc})
        })
        .catch((error)=>{
            return res.status(400).send({success: false, message: error.message})
        })
})

router.post('/signup', (req, res) => {
    const body = req.body;
    const email = body && body.email;
    const firstName = body && body.firstName;
    const lastName = body && body.lastName;
    const password = body && body.password;
    let hash = '';
    return bcrypt.hash(password, 10)
        .then((result) => {
            hash = result;
            if (email && password) {
                let userObject = {
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    password: hash
                }
                return User.create(userObject);
            } else {
                return res.send({ success: false, message: "Please give correct email and password" });
            }
        }).then(() => {
            if (email && password) {
                res.send({ success: true, result: 'User created' });
            }
        }).catch((error) => {
            res.send({ success: false, message: error.message })
        })
})


module.exports = router;