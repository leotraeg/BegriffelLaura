
const wordDictionary = {
    "30.11": "RESET", 
    "01.12": "GLANZ",
    "02.12": "KUGEL",
    "03.12": "PIEKS", 
    "04.12": "RODEL",
    "05.12": "SUESS", 
    "06.12": "HONIG", 
    "07.12": "BAUCH", 
    "08.12": "PFOTE", 
};

const giftDictionary = {
    "30.11": "RESET",
    "01.12": "Kerze", 
    "02.12": "Weihnachtskugeln",
    "03.12": "Kaktus", 
    "04.12": "Schlitten",
    "05.12": "Zuckerstange", 
    "06.12": "Lebkuchenmann",
    "07.12": "Weihnachtsbaum", 
    "08.12": "Hase", 
}

// --- Funktion zum Abrufen des heutigen Zielworts ---
function getTargetWord(today) {    
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Monate sind 0-basiert
    const dateKey = `${day}.${month}`;

    const word = wordDictionary[dateKey];
    
    if (word && word.length === 5) {
        return word.toUpperCase();
    } else {
        // Fallback-Wort, falls das Datum außerhalb des Dictionaries liegt oder das Wort nicht 5 Buchstaben hat
        // Am besten ein Wort, das nicht vorkommt, um zu verhindern, dass man es aus Versehen errät
        console.error(`Kein 5-Buchstaben-Wort für das Datum ${dateKey} gefunden.`);
        return "ERROR"; 
    }
}
function getGiftWord(today) {    
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Monate sind 0-basiert
    const dateKey = `${day}.${month}`;

    return giftDictionary[dateKey];
}

// Das aktuelle Zielwort wird einmal beim Laden der Seite gesetzt.
const targetWord = getTargetWord(new Date()); 
const giftWord = getGiftWord(new Date());
const maxGuesses = 6;
let currentGuess = '';
let guesses = [];
// Funktion zum Zurücksetzen des Spiels, wenn das Limit erreicht ist
function resetGame() {
    guesses = []; // Alle geratenen Wörter löschen
    currentGuess = '';
    
    // Die Tafel (Game Board) leeren
    const board = document.getElementById('game-board');
    if (board) {
        board.innerHTML = '';
    }
    
    // Alle Eingabefelder leeren
    const inputs = [
        document.getElementById('input-1'),
        document.getElementById('input-2'),
        document.getElementById('input-3'),
        document.getElementById('input-4'),
        document.getElementById('input-5')
    ];
    inputs.forEach(input => {
        input.value = '';
        input.classList.remove('correct', 'present', 'absent');
    });

    // Ersten Input-Fokus setzen
    if (inputs.length > 0) {
        inputs[0].focus();
    }
}


// *** HAUPTFUNKTIONEN ***

function submitGuess() {
    const input_1 = document.getElementById('input-1');
    const input_2 = document.getElementById('input-2');
    const input_3 = document.getElementById('input-3');
    const input_4 = document.getElementById('input-4');
    const input_5 = document.getElementById('input-5');
    
    currentGuess = input_1.value + input_2.value + input_3.value + input_4.value + input_5.value;
    currentGuess = currentGuess.toUpperCase();

    // Validierung (sicherstellen, dass 5 Buchstaben eingegeben wurden)
    if (currentGuess.length !== 5) {
        alert("Bitte gib ein 5-Buchstaben-Wort ein!");
        return;
    }
      
    // Das geratene Wort zur Liste hinzufügen und die Tafel aktualisieren
    guesses.push(currentGuess);
    updateGameBoard(currentGuess); // Parameter für das Wort übergeben

    if (currentGuess === targetWord) {
        alert(`🎉 Heute ist das ${giftWord} Säckchen dran! ❤️`);
    } else if (guesses.length === maxGuesses ) {
        alert(`Das Wort bleibt geheim, aber versuchs einfach nochmal :) Viel Glück!`);
        resetGame();
    } 
    
}

