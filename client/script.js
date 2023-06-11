
let ctx = document.getElementById('ctx').getContext("2d");
ctx.font = '30px Arial';

socket.on('newPosition',(data)=>
{
    ctx.clearRect(0,0,500,500);
    ctx.fillText('W',data.x,data.y);
});

