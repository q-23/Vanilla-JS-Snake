let snake;

//Creation of modes
const easy = document.getElementById('easy');
easy.addEventListener('click', ()=>{
  snake = new Game('easy')
  snake.play()
})


const normal = document.getElementById('normal');
normal.addEventListener('click', ()=>{
  snake = new Game('normal')
  snake.play()
})


const hard = document.getElementById('hard');
hard.addEventListener('click', ()=>{
  snake = new Game('hard')
  snake.play()
})
//Handles keypresses
window.addEventListener('keydown',(e)=> {snake.changeDirection(e.code); snake.checkIfGotDot()} )

