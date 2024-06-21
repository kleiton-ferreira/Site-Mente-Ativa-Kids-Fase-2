document.addEventListener('DOMContentLoaded', function() {
    // Seleciona todas as sílabas e adiciona um listener de clique
    var syllables = document.querySelectorAll('.syllable');
    syllables.forEach(function(syllable) {
        syllable.addEventListener('click', function() {
            var soundId = 'sound-' + this.id; // Obtém o ID do som a partir do ID da sílaba
            var audio = document.getElementById(soundId); // Seleciona o elemento de áudio com base no ID
            if (audio) {
                audio.currentTime = 0; // Reinicia o áudio para o início
                audio.play(); // Toca o áudio
            }
        });
    });

    // Botão de controle do áudio principal
    var audioBtn = document.getElementById('audio-btn');
    var audio = document.getElementById('audio');
    var isPlaying = false;

    audioBtn.addEventListener('click', function() {
        if (isPlaying) {
            audio.pause(); // Pausa o áudio se estiver tocando
            isPlaying = false;
        } else {
            audio.play(); // Toca o áudio se não estiver tocando
            isPlaying = true;
        }
    });

    // Botão de início do jogo
    var startBtn = document.querySelector('.iniciar-button');
    startBtn.addEventListener('click', function() {
        if (!state.gameStarted) { // Verifica se o jogo já começou
            startGame(); // Inicia o jogo se ainda não tiver começado
        }
    });
});

// Seletores para elementos importantes do jogo
const selectors = {
    boardContainer: document.querySelector('.board-container'),
    board: document.querySelector('.board'),
    moves: document.querySelector('.moves'),
    timer: document.querySelector('.timer'),
    start: document.querySelector('.iniciar-button'),
    win: document.querySelector('.win'),
    itemList: document.querySelector('.item-list .items')
}

// Estado atual do jogo
const state = {
    gameStarted: false, // Indica se o jogo está em andamento
    flippedCards: 0, // Número de cartas viradas no momento
    totalFlips: 0, // Total de movimentos realizados
    totalTime: 0, // Tempo total decorrido
    loop: null, // Referência para o loop de tempo
    foundItems: [] // Itens encontrados durante o jogo
}

// Função para adicionar um item à lista de itens encontrados
const addItemToList = itemName => {
    const listItem = document.createElement('li'); // Cria um elemento <li>
    listItem.textContent = itemName; // Define o texto do elemento
    selectors.itemList.appendChild(listItem); // Adiciona o elemento à lista
}

// Função para embaralhar um array
const shuffle = array => {
    const clonedArray = [...array]; // Clona o array original para não modificá-lo diretamente
    for (let i = clonedArray.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1)); // Gera um índice aleatório
        const original = clonedArray[i]; // Salva o elemento atual
        clonedArray[i] = clonedArray[randomIndex]; // Troca o elemento atual com o aleatório
        clonedArray[randomIndex] = original; // Restaura o elemento original no lugar do aleatório
    }
    return clonedArray; // Retorna o array embaralhado
}

// Função para selecionar aleatoriamente itens do array
const pickRandom = (array, items) => {
    const clonedArray = [...array]; // Clona o array original
    const randomPicks = [];
    for (let i = 0; i < items; i++) {
        const randomIndex = Math.floor(Math.random() * clonedArray.length); // Gera um índice aleatório
        randomPicks.push(clonedArray[randomIndex]); // Adiciona o item selecionado ao array de escolhas aleatórias
        clonedArray.splice(randomIndex, 1); // Remove o item selecionado do array clonado
    }
    return randomPicks; // Retorna a lista de escolhas aleatórias
}

// Função para gerar o jogo
const generateGame = () => {
    const dimensions = selectors.board.getAttribute('data-dimension'); // Obtém as dimensões do tabuleiro
    if (dimensions % 2 !== 0) {
        throw new Error("A dimensão do tabuleiro deve ser um número par."); // Verifica se as dimensões são pares
    }
    const emojis = ['🥔', '🍒', '🥑', '🌽', '🥕', '🍇', '🍉', '🍌', '🥭', '🍍']; // Emojis disponíveis para o jogo
    const picks = pickRandom(emojis, (dimensions * dimensions) / 2); // Seleciona emojis aleatórios suficientes
    const items = shuffle([...picks, ...picks]); // Embaralha os emojis duplicados
    const cards = `
        <div class="board" style="grid-template-columns: repeat(${dimensions}, auto)">
            ${items.map(item => `
                <div class="card">
                    <div class="card-front"></div>
                    <div class="card-back">${item}</div>
                </div>
            `).join('')}
        </div>
    `;
    const parser = new DOMParser().parseFromString(cards, 'text/html'); // Parseia a string HTML para elementos DOM
    selectors.board.replaceWith(parser.querySelector('.board')); // Substitui o tabuleiro atual pelo novo
}

