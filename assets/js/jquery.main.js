/* Main v1.00.0 | (c) 2018 |  Agência Webnauta ⊙‿⊙ ʕ•ᴥ•ʔ ಠ_ಠ  */

//DICIONÁRIO

	/*
	1) Tipos de Funções:
		- Listener: Funções que atualizam variáveis de acordo com algum estado do sistema (várias vezes a partir de mudança);
		- Setup: Funções que declaram condições do sistema (somente uma vez);
		- Action: Funções que são chamadas e tratam dados (várias vezes quando chamadas);
	*/


//TOTAL

	//Variables ===========================================

		//Geral
			var urlRoot = window.location.href.replace('index.html','').replace('curso.html','');//Identifica o inicio da url do sistema
			var loadingObject = '.loading';
			var containerObject = '.container';
			var menuObject = '.menu';
			var AnimationTime = 600;
			var loadingTime = AnimationTime/3;
		//Status
			var currentPage = 0; //Valor numérico da cena atual
			var firstPage = true;
		//Page
			var containerPage = new Array();
			var pageLoading = false;
		//Audio
			var audioDebug = false;
			var audioPlaying = false;

	//Loading Document ====================================

		//Document Load - Inicia o carregamento quando o elemento document (independente das imagens/estilos) foi carregado
			$(document).ready(function(){//FIRST
				//Chama funções de inicio
				//alert('ready');
			});

		//Window Load - Função que identifica quando o elemento window (todas as imagens/estilos), ou a janela do browser, é carregada (load)
			$(window).bind("load", function() {//SECOND
				//Chama funções de inicio
				//alert('load');
				setTimeout(function(){
					Setup_LoadContainer();
					Action_LoadPage(currentPage);
					firstPage = false;
				}, AnimationTime);
			});

		//Loading Element
			var loadingOpen = true;
			function Action_Loading(text,action){//Função enquanto o conteúdo está sendo carregado
				if(text!='none'){ // Se o argumento for diferente de none
					text = text;
				} else {
					text = 'Carregando';
				}
				if(action=='close'){ //Se o segundo argumento for igual a close
					LoadingFadeOut(); //Chama a função para animação sumir
				} else if(action=='open'){//Se caso for igual open
					$(loadingObject).html('<p>'+text+'</p>');//carrega o conteudo dentro de uma tag <p>
					if(!loadingOpen){//Se caso não carregar nada 
						LoadingFadeIn();//Chama a função para a animação aparecer
					}
				}
			}

			function LoadingFadeOut(){ // Função para animação sumir
				$(loadingObject).animate({ opacity: 1 }, 0, function() {}); // Animação para ter opacidade
				$(loadingObject).animate({
					opacity: 0
				}, loadingTime, function() {
					//Animação está completa
					setTimeout(function(){ //Metodo javascript de tempo para sumir
						loadingOpen = false;
						$(loadingObject).css('display','none'); //Elemento some ao carregar
					}, loadingTime);
				});
			}

			function LoadingFadeIn(){ //Função para quando a animação aparecer
				loadingOpen = true;
				$(loadingObject).animate({ opacity: 0 }, 0, function() { // Animação para opacidade ser 0
					$(loadingObject).css('display','block');//Elemento aparece
				});
				$(loadingObject).animate({ // Animação para opacidade aparecer
					opacity: 1
				}, loadingTime, function() {
					//Animação está completa
				});
			}

	//Load Container ======================================

		function Setup_LoadContainer(){ //Função para carregar o conteúdo dependendo de onde clicar no menu
			$(menuObject).find('a').each(function(i){ // Usa o método find retorna elementos descendentes do elemento selecionado
				//Init
					var thisObject = this; //Chama a si mesmo
					$(thisObject).attr('href',i); 
					$(thisObject).click(function(e){
						e.preventDefault(); //Função que impede que o evento padrão ocorra
						Action_LoadPage(i); //Executa a função de carregamento da página
					});
				//Dados
					var thisName = $(thisObject).data('name');// Retorna o valor de name
					var thisTitle = $(thisObject).html();// Adiciona elementos html
					containerPage[i] = {
						name: thisName,
						title: thisTitle
					};
				//Audio
					var thisAudio = $(thisObject).data('audio');// Retorna o valor de audio
					var thisAudioUrl = urlRoot+'audio/'+thisName+'.mp3'; // Variável para executar o audio correto
					if(thisAudio=='sim'){ // Se houver audio
						containerPage[i]['audioEvent'] = false;
						containerPage[i]['audio'] = new Audio(thisAudioUrl); //Executa o audio correspondente a aquela url
						containerPage[i]['audio'].preload = "auto"; // Executa assim que entrar na página
						if(audioDebug){
							debugAudio(i); //Chama a função debugAudio, caso audioDebug seja false
						}
					} else {
						containerPage[i]['audio'] = false; // Não executa o audio
					}
			});
		}

		function Get_PageByName(name){ // Dá o name correspondente a página 
			var thisLength = containerPage.length;
			for (i = 0; i < thisLength; i++) {
				if(containerPage[i]['name']==name){
					return i;
				}
			}
		}

	//Audio Handle ========================================

		//Function debugAudio
			function debugAudio(i){
				$('body').append('<div class="myaudio-'+i+'"><p>Seconds: <span class="seek">00</span></p><p>Source: <span class="src">00</span></p><a class="audio" href="play">Play</a></div><!-- .myaudio -->');
				containerPage[i]['audio'].addEventListener('timeupdate',function (){//adiciona conteúdo ao final de um elemento HTML e um evento no caso timeupdate
					var time = parseInt(this.currentTime, 10);
					$('.myaudio-'+i+' .seek').text(time);

					var src = this.currentSrc;
					$('.myaudio-'+i+' .src').text(src);
				});
				var played = false;
				$('.myaudio-'+i+' .audio').click(function(e){ //Quando a classe correspondente é clicada
					e.preventDefault();
					if(!played){ // Se a variavel played não for false executa o audio
						containerPage[i]['audio'].play();
						$(this).text('Pause');
						played = true;
					} else {
						containerPage[i]['audio'].pause(); // Senão não executa o audio
						$(this).text('Play');
						played = false;
					}
				});
			}

		//Function Play

			function Action_PlayAudio(i){ // Função para dá o play no audio
				containerPage[i]['audio'].play();
				if(!containerPage[i]['audioEvent']){
					containerPage[i]['audioEvent']=true;
					containerPage[i]['audio'].addEventListener('play',function (){//This will call the play
						audioPlaying = true;
						Action_Page(i);
					});
					containerPage[i]['audio'].addEventListener('ended',function (){//This will call the time
						audioPlaying = false;
					});
				}
			}

		//Function Pause

			function Action_PauseAudio(){ // Função para pausar o audio
				containerPage[currentPage]['audio'].pause();
				containerPage[currentPage]['audio'].currentTime = 0;
			}

	//Load Page ===========================================

		//Função carrega a página
			function Action_LoadPage(i){
				if(!pageLoading&&(i!=currentPage||firstPage)){
					Action_Loading('none','open');
					if(containerPage[currentPage]['audio']!=false){
						Action_PauseAudio();
					}
					setTimeout(function(){
						currentPage = i;
						pageLoading = true;
						if(containerPage[currentPage]['audio']!=false){ //Se a página atual conter audio 
							Action_PlayAudio(currentPage); // Função para executar o áudio
						} else {
							Action_Page(currentPage); // Carrega a página
						}
					}, loadingTime);
				}
			}

			function Action_Page(i){ // Função para carregar a página
				var urlPage = 'telas/'+containerPage[i]['name']+'.html';
				$(containerObject).load(urlPage, function() {
					setTimeout(function(){
						Action_Loading('none','close'); // Quando carrega
						pageLoading = false;
						Action_InternalFunctions();
					}, AnimationTime);
				});
			}


