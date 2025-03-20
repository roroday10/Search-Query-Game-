const topics = {
    "Biology": {
        prompts: ["Who", "What", "How", "When"],
        keywords: {
            "Who": ["discovered DNA", "discovered penicillin"],
            "What": ["is a cell", "is mitochondria"],
            "How": ["does photosynthesis work", "do animals reproduce"],
            "When": ["was the microscope invented", "did evolution start"]
        }
    },
    "History": {
        prompts: ["Who", "What", "How", "When"],
        keywords: {
            "Who": ["was the first Mughal emperor", "led the Indian independence movement"],
            "What": ["was the Dandi March", "was the Renaissance"],
            "How": ["did World War II end", "were the pyramids built"],
            "When": ["did the French Revolution begin", "was the Berlin Wall built"]
        }
    },
    "Science": {  // ✅ Science topic added back
        prompts: ["Who", "What", "How", "When"],
        keywords: {
            "Who": ["discovered gravity", "invented the telescope"],
            "What": ["is quantum physics", "is an atom"],
            "How": ["was the first airplane built", "does electricity work"],
            "When": ["did the Big Bang occur", "was the first computer invented"]
        }
    }
};


let selectedTopic = "";
let selectedPrompt = "";
let selectedKeyword = "";
let usedKeywords = new Set();

let topicScores = {};  // Stores scores separately for each topic
let correctCounts = {}; // Stores correct answers per topic
let wrongCounts = {}; // Stores wrong answers per topic
let totalScore = 80;  // Maximum possible score per topic

function toggleInstructions() {
    let instructions = document.getElementById("instructions");
    if (instructions.style.display === "none") {
        instructions.style.display = "block";
    } else {
        instructions.style.display = "none";
    }
}


function startGame() {
    document.getElementById("score").textContent = "Score: 0";
    const topicsList = document.getElementById("topics-list");
    topicsList.innerHTML = '';

    for (const topic in topics) {
        let button = document.createElement("button");
        button.textContent = topic;
        button.onclick = () => selectTopic(topic);
        topicsList.appendChild(button);
    }
}


function selectTopic(topic) {
    selectedTopic = topic;
    document.getElementById("current-topic").textContent = topic;
    document.getElementById("topic-selection").style.display = "none";
    document.getElementById("search-selection").style.display = "block";

    // Reset score and counts for the selected topic
    if (!topicScores[selectedTopic]) {
        topicScores[selectedTopic] = 0;
        correctCounts[selectedTopic] = 0;
        wrongCounts[selectedTopic] = 0;
    }

    score = topicScores[selectedTopic];
    correctCount = correctCounts[selectedTopic];
    wrongCount = wrongCounts[selectedTopic];

    document.getElementById("score").textContent = `Score: ${score}`;
    populatePrompts();
}

function populatePrompts() {
    const promptsList = document.getElementById("prompts-list");
    promptsList.innerHTML = '';

    topics[selectedTopic].prompts.forEach(prompt => {
        let button = document.createElement("button");
        button.textContent = prompt;
        button.onclick = () => selectPrompt(prompt);
        promptsList.appendChild(button);
    });
}

function selectPrompt(prompt) {
    selectedPrompt = prompt;
    updateSearchBar();
    populateKeywords();
}

function populateKeywords() {
    const keywordsList = document.getElementById("keywords-list");
    keywordsList.innerHTML = '';

    let correctKeywords = topics[selectedTopic].keywords[selectedPrompt];
    let incorrectKeywords = generateIncorrectKeywords(selectedPrompt);
    let allKeywords = shuffle([...correctKeywords.slice(0, 2), ...incorrectKeywords.slice(0, 4)]);

    allKeywords.forEach(keyword => {
        let button = document.createElement("button");
        button.textContent = keyword;

        if (usedKeywords.has(keyword)) {
            button.style.opacity = "0.5"; // Grey out previously selected words
            button.disabled = true;
        } else {
            button.onclick = () => selectKeyword(keyword, button);
        }

        keywordsList.appendChild(button);
    });
}

function selectKeyword(keyword) {
    selectedKeyword = keyword;
    document.getElementById("search-bar").value = `${selectedPrompt} ${selectedKeyword}`.trim();
}


function updateSearchBar() {
    document.getElementById("search-bar").value = `${selectedPrompt} ${selectedKeyword}`.trim();
}

