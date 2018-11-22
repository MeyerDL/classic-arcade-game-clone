/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine makes the canvas' context (ctx) object globally available to make 
 * writing app.js a little simpler to work with.
 */

var Engine = (function(global) { //IIFE (immediatley-invoked function expression)
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document, //window property that returns reference to the document contained within our window
        win = global.window, //window property that points to itself - the window object
        canvas = doc.createElement('canvas'), //canvas element that holds the game content
        ctx = canvas.getContext('2d'), //
        lastTime,
        id;

    const modal = document.querySelector('.modal-bg');
    const replay = document.querySelector('.modal-button'); 
    
    canvas.width = 505; //dimensions for the game board through the canvas properties 
    canvas.height = 606;
    doc.body.appendChild(canvas); //append the canvas to the document

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() { //main function that handles the game loop
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(), //variable that calls the Date object now method
            dt = (now - lastTime) / 1000.0; //miliseconds 
            //will be able to calculate the dfference in time between 2 points 
            //dt gives us our constant time between frames so that regardless of how fast or slow a computer is, the user will experience the same game speed

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt); //call an update with our created dt varaiable - need to smooth out the animations 
        render(); //call the render function to draw the changes made after update

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now; // set lastTime to the old now variable 

        replay.addEventListener("click", event => {
            
            const clickTarget = event.target;
            modal.classList.toggle("hide");
            player.reset();
            player.victory = false;
            win.requestAnimationFrame(main);
     });

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        if (player.victory === true) {
            win.cancelAnimationFrame(id);
            modal.classList.toggle('hide');
            modal.classList.toggle("show"); 
        } 
        else {
            id = win.requestAnimationFrame(main); //window method that performs the drawing to the canvas of what we rendered earlier and takes a callback argument of main
        }
    }


    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() { // function we call to a reset function
        reset();
        lastTime = Date.now(); // an initial value assignment to lastTime 
        main(); //first call to main, triggering the game loop
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) { //update function we call from the main
        updateEntities(dt); //delta time - pass this parameter to the updateEntities function
        // checkCollisions();
    }

    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) { //loop through each enemy in allEnemies array
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.update(); //call to the player object's update method
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [ //array holding the different background images of our game
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6, //number of rows our game board will contain which is 6
            numCols = 5, //number of cols each row will have which is 5
            row, col; //empty variables for later assignment
        
        // Before drawing, clear existing canvas
        ctx.clearRect(0,0,canvas.width,canvas.height) //method to the CanvasRenderingContext2D object established earlier,
        //takes 4 parameters, the x and y for the starting position and the canvas width and height

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) { //for loops 
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83); //blocks width is 101 pixels and the blocks height is 83 pixels
                //Another method of the CanvasRenderingContext2D object for drawing the rowImages at designated x&y with a width (101) and height (83).
            }
        }

        renderEntities(); //make a call to render our game units
    }

    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allEnemies.forEach(function(enemy) {
           enemy.render(); //calling the class object’s render method for both the enemy and player object.
        });

        player.render();
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
        // noop
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([ //Loads an array of our canvas images using a public method that will load them into cache
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png'
    ]);
    Resources.onReady(init); //public method on the resources object 
    //takes in a callback to execute after the Resource utility finishes loading the array of images. This callback is our init game function which set’s everything in motion

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx; //Add a property to the window object which holds our 2d context for easy access in the global scope
})(this); //global parameter
//where our IIFE is called with an argument of this
//scope refers to the global window object 
//parameter global above is this object window

