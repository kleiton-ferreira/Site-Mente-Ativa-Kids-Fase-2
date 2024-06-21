// Seleciona todas as células do jogo
const celulas = document.querySelectorAll(".celula");

// Variáveis de controle de turno e jogadores
let checarTurno = true;
const JOGADOR_X = "X";
const JOGADOR_O = "O";

// Pontuações iniciais recuperadas do armazenamento local ou iniciadas como zero
let pontuacaoX = localStorage.getItem("pontuacaoX") ? parseInt(localStorage.getItem("pontuacaoX")) : 0;
let pontuacaoO = localStorage.getItem("pontuacaoO") ? parseInt(localStorage.getItem("pontuacaoO")) : 0;

// Atualiza os elementos de exibição das pontuações
document.getElementById("jogadorX").textContent = `Jogador X: ${pontuacaoX}`;
document.getElementById("jogadorO").textContent = `Jogador O: ${pontuacaoO}`;

// Listener para o botão de resetar o placar
document.getElementById("resetPlacar").addEventListener("click", resetPlacar);

// Combinações possíveis para vencer o jogo
const combinacoes = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Listener para clicks nas células do tabuleiro
document.addEventListener("click", (event) => {
    if (event.target.matches(".celula")) {
        jogar(event.target.id); // Chama a função jogar com o ID da célula clicada
    }
});

// Função para processar a jogada do jogador ou da IA
function jogar(id) {
    const celula = document.getElementById(id);
    if (celula.textContent === "") { // Verifica se a célula está vazia
        const turno = checarTurno ? JOGADOR_X : JOGADOR_O; // Determina o turno atual
        celula.textContent = turno; // Marca a célula com o símbolo do jogador
        celula.classList.add(turno); // Adiciona uma classe para estilização
        checarVencedor(turno); // Verifica se houve um vencedor após a jogada

        const moveSound = document.getElementById('moveSound'); // Som de movimento
        moveSound.play(); // Toca o som de movimento

        checarTurno = !checarTurno; // Alterna o turno entre jogadores

        atualizarTurno(); // Atualiza a mensagem de turno exibida

        if (!checarTurno) {
            setTimeout(jogadaIA, 500); // Se for a vez da IA, ela joga após 500ms
        }
    }
}

// Função para a jogada da IA, baseada na dificuldade selecionada
function jogadaIA() {
    const dificuldade = parseInt(document.getElementById("dificuldade").value);
    let melhorMovimento;

    if (dificuldade === 1) {
        melhorMovimento = jogadaAleatoria();
    } else if (dificuldade === 2) {
        melhorMovimento = Math.random() < 0.5 ? jogadaAleatoria() : minimax(celulas, JOGADOR_O).index;
    } else {
        melhorMovimento = minimax(celulas, JOGADOR_O).index;
    }

    jogar(melhorMovimento.toString()); // Executa a jogada encontrada pela IA
}

// Função para jogada aleatória da IA
function jogadaAleatoria() {
    const celulasVazias = getCelulasVazias(celulas);
    return celulasVazias[Math.floor(Math.random() * celulasVazias.length)];
}

// Algoritmo minimax para decidir a melhor jogada da IA
function minimax(novasCelulas, jogador) {
    const celulasVazias = getCelulasVazias(novasCelulas);

    // Condições de fim de jogo e pontuação atribuída para minimax
    if (checarVitoria(novasCelulas, JOGADOR_X)) {
        return { pontuacao: -10 };
    } else if (checarVitoria(novasCelulas, JOGADOR_O)) {
        return { pontuacao: 10 };
    } else if (celulasVazias.length === 0) {
        return { pontuacao: 0 };
    }

    // Array para armazenar movimentos possíveis
    const movimentos = [];

    for (let i = 0; i < celulasVazias.length; i++) {
        const movimento = {};
        movimento.index = novasCelulas[celulasVazias[i]].id;
        novasCelulas[celulasVazias[i]].textContent = jogador;

        // Recursivamente avalia o resultado de cada movimento
        if (jogador === JOGADOR_O) {
            const resultado = minimax(novasCelulas, JOGADOR_X);
            movimento.pontuacao = resultado.pontuacao;
        } else {
            const resultado = minimax(novasCelulas, JOGADOR_O);
            movimento.pontuacao = resultado.pontuacao;
        }

        novasCelulas[celulasVazias[i]].textContent = ""; // Desfaz a jogada para o próximo movimento
        movimentos.push(movimento); // Adiciona o movimento ao array
    }

    // Encontra o melhor movimento baseado na pontuação obtida
    let melhorMovimento;
    if (jogador === JOGADOR_O) {
        let melhorPontuacao = -Infinity;
        for (let i = 0; i < movimentos.length; i++) {
            if (movimentos[i].pontuacao > melhorPontuacao) {
                melhorPontuacao = movimentos[i].pontuacao;
                melhorMovimento = i;
            }
        }
    } else {
        let melhorPontuacao = Infinity;
        for (let i = 0; i < movimentos.length; i++) {
            if (movimentos[i].pontuacao < melhorPontuacao) {
                melhorPontuacao = movimentos[i].pontuacao;
                melhorMovimento = i;
            }
        }
    }

    return movimentos[melhorMovimento]; // Retorna o melhor movimento encontrado
}

