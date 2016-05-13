//strafes faster than moves forwards/backwards
//rendering/fading looks like shit
//make walls solid
//make textures variable
//add multiplayer

window.onload = function(){

    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    	
    var fps = 100;

    var world = JSON.parse(document.getElementById("data").innerHTML);

    var textures = [["static/textures/1/1.png", "static/textures/1/2.png", "static/textures/1/3.png", "static/textures/1/4.png", "static/textures/1/5.png"],
                    ["static/textures/2/1.png", "static/textures/2/2.png", "static/textures/2/3.png", "static/textures/2/4.png", "static/textures/2/5.png"],
                    ["static/textures/3/1.png", "static/textures/3/2.png", "static/textures/3/3.png", "static/textures/3/4.png", "static/textures/3/5.png"],
                    ["static/textures/4/1.png", "static/textures/4/2.png", "static/textures/4/3.png", "static/textures/4/4.png", "static/textures/4/5.png"],
                    ["static/textures/5/1.png", "static/textures/5/2.png", "static/textures/5/3.png", "static/textures/5/4.png", "static/textures/5/5.png"]];
    // var textures = ["static/textures/1.png", "static/textures/2.png","static/textures/3.png","static/textures/4.png","static/textures/5.png","static/textures/6.png"];

    var unitSize = 80;
    var unitWidth = 10;

    var resolution = 3;
    var renderDistance = 1000;

    var textureResolution = 64;

    var fov = 50;
    var player = {x:160,y:90,dir:50,mod:0};
    var turningSpeed = 3;
    var moveSpeed = 6;

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
    function castRay(originx, originy, angle, castNumber){
        var realangle = angle;
        angle -= 360*Math.floor(angle/360);
        var hitDirection = "ew";

        for(var distance = 0; distance < renderDistance; distance+=resolution){
            var x = originx + (Math.cos(toRad(angle)) * distance);
            var y = originy + (Math.sin(toRad(angle)) * distance);
            var gridx = x / unitSize;
            var gridy = y / unitSize;
            var flooredGridx = Math.floor(gridx);
            var flooredGridy = Math.floor(gridy);

            if(flooredGridx < world[0].length && flooredGridy < world.length && flooredGridx >= 0 && flooredGridy >= 0){
                if(world[flooredGridy][flooredGridx] != 0){
                    var textureNumber = world[flooredGridy][flooredGridx];
                    if(x>originx) {
                        yNormalized = (Math.tan(toRad(angle)) * (Math.floor(x/unitSize) - originx/unitSize) + originy/unitSize);
                        if((yNormalized > Math.floor(y/unitSize) && yNormalized < Math.ceil(y/unitSize))){
                            hitDirection = "ns";
                        }
                    }
                    if(x<originx) {
                        yNormalized = (Math.tan(toRad(angle)) * (Math.ceil(x/unitSize) - originx/unitSize) + originy/unitSize);
                        if((yNormalized > Math.floor(y/unitSize) && yNormalized < Math.ceil(y/unitSize))) {
                            hitDirection = "ns";
                        }
                    }
                    //console.log(hitDirection);
                    return {x:x, y:y, textureID:textureNumber,castNumber:castNumber,direction:hitDirection, ang:angle, gridx:gridx, gridy:gridy};
                }
            }
        }
        return [];
    }

    function draw(){

        player.dir += movement.turningRight;
        player.dir -= movement.turningLeft;

        var startPlayerX = player.x;
        var startPlayerY = player.y;

        if(movement.movingForward != 0){
            player.x += Math.cos(toRad(player.dir)) * moveSpeed * 1.6;
            player.y += Math.sin(toRad(player.dir)) * moveSpeed * 1.6;
        }
        if(movement.movingBackward != 0){
            player.x -= Math.cos(toRad(player.dir)) * moveSpeed * 1.6;
            player.y -= Math.sin(toRad(player.dir)) * moveSpeed * 1.6;
        }
        if(movement.movingLeft != 0){
            player.x += Math.sin(toRad(player.dir)) * moveSpeed;
            player.y -= Math.cos(toRad(player.dir)) * moveSpeed;
        }
        if(movement.movingRight != 0){
            player.x -= Math.sin(toRad(player.dir)) * moveSpeed;
            player.y += Math.cos(toRad(player.dir)) * moveSpeed;
        }

        var playerGridX = Math.floor(player.x / unitSize);
        var playerGridY = Math.floor(player.y / unitSize);

        if(world[playerGridY][playerGridX] != 0 ){
            player.x = startPlayerX;
            player.y = startPlayerY;
        }

        context.clearRect(0,0,canvas.width,canvas.height);
        context.fillStyle = "rgb(156,156,156)";
        context.fillRect(0,0,canvas.width, canvas.height/2);
        context.fillStyle = "rgb(180,180,180)";
        context.fillRect(0,canvas.height/2,canvas.width, canvas.height);

        var hits = [];
        var castCounter = 0;
        castRay(player.x,player.y,player.dir);
        for(var ang = player.dir-(fov/2); ang < player.dir+(fov/2); ang+=.05){
            rayh = castRay(player.x, player.y, ang, castCounter);
            if(rayh.length != 0){
                hits.push(rayh);
            }
            castCounter+=1;
        }

        for(var i = 0; i < hits.length; i++){
            //console.log(toRad(player.dir));
            var hitx = hits[i].x;
            var hity = hits[i].y;
            var gridx = hits[i].gridx;
            var gridy = hits[i].gridy;
            var cc = hits[i].castNumber;
            // cc += canvas.width/2;
            var textureId = hits[i].textureID;
            var hitDirection = hits[i].direction;
            var distanceFromPlayer = Math.sqrt(Math.pow(player.x-hitx,2) + Math.pow(player.y-hity,2));
            distanceFromPlayer = distanceFromPlayer*Math.cos(toRad(player.dir) - toRad(hits[i].ang));
            var percievedHeight = canvas.width/distanceFromPlayer * unitSize;
            percievedHeight *= canvas.height / canvas.width * 2;
            var xdraw = cc/fov * (canvas.width/fov * 3);
            var texture = new Image();

            var hash = 8.1219*Math.floor(gridx)*Math.floor(gridy);

            texture.src = textures[textureId - 1][Math.floor((hash-Math.floor(hash))*5)];
            var adjustConstant = 8;
            var texturePercent;
            if(hitDirection == "ns") {
                texturePercent = textureResolution * (hity / (unitWidth * adjustConstant) - Math.floor(hity / (unitWidth * adjustConstant)));
            }else if(hitDirection == "ew"){
                texturePercent = textureResolution * (hitx / (unitWidth * adjustConstant) - Math.floor(hitx / (unitWidth * adjustConstant)));
            }
            context.drawImage(texture,texturePercent, 0, .01, textureResolution, xdraw, canvas.height/2 - percievedHeight/2, 2, percievedHeight);
            var opacity = (distanceFromPlayer/renderDistance);
            
            if(distanceFromPlayer < renderDistance * .8){
                opacity = 0;
            }
            context.fillStyle = "rgba(180,180,180,"+opacity+")";
            context.fillRect( xdraw, canvas.height/2 - percievedHeight/2, 1, percievedHeight);
        }

        setTimeout(function() {
            requestAnimationFrame(draw);
        }, 1000 / fps);
    }

    window.requestAnimationFrame(draw);

}