// Função para iniciar o jogo
const startGame = () => {
    state.gameStarted = true; // Marca o início do jogo
    selectors.start.classList.add('disabled'); // Adiciona classe para desabilitar o botão de início
    state.loop = setInterval(() => {
        state.totalTime++; // Incrementa o tempo total a cada segundo
        selectors.moves.innerText = `${state.totalFlips} movimentos`; // Atualiza o número de movimentos na interface
        selectors.timer.innerText = `Tempo: ${state.totalTime} seg`; // Atualiza o tempo decorrido na interface
    }, 1000); // Chama a função a cada segundo
}

// Função para virar as cartas de volta
const flipBackCards = () => {
    document.querySelectorAll('.card:not(.matched)').forEach(card => {
        card.classList.remove('flipped'); // Remove a classe 'flipped' das cartas não combinadas
    });
    state.flippedCards = 0; // Reinicia o contador de cartas viradas
}

// Função para virar uma carta
const flipCard = card => {
    state.flippedCards++; // Incrementa o contador de cartas viradas
    state.totalFlips++; // Incrementa o contador de movimentos
    if (!state.gameStarted) {
        startGame(); // Inicia o jogo se ainda não tiver começado
    }
    if (state.flippedCards <= 2) {
        card.classList.add('flipped'); // Adiciona a classe 'flipped' à carta clicada
    }
    if (state.flippedCards === 2) {
        const flippedCards = document.querySelectorAll('.flipped:not(.matched)'); // Seleciona as cartas viradas não combinadas
        if (flippedCards[0].innerText === flippedCards[1].innerText) { // Verifica se os textos das cartas são iguais
            flippedCards[0].classList.add('matched'); // Adiciona a classe 'matched' à primeira carta
            flippedCards[1].classList.add('matched'); // Adiciona a classe 'matched' à segunda carta
            const itemName = flippedCards[0].innerText; // Obtém o nome do item (emoji)
            state.foundItems.push(itemName); // Adiciona o item encontrado ao array de itens encontrados
            addItemToList(itemName); // Adiciona o item à lista na interface
        }
        setTimeout(() => {
            flipBackCards(); // Volta as cartas após 1 segundo
        }, 1000);
    }
    if (!document.querySelectorAll('.card:not(.flipped)').length) { // Verifica se todas as cartas foram combinadas
        setTimeout(() => {
            selectors.boardContainer.classList.add('flipped'); // Adiciona a classe 'flipped' ao contêiner do tabuleiro
            selectors.win.innerHTML = `
                <span class="win-text">
                    Você ganhou!<br />
                    com <span class="highlight">${state.totalFlips}</span> movimentos<br />
                    em <span class="highlight">${state.totalTime}</span> segundos
                </span>
            `; // Exibe mensagem de vitória na interface
            const gameOverSound = document.getElementById('game-over-sound'); // Seleciona o elemento de áudio de game over
            gameOverSound.play(); // Toca o som de game over
            clearInterval(state.loop); // Para o loop de tempo
        }, 1000);
    }
}

// Função para anexar event listeners aos elementos relevantes
const attachEventListeners = () => {
    document.addEventListener('click', event => {
        const eventTarget = event.target; // Elemento clicado
        const eventParent = eventTarget.parentElement; // Elemento pai do elemento
        if (eventTarget.className.includes('card') && !eventParent.className.includes('flipped')) {
            flipCard(eventParent); // Chama a função para virar a carta se não estiver virada
        } else if (eventTarget.nodeName === 'BUTTON' && eventTarget.className.includes('iniciar-button') && !eventTarget.className.includes('disabled')) {
            startGame(); // Inicia o jogo se o botão de início estiver disponível e não estiver desativado
        }
    });
}

generateGame(); // Gera o jogo ao carregar a página
attachEventListeners(); // Anexa os event listeners aos elementos necessários
