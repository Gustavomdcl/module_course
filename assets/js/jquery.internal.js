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
			var containerClass = '.container';


//INTERNO

	//Internal Functions ==================================

		function Action_InternalFunctions() { // Função que se atender os requisitos chama as funções para ir para a próxima pagina e dá o titulo da página
			var goToObject = $(containerClass+' .goto');
			if (goToObject.length) {
				Setup_GoTo(goToObject); //Indica a próxima página
			}
			var titleObject = $(containerClass+' .varTitle'); 
			if (titleObject.length) {
				Setup_Title(titleObject); // Dá o titulo
			}
		}

	//Navigation System ====================================

		function Setup_GoTo(goToObject) { //Função que determina para qual pagina deve ir ao indicar no data-goto
			goToObject.each(function(i, val) {
				$(this).click(function(e){
					e.preventDefault();
					var page = Get_PageByName($(this).data('goto')); // dá o nome dá pagina pelo data-goto do html
					Action_LoadPage(page); // Carrega a página
				});
			});
		}

		window.onkeydown = Action_KeyPressed;
		function Action_KeyPressed(e) {
			console.log(e.keyCode);
			var pressToObject = $(containerClass+' .pressto');
			if (pressToObject.length) {
				Setup_PressTo(pressToObject,e.keyCode); //Indica a próxima página
			}
		}

		function Setup_PressTo(pressToObject,key) { //Função que determina para qual pagina deve ir ao indicar no data-pressto
			pressToObject.each(function(i, val) {
				var thisPressTo = $(this);
				var thisPressToKey = $(this).data('key');
				if(thisPressToKey==key){
					var page = Get_PageByName(thisPressTo.data('goto')); // dá o nome dá pagina pelo data-goto do html
					Action_LoadPage(page); // Carrega a página
				}
			});
		}

	//Text System ==========================================

		function Setup_Title(titleObject) { //Função que dá o nome de cada página a partir do nome do seu container
			titleObject.each(function(i, val) { // Percorre todo html
				$(this).text(containerPage[currentPage]['title']);
			});
		}


//GERAL

	/************ COOKIES **************/

		/**========== CRIAR COOKIE ==========**/
			//Função Action_CreateCookie(); que cria os argumentos nome 'name', valor 'value' e número de dias que permanece ativo como 'days'
			function Action_CreateCookieInternal(name,value,days) {
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
			function Action_ReadCookieInternal(name) {
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
			function Action_EraseCookieInternal(name) {
				//Chama a função Action_CreateCookie(); com o nome com o argumento name, valor nulo e o day negativo, deletando no exato momento
				Action_CreateCookie(name,"",-1);
			}

