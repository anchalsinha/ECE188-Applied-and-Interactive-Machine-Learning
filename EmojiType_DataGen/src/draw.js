var canvas = $('#drawingCanvas')[0];
canvas.width = 150;
canvas.height = 150;
var bounds = canvas.getBoundingClientRect();

var ctx = canvas.getContext('2d');
var pos = { x: 0, y: 0 };

document.addEventListener('mousemove', draw);
document.addEventListener('mousedown', setPosition);
document.addEventListener('mouseenter', setPosition);

function setPosition(e) {
    pos.x = e.clientX - bounds.left;
    pos.y = e.clientY - bounds.top;
}

function draw(e) {
    if (e.buttons !== 1) 
        return;
  
    ctx.beginPath();
  
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
  
    ctx.moveTo(pos.x, pos.y); 
    setPosition(e);
    ctx.lineTo(pos.x, pos.y);
  
    ctx.stroke(); 
}