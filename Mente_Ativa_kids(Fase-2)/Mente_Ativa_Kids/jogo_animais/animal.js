//animal.js

const questions = [
    { question: "animais/tigre.jpg", options: ["Tigre", "Boi", "Cavalo", "Dromedário"], answer: "Tigre" }, // Questão com imagem de um tigre e opções de resposta
    { question: "animais/baleia.jpg", options: ["Hiena", "Iguana", "Baleia", "Tatu"], answer: "Baleia" }, // Questão com imagem de uma baleia e opções de resposta
    { question: "animais/urso.jpg", options: ["Macaco", "Tartaruga", "Zebra", "Urso"], answer: "Urso" }, // Questão com imagem de um urso e opções de resposta
    { question: "animais/jacare.jpg", options: ["Girafa", "Jacaré", "Pato", "Lobo"], answer: "Jacaré" }, // Questão com imagem de um jacaré e opções de resposta
    { question: "animais/elefante.jpg", options: ["Sapo", "Papagaio", "Ovelha", "Elefante"], answer: "Elefante" }, // Questão com imagem de um elefante e opções de resposta
    { question: "animais/macaco.jpg", options: ["Gato", "Abelha", "Tatu", "Macaco"], answer: "Macaco" }, // Questão com imagem de um macaco e opções de resposta
    { question: "animais/onca.jpg", options: ["Aranha", "Cachorro", "Onça", "Rato"], answer: "Onça" }, // Questão com imagem de uma onça e opções de resposta
    { question: "animais/pinguim.jpg", options: ["Pinguim", "Siri", "Coelho", "Urubu"], answer: "Pinguim" }, // Questão com imagem de um pinguim e opções de resposta
    { question: "animais/tucano.jpg", options: ["Foca", "Tucano", "Vaca", "Minhoca"], answer: "Tucano" }, // Questão com imagem de um tucano e opções de resposta
    { question: "animais/zebra.jpg", options: ["Peixe", "Cobra", "Borboleta", "Zebra"], answer: "Zebra" }, // Questão com imagem de uma zebra e opções de resposta
    { question: "animais/leao.jpg", options: ["Hipopótamo", "Leão", "Bode", "Urso"], answer: "Leão" }, // Questão com imagem de um leão e opções de resposta
    { question: "animais/cavalo.jpg", options: ["Cavalo", "Gato", "Baleia", "Pombo"], answer: "Cavalo" }, // Questão com imagem de um cavalo e opções de resposta
    { question: "animais/abelha.jpg", options: ["Pato", "Ovelha", "Abelha", "Elefante"], answer: "Abelha" }, // Questão com imagem de uma abelha e opções de resposta
    { question: "animais/gato.jpg", options: ["Tardígrado", "Gorila", "Gato", "Zebra"], answer: "Gato" }, // Questão com imagem de um gato e opções de resposta
    { question: "animais/cachorro.jpg", options: ["Pássaro", "Cachorro", "Formiga", "Lobo"], answer: "Cachorro" }, // Questão com imagem de um cachorro e opções de resposta
    { question: "animais/passaro.jpg", options: ["Pássaro", "Cachorro", "Formiga", "Lobo"], answer: "Pássaro" }, // Questão com imagem de um pássaro e opções de resposta
];

let currentQuestion = 0; 
let score = 0; 
let selectedQuestions = []; 
let timer; 
let timeLeft = 20; 

const questionElement = document.getElementById('question-image'); 
const optionsContainer = document.getElementById('options-container'); 
const scoreElement = document.getElementById('score'); 
const messageElement = document.getElementById('message'); 
const restartButton = document.getElementById('restart-btn'); 
const startButton = document.getElementById('start-btn'); 
const timerElement = document.getElementById('time-left'); 

// Função assíncrona que simula a obtenção de perguntas de um servidor
async function fetchQuestions() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(questions);
        }, 1000);
    });
}

// Função assíncrona que embaralha as perguntas e seleciona 10 aleatórias
async function shuffleQuestions() {
    const fetchedQuestions = await fetchQuestions();
    selectedQuestions = fetchedQuestions.sort(() => Math.random() - 0.5).slice(0, 10);
}

