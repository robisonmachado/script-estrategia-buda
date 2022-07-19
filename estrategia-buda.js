var config = {
    aposta: { label: "aposta", value: currency.minAmount, type: "number" },
    payout: { label: "payout", value: 2, type: "number" },
    martingale: { label: "martigale", value: 2, type: "number" },
    percasConsecutivasAntesIniciar: { label: "percas consecutivas antes de iniciar", value: 1, type: "number" },
    stopWin: { label: "stop win", value: 0, type: "number" },
    dividirBancaEmPartes: { label: "dividir banca em partes", value: 10, type: "number" },
    tituloAposQuebraBanca: { label: "Entrar após evento de quebra da banca", type: "title" },
      aposQuebraBanca: {
        label: "",
        value: "sim",
        type: "radio",
        options: [
          { value: "nao", label: "não" },
          { value: "sim", label: "sim" },
        ],
      },
  };
  
  
  function verificarPercasConsecutivas(){
    let resultado = game.history[0].odds;
  
    if(resultado < config.payout.value){
      percasConsecutivas++;
      log.info("Total de percas >>> "+percasConsecutivas);
      aconteceuGanho = false;
    }else{
      percasConsecutivas = 0;
      aconteceuGanho = true;
      //log.info("ocorreu uma VITÓRIA agora | ZERANDO percas consecutivas >>> "+percasConsecutivas);
  
    }
  }
  
  function podeJogar(){
    if(aconteceuGanho == true) return false;
    if(percasConsecutivasAntesIniciar == 0) return true;
    if(percasConsecutivas == percasConsecutivasAntesIniciar) return true;
    if(iniciarEstrategia) return true;
  
    return false;
  }
  
  let percasConsecutivas                = 0;
  let percasConsecutivasAntesIniciar    = config.percasConsecutivasAntesIniciar.value;
  let martigalesExecutados              = 0;
  let valorAposta                       = config.aposta.value;
  let stopWin                           = config.stopWin.value;
  let iniciarEstrategia                 = false;
  let aposQuebraBanca                   = config.aposQuebraBanca.value;
  let contadorJogadas                   = 0;
  let aconteceuGanho                    = false;
  let dividirBancaEmPartes              = config.dividirBancaEmPartes.value;
  let somaGanhosPerdas                  = 0;
  
  function main() {
  
    percasConsecutivas                = 0;
    percasConsecutivasAntesIniciar    = config.percasConsecutivasAntesIniciar.value;
    martigalesExecutados              = 0;
    valorAposta                       = config.aposta.value;
    iniciarEstrategia                 = false;
    aposQuebraBanca                   = config.aposQuebraBanca.value;
    contadorJogadas                   = 0;
  
  
    log.info("Robô ESTRATÉGIA BUDA - versão 1.2 >>> iniciando...");
    log.info("configurações identificadas:");
    log.info("aposta inicial: "+valorAposta);
    log.info("percas consecutivas antes de iniciar: "+percasConsecutivasAntesIniciar);
    log.info("iniciar após quebra da banca: "+aposQuebraBanca);
  
    log.info('$$$$$$$$$$$$$$$$$$$$$$$$$$$$\n\n');
    
    game.onBet = function() {
      contadorJogadas++;
  
      //log.info("jogada Nº "+contadorJogadas+" iniciada, vou avaliar se posso entrar...");
      verificarPercasConsecutivas();
  
      if(podeJogar()){
          log.error("iniciando estratégia, valor: "+valorAposta);
          log.info('\n\n');
          iniciarEstrategia = true;
          game.bet(valorAposta, config.payout.value).then(function(payout) {
  
              if (payout >= config.payout.value) {
                somaGanhosPerdas = somaGanhosPerdas + valorAposta;
                log.success("Nós ganhamos >>> soma ganhos perdas = " + somaGanhosPerdas);
                percasConsecutivas = 0;
                martigalesExecutados = 0;
                valorAposta = config.aposta.value;
                iniciarEstrategia = false;
              } else {
                somaGanhosPerdas = somaGanhosPerdas - valorAposta;
                log.error("Nós perdemos >>> soma ganhos perdas = " + somaGanhosPerdas);
                martigalesExecutados++;
                if(martigalesExecutados<=config.martingale.value){            
                  log.info("entrando com martingale: "+martigalesExecutados);
                }
                valorAposta = valorAposta*2;
                
  
                if(martigalesExecutados > config.martingale.value){
                  valorAposta = config.aposta.value;
                  martigalesExecutados = 0;
                  percasConsecutivas = 0;
                  iniciarEstrategia = false;
                }
  
                
              }
            });
      }
  
      
  
  
  
  
    };
  }