//GERAL

	/**========== VERSÃO DO INTERNET EXPLORER ==========**/
		
		// Identifica se a versão do internet explorer (msie - microsoft internet explorer)
		function Setup_Msieversion() {
			//Cria a variável ua com valor da janela
			var ua = window.navigator.userAgent
			//Cria a variável msie
			var msie = ua.indexOf ( "MSIE " )
			//Verifica se o valor msie é maior que 0
		    if ( msie > 0 )     
		    	// If Internet Explorer, return version number
				return parseInt (ua.substring (msie+5, ua.indexOf (".", msie )))
			else                
				// If another browser, return 0
				return 0
		}

	/************ COOKIES **************/

		/**========== CRIAR COOKIE ==========**/
			//Função Action_CreateCookie(); que cria os argumentos nome 'name', valor 'value' e número de dias que permanece ativo como 'days'
			function Action_CreateCookie(name,value,days) {
				//Se o existir valor no argumento 'days'
				if (days) {
					//Cria um novo objeto Date na variÃ¡vel date contendo a data atual
					var date = new Date();
					//Obtem o tempo atual e adiciona o número solicitado de dias, definindo a data com esse valor, contendo a data exata que o cokie vai expirar
					date.setTime(date.getTime()+(days*24*60*60*1000));
					//Define a variÃ¡vel expires na data atual no formato UTC/GMT exigido por cookies.
					var expires = "; expires="+date.toGMTString();
				}
				//Se não existir valor no argumento 'days', a variÃ¡vel expires recebe o valor nulo "" e o cookie expira assim que o usuÃ¡rio fechar o navegador
				else var expires = "";
				//Declara o cookie dentro do document.cookie na sintaxe correta.
				document.cookie = name+"="+value+expires+"; path=/";
			}

		/**========== LER COOKIE ==========**/
			//Função Action_ReadCookie(); referente ao argumento 'name'
			function Action_ReadCookie(name) {
				//Cria a vÃ¡riavel nameEQ com o valor do argumento 'name' seguido de um =
				var nameEQ = name + "=";
				//Divide o documento.cookie em ';', criando assim a variÃ¡vel array ca
				var ca = document.cookie.split(';');
				//Cria um for() que segue a quantidade de cookies de acordo com o tamanho da variÃ¡vel array ca
				for(var i=0;i < ca.length;i++) {
					//Nomeie a variÃ¡vel c com o valor referente ao cookie na array ca
					var c = ca[i];
					//Enquanto o primeiro caractere for nulo ' ', o valor de c deleta esse valor nulo localizado em 0, começa pelo 1 e vai atÃ© o valor final de caracteres em c (c.length)
					while (c.charAt(0)==' ') c = c.substring(1,c.length);
					//Se o valor da primeira palavra de c (indexOF()==0) Ã© o valor de nameEQ, retorne o valor de c desde o seu inicio apÃ³s o nome (nameEQ.length), atÃ© o valor total da variÃ¡vel c (c.length)
					if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
				}
				//Se não achar o cookie, retorna nulo
				return null;
			}

		/**========== DELETAR COOKIE ==========**/
			//Função Action_EraseCookie(); referente ao argumento 'name'
			function Action_EraseCookie(name) {
				//Chama a função Action_CreateCookie(); com o nome com o argumento name, valor nulo e o day negativo, deletando no exato momento
				Action_CreateCookie(name,"",-1);
			}

