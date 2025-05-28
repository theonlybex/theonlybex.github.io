document.addEventListener('DOMContentLoaded', () => {
    // Ensure the page starts at the top
    window.scrollTo(0, 0);

    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.7
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            targetSection.scrollIntoView({ behavior: 'smooth' });
        });
    });
});

// Snake Game code (unchanged)
const gameBoard = document.getElementById('gameBoard');
const ctx = gameBoard.getContext('2d');
const scoreText = document.getElementById('scoreText');
const startButton = document.getElementById('startButton');
const gridSize = 20;
const tileCount = 20;
let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 15 };
let dx = 0;
let dy = 0;
let score = 0;
let gameLoop;

function drawGame() {
    clearBoard();
    moveSnake();
    drawSnake();
    drawFood();
    checkCollision();
    updateScore();
}

function clearBoard() {
    ctx.fillStyle = '#fbfbfd';
    ctx.fillRect(0, 0, gameBoard.width, gameBoard.height);
}

function drawSnake() {
    ctx.fillStyle = '#0071e3';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });
}

function drawFood() {
    ctx.fillStyle = '#ff3b30';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        score++;
        generateFood();
    } else {
        snake.pop();
    }
}

function generateFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
}

function checkCollision() {
    const head = snake[0];
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
    }
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
        }
    }
}

function gameOver() {
    clearInterval(gameLoop);
    alert(`Game Over! Your score: ${score}`);
    snake = [{ x: 10, y: 10 }];
    dx = 0;
    dy = 0;
    score = 0;
    startButton.style.display = 'block';
}

function updateScore() {
    scoreText.textContent = `Score: ${score}`;
}

function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const keyPressed = event.keyCode;
    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingRight = dx === 1;
    const goingLeft = dx === -1;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -1;
        dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -1;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 1;
        dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 1;
    }
}

function startGame() {
    gameLoop = setInterval(drawGame, 100);
    startButton.style.display = 'none';
}

document.addEventListener('keydown', changeDirection);
startButton.addEventListener('click', startGame);

// Previous runHelloWorld and runBitProgram functions remain unchanged
function runHelloWorld() {
    const text = 'Hello, World!';
    let index = 0;
    const speed = 100;
    const output = document.getElementById('output');
    output.textContent = '';

    function typeWriter() {
        if (index < text.length) {
            output.textContent += text.charAt(index);
            index++;
            setTimeout(typeWriter, speed);
        }
    }

    typeWriter();
}

function runBitProgram() {
    const output = document.getElementById('bit-output');
    const result = `
PUNCTUATION ;
     PUNCTUATION ;
          PUNCTUATION :=
               IDENTIFIER y
               PUNCTUATION +
                    PUNCTUATION +
                         INTEGER 2
                         INTEGER 2
                    INTEGER 2
          PUNCTUATION :=
               IDENTIFIER x
               INTEGER 5
     RESERVED_KEYWORDS while
          PUNCTUATION -
               IDENTIFIER y
               INTEGER 1
          PUNCTUATION ;
               PUNCTUATION :=
                    IDENTIFIER x
                    PUNCTUATION +
                         IDENTIFIER x
                         INTEGER 1
               PUNCTUATION :=
                    IDENTIFIER y
                    PUNCTUATION -
                         IDENTIFIER y
                         INTEGER 1
    `;

    output.textContent = '';
    let index = 0;
    const speed = 10;

    function typeWriter() {
        if (index < result.length) {
            output.textContent += result.charAt(index);
            index++;
            setTimeout(typeWriter, speed);
        }
    }

    typeWriter();
}

document.addEventListener('DOMContentLoaded', () => {
    const storyText = document.getElementById('storyText');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');

    // The space-themed story to be typed out
    const spaceStory = `In the vastness of space, stars flicker like distant memories...
Beyond the edge of the galaxy, new frontiers await exploration...
And just like the infinite expanse, the journey of learning and creating never ends.
Welcome to the universe of development.`;

    let charIndex = 0;
    const typingSpeed = 50; // Speed for typing each character

    // Function to simulate typing effect
    function typeStory() {
        if (charIndex < spaceStory.length) {
            storyText.textContent += spaceStory.charAt(charIndex);
            charIndex++;
            setTimeout(typeStory, typingSpeed);
        } else {
            // Once the typing finishes, fade in the sections
            setTimeout(() => {
                sections.forEach(section => section.classList.add('active'));  // Ensure sections fade in
            }, 1000); // Delay before activating the sections
        }
    }

    // Start the typing animation
    typeStory();

    // IntersectionObserver to detect when sections come into view and fade in
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');  // Add 'active' class when in view
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);  // Observe each section
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            targetSection.scrollIntoView({ behavior: 'smooth' });
        });
    });
});

// Calculator functions

let displayValue = '';

function clearDisplay() {
    displayValue = '';
    document.getElementById('calc-display').value = displayValue;
}

function deleteLast() {
    displayValue = displayValue.slice(0, -1);
    document.getElementById('calc-display').value = displayValue;
}

function appendNumber(number) {
    displayValue += number;
    document.getElementById('calc-display').value = displayValue;
}

function appendOperator(operator) {
    const lastChar = displayValue.charAt(displayValue.length - 1);
    if (['+', '-', '*', '/'].includes(lastChar)) {
        displayValue = displayValue.slice(0, -1); // Replace last operator
    }
    displayValue += operator;
    document.getElementById('calc-display').value = displayValue;
}

function calculate() {
    try {
        displayValue = eval(displayValue).toString();
        document.getElementById('calc-display').value = displayValue;
    } catch (e) {
        displayValue = 'Error';
        document.getElementById('calc-display').value = displayValue;
    }
}