// Carrega a pergunta atual na interface
function loadQuestion() {
    if (currentQuestion === selectedQuestions.length) {
        endGame(); 
        return;
    }

    // Carrega a pergunta atual na interface
    const current = selectedQuestions[currentQuestion]; // Obtém a pergunta atual da lista de perguntas selecionadas
    questionElement.src = current.question; // Define a imagem da pergunta atual
    
    optionsContainer.innerHTML = ''; // Limpa as opções anteriores
    current.options.forEach(option => { // Para cada opção da pergunta atual
        const button = document.createElement('button'); // Cria um botão para a opção
        button.innerText = option; // Define o texto do botão com a opção
        button.onclick = () => checkAnswer(option); // Define a ação de clique do botão para verificar a resposta
        optionsContainer.appendChild(button); // Adiciona o botão ao contêiner de opções
    });
    
    timeLeft = 20; // Reseta o tempo disponível para responder a pergunta
    timerElement.innerText = timeLeft; // Atualiza a interface com o tempo restante
    clearInterval(timer); // Limpa qualquer contagem regressiva anterior
    timer = setInterval(countDown, 1000); // Inicia uma nova contagem regressiva de 1 segundo
    }
    

// Contagem regressiva do tempo para responder a pergunta
function countDown() {
    if (timeLeft > 0) {
        timeLeft--;
        timerElement.innerText = timeLeft;
    } else {
        endGame(); 
    }
}

// Inicia o jogo, escondendo o botão de início, embaralhando perguntas e carregando a primeira pergunta
async function startGame() {
    startButton.style.display = 'none'; // Esconde o botão de início
    await shuffleQuestions(); // Aguarda o embaralhamento das perguntas (função assíncrona)
    loadQuestion(); // Carrega a primeira pergunta
}

// Desabilita os botões de opções para evitar múltiplas respostas
function disableOptions() {
    const buttons = optionsContainer.querySelectorAll('button');
    buttons.forEach(button => {
        button.disabled = true; 
    });
}


// Função que verifica se a resposta escolhida está correta e atualiza a pontuação
function checkAnswer(answer) {
    const current = selectedQuestions[currentQuestion]; // Obtém a pergunta atual
    if (answer === current.answer) { // Verifica se a resposta escolhida é correta
        score++; // Incrementa a pontuação
        scoreElement.innerText = `Pontuação: ${score}`; // Atualiza o elemento HTML da pontuação
        messageElement.innerText = "Parabéns!"; // Exibe uma mensagem de parabéns
        messageElement.classList.add('show'); // Adiciona a classe 'show' para mostrar a mensagem
        document.getElementById('correct-sound').play(); // Toca o som de resposta correta
        setTimeout(() => {
            messageElement.classList.remove('show'); // Remove a mensagem após 1 segundo
            currentQuestion++; // Avança para a próxima pergunta
            loadQuestion(); // Carrega a próxima pergunta
        }, 1000);
    } else {
        endGame(); // Finaliza o jogo se a resposta estiver incorreta
        document.getElementById('wrong-sound').play(); // Toca o som de resposta incorreta
    }
}

// Função que finaliza o jogo, exibindo a pontuação final e desabilitando as opções
function endGame() {
    clearInterval(timer); // Para o contador de tempo (se existir)
    if (score === 10) { // Se o jogador acertou todas as perguntas
        messageElement.innerText = `Parabéns! Você acertou todas as perguntas! Sua pontuação final é ${score}.`; // Exibe mensagem de vitória
        document.getElementById('victory-sound').play(); // Toca o som de vitória
    } else {
        messageElement.innerText = `Fim do jogo! Sua pontuação final é ${score}.`; // Exibe mensagem de fim de jogo
    }
    messageElement.classList.add('show'); // Mostra a mensagem final
    restartButton.classList.remove('hidden'); // Torna visível o botão de reinício
    disableOptions(); // Desabilita as opções de resposta
}

// Função que reinicia o jogo, resetando todas as variáveis e exibindo o botão de início
function restartGame() {
    startButton.style.display = 'inline-block'; // Torna o botão de início visível
    currentQuestion = 0; // Reinicia o índice da pergunta atual
    score = 0; // Reinicia a pontuação
    scoreElement.innerText = `Pontuação: ${score}`; // Atualiza o elemento HTML da pontuação
    messageElement.classList.remove('show'); // Remove a mensagem visível
    restartButton.classList.add('hidden'); // Esconde o botão de reinício
}

// Função que é chamada ao carregar a janela para reiniciar o jogo
window.onload = () => {
    restartGame(); // Chama a função para reiniciar o jogo
};

// Controla a reprodução do áudio de fundo
var audio = document.getElementById("audio"); // Obtém o elemento de áudio
var isPlaying = false; // Variável para controlar se o áudio está tocando

// Alterna a reprodução do áudio entre tocar e pausar
function toggleAudio() {
    if (isPlaying) {
        audio.pause(); // Pausa o áudio
        isPlaying = false; // Atualiza o estado do áudio
    } else {
        audio.play(); // Toca o áudio
        isPlaying = true; // Atualiza o estado do áudio
    }
}
