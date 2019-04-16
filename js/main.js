class Game {
  constructor(interval){
    this.interval = interval;
    this.snake = [148, 149, 150];
    this.nextTile = 151;
    this.dot = this.returnRandom();
    this.lastTile = 0;
    this.direction = 'right';
    this.isPlaying  = false;
    this.time = 0;
  }
  //Find out where's the snake's head based on movement direction
  head(){
    if (this.direction === 'left' || 'up') { return this.snake[this.snake.length-1] } else return this.snake[0]
  }
  //Handles coloring of particular elements depending on provided args and type specifier
  colorize (elements, color){
    if(elements.length>1) {
      elements.forEach(e => {
        document.getElementById(`${e}`).style.backgroundColor = color
      });
    } else {
      document.getElementById(`${elements}`).style.backgroundColor = color
    }
  }
  move(){
    //select next tile which will be added into snake array during next move, considering direction in which we're moving
    //Change game state whenever snake reaches the borders

    //Firstly, check for collisions with self, then - check whether the dot will be acquired
    this.checkForCollisions();
    this.checkIfGotDot();
    switch(this.direction){
      case 'right':
        if(this.head()%20===0 && this.interval!==170){
          //If mode isn't set to easy and the head reaches any of the edges - game ends.
          this.isPlaying = false
          this.snake.push(this.snake[(this.snake.length-1)-1])
        } else if(this.head()%20===0 && this.interval===170) {
          //In easy mode it is possible to pass through the borders, and this is the function which handles it
          this.nextTile = this.snake[this.snake.length-1]-19
        } else {
          //Any other case - just moving by one tile
          this.nextTile = this.head() + 1;
        }
        break;
      case 'up':
        if(this.head()<=20 && this.interval!==170){
          this.isPlaying = false
          this.snake.push(this.snake[(this.snake.length-1)+20])
        } else if(this.head()<=20 && this.interval===170) {
          this.nextTile = this.snake[this.snake.length-1]+380
        } else {
          this.nextTile = this.head()  - 20;
        }
        break;
      case 'down':
        if(this.head()>=380 && this.interval!==170){
          this.isPlaying = false
          this.snake.push(this.snake[(this.snake.length-1)-20])
        } else if (this.head()>=380 && this.interval===170) {
          this.nextTile = this.snake[this.snake.length-1]-380
        } else {
          this.nextTile = this.head()  + 20;
        }
        break;
      case 'left':
        if((this.head()+19)%20===0 && this.interval!==170){
          this.isPlaying = false
          this.snake.push(this.snake[(this.snake.length-1)+1])
        } else if ((this.head()+19)%20===0 && this.interval===170) {
          this.nextTile = this.snake[this.snake.length-1]+19
        } else {
          this.nextTile = this.head()  - 1;
        }
        break;
    }
    //Add new element to snake while removing the last one and apply appropriate coloring
    this.snake.push(this.nextTile);
    this.lastTile = this.snake.shift();
    //Colorization of snake and last tile
    this.colorize(this.snake, '#3bff00');
    this.colorize(this.lastTile, 'black');
  }
  //Handle direction changing
  changeDirection(e){
    switch(e){
      case "ArrowUp":
        //Disable certain keys so it won't be possible to go in the direction opposite to current
        if(this.direction !== 'down') {
          this.direction = 'up'
        }
        break;
      case "ArrowRight":
        if(this.direction !== 'left') {
          this.direction = 'right'
        }
        break;
      case "ArrowLeft":
        if(this.direction !== 'right') {
          this.direction = 'left'
        }
        break;
      case "ArrowDown":
        if(this.direction !== 'up') {
          this.direction = 'down'
        }
        break;
    }
  }
  //Checks if the dot will be acquired during next iteration
  checkIfGotDot(){
    switch(this.direction){
      case 'up':
        if(this.head()-20 === this.dot)
          this.addDot();
        break;
      case 'down':
        if(this.head()+20 === this.dot)
          this.addDot();
        break;
      case 'left':
        if(this.head()-1 === this.dot)
          this.addDot();
        break;
      case 'right':
        if(this.head()+1 === this.dot)
          this.addDot();
        break;
    }
  }
  //Handling snake's collisions with itself - create new set containing only unique numbers from original snake
  //array, if lengths of both do not match - collision detected, end game.
  checkForCollisions(){
    const set = [...new Set(this.snake)]
    if(set.length!==this.snake.length) {
      this.endGame()
    }
  }

  //Handles adding eaten dot into snake array
  addDot(){
    this.snake.push(this.dot);
    this.dot = null
  }
  //Returns random number between min and max making sure that it's not placed within snake body
  returnRandom(){
    let random;
    function generateRandom(){random = Math.floor(Math.random() * (+400 - +1) + +1)}
    do {
      generateRandom()
    } while (this.snake.includes(random))
    return random
  }

  changeVisibility(arg){
    const game = document.getElementById('game')
    const dashboard = document.getElementById('dashboard')
    if(arg){
      game.style.visibility = 'visible'
      dashboard.style.visibility = 'hidden'
    } else {
      game.style.visibility = 'hidden'
      dashboard.style.visibility = 'visible'
    }
  }
  //Handles ending game
  endGame(){
    this.isPlaying = false
    this.changeVisibility(this.isPlaying)
    alert(`You have lost the game! You've managed to play for ${Math.floor(this.time/1000)} seconds and collected ${this.snake.length-3} tiles!`)
    //Clears the leftovers of last game
    const arr = [...new Array(400)].map((e,i)=>e=i+1)
    this.colorize(arr, 'black')
  }
  //Handles adding HTML content
  populateHTML(element, data) {
    document.getElementById(element).innerText = data
  }
  //Launches all vital game mechanisms and watchers
  play(){
    this.isPlaying = true
    this.changeVisibility(this.isPlaying)
    // this.colorize(this.dot, 'dot')
    const play = setInterval(() => {
      if(!this.isPlaying){
        clearInterval(play);
        this.endGame()
      } else {
        this.move();
        this.populateHTML('state', `Time: ${Math.floor(this.time/1000)} s Segments: ${this.snake.length-3}`);
        this.time += this.interval
        if (!this.dot) {
            this.dot = this.returnRandom()
        } else {
          this.colorize(this.dot, 'red')
        }
      }
    }, this.interval)
  }

}

