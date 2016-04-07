var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
    
var fps = 30;
var world = [[0,0,1,1,0],
             [0,0,0,0,0],
             [1,0,1,1,0],
             [0,0,1,0,0],
             [0,0,0,0,0]];

var unitSize = canvas.width/world.length;

var resolution = 1;
var renderDistance = 400;

var fov = 50;
var player = {x:10,y:10,dir:90,mod:0};
var turningSpeed = 3;
var moveSpeed = 3;

var movement = {turningRight:0, turningLeft:0,movingRight:0,movingLeft:0,movingForward:0,movingBackward:0};

window.addEventListener("keydown", keydownHandler, false);
window.addEventListener("keyup", keyupHandler, false);

function toDeg(radians){
    return (radians*180)/Math.PI;
}

function toRad(deg){
    return deg*(Math.PI/180);
}

function keydownHandler(event){
    var key = event.keyCode;
    if(key == 190){
        movement.turningRight = turningSpeed;
    }
    if(key == 188){
        movement.turningLeft = turningSpeed;
    }
    if(key == 87){
        movement.movingForward = moveSpeed;
    }
    if(key == 83){
        movement.movingBackward = moveSpeed;
    }
    if(key == 65){
        movement.movingLeft = moveSpeed;
    }
    if(key == 68){
        movement.movingRight = moveSpeed;
    }
}

function keyupHandler(event){
    var key = event.keyCode;
    if(key == 190){
        movement.turningRight = 0;
    }
    if(key == 188){
        movement.turningLeft = 0;
    }
    if(key == 87){
        movement.movingForward = 0;
    }
    if(key == 83){
        movement.movingBackward = 0;
    }
    if(key == 65){
        movement.movingLeft = 0;
    }
    if(key == 68){
        movement.movingRight = 0;
    }
}

//angle in degrees
function castRay(originx, originy, angle){
    realangle = angle;
    angle -= 360*Math.floor(angle/360);
    for(var distance = 0; distance < renderDistance; distance+=resolution){
        var x = originx + (Math.cos(toRad(angle)) * distance);
        var y = originy + (Math.sin(toRad(angle)) * distance);
        var gridx = x / unitSize;
        var gridy = y / unitSize;
        gridx = Math.floor(gridx);
        gridy = Math.floor(gridy);
        if(gridx < world[0].length && gridy < world.length && gridx >= 0 && gridy >= 0){
            if(world[gridy][gridx] != 0){
                var textureNumber = world[gridy][gridx];
                return [x, y, textureNumber];
            }
        }
    }
    return [];
}

function draw(){

    player.dir += movement.turningRight;
    player.dir -= movement.turningLeft;

    if(movement.movingForward != 0){
        player.x += Math.cos(toRad(player.dir)) * moveSpeed;
        player.y += Math.sin(toRad(player.dir)) * moveSpeed;
    }
    if(movement.movingBackward != 0){
        player.x -= Math.cos(toRad(player.dir)) * moveSpeed;
        player.y -= Math.sin(toRad(player.dir)) * moveSpeed;
    }
    if(movement.movingLeft != 0){
        player.x += Math.sin(toRad(player.dir)) * moveSpeed;
        player.y -= Math.cos(toRad(player.dir)) * moveSpeed;
    }
    if(movement.movingRight != 0){
        player.x -= Math.sin(toRad(player.dir)) * moveSpeed;
        player.y += Math.cos(toRad(player.dir)) * moveSpeed;
    }

    context.clearRect(0,0,1000,1000);
    context.fillStyle = "rgb(0, 0, 255)";
    for(var y = 0; y < world.length; y++){
        for(var x = 0; x < world[y].length; x++){
            if(world[y][x] != 0){
                context.fillRect(x*unitSize,y*unitSize,unitSize-2,unitSize-2);
            }
        }
    }
    var hits = [];
    castRay(player.x,player.y,player.dir);
    for(var ang = player.dir-(fov/2); ang < player.dir+(fov/2); ang+=.05){
        rayh = castRay(player.x, player.y, ang);
        if(rayh.length != 0){
            hits.push(rayh);
        }
    }
    for(var i = 0; i < hits.length; i++){
        context.fillStyle = "rgb(255, 0, 0)";
        var rayh = hits[i];
        context.fillRect(rayh[0],rayh[1],5,5);
        var texture = new Image();
        texture = "brick.png";
        content.drawImage(texture, rayh[0], rayh[1], 5, 5);
    }
    // context.fillStyle = "rgb(0, 255, 0)";
    // context.fillRect(player.x,player.y,20,20);


    setTimeout(function() {
        requestAnimationFrame(draw);
    }, 1000 / fps);
}

window.requestAnimationFrame(draw);
