x = 100;
y = 100;
speed = 5;
angle = 0;
mod = 0;

var viewDistance = 10000;
var objectHeight = 500;

var fov = 60;

var world= [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
            [0, 1, 0, 1, 0, 0, 1, 0, 0, 0],
            [0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];


canvas = document.getElementById("minimap");
context = canvas.getContext("2d");

var squareSize = canvas.width/world.length;

window.addEventListener("keydown", keypress_handler, false);
window.addEventListener("keyup", keyup_handler, false);

var moveInterval = setInterval(function () {
    draw();
}, 30);

function castRay(originx, originy, a){
    var coords = []
    if(angle == 180 || angle == 90 || angle == 270 || angle == 225)
        angle += 1;
    
    var slope = Math.tan(angle * Math.PI/180).toFixed(4);
    for(var y  = 0; y < world.length; y++){
        for(var x = 0; x < world[y].length; x++){
                if(world[y][x] != 0){
                var left = squareSize*x;
                var right = squareSize*(x+1)
                var top = y*squareSize;
                var bot = (y+1)*squareSize;
                var sr = slope * (right-originx) + originy;
                var sl = slope * (left-originx) + originy;
                var st = (top-originy)/slope + originx;
                var sb = (bot-originy)/slope + originx;
                if((sr > bot && sr < top)||(st > left && st < right)||(sl > top && sl < bot)||(sb > left && sb < right)){
                    if(angle > 270 && (left > originx || right > originx) && (top < originy || bot < originy))
                        coords.push([x,y]);
                    if(angle < 90 && (left > originx || right > originx) && (top > originy || bot > originy))
                        coords.push([x,y]);
                    if(angle > 90 && angle < 180 && (left < originx || right < originx) && (top > originy || bot > originy))
                        coords.push([x,y]);
                    if(angle > 180 && angle < 270 && (left < originx || right < originx) && (top < originy || bot < originy))
                        coords.push([x,y]);
                }
            }
        }
    }
    
    return coords;
}

function draw() {
    context = canvas.getContext("2d");
    context.clearRect(0, 0, 500, 500);

    if(angle == 0){
        angle = 360;
    }
    if(angle < 0){
        angle += angle * -1;
    }
    if(angle > 360){
        angle -= 360;
    }
    var slope = Math.tan(angle * Math.PI/180).toFixed(4);
    var hits = castRay(x, y, angle);

    x += (speed * mod) * Math.cos(Math.PI / 180 * (angle));
    y += (speed * mod) * Math.sin(Math.PI / 180 * (angle));
    for(var i = 0; i < world.length; i++){
        for(var j = 0; j < world[i].length; j++){
            context.fillStyle = "rgb(200, 200, 255)"

            if(world[i][j] != 0){
                context.fillStyle = "rgb(100, 100, 255)";
                
            }
            for(var h  = 0; h < hits.length; h++){
                    var hit = hits[h];
                    if(hit[0] == j && hit[1] == i){
                        context.fillStyle = "rgb(0, 0, 255)"
                        break;
                    }
                }
                                
            
            context.fillRect(j*squareSize, i*squareSize, squareSize, squareSize);
        }
    }

    context.beginPath();
    context.moveTo(x,y);
    
    var yp = slope * x;
    yp = Math.min(yp, 5000);
    var xp = x;
    if(angle > 90 && angle <= 270){
        xp *= -1;
        yp *= -1;
    }
    context.lineTo(x+xp, y+yp);
    context.stroke();

    context.save();
    context.translate(x, y);
    context.rotate(Math.PI / 180 * angle);
    context.fillStyle = "rgb(200, 0, 0)";
    context.fillRect(0-squareSize/2, 0-squareSize/2, squareSize,squareSize);
    context.restore();
}

function keyup_handler(event) {
    if (event.keyCode == 87 || event.keyCode == 83) {
        mod = 0;
    }
}

function keypress_handler(event) {
    if (event.keyCode == 87) {
        mod = 1;
    }
    if (event.keyCode == 83) {
        mod = -1;
    }
    if (event.keyCode == 65) {
        angle -= 3;
    }
    if (event.keyCode == 68) {
        angle += 3;
    }
}

var view3d = document.getElementById("3d");
context3d = view3d.getContext("2d");

function draw3d(){
    context3d.clearRect(0, 0, 1000, 1000);
    context3d.moveTo(0,250);
    context3d.lineTo(500,250);
    context3d.stroke();
    var seenLocs = castRay(x, y, angle);
    
    for(var i = 0; i < seenLocs.length; i++){
        var boxX = seenLocs[i][0];
        var boxY = seenLocs[i][1];
        if(world[boxY][boxX] != 0){
            var distance = Math.sqrt(Math.pow(x-boxX*squareSize,2)+Math.pow(y-boxY*squareSize,2));
        }
    }
    window.requestAnimationFrame(draw3d);
}

window.requestAnimationFrame(draw3d);
