const targetWord = "GYOZA"; // 
let currentGuess = '';
let guesses = [];

function submitGuess() {
    const input_1 = document.getElementById('input-1');
    const input_2 = document.getElementById('input-2');
    const input_3 = document.getElementById('input-3');
    const input_4 = document.getElementById('input-4');
    const input_5 = document.getElementById('input-5');

    currentGuess = input_1.value + input_2.value + input_3.value + input_4.value + input_5.value;
    currentGuess = currentGuess.toUpperCase()
    
    if (guesses.length > 6) {
        alert(`Bis heute abend <3. Das Wort war: ${targetWord}`);
        return;
    }

    updateGameBoard(currentGuess);
    guesses.push(currentGuess);

    if (currentGuess === targetWord) {
        alert('Wohoooooo! Bis heute abend <3');
    } else if (guesses.length === 6) {
        alert(`Ein zusätzlicher Hasenversuch!)`);
    } 
}

function updateGameBoard() {
    const board = document.getElementById('game-board');

    // Gather guess from input fields
    const inputs = [
        document.getElementById('input-1'),
        document.getElementById('input-2'),
        document.getElementById('input-3'),
        document.getElementById('input-4'),
        document.getElementById('input-5')
    ];
    const guessArray = inputs.map(input => input.value);

    // Container for this guess
    const guessRow = document.createElement('div');
    guessRow.classList.add('d-flex', 'justify-content-center', 'mb-2');

    guessArray.forEach((letter, index) => {
        const cell = document.createElement('div');
        cell.textContent = letter;
        cell.classList.add('form-control', 'text-center', 'mx-1');
        cell.style.width = '50px';
        cell.style.pointerEvents = 'none';

        if (letter === targetWord[index]) {
            cell.classList.add('correct');
            inputs[index].classList.add('correct'); // Apply the correct class
        } else if (targetWord.includes(letter)) {
            cell.classList.add('present');
            inputs[index].classList.add('present'); // Apply the present class
        } else {
            cell.classList.add('absent');
            inputs[index].classList.add('absent'); // Apply the absent class
        }

        guessRow.appendChild(cell);
    });

    // Append the row to the board
    board.appendChild(guessRow);

    // Clear the input fields for next guess
    inputs.forEach(input => {
        input.value = '';
        input.classList.remove('correct', 'present', 'absent'); // Remove classes for next guess
    });
}

document.querySelectorAll('input[type="text"]').forEach((input, index, inputs) => {
    input.addEventListener('input', () => {
        // Convert to uppercase
        input.value = input.value.toUpperCase();

        // Automatically move to the next input if a character is typed and not the last input
        if (input.value.length === input.maxLength && index < inputs.length - 1) {
            inputs[index + 1].focus();
        }
    });
});