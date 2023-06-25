window.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("game-of-life");
    const ctx = canvas.getContext("2d");

    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    const cellSize = 17;
    const rows = Math.floor(height / cellSize);
    const cols = Math.floor(width / cellSize);

    const grid = createGrid();
    let showComingSoon = true;

    drawInitialMessage();
    draw();

    setTimeout(() => {
        showComingSoon = false;
        animateGameOfLife();
    }, 5000);

    function createGrid() {
        const grid = new Array(cols);
        for (let i = 0; i < cols; i++) {
            grid[i] = new Array(rows).fill(0);
        }
        return grid;
    }

    function drawInitialMessage() {
        const message = "COMING SOON";
        const initialX = Math.floor((cols - message.length) / 7);
        const initialY = Math.floor(rows / 2) - 2;

        let x = initialX;
        for (let i = 0; i < message.length; i++) {
            const char = message.charAt(i).toUpperCase();
            const pattern = getPattern(char);

            let y = initialY;
            for (let row = 0; row < pattern.length; row++) {
                const rowData = pattern[row];
                let col = 0;
                for (let pixel = 0; pixel < rowData.length; pixel++) {
                    if (rowData[pixel] === "1") {
                        grid[x + col][y] = 1;
                    }
                    col++;
                }
                y++;
            }

            x += pattern[0].length + 1;
        }
    }

    function getPattern(char) {
        const patterns = {
            "C": [
                "11111",
                "10000",
                "10000",
                "10000",
                "10000",
                "11111"
            ],
            "O": [
                "01110",
                "10001",
                "10001",
                "10001",
                "01110"
            ],
            "M": [
                "10001",
                "11011",
                "10101",
                "10001",
                "10001"
            ],
            "I": [
                "11111",
                "00100",
                "00100",
                "00100",
                "11111"
            ],
            "N": [
                "10001",
                "11001",
                "10101",
                "10011",
                "10001"
            ],
            "G": [
                "01110",
                "10001",
                "10000",
                "10111",
                "01111"
            ],
            "S": [
                "01111",
                "10000",
                "01110",
                "00001",
                "11110"
            ],
            " ": [
                "00000",
                "00000",
                "00000",
                "00000",
                "00000"
            ]
        };

        return patterns[char] || patterns[" "];
    }

    //BLACK AND WHITE VERSION
    /*
    function draw() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                const x = i * cellSize;
                const y = j * cellSize;

                if (grid[i][j] === 1) {
                    const opacity = showComingSoon ? 1 : Math.random() * 0.5 + 0.5;
                    ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
                    ctx.fillRect(x, y, cellSize, cellSize);
                }
            }
        }
    }
    */

    //COLORED VERSION

    function draw() {
        ctx.clearRect(0, 0, width, height);
    
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                const x = i * cellSize;
                const y = j * cellSize;
    
                if (grid[i][j] === 1) {
                    const opacity = showComingSoon ? 1 : Math.random() * 0.5 + 0.5;
                    const color = `rgba(${getRandomRGB()}, ${getRandomRGB()}, ${getRandomRGB()}, ${opacity})`;
                    ctx.fillStyle = color;
                    ctx.fillRect(x, y, cellSize, cellSize);
                }
            }
        }
    }
    
    function getRandomRGB() {
        return Math.floor(Math.random() * 256);
    }
    

    function update() {
        const nextGrid = createGrid();

        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                const neighbors = countNeighbors(i, j);

                if (grid[i][j] === 1) {
                    if (neighbors < 2 || neighbors > 3) {
                        nextGrid[i][j] = 0;
                    } else {
                        nextGrid[i][j] = 1;
                    }
                } else {
                    if (neighbors === 3) {
                        nextGrid[i][j] = 1;
                    } else {
                        nextGrid[i][j] = 0;
                    }
                }
            }
        }

        grid.splice(0, grid.length);
        for (let i = 0; i < cols; i++) {
            grid.push(nextGrid[i].slice());
        }
    }

    function countNeighbors(x, y) {
        let sum = 0;
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                const col = (x + i + cols) % cols;
                const row = (y + j + rows) % rows;
                sum += grid[col][row];
            }
        }
        sum -= grid[x][y];
        return sum;
    }

    function animateGameOfLife() {
        setInterval(() => {
            update();
            draw();
        }, 100);
    }
});
