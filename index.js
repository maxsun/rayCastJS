//http://www.permadi.com/tutorial/raycast/rayc8.html
//no textures
// no collisions
//some kind of problem of moving

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var canvasscreen = document.getElementById("screen");
var contextscreen = canvasscreen.getContext("2d");

var turnSpeed = 0;

window.addEventListener("keydown", keypress_handler, false);
window.addEventListener("keyup", keyup_handler, false);

var world= [
            [0, 0, 0, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 2, 0, 0],
            [0, 0, 0, 0, 0]
];
var unitSize = canvas.width/world.length;
var rayHitWidth = 1;
var screenUnitSize = canvasscreen.width;

var speed = 3;
var fov = 50;
var player = {x:10,y:10,dir:90,mod:0};
var textures = ["brick.png", "test.jpg", "brick.png"];

function toDeg(radians){
    return (radians*180)/Math.PI;
}

function toRad(deg){
    return deg*(Math.PI/180);
}


//angle in degrees
function castRay(originx, originy, angle){
    realangle = angle
    angle -= 360*Math.floor(angle/360)
    var slope = Math.tan(toRad(angle));
    var results = [];
    for(var y = 0; y < world.length; y++){
        for(var x = 0; x < world[y].length; x++){
            if(world[y][x] != 0){
                var xmin = x*unitSize;
                var xmax = (x+1)*unitSize;
                var ymin = y*unitSize;
                var ymax = (y+1)*unitSize;
                var xminInt = slope*(xmin-originx)+originy;
                var xmaxInt = slope*(xmax-originx)+originy;
                var yminInt = (ymin-originy)/slope+originx;
                var ymaxInt = (ymax-originy)/slope+originx;

                //ns or ew
                var sidehit = "ns";
                var hitnumber = world[y][x];
                // console.log(hitnumber);

                if(xminInt < ymax && xminInt > ymin){
                    sidehit = "ew";
                    if(angle >= 270 && xmin >= originx && xminInt <= originy){
                        results.push([xmin, xminInt, realangle, sidehit, hitnumber]);
                    }
                    if(angle <= 90 && xmin >= originx && xminInt >= originy){
                        results.push([xmin, xminInt, realangle, sidehit, hitnumber]);
                    }
                    if(angle >= 90 && angle <= 180 && xmin <= originx && xminInt >= originy){
                        results.push([xmin, xminInt, realangle, sidehit, hitnumber]);
                    }
                    if(angle >= 180 && angle <= 270 && xmin <= originx && xminInt <= originy){
                        results.push([xmin, xminInt, realangle, sidehit, hitnumber]);
                    }
                }
                if(xmaxInt < ymax && xmaxInt > ymin){
                    sidehit = "ew";
                    if(angle >= 270 && xmax >= originx && xmaxInt <= originy){
                        results.push([xmax, xmaxInt, realangle, sidehit, hitnumber]);
                    }
                    if(angle <= 90 && xmax >= originx && xmaxInt >= originy){
                        results.push([xmax, xmaxInt, realangle, sidehit, hitnumber]);
                    }
                    if(angle >= 90 && angle <= 180 && xmax <= originx && xmaxInt >= originy){
                        results.push([xmax, xmaxInt, realangle, sidehit, hitnumber]);
                    }
                    if(angle >= 180 && angle <= 270 && xmax <= originx && xmaxInt <= originy){
                        results.push([xmax, xmaxInt, realangle, sidehit, hitnumber]);
                    }
                }
                if(ymaxInt < xmax && ymaxInt > xmin){
                    sidehit = "ns";
                    if(angle >= 270 && ymaxInt >= originx && ymax <= originy){
                        results.push([ymaxInt, ymax, realangle, sidehit, hitnumber]);
                    }
                    if(angle <= 90 && ymaxInt >= originx && ymax >= originy){
                        results.push([ymaxInt, ymax, realangle, sidehit, hitnumber]);
                    }
                    if(angle >= 90 && angle <= 180 && ymaxInt <= originx && ymax >= originy){
                        results.push([ymaxInt, ymax, realangle, sidehit, hitnumber]);
                    }
                    if(angle >= 180 && angle <= 270 && ymaxInt <= originx && ymax <= originy){
                        results.push([ymaxInt, ymax, realangle, sidehit, hitnumber]);
                    }
                }
                if(yminInt < xmax && yminInt > xmin){
                    sidehit = "ns";
                    if(angle >= 270 && yminInt >= originx && ymin <= originy){
                        results.push([yminInt, ymin, realangle, sidehit, hitnumber]);
                    }
                    if(angle <= 90 && yminInt >= originx && ymin >= originy){
                        results.push([yminInt, ymin, realangle, sidehit, hitnumber]);
                    }
                    if(angle >= 90 && angle <= 180 && yminInt <= originx && ymin >= originy){
                        results.push([yminInt, ymin, realangle, sidehit, hitnumber]);
                    }
                    if(angle >= 180 && angle <= 270 && yminInt <= originx && ymin <= originy){
                        results.push([yminInt, ymin, realangle, sidehit, hitnumber]);
                    }
                }
            }

        }
    }
    closest = [];
    closestdist = 1000000000000000;
    for(var i = 0; i < results.length; i++){
        var x = results[i][0];
        var y = results[i][1];
        var dist = Math.sqrt(Math.pow(originx-x,2)+Math.pow(originy-y,2));
        
        if(dist < closestdist){
            closestdist = dist;
            closest = results[i];
        }
    }
    return [closest];
}

