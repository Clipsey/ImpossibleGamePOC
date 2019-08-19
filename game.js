const 	CANVAS_WIDTH			= 300;
const 	CANVAS_HEIGHT			= 300;

const 	BOX_WIDTH 				= 20;
const 	BOX_HEIGHT 				= 20;

const 	RESTING					= 0;
const 	JUMPING					= 1;
const 	FALLING					= 2;
const	MOVEMENT_STATES			= [RESTING, JUMPING, FALLING];
let		moveState				= RESTING;

const 	Y_JUMP_START 			= 5;
const   Y_RISING_ACCEL  		= -0.05;
let		yRisingVelocity 		= Y_JUMP_START;

const 	Y_FALL_START			= 1;
const 	Y_FALLING_ACCEL 		= -0.65; //Gravity
let 	yFallingVelocity		= Y_FALL_START;

const 	xPos 					= 50;
let   	yPos 					= 280;

let		jumpTimer  				= null;

let 	rotateNum 				= 0;

// Move to the left, 1 per frame
// Array of objects, start (x), level (y), width, height
// Squares to start

// Struct of Arrays

const 	OBJECTS					= {
	start: 	[],
	level: 	[],
	width: 	[],
};
let		mapIndex				= 0;


// Collision - By having array of "shapes", if xPos && yPos in one of the shapes, collided
// Obstacles - Array of shapes, As iterate over array, bring shape in to picture
// Map - Obstacles array shifted left, drawing from top left
// Floor detection - if yPos == 20 + y_object, and xPos + 20 within range of object, floor

(function populate() {
	OBJECTS["start"][0] = 20;
	OBJECTS["level"][0] = 1;
	OBJECTS["width"][0] = 40;
})();

window.addEventListener("keydown", function(e) {
	if(e.code == "Space" && moveState == RESTING){
		moveStateChange(JUMPING);
		jumpTimer = setTimeout( function() {
			moveStateChange(FALLING);
		}.bind(this), 200);
	}
});

function moveStateChange(status) {
	yRisingVelocity = Y_JUMP_START;
	yFallingVelocity = Y_FALL_START;
	
	moveState = status;
};

function updateCube(ctx) {
	if (moveState == JUMPING) {
		yPos = yPos - yRisingVelocity;
		yRisingVelocity += Y_RISING_ACCEL;
	} else if (moveState = FALLING) {
		yPos = Math.min(yPos + yFallingVelocity, 280);
		// TODO: Find floor given objects on screen, and pos of cube
		if (yPos == 280) {
			clearTimeout(jumpTimer);
			moveStateChange(RESTING);
		} else {
			yFallingVelocity -= Y_FALLING_ACCEL;
		}
	} else {
		moveStateChange(RESTING);
	}
}

function rotateCube(ctx) {
	const cx = xPos + BOX_WIDTH / 2;
	const cy = yPos + BOX_HEIGHT / 2;

	rotateNum += 5;

	ctx.translate(cx, cy);
	ctx.rotate((Math.PI / 180) * rotateNum);
	ctx.translate(-cx, -cy);
}

function drawCube(ctx) {
	let time = new Date();
	ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'
	 //ctx.rotate(((2 * Math.PI) / 6) * time.getSeconds() + ((2 * Math.PI) / 6000) * time.getMilliseconds());
	//ctx.rotate(-1);
	
	if (moveState != RESTING) {
		rotateCube(ctx);
	}

	ctx.fillRect(xPos, yPos, BOX_WIDTH, BOX_HEIGHT);
	updateCube(ctx);
};

function drawFloor(ctx) {
	ctx.lineWidth = 2;
	ctx.moveTo(0, 300);
	ctx.lineTo(300,300);
	ctx.closePath();
	ctx.stroke();
};

function drawObjects(ctx) {
	// x = 300 - (start - object.start)
	// y = 300 - (20 * object.level)
	
	mapIndex += 4;

	// TODO: Change size 
	if (mapIndex > 500) {
		mapIndex = 0;
	}

	for (let i = 0; i < OBJECTS["start"].length; ++i) {

		let object_vals = [
			OBJECTS["start"][i], 
			OBJECTS["level"][i],
			OBJECTS["width"][i]
		];
		const startV = object_vals[0];
		const heightV = 20 * object_vals[1];
		const widthV = object_vals[2];

		const startX = 300 + startV - mapIndex;
		const startY = 300 - (heightV);

		//console.log(startV, heightV, widthV);
		console.log(startX, startY);

		ctx.fillRect(startX, startY, widthV, heightV);

	}
}

(function area() {
	const canvas = document.getElementById("canvas");
	canvas.setAttribute("height", 300);
	canvas.setAttribute("width", 300);

	const ctx = canvas.getContext('2d');

	ctx.save();
	drawCube(ctx);
	ctx.restore();

	ctx.save();
	drawFloor(ctx);
	ctx.restore();

	ctx.save();
	drawObjects(ctx);
	ctx.restore();

	window.requestAnimationFrame(area);
})();