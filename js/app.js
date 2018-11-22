// Instructions of how to design the Hero class (the player object)

// Hero class
    // Constructor
        // Properties 
            // x position
            // y position
            // Sprite image

        // Methods (This method gets ran every cycle of the game engine loop from earlier - checking the Hero’s position on the board in relation to whatever we want)
            // Update position
                // Check collision here (when we have enemies on the screen and they collide with the hero)
                    // Did player x and y collide with enemy?
                // Check win here?
                    // Did x and y reach final title? (The end of the game in this case will be when the player reaches the top row of the grid.)
            // Render (This method will draw or redraw the hero to the board every loop through the main game loop.)
                // Draw player sprite on current x and y coordinate position
            // Handling the keyboard input (“handles” the input from the event listener on the user’s arrow keys)
                // Update player's x and y property according to the input
            // Reset Hero (When the player makes contact with an enemy or reaches the final tiles)
                // Set x and y to starting x and y (resetting the player’s x and y position back to the starting block)

class Hero {
    constructor() {
        // Properties 
        this.sprite = 'images/char-boy.png';    // Sprite image
        this.step = 101; // Distance between one block to another from the x axis
        this.jump = 83; // Distance between the blocks on the y axis.
        this.startX = this.step * 2; // Places the hero 2 blocks to the right (middle block) on the x axis
        this.startY = (this.jump * 4) + 55;    // Places the hero 5 blocks down from the top row. // Subtract 20 px off the y initial start location for centered position
        this.x = this.startX; // Modify the initial value of the x and y property to be the values of the startX and startY.
        this.y = this.startY;  
        this.victory = false;  
    }
    // Draw hero sprite on current x and y coord position
        render() {
            ctx.drawImage(Resources.get(this.sprite), this.x, this.y); //calls the drawImage method from the ctx (2d canvas) object with a few arguments
            // get method of the Resources object = returns a cached image of the sprite from the string url
    }
    
    /**
     * Update here's x and y property according to the input
     * 
     * @param {string} input - Direction to travel 
     */

    handleInput(input){
    // Modify the player’s x and y property based on what argument is passed as a parameter to this method
        switch(input) { // top left corner would be 0,0
            case 'left': // check the value of input and match it to the correct direction.
                if (this.x > 0) { // Checks if the hero’s x property is greater than 0 (the left edge of the board)
                    this.x -= this.step; //If it is greater than 0 continue left if it reaches the left edge (0) it will fail and won't continue 
                }
                 //Subtracting x would move the character left 
                break;
            case 'up': // y axis starts at the top
                if (this.y > 0) {
                    this.y -= this.jump; 
                }
                 //Decreasing y would move the character up
                break;
            case 'right': // Left most block starts at 0 // 4 steps would put us at the right edge
                if (this.x < this.step * 4) { 
                    this.x += this.step;
                }
                 //Adding to x would move the character right
                break; 
            case 'down':
                if (this.y < this.jump * 4) {
                    this.y += this.jump;
                }
                 //Increasing y would move the character down
                break;
        }
    }

    update() {
        // Update position
                // Check collision here (when we have enemies on the screen and they collide with the hero)
        for(let enemy of allEnemies) {
            // Did player x and y collide with enemy?
            if (this.y === enemy.y && (enemy.x + enemy.step / 2 > this.x && enemy.x < this.x + this.step /2 )) {
                this.reset(); // enemy.x + enemy.step (right side) is greater than the player’s this.x (left side)
                //Last, we check that the enemy.x (left side) is less than the player’s this.x + this.step (right side)
            }
            // Did player x and y collide with enemy?
                // Check win here?
                    // Did x and y reach final title? 
            if(this.y < 0) {
                this.victory = true;
                this.reset(); // Hero’s “y” property is equal to the top of the grid (0) + the center offset (55).
            }
        }              
    }

    reset() { // Reset hero
        // Set x and y to starting x and y
        this.y = this.startY;
        this.x = this.startX; 
    }
} 

// Enemy object constructor
// Enemies our player must avoid
var Enemy = function(x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    
    this.x = x;
    this.y = y + 55; //center //Adding 55 to the y axis for a more centered stroll
    this.speed = speed; 
    // x position
    // y position

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.step = 101; 
    this.boundary = this.step * 5; 
    this.resetPos = -this.step; // Setting it to one block off-screen
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) { //method (Because the enemy is controlled by the computer and not the player through keyboard inputs)
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    // If enemy is not passed boundary  (This method will check if the current position of this enemy not passed the screen edge)
    if(this.x < this.boundary) { // Checks that the enemy isn’t past the boundary
        // Move forward
        // Increment x by speed * dt (delta time for constant time)
        this.x += this.speed * dt; // 20 * dt , dt being the function parameter //Multiplying by dt gives the enemy a constant speed across the gameboard as the computer loops through the code in the game loop.
    }
    else {
        // Reset pos to start
        this.x = this.resetPos; 
    }     
};

// New Hero object (We only have a single player game and only need one brave hero, we only need to create a single Hero object)

// Init allEnemies array (an array to hold all of our undetermined number of enemies)
// For each enemy create and push new Enemy object into above array (fill this array by using a loop and for up to number of desired enemies create a new Enemy object and push it into the allEnemies array)


// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() { //this method renders the result of the previous method 
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y); //uses HTML Canvas method to draw the enemy sprite's new position to the game board
};

const player = new Hero(); //player already referenced in the engine.js file
const bug1 = new Enemy(-101, 0, 280); 
const bug2 = new Enemy(-101, 83, 300);
const bug3 = new Enemy((-101 * 2.5), 166, 300);
const bug4 = new Enemy((-101 * 2.5), 0, 280);
const allEnemies = [];
allEnemies.push(bug1, bug2, bug3, bug4); 

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) { //event handler attached to the document listening for keyup
    var allowedKeys = { //object 
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    }; // every keyboard key is attached to a certain number 

    player.handleInput(allowedKeys[e.keyCode]);
});