function keyup_handler(event) {
    if (event.keyCode == 87 || event.keyCode == 83 || event.keyCode == 65 || event.keyCode == 68) {
        player.mod = 0;
    }
    if (event.keyCode == 37 || event.keyCode == 39){turnSpeed = 0;}
}

var direction;

function keypress_handler(event) {
    if (event.keyCode == 87) {
        direction = "forwards";
        player.mod = 1;
    }
    if (event.keyCode == 83) {
        direction = "backwards";
        player.mod = 1;
    }
    if (event.keyCode == 65) {
        direction = "left"
        player.mod = 1;
    }
    if (event.keyCode == 68) {
        direction = "right"
        player.mod = 1;
    }
    if (event.keyCode == 37) {
        turnSpeed = -1
    }
    if (event.keyCode == 39) {
        turnSpeed = 1;
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
    xchange = 1 * (speed * player.mod) * Math.cos(Math.PI / 180 * (player.dir));
    ychange = 1 * (speed * player.mod) * Math.sin(Math.PI / 180 * (player.dir));
    
    var previousCoords = {x:player.x, y:player.y};
    if(direction == "forwards"){player.x += xchange; player.y += ychange;}
    else if(direction == "backwards"){player.x -= xchange; player.y -= ychange;}
    else if(direction == "left"){player.y -= xchange; player.x += ychange;}
    else if(direction == "right"){player.y += xchange; player.x -= ychange;}

    //var gridx = Math.floor(player.x / (world.length * screenUnitSize));
    //var gridy = Math.floor(player.y / (world.length * screenUnitSize));
    var gridx = Math.floor((player.x+.5) /(60));
    var gridy = Math.floor((player.y+.5) /(60));

    //console.log(gridx, gridy)

    try{
        if(world[gridy][gridx] != 0){
            player.x = previousCoords.x;
            player.y = previousCoords.y;
        }
    }catch(error){
        player.x = previousCoords.x;
        player.y = previousCoords.y;
    }
    player.dir += turnSpeed;

    context.clearRect(0, 0, 1000, 1000);
    contextscreen.clearRect(0,0,1000,1000);
    context.fillStyle = "rgb(200, 200, 255)";

    for(var y = 0; y < world.length; y++){
        for(var x = 0; x < world[y].length; x++){
            if(world[y][x] != 0){
                context.fillRect(x*unitSize,y*unitSize,unitSize-2,unitSize-2);
            }
        }
    }
    contextscreen.fillStyle = "rgb(115, 93, 30)";
    contextscreen.fillRect(0, canvasscreen.height/2, canvasscreen.width, canvasscreen.height/2);
    contextscreen.fillStyle = "rgb(187, 234, 250)";
    contextscreen.fillRect(0, 0, canvasscreen.width, canvasscreen.height/2);
    context.fillStyle = "rgb(0, 0, 0)";
    var hits = [];
    for(var ang = player.dir-(fov/2); ang < player.dir+(fov/2); ang+=.05){
        rayh = castRay(player.x, player.y, ang);
        if(rayh[0].length != 0 && rayh.length != 0){
            hits = hits.concat(rayh);
        }
    }
    context.fillRect(player.x, player.y, unitSize/5, unitSize/5);
    contextscreen.fillStyle = "rgb(70, 70, 70)"
    for(var i = 0; i < hits.length; i++){
        var h = hits[i];
        var ang = h[2];
        var xloc = canvasscreen.width*((ang-player.dir)/fov);
        xloc += canvasscreen.width/2;
        var distance = Math.sqrt(Math.pow(player.x-h[0],2) + Math.pow(player.y-h[1],2));

        var perpDist = distance*Math.cos(toRad(player.dir-ang));
        var ph = screenUnitSize/perpDist;
        ph *= screenUnitSize/9;
        var texture = new Image();
        // console.log(h);
        if(h[4] == NaN){
            break;
        }
        texture.src = textures[h[4]-1];
        // contextscreen.fillRect(xloc, canvasscreen.height/2-ph/2, rayHitWidth, ph);
        
        if(h[3] == "ns"){
            var textureStretch = .15;
            var color = 32*((h[0]/screenUnitSize/textureStretch)-Math.floor(h[0]/screenUnitSize/textureStretch));
            contextscreen.drawImage(texture, color, 0, 1, 32, xloc, canvasscreen.height/2-ph/2, 1, ph);
            contextscreen.drawImage(texture, Math.floor(color), 0, 1, 32, xloc, canvasscreen.height/2-ph/2, 1, ph);

        }else{
            var textureStretch = .15;
            var color = 32*((h[1]/screenUnitSize/textureStretch)-Math.floor(h[1]/screenUnitSize/textureStretch));
            contextscreen.drawImage(texture, color, 0, 1.5, 32, xloc, canvasscreen.height/2-ph/2, 1, ph);
            contextscreen.drawImage(texture, Math.floor(color), 0, 1, 32, xloc, canvasscreen.height/2-ph/2, 1, ph);
        }
        
    }

    for(var i = 0; i < hits.length; i++){
        context.fillStyle = "rgb(255, 200, 200)"
        context.fillRect(hits[i][0], hits[i][1], 20, 20);
    }
    
    window.requestAnimationFrame(draw);
}
window.requestAnimationFrame(draw);


