var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var canvasscreen = document.getElementById("screen");
var contextscreen = canvasscreen.getContext("2d");

window.addEventListener("keydown", keypress_handler, false);
window.addEventListener("keyup", keyup_handler, false);

var world= [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 1, 0],
            [0, 1, 0, 0, 0],
            [0, 0, 0, 0, 0]
];
var unitSize = canvas.width/world.length;
var screenUnitSize = canvasscreen.width/world.length;

var speed = 3;
var fov = 75;
var player = {x:10,y:10,dir:90,mod:0};

function toDeg(radians){
    return (radians*180)/Math.PI;
}

function toRad(deg){
    return deg*(Math.PI/180);
}

//angle in degrees
function castRay(originx, originy, angle){
    var slope = Math.tan(toRad(angle));
    var results = [];
    for(var y = 0; y < world.length; y++){
        for(var x = 0; x < world[y].length; x++){
            if(world[y][x] != 0){
                var xmin = x*unitSize;
                var xmax = (x+1)*unitSize;
                var ymin = y*unitSize;
                var ymax = (y+1)*unitSize;
                //check if our line collides with these mins/maxs
                // y1=m(x2-x1)+y2
                var xminInt = slope*(xmin-originx)+originy;
                var xmaxInt = slope*(xmax-originx)+originy;
                var yminInt = (ymin-originy)/slope + originx;
                var ymaxInt = (ymax-originy)/slope + originx;

                if(xminInt < ymax && xminInt > ymin){
                        results.push([xmin, xminInt]);
                }
                if(xmaxInt < ymax && xmaxInt > ymin){
                        results.push([xmax, xmaxInt]);
                }
                if(ymaxInt < xmax && ymaxInt > xmin){
                        results.push([ymaxInt, ymax]);
                }
                if(yminInt < xmax && yminInt > xmin){
                        results.push([yminInt, ymin]);
                }
            }

        }
    }
    return results;
}

function keyup_handler(event) {
    if (event.keyCode == 87 || event.keyCode == 83) {
        player.mod = 0;
    }
}

function keypress_handler(event) {
    if (event.keyCode == 87) {
        player.mod = 1;
    }
    if (event.keyCode == 83) {
        player.mod = -1;
    }
    if (event.keyCode == 65) {
        player.dir -= 1;
    }
    if (event.keyCode == 68) {
        player.dir += 1;
    }
}

function draw(){
    if(player.dir == 0){
        player.dir = 360;
    }
    if(player.dir < 0){
        player.dir += player.dir * -1;
    }
    if(player.dir > 360){
        player.dir -= 360;
    }
    player.x += (speed * player.mod) * Math.cos(Math.PI / 180 * (player.dir));
    player.y += (speed * player.mod) * Math.sin(Math.PI / 180 * (player.dir));
    context.clearRect(0, 0, 1000, 1000);
    contextscreen.clearRect(0,0,1000,1000);
    context.fillStyle = "rgb(200, 200, 255)"
    contextscreen.moveTo(0,canvasscreen.height/2);
    contextscreen.lineTo(canvasscreen.width, canvasscreen.height/2);
    contextscreen.stroke();
    for(var y = 0; y < world.length; y++){
        for(var x = 0; x < world[y].length; x++){
            if(world[y][x] != 0){
                context.fillRect(x*unitSize,y*unitSize,unitSize-2,unitSize-2);
            }
        }
    }
    context.fillStyle = "rgb(0, 0, 0)";
    var hits = [];
    for(var ang = player.dir-(fov/2); ang < player.dir+(fov/2); ang++){
        hits = hits.concat(castRay(player.x, player.y, ang));
    }
    context.fillRect(player.x, player.y, unitSize/5, unitSize/5);
    contextscreen.fillStyle = "rgb(0, 0, 255)"
    for(var i = 0; i < hits.length; i++){
        var h = hits[i];
        var ang = toDeg(Math.atan((h[1]-player.y)/(h[0]-player.x)));
        var xloc = canvasscreen.width*(ang/fov);
        var distance = Math.sqrt(Math.pow(player.x-h[0]*screenUnitSize,2) + Math.pow(player.y-h[1]*screenUnitSize,2));
        var ph = (distance/canvasscreen.height)

        contextscreen.fillRect(xloc-15, canvasscreen.height/2-ph/2, 30, ph);
    }

    for(var i = 0; i < hits.length; i++){
        context.fillStyle = "rgb(255, 200, 200)"
        context.fillRect(hits[i][0], hits[i][1], 20, 20);
    }
    
    window.requestAnimationFrame(draw);
}
window.requestAnimationFrame(draw);


