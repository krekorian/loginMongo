const express = require("express");
const users = express.Router();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../models/User")
users.use(cors())

process.env.SECRET_KEY = 'secret'

users.post('/register', (req, res) => {
    const today = new Date()
    const userData = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
        created: today
    }

    User.findOne({
        email: req.body.email
    })
        .then(user => {
            if (!user) {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    userData.password = hash
                    User.create(userData)
                        .then(user => {
                            res.json({ status: user.email + 'Registered!' })
                        })
                        .catch(err => {
                            res.send('error: ' + err)
                        })
                })
            } else {
                res.json({ error: 'User already exists' })
            }
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})


users.post('/login', (req, res) => {
    User.findOne({
        email: req.body.email
    })
        .then(user => {
            console.log("user under User.js under routes");
            console.log(user)
            if (user) {
                if (bcrypt.compareSync(req.body.password, user.password)) {
                    const payload = {
                        _id: user._id,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        email: user.email
                    }
                    let token = jwt.sign(payload, process.env.SECRET_KEY, {
                        expiresIn: '604800'
                    })

                    res.send(token)
                } else {
                    res.json({ error: "User password does not exist" })
                }
            } else {
                res.json({ error: "User(s) does not exist" })
            }
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

users.get('/profile', (req, res) => {
    console.log("req.headers")
    console.log((req.headers['authorization']).slice(7))
    var decoded = jwt.verify((req.headers['authorization']), process.env.SECRET_KEY)

    console.log("decoded console log");
    console.log(decoded);
    console.log(decoded.exp);
    User.findOne({
        _id: decoded._id
    })
        .then(user => {
            if (user) {
                console.log(user);
                res.json(user)
            } else {
                res.send("User does not EXIST")
            }
        })
        .catch(err => {
            window.location.href("/")
            // res.send('error:: ' + err)
        })
})

users.get('/verifyuser', (req, res) => {
    console.log("req")
    console.log(req)

    User.findOne({
        email: req.body.email
    })
})

module.exports = users;