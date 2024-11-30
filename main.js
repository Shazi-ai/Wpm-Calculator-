// Selecting elements from the DOM
const typingText = document.querySelector(".typing-text p");
const inputField = document.querySelector(".input-field");
const tryAgainBtn = document.querySelector("button");
const timeTag = document.querySelector(".time span b");
const mistakeTag = document.querySelector(".mistake span");
const wpmTag = document.querySelector(".wpm span");
const cpmTag = document.querySelector(".cpm span");

let timer;
const maxTime = 60;
let timeLeft = maxTime;
let charIndex = 0;
let mistakes = 0;
let isTyping = false;

// Array of paragraphs for typing test
const paragraphs = [
    "The quick brown fox jumps over the lazy dog. It was an incredibly sunny day, and all the animals in the forest were having a wonderful time.",
    "She sells seashells by the seashore. The shells she sells are surely seashells. So if she sells shells on the seashore, I'm sure she sells seashore shells.",
    "How much wood would a woodchuck chuck if a woodchuck could chuck wood? He would chuck as much wood as a woodchuck would if a woodchuck could chuck wood.",
    "A quick movement of the enemy will jeopardize six gunboats. All the gunboats were ready for action as they navigated through the choppy waters.",
    "Pack my box with five dozen liquor jugs. Jack quickly picked up the box and carefully placed each jug inside, ensuring none of them would break."
];

// Function to load a random paragraph
function randomParagraph() {
    const randIndex = Math.floor(Math.random() * paragraphs.length);
    typingText.innerHTML = paragraphs[randIndex].split("").map(char => `<span>${char}</span>`).join("");
    typingText.querySelector("span").classList.add("active");

    // Set focus to input field once random paragraph is loaded
    document.addEventListener('keydown', () => inputField.focus());
    typingText.addEventListener('click', () => inputField.focus());
}

// Function to handle typing input
function initTyping() {
    const characters = typingText.querySelectorAll("span");
    const typedChar = inputField.value.split("")[charIndex];

    if (charIndex < characters.length && timeLeft > 0) {
        if (!isTyping) {
            timer = setInterval(startTimer, 1000);
            isTyping = true;
        }

        if (typedChar == null) { // Handle backspace
            if (charIndex > 0) {
                charIndex--;
                if (characters[charIndex].classList.contains("incorrect")) {
                    mistakes--;
                }
                characters[charIndex].classList.remove("correct", "incorrect");
            }
        } else { // Handle correct and incorrect characters
            if (characters[charIndex].innerText === typedChar) {
                characters[charIndex].classList.add("correct");
            } else {
                mistakes++;
                characters[charIndex].classList.add("incorrect");
            }
            charIndex++;
        }

        characters.forEach(span => span.classList.remove("active"));
        if (charIndex < characters.length) {
            characters[charIndex].classList.add("active");
        }

        // Calculate WPM and CPM
        const wpm = Math.round((((charIndex - mistakes) / 5) / (maxTime - timeLeft)) * 60) || 0;
        const cpm = charIndex - mistakes;

        // Update tags with current values
        mistakeTag.innerText = mistakes;
        wpmTag.innerText = wpm;
        cpmTag.innerText = cpm;
    } else {
        clearInterval(timer);
        inputField.value = "";
        showResults();
    }
}

// Function to start the timer
function startTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        timeTag.innerText = timeLeft;
    } else {
        clearInterval(timer);
        inputField.disabled = true;
        showResults();
    }
}

// Function to reset the game
function resetGame() {
    randomParagraph();
    inputField.value = "";
    clearInterval(timer);
    timeLeft = maxTime;
    charIndex = mistakes = 0;
    isTyping = false;
    timeTag.innerText = timeLeft;
    mistakeTag.innerText = 0;
    wpmTag.innerText = 0;
    cpmTag.innerText = 0;
    inputField.disabled = false;
    inputField.focus();
    document.querySelector(".results").classList.remove("show");
}

// Function to display results and show emojis
function showResults() {
    const results = document.querySelector(".results");
    results.classList.add("show");

    const resultParts = results.querySelectorAll("span");
    resultParts.forEach((part, index) => {
        setTimeout(() => {
            part.classList.add("show");
        }, index * 500);
    });

    showEmojis(parseInt(wpmTag.innerText));
}

// Function to display emojis based on score
function showEmojis(score) {
    let emoji;
    if (score >= 80) {
        emoji = '🚀'; // Outstanding
    } else if (score >= 50) {
        emoji = '👍'; // Great job
    } else if (score >= 30) {
        emoji = '🙂'; // Keep practicing
    } else {
        emoji = '🙁'; // Needs improvement
    }

    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            const emojiSpan = document.createElement("span");
            emojiSpan.innerText = emoji;
            emojiSpan.style.position = 'absolute';
            emojiSpan.style.left = `${Math.random() * 100}%`;
            emojiSpan.style.top = `${Math.random() * 100}%`;
            emojiSpan.style.fontSize = '2rem';
            emojiSpan.style.transition = 'transform 0.5s, opacity 0.5s';
            document.body.appendChild(emojiSpan);

            setTimeout(() => {
                emojiSpan.style.transform = 'translateY(-50px)';
                emojiSpan.style.opacity = '0';
            }, 500);

            setTimeout(() => {
                emojiSpan.remove();
            }, 1000);
        }, i * 200);
    }
}

// Initialize the game
randomParagraph();
inputField.addEventListener("input", initTyping);
tryAgainBtn.addEventListener("click", resetGame);
