//carregar modulos
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()
const admin = require('./routes/admin')
const path = require('path')
const mongoose = require('mongoose')
const session = require("express-session")
const flash = require("connect-flash")
/*const bcrypt = require('bcrypt')
const passport=require('passport')
const flash = require('express-flash')
const session=require('express-session')
const initializePassport=require('./passport-config')
initializePassport(passport, email=>(users.find(user=>user.email===email)
))*/

const users=[] 
//config

    //sessão
    app.use(session({
        secret: "cursodenode",
        resave:true,
        saveUninitialized: true
    }))
    app.use(flash())
    //Midleware
    app.use((req, res, next)=>{
        res.locals.success_msg = req.flash("success_msg")
        res.locals.error_msg = req.flash("error_msg")
        next()
    })
    //bodyParser
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())

    //handlebars
    app.engine('handlebars',handlebars({defaultLayout: 'main'}))   
    app.set('view engine', 'handlebars')
    //teste
    /*app.use(express.urlencoded({extended:false}))
    app.use(flash())
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave:false,
        saveUninitialized:false
    }))
    app.use(passport.initialize())
    app.use(passport.session())
    */
    
    
    //Mongoose
        /*
        mongoose.connect(process.env.DATABASE_URL,{
            useNewUrlParser:true})

        const db=mongoose.connection
        db.on('error',error=>console.error(error))
        db.on('open',()=>console.log('connected to mongoose'))*/
        mongoose.Promise = global.Promise;
        mongoose.connect("mongodb://localhost/teste", {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        }).then(()=>{
            console.log("conectado ao mongo")
        }).catch((err)=>{
            console.log("ocorreu um erro")
        })
  /*      mongoose.connect(process.env.MONGO_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        })
        .then(() => console.log('DB Connected!'))
        .catch(err => {
        console.log(Error, err.message);
        });*/
        // Outras

    //Public
app.use(express.static(path.join(__dirname,"public")))

app.use((req,res,next)=>{
    console.log("O meu primeiro midleware")
    next()
})
//routes


app.get('/', (req,res)=>{
    res.render('home')
})

app.get('/about', (req,res)=>{
    res.render('about')
})

app.get('/learn', (req,res)=>{
    res.render('learn')
})


app.get('/login', (req,res)=>{
    res.render('login')
})

/*app.post('/login', (req,res)=>{
    res.render('login')
})*/

/*app.post('/login', passport.authenticate('local', {
    successRedirect:'/',
    failureRedirect:'/login',
    failureFlash:true
}))
*/
app.get('/register', (req,res)=>{
    res.render('register')
})

/*app.post('/register', async (req,res)=>{
    try{
    const hashedPassword = await bcrypt.hash(req.body.password,10)
    users.push({
        id:Date.now().toString(),
        name:req.body.name,
        email:req.body.email,
        password:hashedPassword
    })
    res.redirect('/login')
    }catch{
        res.redirect('/register')
    }
    console.log(users)
})
*/
app.use('/admin', admin)

//outros
const PORT = 3000
app.listen(PORT , () => {
    console.log("servidor na porta " + PORT)
})