const express = require('express')
const db = require('./src/db/mongoose')
const userRouter = require('./src/routers/user')
const friendRouter = require('./src/routers/friend')
const chatRouter = require('./src/routers/chat')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')

const app = express();
const server = http.createServer(app)
const io = socketio(server)

const publicDirectoryPath = path.join(__dirname, '/public/')

app.get('/', function(req, res, next) {
    // console.log(publicDirectoryPath)
    res.render(`${publicDirectoryPath}signin.ejs`)
        // console.log('Successfully User Created!')
})

app.get('/forgot', function(req, res, next) {
    res.render(`${publicDirectoryPath}forgot.ejs`)
})

app.get('/signup', function(req, res, next) {
    res.render(`${publicDirectoryPath}signup.ejs`)
})

app.get('/index', function(req, res, next) {
    res.render(`${publicDirectoryPath}index.ejs`)
})

app.get('/addFriend', function(req, res, next) {
    res.render(`${publicDirectoryPath}addFriend.ejs`)
})

app.use(express.static(publicDirectoryPath))

io.on('connection', () => {
    console.log('New WebSocket Connection')
})

app.use(express.json())
app.use(userRouter)
app.use(friendRouter)
app.use(chatRouter)

server.listen(5000, () => console.log("Server Up and Running!"));

module.exports = app