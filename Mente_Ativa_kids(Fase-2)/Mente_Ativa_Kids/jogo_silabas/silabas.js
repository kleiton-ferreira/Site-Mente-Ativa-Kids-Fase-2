document.addEventListener("DOMContentLoaded", function () {

    // Array de palavras com informações de sílabas, emoji e palavra completa
    const words = [
        { syllables: ["BA", "NA", "NA"], emoji: "🍌", word: "BANANA" },
        { syllables: ["CA", "SA"], emoji: "🏠", word: "CASA" },
        { syllables: ["CA", "CHOR", "RO"], emoji: "🐶", word: "CACHORRO" },
        { syllables: ["GA", "TO"], emoji: "🐱", word: "GATO" },
        { syllables: ["GI", "RA", "FA"], emoji: "🦒", word: "GIRAFA" },
        { syllables: ["E", "LE", "FAN", "TE"], emoji: "🐘", word: "ELEFANTE" },
        { syllables: ["CAR", "RO"], emoji: "🚗", word: "CARRO" },
        { syllables: ["BA", "LEI", "A"], emoji: "🐋", word: "BALEIA" },
        { syllables: ["LI", "VRO"], emoji: "📖", word: "LIVRO" },
        { syllables: ["JA", "CA", "RÉ"], emoji: "🐊", word: "JACARÉ" },
        { syllables: ["MO", "TO", "CI", "CLE", "TA"], emoji: "🏍️", word: "MOTOCICLETA" },
        { syllables: ["A", "VI", "ÃO"], emoji: "✈️", word: "AVIÃO" },
        { syllables: ["ÁR", "VO", "RE"], emoji: "🌳", word: "ÁRVORE" },
        { syllables: ["ON", "DA"], emoji: "🌊", word: "ONDA" },
        { syllables: ["TAR", "TA", "RU", "GA"], emoji: "🐢", word: "TARTARUGA" },
        { syllables: ["A", "RA", "NHA"], emoji: "🕷️", word: "ARANHA" },
        { syllables: ["GA", "LO"], emoji: "🐓", word: "GALO" },
        { syllables: ["SA", "PA", "TO"], emoji: "👟", word: "SAPATO" },
        { syllables: ["TE", "LE", "VI", "SÃO"], emoji: "📺", word: "TELEVISÃO" },
        { syllables: ["BI", "CI", "CLE", "TA"], emoji: "🚴", word: "BICICLETA" },
        { syllables: ["MO", "CHI", "LA"], emoji: "🎒", word: "MOCHILA" },
        { syllables: ["SOR", "RI", "SO"], emoji: "😊", word: "SORRISO" },
        { syllables: ["LÁ", "PIS"], emoji: "✏️", word: "LÁPIS" },
        { syllables: ["CA", "DEI", "RA"], emoji: "🪑", word: "CADEIRA" },
        { syllables: ["TE", "LE", "FO", "NE"], emoji: "📞", word: "TELEFONE" },
        { syllables: ["PÁS", "SA", "RO"], emoji: "🐦", word: "PÁSSARO" },
        { syllables: ["CE", "RE", "JA"], emoji: "🍒", word: "CEREJA" },
        { syllables: ["LI", "MÃO"], emoji: "🍋", word: "LIMÃO" },
        { syllables: ["CO", "RA", "ÇÃO"], emoji: "❤️", word: "CORAÇÃO" },
        { syllables: ["BAR", "CO"], emoji: "⛵", word: "BARCO" }

    ];

    // Variáveis globais
    let currentWordIndex = Math.floor(Math.random() * words.length); // Índice da palavra atual
    let formedSyllables = []; // Sílabas formadas pelo jogador
    let score = 0; // Pontuação do jogador
    const maxStars = 10; // Máximo de estrelas para o rating

    // Elementos do DOM
    const hintArea = document.getElementById("hintArea");
    const syllablesContainer = document.getElementById("syllablesContainer");
    const wordFormationArea = document.getElementById("wordFormationArea");
    const scoreDisplay = document.getElementById("score");
    const messageArea = document.getElementById("messageArea");
    const restartArea = document.getElementById("restartArea");
    const restartButton = document.getElementById("restartButton");
    const starRating = document.getElementById("starRating");

    // Mostra mensagem na área de mensagem
    function showMessage(message) {
        messageArea.textContent = message;
    }

    // Atualiza a exibição das estrelas de acordo com a pontuação
    function updateStarRating() {
        const stars = "⭐️".repeat(score) + "☆".repeat(maxStars - score);
        starRating.textContent = stars;
    }

    // Função para embaralhar um array
    function shuffleArray(array) {
        let originalArray = array.slice(); // Cria uma cópia do array original
        do {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]]; // Troca os elementos aleatoriamente
            }
        } while (array.join('') === originalArray.join('')); // Garante que o array não seja apenas reordenado
    }

    // Preenche a área de sílabas com as sílabas embaralhadas da palavra atual
    function populateSyllables() {
        const syllables = [...words[currentWordIndex].syllables]; // Copia as sílabas da palavra atual
        shuffleArray(syllables); // Embaralha as sílabas
        hintArea.innerHTML = ''; // Limpa a área de dica
        hintArea.textContent = words[currentWordIndex].emoji; // Exibe o emoji da palavra

        syllablesContainer.innerHTML = ''; // Limpa o container de sílabas
        formedSyllables = []; // Reseta as sílabas formadas

        // Cria divs para cada sílaba embaralhada e as adiciona ao container
        syllables.forEach(syllable => {
            const div = document.createElement("div");
            div.textContent = syllable;
            div.setAttribute("draggable", true); // Permite que as sílabas sejam arrastáveis
            div.addEventListener("dragstart", handleDragStart); // Adiciona um listener para o evento de arrastar
            syllablesContainer.appendChild(div);
        });
    }

    // Função para lidar com o início do arrastar de uma sílaba
    function handleDragStart(event) {
        event.dataTransfer.setData("text", event.target.textContent); // Define o dado que será arrastado
        event.target.classList.add("dragging"); // Adiciona a classe 'dragging' ao elemento sendo arrastado
    }

    // Listener para o evento de 'dragover' na área de formação da palavra
    wordFormationArea.addEventListener("dragover", function(event) {
        event.preventDefault(); // Previne o comportamento padrão
    });

    // Listener para o evento de 'drop' na área de formação da palavra
    wordFormationArea.addEventListener("drop", function(event) {
        event.preventDefault(); // Previne o comportamento padrão
        const syllable = event.dataTransfer.getData("text"); // Obtém a sílaba arrastada
        formedSyllables.push(syllable); // Adiciona a sílaba ao array de sílabas formadas

        // Cria uma div com a sílaba e a adiciona à área de formação da palavra
        const div = document.createElement("div");
        div.textContent = syllable;
        wordFormationArea.appendChild(div);

        checkCompletion(); // Verifica se a palavra está completa

        const draggedElement = document.querySelector(".dragging");
        draggedElement.parentNode.removeChild(draggedElement); // Remove o elemento arrastado da caixa de origem
    });

    // Função para reproduzir um som com base no ID do áudio
    function playSound(soundId) {
        const audio = document.getElementById(soundId);
        audio.play();
    }

    // Verifica se a palavra está completa e atualiza a pontuação
    function checkCompletion() {
        if (formedSyllables.length === words[currentWordIndex].syllables.length) {
            const formedWord = formedSyllables.join('');
            if (formedWord === words[currentWordIndex].word) { // Verifica se a palavra formada está correta
                score += 1; // Incrementa a pontuação
                if (score <= maxStars) {
                    updateStarRating(); // Atualiza o rating de estrelas
                }
                showMessage(`Parabéns! A palavra "${formedWord}" está correta. Estrelas: ${score}`);
                if (score < maxStars) {
                    playSound('audio-acerto'); // Toca o som de acerto
                }
                nextWord(); // Passa para a próxima palavra
            } else {
                showMessage(`A palavra "${formedWord}" está incorreta. Estrelas ${score}.`);
                playSound('audio-erro'); // Toca o som de erro
                restartArea.style.display = "block"; // Mostra a área de reinício
            }
        }
    }

    // Passa para a próxima palavra ou finaliza o jogo se o jogador alcançar a pontuação máxima
    function nextWord() {
        if (score >= maxStars) {
            showMessage(`Incrível! Você completou todas as palavras! Estrelas: ${score}`);
            playSound('audio-winner'); // Toca o som de vitória
            restartArea.style.display = "block"; // Mostra a área de reinício
        } else {
            currentWordIndex = (currentWordIndex + 1) % words.length; // Avança para a próxima palavra
            resetGame(); // Reinicia o jogo com a próxima palavra
        }
    }

    // Reinicia o jogo com a palavra atual
    function resetGame() {
        formedSyllables = []; // Reseta as sílabas formadas
        wordFormationArea.innerHTML = ""; // Limpa a área de formação da palavra
        populateSyllables(); // Preenche a área de sílabas com a próxima palavra
        restartArea.style.display = "none"; // Oculta a área de reinício
    }

    // Listener para o botão de reinício
    restartButton.addEventListener("click", function() {
        score = 0; // Zera a pontuação
        updateStarRating(); // Atualiza o rating de estrelas
        resetGame(); // Reinicia o jogo
    });

    populateSyllables(); // Inicia o jogo populando as sílabas da primeira palavra
});


// Função para controlar a reprodução/pausa do áudio
var audio = document.getElementById("audio");
var isPlaying = false;

function toggleAudio() {
    if (isPlaying) {
        audio.pause(); // Pausa o áudio
        isPlaying = false;
    } else {
        audio.play(); // Reproduz o áudio
        isPlaying = true;
    }
}