function updateGameBoard(currentGuess) {
    const board = document.getElementById('game-board');

    // Gather guess from input fields (Die Eingabefelder werden hier nur zum Auslesen der Buchstaben verwendet)
    const inputs = [
        document.getElementById('input-1'),
        document.getElementById('input-2'),
        document.getElementById('input-3'),
        document.getElementById('input-4'),
        document.getElementById('input-5')
    ];
    // **WICHTIG:** Sicherstellen, dass die Buchstaben aus dem übergebenen `currentGuess` verwendet werden,
    // falls die Input-Werte bereits in `submitGuess` verändert wurden.
    const guessArray = currentGuess.split(''); 

    // Container for this guess
    const guessRow = document.createElement('div');
    guessRow.classList.add('d-flex', 'justify-content-center', 'mb-2');

    // **Zählweise für Vorkommen im Zielwort**, um Mehrfachnennungen korrekt zu behandeln (wie im echten Wordle)
    const targetWordLetters = targetWord.split('');
    const targetLetterCounts = {};
    for (const char of targetWordLetters) {
        targetLetterCounts[char] = (targetLetterCounts[char] || 0) + 1;
    }
    
    // **Erster Durchgang: Korrekte (Grüne) Buchstaben identifizieren und Zähler anpassen**
    const matchResults = Array(5).fill(''); // Speichert 'correct', 'present' oder 'absent'
    
    guessArray.forEach((letter, index) => {
        if (letter === targetWordLetters[index]) {
            matchResults[index] = 'correct';
            targetLetterCounts[letter]--; // Zähler für diesen Buchstaben dekrementieren
        }
    });

    // **Zweiter Durchgang: Vorhandene (Gelbe) Buchstaben identifizieren**
    guessArray.forEach((letter, index) => {
        if (matchResults[index] === 'correct') {
            // Bereits als 'correct' markiert, überspringen
            return;
        }

        if (targetWordLetters.includes(letter) && targetLetterCounts[letter] > 0) {
            matchResults[index] = 'present';
            targetLetterCounts[letter]--; // Zähler dekrementieren, um Mehrfachzählungen zu verhindern
        } else {
            matchResults[index] = 'absent';
        }
    });
    
    // **Dritter Durchgang: Visualisierung**
    guessArray.forEach((letter, index) => {
        const cell = document.createElement('div');
        cell.textContent = letter;
        cell.classList.add('form-control', 'text-center', 'mx-1', matchResults[index]);
        cell.style.width = '50px';
        cell.style.pointerEvents = 'none';

        guessRow.appendChild(cell);
        
        // **WICHTIG:** Die Klassen für die **aktuellen Inputfelder** (Keyboard-Feedback) setzen/entfernen
        // Dies funktioniert nur, wenn Sie die Klassen für das "virtuelle Keyboard" oder die Eingabefelder separat steuern.
        // Im Wordle-Stil sollte Feedback normalerweise am **Keyboard** und am **geratenen Wort** erfolgen. 
        // Ich habe das direkte Anwenden der Klassen auf die Inputfelder **entfernt**, da diese in der nächsten Zeile geleert werden 
        // und das Feedback nur für die **neue Zeile** relevant ist.

    });

    // Append the row to the board
    board.appendChild(guessRow);

    // Clear the input fields for next guess
    inputs.forEach(input => {
        input.value = '';
        input.classList.remove('correct', 'present', 'absent'); // Sicherstellen, dass sie leer sind
    });

    // Fokus auf das erste Feld setzen
    if (inputs.length > 0) {
        inputs[0].focus();
    }
}

// Event-Listener für das Auto-Fokus-Wechseln
document.querySelectorAll('input[type="text"]').forEach((input, index, inputs) => {
    input.addEventListener('input', () => {
        // Convert to uppercase
        input.value = input.value.toUpperCase();

        // Überprüfen, ob nur ein Buchstabe eingegeben wurde
        if (input.value.length > 1) {
            input.value = input.value.charAt(0); // Nur den ersten Buchstaben nehmen
        }

        // Automatically move to the next input if a character is typed and not the last input
        if (input.value.length === 1 && index < inputs.length - 1) {
            inputs[index + 1].focus();
        }
    });
});