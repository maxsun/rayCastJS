
# __RaycastJS__
### Try the demo: [here](http://maxsun.github.io/rayCastJS/).
Max Sun & Christian Wu

----

### __Goal__

Create a raycasting engine to render 3d environments based on a 2d array in pure Javascript. Our engine is capable of rendering textures, detecting collisions with walls, and we currently have it generate random maps upon every load. We were inspired by video games like Wolfenstein 3d.


----

### __What is Raycasting?__

Raycasting is the one of the most basic rendering algorithms. Raycasting generates a scene one horizontal strip at a time. For each pixel (or whatever our resolution is) we send a ray out from our camera at a the associated angle which returns what it hit and how far away it is (if it hit something).  We then use these values to draw the environment through the point of view of a camera. Hits that are farther away from us are drawn smaller, creating the illusion of perspective.

----
### __Files__
#### *index.js*
This Javascript file is the core of our engine. It uses HTML 5's canvas to draw each ray.

#### *index.html*
This HTML file contains our canvas, imports JQuery, and imports index.js. It also contains an invisible div that we use to store our map data.

#### *server.py*
This Python2.7 file uses Flask to host a simple server. We use this to host our demo on Heroku, and we also use it to connect our Javascript to CaveGeneration.py.

#### *caveGeneration.py*
This Python2.7 file was written by Andrew Wang, we use it to generate a 2d array that represents the cave in our demo.

----
### __Problems and Solutions__
*Extreme lag when displaying many blocks:*

In our rewrite of the raycast function, we test only for the first instance of a hit.  Previously we checked all points within render distance that rays hit, leading to an extreme lag in our code. This happened because the amount of rays we cast was directly proportional to the amount of blocks in the map. For every block, we cast multiple rays, checking to see if they were within the player’s FOV; this was simple to implement, but ended up backfiring when we began to add multiple blocks into the world. To overcome this, we changed our ray casting system to be constant: no matter the number of blocks, we always cast the same amount of rays, and therefore we can handle any number of blocks with the same amount of delay.

*Displaying the textures on the blocks (not solved in our current implementation):*

Displaying the actual texture image files on the blocks has proved to be the most complicated part of the project. In order to display the images, we not only have to identify which portion of the photo to display on which ray, but we also have to determine which face of the block our ray made contact with.  We fixed this through a complicated algorithm which basically redraws the ray as a line using the angle as a slope.  It then uses the direction this ray was going to approximate (very well) which side it intersected with.  We had this solution for a long time, but it wasn't working because we drew our lines using values not adjusted for unitSize, the difference between our map grid and our coordinate system.  This error took a long time to diagnose and left us very confused for many class periods.  We eventually fixed it purely intuitively.

*Fisheye effect distorting projected drawings:*

Because our camera calculated distances looking directly forwards, the field of view used to be slightly distorted due to something called the Fisheye effect.  The edges of the drawing would have shorter percieved heights because the distances were warped.  In order to account for this distortion, we recalculated the real height based upon the difference between the angle's ray and our camera's direction.  At the moment, the fisheye effect is almost completely accounted for.
