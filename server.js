const express = require('express');
const admin = require('firebase-admin');
const bcrypt = require('bcrypt');
const app = express();

const PORT = process.env.PORT || 5050

//Firebase Admin SetUp
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});


//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//View Engine
app.set('view engine', 'hbs');

app.get('/', async(req, res)=>{
    const user = admin.auth().currentUser
    if(!user){
        res.render('login');
    }
    res.render('home');
})

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/signup', async (req, res)=>{
    res.render('signup');
});

app.post('/signup', async (req, res) => {

    try {
        const user = {
            fName: req.body.fName,
            lName: req.body.lName,
            email: req.body.email,
            password: req.body.password
        }
        
        const userResponse = await admin.auth().createUser({
            fName: user.fName,
            lName: user.lName,
            email: user.email,
            password: user.password,
            emailVerified: false,
            disabled: false
        });
        console.log(userResponse);
        res.redirect('/')
    } catch (err) {
        res.render('login', {message: err.errorInfo.message})
    }
})

app.post('/login', async(req, res)=> {
    try {
        if (req.body.email === admin.auth().credential.email && req.body.password === admin.auth().credential.password) {
            res.redirect('/home');
        }
    } catch (err) {
        res.render('login', {message: err.errorInfo?.message});
    }
});

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));