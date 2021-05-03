
var ctx = emojiCanvas.getContext('2d');
var pos = { x: 0, y: 0 };

points = []

emojiCanvas.addEventListener('mousemove', draw);
emojiCanvas.addEventListener('mousedown', setPosition);
emojiCanvas.addEventListener('mouseenter', setPosition);
emojiCanvas.addEventListener('mouseup', classify);
emojiCanvas.addEventListener('mouseleave', classify);

function getMousePos(evt) {
    var bounds = emojiCanvas.getBoundingClientRect(),
        scaleX = emojiCanvas.width / bounds.width,
        scaleY = emojiCanvas.height / bounds.height;

    return {
        x: (evt.clientX - bounds.left) * scaleX,   // scale mouse coordinates after they have
        y: (evt.clientY - bounds.top) * scaleY     // been adjusted to be relative to element
    }
}

function setPosition(e) {
    pos = getMousePos(e);
    points.push(pos);
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

function clearDrawing() {
    points = [];
    pos = { x: 0, y: 0 };
    ctx.clearRect(0, 0, emojiCanvas.width, emojiCanvas.height);
}


const distanceThreshold = 10;
const midpointThreshold = 0.2; // error

const minStrokeBounds = 30;

function getStrokeProperties() {
    let minX = emojiCanvas.width;
    let maxX = 0;
    let minXPoint = {};
    let maxXPoint = {};

    let minY = emojiCanvas.height;
    let maxY = 0;
    let minYPoint = {};
    let maxYPoint = {};

    points.shift();
    const startPoint = points[0];
    const endPoint = points[points.length - 1];

    for (const point of points) {
        if (point.x < minX) {
            minX = point.x;
            minXPoint = point;
        }
        else if (point.x > maxX) {
            maxX = point.x;
            maxXPoint = point;
        }
        if (point.y < minY) {
            minY = point.y;
            minYPoint = point;
        }
        else if (point.y > maxY) {
            maxY = point.y;
            maxYPoint = point;
        }
    }
    
    
    const minXDist = Math.abs(startPoint.x - minXPoint.x);
    const maxXDist = Math.abs(startPoint.x - maxXPoint.x);
    const minYDist = Math.abs(startPoint.y - minYPoint.y);
    const maxYDist = Math.abs(startPoint.y - maxYPoint.y);

    const midpoint = maxYDist > minYDist ? maxYPoint : minYPoint;
    const midpointRatio = (endPoint.x - midpoint.x)/(endPoint.x - startPoint.x);

    const startEndDist = Math.sqrt((endPoint.x - startPoint.x) ** 2 + (endPoint.y - startPoint.y) ** 2);
    
    return [ 
        maxXDist > minXDist, 
        maxYDist > minYDist, 
        Math.max(minXDist, maxXDist) > distanceThreshold, 
        Math.max(minYDist, maxYDist) > distanceThreshold, 
        midpointRatio < 0.5 + midpointThreshold && midpointRatio > 0.5 - midpointThreshold,
        Math.abs(startEndDist) > distanceThreshold ];

}

const minPoints = 30;

function classify() {

    if (points.length < minPoints) {
        clearDrawing();
        return;
    }
    
    const [xDirRight, yDirDown, dx_test, dy_test, midpoint_test, dist_test] = getStrokeProperties();

    // console.log(`X Right: ${xDirRight}, Y Down: ${yDirDown}, dX Threshold: ${dx_test}, dY Threshold: ${dy_test}, midpoint Threshold: ${midpoint_test}, dist Threshold: ${dist_test}`);

    if (dx_test && dy_test && !midpoint_test && dist_test) {
        addEmojiText("squiggle");
    }
    else if (yDirDown && dx_test && dy_test && dist_test) {
        addEmojiText("smile");
    }
    else if (!yDirDown && dx_test && dy_test && dist_test) {
        addEmojiText("frown");
    }
    else if (yDirDown && !dx_test && dy_test && dist_test) {
        addEmojiText("100");
    }
    else if (xDirRight && dx_test && !dy_test && dist_test) {
        addEmojiText("flat");
    }
    else if (!dist_test) {
        addEmojiText("open");
    }
    clearDrawing();
}

function addEmojiText(name) {
    console.log(name);
    switch (name) {
        case "smile":
            inputTextAppend('😀');
            break;
        case "frown":
            inputTextAppend('🙁');
            break;
        case "open":
            inputTextAppend('😮');
            break;
        case "flat":
            inputTextAppend('😐');
            break;
        case "squiggle":
            inputTextAppend('🥴');
            break;
        case "100":
            inputTextAppend('💯');
            break;       
    }
}