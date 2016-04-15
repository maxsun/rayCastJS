# __RAYCAST JS__
### Try the demo: [here](http://maxsun.github.io/rayCastJS/).
Max Sun & Christian Wu

----

### __Purpose__

To draw three dimensional scenes in a browser using javascript and raycasting.  Our first goal was to draw a cube that could be viewed at different angles using keyboard controls.  Eventually we incorporated multiple objects and textures, as well as tweaks to make movement smoother.  In the future we plan to add 2d sprites and optimize our code further.

----
### __Files__
#### *index.js*
The javascript runs all of the calculation inside of the screen (the canvas).  This includes raycasting, inputs and drawing.

##### Variables :

    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    	
    var fps = 30;
    var world = [[0,0,0,0,0],
                 [0,0,1,0,0],
                 [0,0,0,0,0],
                 [0,0,0,0,0],
                 [0,0,0,0,0]];
    
    var unitSize = canvas.width/world.length;
    var unitWidth = 10;
    
    var resolution = 3;
    var renderDistance = 400;
    
    var fov = 50;
    var player = {x:10,y:10,dir:0,mod:0};
    var turningSpeed = 3;
    var moveSpeed = 3;
    
    var movement = {turningRight:0, 
    turningLeft:0,movingRight:0,movingLeft:0,movingForward:0,movingBackward:0};

* World contains a 2d array which represents the blocks ‘filled’ in inside the world.  The elements in the array are block IDs, 0 represents air, 1 represents a missing texture, and 2 represents bricks.  In this case, there are two missing texture blocks next to each other.  In the future we will use Andrew’s map generation program to generate these maps semi-randomly.

* Resolution represents how often rays we cast check for objects.  With a higher number the environment becomes more blocky, but the program runs faster.  We found that 3 is a good balance between aesthetic and function.

* Render distance represents the maximum distance our rays will travel before they give up and return nothing.  A lower number makes the program run faster but shortens the maximum distance at which objects display on the screen.

* Fov dictates how wide the field of vision is.  With 50, you can see 50 degrees.  With a higher number, objects in more peripheral places are shown but the fisheye effect is increased because of the distortion in perceived distance. 

* Player contains the point (x, y) that the camera is located and what angle it is pointing at (dir).  Mod is not used at the moment.

* TurningSpeed and MoveSpeed determine how fast a player turns and moves

### Raycasting :

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
                    if(Math.cos(toRad(angle)) > 0) {
                        yNormalized = (Math.tan(toRad(angle)) * (Math.floor(x) - originx) + originy);
                        if((yNormalized > Math.floor(y) && yNormalized < Math.ceil(y))){
                            hitDirection = "ns";
                        }
                    }
                    if(Math.cos(toRad(angle)) < 0) {
                        yNormalized = (Math.tan(toRad(angle)) * (Math.ceil(x) - originx) + originy);
                        if((yNormalized > Math.floor(y) && yNormalized < Math.ceil(y))) {
                            hitDirection = "ns";
                        }
                    }
                    //console.log(hitDirection);
                    return {x:x, y:y, textureID:textureNumber,castNumber:castNumber,direction:hitDirection};
                }
            }
        }
        return [];
    }

* The function castRay takes arguments for the starting point of a ray and the angle at which it is firing out.  The first thing the function does is convert the angle to a degree angle between 0 and 360 degrees.  Then it enters a for loop where checks the origin point for a block.  If it doesn’t find one, it increments along the ray for resolution distance and then checks again, until it reaches render distance.  If it cannot find anything, it returns an empty array, but if it does find something then it returns a suite of variables, which help our calculations later.

* Right now, in order to draw texture properly, we need to determine if a ray hit a block on a east/west facing side or a north/south facing side.  This is a challenge because while it is easy to estimate which side a ray hit, it is hard to accurately determine this.

### Movement : 
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


* Using trigonometry and the angle the camera is pointing, we can move the player.  We use if statements instead of elifs because then if both forward and backwards are pressed the two cancel.  Later we plan to implement momentum and smoother controls, but for the moment movement is fairly basic.

### Drawing : 
    for(var i = 0; i < hits.length; i++){
        var hitx = hits[i].x;
        var hity = hits[i].y;
        var cc = hits[i].castNumber;
        var textureId = hits[i].textureID;
        var hitDirection = hits[i].direction;
        var distanceFromPlayer = Math.sqrt(Math.pow(player.x-hitx,2) + Math.pow(player.y-hity,2));
        var percievedHeight = renderDistance/distanceFromPlayer * 80;
        var xdraw = cc/fov * 20;
        var texture = new Image();
        texture.src = "brick.png";
        var adjustConstant = 8;
        var texturePercent;
        if(hitDirection == "ns") {
            texturePercent = 32 * (hity / (unitWidth * adjustConstant) - Math.floor(hity / (unitWidth * adjustConstant)));
        }else if(hitDirection == "ew"){
            texturePercent = 32 * (hitx / (unitWidth * adjustConstant) - Math.floor(hitx / (unitWidth * adjustConstant)));

        }
        context.drawImage(texture,texturePercent, 0, 1, 32, xdraw, 200 - percievedHeight/2, 1 , percievedHeight);

    }
    
* Our drawing system for RaycastJS is actually pretty simple. Our “cast ray” method returns the texture ID to display, as well as an ID called cast number which tell us how many rays were cast before it. It also gives us the X and Y coordinates of the ray hit. We use this data first to calculate the distance between us (the player) and the ray hit. From the distance, we can derive the perceived height of the ray hit (things farther away appear shorter than closer things). We can then use our cast number to figure out which portion of the screen the ray hit should be draw at. For example, if the cast number is 50% our FOV, we know to draw that ray hit in the center of the screen. If the cast number is 90% our FOV, we know that we need to draw that hit at .9 * the width of the screen. Using just these two values, we can draw our blocks.

----
### __Problems and Solutions__
*Extreme lag when displaying many blocks:*

In our rewrite of the raycast function, we test only for the first instance of a hit.  Previously we checked all points within render distance that rays hit, leading to an extreme lag in our code. This happened because the amount of rays we cast was directly proportional to the amount of blocks in the map. For every block, we cast multiple rays, checking to see if they were within the player’s FOV; this was simple to implement, but ended up backfiring when we began to add multiple blocks into the world. To overcome this, we changed our ray casting system to be constant: no matter the number of blocks, we always cast the same amount of rays, and therefore we can handle any number of blocks with the same amount of delay.

*Displaying the textures on the blocks (not solved in our current implementation):*

Displaying the actual texture image files on the blocks has proved to be the most complicated part of the project. In order to display the images, we not only have to identify which portion of the photo to display on which ray, but we also have to determine which face of the block our ray made contact with.