function finalizeSelection() {
    let feedback = document.getElementById("feedback");
    let correctKeywords = topics[selectedTopic].keywords[selectedPrompt];
     
    // Ensure score is a number
      if (isNaN(score)) {
        score = 0;
    }

    if (!selectedKeyword) {
        feedback.innerHTML = "<p style='color:red;'>Please select a keyword first!</p>";
        return;
    }

    if (correctKeywords.includes(selectedKeyword)) {
        topicScores[selectedTopic] += 10;
        correctCounts[selectedTopic] += 1;
        feedback.innerHTML = `<p style='color:green;'>✅ Correct! </p>`;
    } else {
        topicScores[selectedTopic] -= 5;
        wrongCounts[selectedTopic] += 1;
        feedback.innerHTML = `<p style='color:red;'>❌ Incorrect! Try again.</p>`;
    }
    score = topicScores[selectedTopic];
    correctCount = correctCounts[selectedTopic];
    wrongCount = wrongCounts[selectedTopic];

    document.getElementById("score").textContent = `Score: ${score}`;

    // Grey out and disable ALL selected keywords (correct and incorrect)
    if (selectedKeyword) {
        usedKeywords.add(selectedKeyword);
        document.querySelectorAll("#keywords-list button").forEach(button => {
            if (button.textContent === selectedKeyword) {
                button.style.opacity = "0.5"; // Grey out selected keyword
                button.disabled = true;  // Disable button
            }
        });
    }

 // Check if all correct keywords for this prompt have been chosen
 let allCorrectChosen = correctKeywords.every(kw => usedKeywords.has(kw));

 if (allCorrectChosen) {
     let prompts = topics[selectedTopic].prompts;
     let currentIndex = prompts.indexOf(selectedPrompt);

     if (currentIndex !== -1 && currentIndex < prompts.length - 1) {
         selectedPrompt = prompts[currentIndex + 1]; // Move to next first-string word
         updateSearchBar();
         populateKeywords();
     } else {
        // 🏆 Generate Report Card at the End
        showReportCard();
    }
}

selectedKeyword = ""; 
updateSearchBar();  
}

// 🎯 Function to Show Report Card
function showReportCard() {
    // ⭐ Star rating logic: Each star represents 16 points
    let starRating = Math.min(5, Math.max(1, Math.floor(score / 16))); 
    let stars = "⭐".repeat(starRating) + "☆".repeat(5 - starRating); // Display stars

    let reportCard = `
        <h2>📜 Topic Completed: ${selectedTopic}</h2>
        <p>✅ Correct Answers: <strong>${correctCount}</strong></p>
        <p>❌ Wrong Answers: <strong>${wrongCount}</strong></p>
        <p>🏆 Final Score: <strong>${score}/${totalScore}</strong></p>
        <p>⭐ Rating: <strong>${stars}</strong></p>
        <button onclick="resetGame()">🔄 Restart Game</button>
    `;

    document.getElementById("feedback").innerHTML = reportCard;

    // 🔹 Hide keyword selection & prevent further interactions
    document.getElementById("keywords-list").innerHTML = "";
    document.getElementById("prompts-list").innerHTML = "";
}

// Reset function to clear everything
function resetGame() {
    selectedTopic = "";
    selectedPrompt = "";
    selectedKeyword = "";
    usedKeywords.clear();
    correctCount = 0;
    wrongCount = 0;
    score = 0;
    
    document.getElementById("score").textContent = "Score: 0";
    document.getElementById("feedback").innerHTML = "";
    document.getElementById("search-selection").style.display = "none";
    document.getElementById("topic-selection").style.display = "block";
    
    startGame();
}


function moveToNextPrompt() {
    let prompts = topics[selectedTopic].prompts;
    let currentIndex = prompts.indexOf(selectedPrompt);

    if (currentIndex !== -1 && currentIndex < prompts.length - 1) {
        selectedPrompt = prompts[currentIndex + 1]; 
        updateSearchBar();
        populateKeywords();
    } else {
        let maxScore = 80; // 8 correct answers * 10 points = 80
        let message = `<p>All prompts completed for <strong>${selectedTopic}</strong>!</p>`;
        message += `<p>Your Score: <strong>${score}/${totalScore}</strong></p>`;

        document.getElementById("feedback").innerHTML = message;
    }
}

function generateIncorrectKeywords(prompt) {
    let incorrectKeywords = [];
    Object.keys(topics).forEach(topic => {
        if (topic !== selectedTopic && topics[topic].keywords[prompt]) {
            incorrectKeywords.push(...topics[topic].keywords[prompt].slice(0, 2));
        }
    });
    return shuffle(incorrectKeywords).slice(0, 4);
}

function resetGame() {
    selectedTopic = "";
    selectedPrompt = "";
    selectedKeyword = "";
    topicScores = {}; // Reset topic scores
    usedKeywords.clear();
    document.getElementById("search-selection").style.display = "none";
    document.getElementById("topic-selection").style.display = "block";
    document.getElementById("feedback").innerHTML = "";
    document.getElementById("score").textContent = "Score: 0";
    startGame();
}

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

startGame();