// Função para obter todas as células vazias do tabuleiro
function getCelulasVazias(novasCelulas) {
    const celulasVazias = [];
    novasCelulas.forEach((celula, index) => {
        if (celula.textContent === "") {
            celulasVazias.push(index);
        }
    });
    return celulasVazias;
}

// Função para verificar se há um vencedor com base nas combinações possíveis
function checarVitoria(tabuleiro, jogador) {
    return combinacoes.some(comb => {
        return comb.every(index => {
            return tabuleiro[index].textContent === jogador;
        });
    });
}

// Função para determinar o vencedor e atualizar a pontuação
function checarVencedor(turno) {
    const vencedor = combinacoes.some((comb) => {
        return comb.every((index) => {
            return celulas[index].classList.contains(turno);
        });
    });

    if (vencedor) {
        if (turno === JOGADOR_X) {
            pontuacaoX++; // Incrementa a pontuação do jogador X
            localStorage.setItem("pontuacaoX", pontuacaoX); // Salva a pontuação no armazenamento local
            document.getElementById("jogadorX").textContent = `Jogador X: ${pontuacaoX}`; // Atualiza a exibição
        } else {
            pontuacaoO++; // Incrementa a pontuação do jogador O
            localStorage.setItem("pontuacaoO", pontuacaoO); // Salva a pontuação no armazenamento local
            document.getElementById("jogadorO").textContent = `Jogador O: ${pontuacaoO}`; // Atualiza a exibição
        }
        destacarCelasVencedoras(turno); // Destaca as células que formaram a linha vencedora
        encerrarJogo(turno); // Encerra o jogo, exibindo o vencedor
    } else if (checarEmpate()) { // Se não houver vencedor e houver empate
        encerrarJogo(); // Encerra o jogo como empate
    }
}

// Função para exibir a tela de encerramento do jogo
function encerrarJogo(vencedor = null) {
    const telaEscura = document.getElementById("telaEscura");
    const h2 = document.createElement("h2");
    const h3 = document.createElement("h3");

    telaEscura.style.display = "block"; // Exibe a tela escura de fundo
    telaEscura.appendChild(h2); // Adiciona título h
    telaEscura.appendChild(h3); // Adiciona mensagem de contagem regressiva

    if (vencedor) {
        h2.innerHTML = `O player <span>${vencedor}</span> venceu!`; // Exibe mensagem de vitória do jogador
    } else {
        h2.innerHTML = `Empatou!`; // Exibe mensagem de empate
    }

    let contador = 3;
    setInterval(() => {
        h3.innerHTML = `Reiniciando em ${contador--}...`; // Contagem regressiva para reinício do jogo
    }, 1000);

    setTimeout(() => location.reload(), 4000); // Reinicia a página após 4 segundos
}

// Função para verificar se houve empate no jogo
function checarEmpate() {
    let x = 0;
    let o = 0;

    for (const index in celulas) {
        if (!isNaN(index)) {
            if (celulas[index].classList.contains(JOGADOR_X)) {
                x++;
            }

            if (celulas[index].classList.contains(JOGADOR_O)) {
                o++;
            }
        }
    }
    return x + o === 9; // Retorna true se todas as células estiverem preenchidas sem vencedor
}

// Função para atualizar a exibição do turno atual
function atualizarTurno() {
    const turnoElement = document.getElementById("turno");
    const turno = checarTurno ? JOGADOR_X : JOGADOR_O;
    turnoElement.textContent = `Vez do jogador: ${turno}`; // Exibe qual jogador deve jogar
}

// Função para resetar o placar, zerando as pontuações
function resetPlacar() {
    pontuacaoX = 0;
    pontuacaoO = 0;
    localStorage.setItem("pontuacaoX", pontuacaoX); // Reseta a pontuação no armazenamento local
    localStorage.setItem("pontuacaoO", pontuacaoO);
    document.getElementById("jogadorX").textContent = `Jogador X: ${pontuacaoX}`; // Atualiza a exibição das pontuações
    document.getElementById("jogadorO").textContent = `Jogador O: ${pontuacaoO}`;
}

// Função para destacar as células que formaram a linha vencedora
function destacarCelasVencedoras(turno) {
    combinacoes.forEach((comb) => {
        if (comb.every((index) => celulas[index].classList.contains(turno))) {
            comb.forEach((index) => {
                celulas[index].style.backgroundColor = '#ffcc5c'; // Destaca as células com uma cor de fundo
            });
        }
    });
}
