window.onload = function(){

    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    	
    var fps = 100;

    var world = JSON.parse(document.getElementById("data").innerHTML);
    console.log(document.getElementById("data").innerHTML);
    var textures = ["static/brick.png", "static/test.jpg"];

    var unitSize = 80;
    var unitWidth = 10;

    var resolution = 3;
    var renderDistance = 500;

    var fov = 50;
    var player = {x:10,y:10,dir:0,mod:0};
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
                    return {x:x, y:y, textureID:textureNumber,castNumber:castNumber,direction:hitDirection, ang:angle};
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

        context.clearRect(0,0,400,400);

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
            var cc = hits[i].castNumber;
            var textureId = hits[i].textureID;
            var hitDirection = hits[i].direction;
            var distanceFromPlayer = Math.sqrt(Math.pow(player.x-hitx,2) + Math.pow(player.y-hity,2));
            distanceFromPlayer = distanceFromPlayer*Math.cos(toRad(player.dir) - toRad(hits[i].ang));
            var percievedHeight = renderDistance/distanceFromPlayer * 80;
            var xdraw = cc/fov * 20;
            var texture = new Image();
            texture.src = textures[textureId - 1];
            var adjustConstant = 8;
            var texturePercent;
            if(hitDirection == "ns") {
                texturePercent = 32 * (hity / (unitWidth * adjustConstant) - Math.floor(hity / (unitWidth * adjustConstant)));
            }else if(hitDirection == "ew"){
                texturePercent = 32 * (hitx / (unitWidth * adjustConstant) - Math.floor(hitx / (unitWidth * adjustConstant)));
            }
            context.drawImage(texture,texturePercent, 0, .01, 32, xdraw, 200 - percievedHeight/2, 2, percievedHeight);

        }

        setTimeout(function() {
            requestAnimationFrame(draw);
        }, 1000 / fps);
    }

    window.requestAnimationFrame(draw);

}
