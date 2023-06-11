console.log('Waheguru Ji')
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {});

const Port = process.env.PORT || 2000;

app.use('/client', express.static(__dirname + '/client'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client/index.html');
});
let socketList = {};
let playerList = {};



const Player = (id)=>
{
    const self = {
        x:250,
        y:250,
        id:id,
        number: ""+Math.floor(Math.random() * 10),
        pressingRight:false,
        pressingLeft:false,
        pressingUp:false,
        pressingDown:false,
        maxSpd:10,
    }

    self.updatePosition = () =>
    {
        if (self.pressingRight)
            self.x += self.maxSpd;
        if (self.pressingLeft)
            self.x -= self.maxSpd;
        if (self.pressingUp)
            self.y -= self.maxSpd;
        if (self.pressingDown)
            self.y += self.maxSpd;
    }

    return self;
}

io.sockets.on('connection', (socket) => {
    socket.id = `${new Date(Date.now('MM-DD-YY_4.55PM')).toLocaleDateString()}_${Math.random() * 100} `;
    socketList[socket.id] = socket;
    let player = Player(socket.id);
    playerList[socket.id] = player;

    console.log(`${socket.id} connected`);

    socket.on('disconnect',()=>
    {
        delete socketList[socket.id];
        delete playerList[socket.id];
    });

    socket.on('keyPress',(data)=>
    {
        if (data.inputId === 'left')
        {
            player.pressingLeft = data.state;
        }
        else 
        if (data.inputId === 'right')
        {
            player.pressingRight = data.state;
        }
        if (data.inputId === 'up')
        {
            player.pressingUp = data.state;
        }
        if (data.inputId === 'down')
        {
            player.pressingDown = data.state;
        }
    });
});

setInterval(() => {
    let pack = [];
    for (let i in playerList) {
        let player = playerList[i];
        player.updatePosition();

        pack.push(
            {
                x: player.x,
                y: player.y,
                number: player.number
            });
    }
    for (let i in socketList)
    {
        let socket = socketList[i];
        socket.emit('newPostitions',pack);
    }

}, 1000 / 25);

server.listen(Port, () => {
    console.log(`Server Is Up and Running On Port: ${Port}`);
});
