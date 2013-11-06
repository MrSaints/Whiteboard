// get the canvas element and its context
var canvas;
var context;

var sketchContainer;
var sketchStyle;

function initialize(document) {
	canvas = document.querySelector('#sketch');
	context = canvas.getContext('2d');
	
	sketchContainer = document.querySelector('#sketchContainer');
	sketchStyle = getComputedStyle(sketchContainer);
	
	canvas.width = parseInt(sketchStyle.getPropertyValue('width'), 10);
	canvas.height = parseInt(sketchStyle.getPropertyValue('height'), 10);

	drawGrid();
	
	// brush settings
	context.lineWidth = 2;
	context.lineJoin = 'round';
	context.lineCap = 'round';
	context.strokeStyle = '#000';
	
    canvas.addEventListener('mousemove', move, false);
	

	canvas.addEventListener('mousedown', function(e) {
		if (startMouse != null) {
			context.fillRect(Math.min(startMouse.x, curMouse.x), Math.min(startMouse.y, curMouse.y), Math.abs(startMouse.x - curMouse.x), Math.abs(startMouse.y - curMouse.y));   
			startMouse = null;
		} else {
			startMouse = {
				x: clamp(e.pageX - this.offsetLeft),
				y: clamp(e.pageY - this.offsetTop)
			};
		}
	}, false);

	canvas.addEventListener('mouseup', function () {
		//context.fillRect(startMouse.x, startMouse.y, curMouse.x, curMouse.y);
	}, false);
	
}

// Clamps a given number to its nearest multiple of 10 (corresponds to grid)
function clamp(coordinate) {
	return Math.round(coordinate / 10) * 10;
}

function drawGrid() {
	// Save old context stuff, TODO: Save all
	var oldStyle = context.strokeStyle;
	
	// Draw 10x10 grid
	context.beginPath();
	for (var x = 0.5; x < canvas.width; x += 10) {
		context.moveTo(x, 0);
		context.lineTo(x, canvas.height); //Draw downward (Bottom y position)
	}
	for (var y = 0.5; y < canvas.height; y += 10) {
		context.moveTo(0, y);
		context.lineTo(canvas.width, y); //Draw right (Rightmost x position)
	}
	context.strokeStyle = "#f2f2f2"; // Inner grid colour
	context.closePath();
	context.stroke();
	
	// Draw 50x50 Grid
	context.beginPath();
	for (var x = 0.5; x < canvas.width; x += 50) {
		context.moveTo(x, 0);
		context.lineTo(x, canvas.height);
	}
	
	for (var y = 0.5; y < canvas.height; y += 50) {
		context.moveTo(0, y);
		context.moveTo(canvas.width, y);
	}
	context.strokeStyle = "#e5e5e5"; // Outer grid colour
	context.closePath();
	context.stroke();
}

var lastMouse = {
    x: 0,
    y: 0
};

var startMouse = null;
var curMouse = null;

// attach the mousedown, mousemove, mouseup event listeners.
//canvas.addEventListener('mousedown', function (e) {
//    lastMouse = {
//        x: e.pageX - this.offsetLeft,
//        y: e.pageY - this.offsetTop
//    };
//}, false);

//canvas.addEventListener('mouseup', function () {
//    canvas.removeEventListener('mousemove', move, false);
//}, false);

function move(e) {
    curMouse = {
        x: clamp(e.pageX - this.offsetLeft),
        y: clamp(e.pageY - this.offsetTop)
    };
}
    
    
/*
function move(e) {
    var mouse = {
        x: e.pageX - this.offsetLeft,
        y: e.pageY - this.offsetTop
    };
    draw(lastMouse, mouse);
    lastMouse = mouse;
}
*/
function draw(start, end, remote) {
    context.beginPath();
    context.moveTo(start.x, start.y);
    context.lineTo(end.x, end.y);
    context.closePath();
    context.stroke();
    if ((!remote) && TogetherJS.running) {
        TogetherJS.send({
            type: "draw",
            start: start,
            end: end
        });
    }
}

TogetherJS.hub.on("draw", function (msg) {
    draw(msg.start, msg.end, true);
});

TogetherJS.hub.on("togetherjs.hello", function () {
    var image = canvas.toDataURL("image/png");
    TogetherJS.send({
        type: "init",
        image: image
    });
});

TogetherJS.hub.on("init", function (msg) {
    var image = new Image();
    image.src = msg.image;
    context.drawImage(image, 0, 0);
});
