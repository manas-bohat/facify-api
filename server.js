const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt-nodejs');
const db = require('knex')({
    client: 'pg',
    connection: {
      connectionString : process.env.DATABASE_URL,
      ssl : true
    }
});

const app = express();
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const image = require('./controllers/image')

app.use(express.json());
app.use(cors());

app.get('/', (req, res)=> {
    res.json("It's working");
})

// endpoints : 1. sign in   2. register    3. profile   
// 4. image (just increases the number of entries)

// 1.
// dependency injection
app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) });

// 2.
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) });

// 3.
// not in use now but can be used in future if we decide to have a profile for
// every user
// not making this a one liner just to show how it can be done in this way also.
app.get('/profile/:id', (req, res) => {
    let { id } = req.params;      // anything after colon is a parameter
    db.select('*').from('users').where({
        id: id
    }).then(user => {
        if(user.length)
            res.json(user[0]);
        else
            res.status(400).json('Profile not found');
    }).catch(err => res.status(400).json('Error finding profile'));
})

// 4.
app.put('/image', (req, res) => {image.handleImage(req, res, db)})
// 5
app.post('/imageurl', (req, res) => {image.handleApiCall(req, res)})

app.listen(process.env.PORT || 3000, () => {
    console.log("app is running");
});