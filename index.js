const express = require('express')
const app = express()
const apiai = require('apiai')(process.env.APIAI_TOKEN)

app.use(express.static(__dirname + '/views'))
app.use(express.static(__dirname + '/public'))

const server = app.listen(process.env.PORT || 8000, () => {
    console.log('Listening at port %d in %s mode', server.address().port, app.settings.env)
})

const io = require('socket.io')(server)
io.on('connection', function(socket) {
    console.log('user connected')
})

app.get('/', (req, res) => {
    res.sendFile('index.html')
})

io.on('connection', function(socket) {
    socket.on("chat message", text => {
        console.log("Message: " + text)

        let apiaiReq = apiai.textRequest(text, {
            sessionId: APIAI_SESSION_ID
        })

        apiaiReq.on("response", response => {
            let aiText = response.result.fulfillment.speech;
            console.log("Bot reply: " + aiText)
            socket.emit("bot reply", aiText)
        });

        apiaiReq.on("error", error => {
            console.log(error)
        })

        apiaiReq.end()
    })
})