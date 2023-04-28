/*************************************
TITULO: SCRIPT DE FUNCIONES GENERALES.
AUTOR: GTONIK7
FECHA: 07/04/2019
VERSION: 2.0.29
**************************************/

var intervalsMap = {};
var splitPag = 300; //divisiones en paginación.
var iconos = {};
iconos['check'] = '<img src="/images/icons/highlights/reskin/checkMark.svg" />';
iconos['warning'] = '<img src="/images/icons/highlights/reskin/exclamationMark.svg" />';
iconos['cross'] = '<img src="/images/icons/highlights/reskin/xMark.svg" />';
iconos['redflag'] = '<img src="/images/icons/highlights/reskin/flag_red.svg" />';
iconos['blueflag'] = '<img src="/images/icons/highlights/reskin/flag_blue.svg" />';
iconos['greenflag'] = '<img src="/images/icons/highlights/reskin/flag_green.svg" />';
iconos['new'] = '<img height="18" width="18" src="/images/icons/highlights/reskin/starBurst_new.svg" />';
iconos['arrowright'] = '<img height="18" width="18" src="/images/icons/highlights/reskin/arrow_red_right.svg" />';
iconos['loading'] = '<img height="18" width="18" src="data:image/gif;base64,R0lGODlhLQAtAPMPANTU1O3t7fJoRfv7++9OJdvb2+Lf3/SBZPixn/7v6/m+r/b29ubm5u0wAM3Nzf///yH/C05FVFNDQVBFMi4wAwEAAAAh+QQFCgAPACwAAAAALQAtAAAE//DJSesIBjg3WxMHklRkaUpBsa2c5L0fcs5VoLFrB7+ETJsDFY6l270Eox8lMBwWjS+fktnEPaEehVJiqBJd2NdhOul6ARNCuDFGnZiG8tAQGFQSioOx/egGSgsrcVwrDHYzCXoefGYOCyRCG4N9AI9bBgSMLAU1c1s0jSt/Ezc4k58VoStoKFWsqBWlOKOROJawFIFNnANVDLglDFUXw8AkvU0YTafGcnOyos0kVDjQK4fSE8heLK/ZpE3f4uPk5RVN3uLWXuXb1cnk1N2qkuT0DnTF3+4sdb7iwprYqcUCmzF+Kzg9kNct2zoHox6sY4brnjeG+MTRiyih1qQMBltpDADwcRMJXRkJbTAkMmDKPituLXmpiiTHCcpMybm5xJkrcF4m8Sxxz4oEbvW2YAx3FCnET0uNPnA6dMYCglK5FZCJykaVCa6qdsUKFkcBscAuZNhQ1mbIGREAACH5BAUKAA8ALBgAAAAVABUAAARg0Lliwng46y37DFuIeR4AihlJFheqqmf4wuLsGShgOzimhIOAQdV7HBoI1IDRKR4bjQTqsQA4oVDBdPPEIreYrpcAfhC83t/WgMZqwWLvotyGJuH1Q1lRf28TdQ1lZnURACH5BAUKAA8ALCIABwALAB8AAARe8EkZppXG1fuyc8PlfYU1fhqGroAErGu1wGj5MPQXPnna5QZKzjboTV40jnLJ5BAa0GhDkpBKJQorVCA5aBuHR/WLeHi/Cca3wX1+FeYvYXKWlulS7qWeUHrvSnAWEQAh+QQFCgAPACwYABgAFQAVAAAEZ/DJSSdwOLvK39BaVwUgVoiUUToGKn1r4D7M6gzuYp/uFc+qEmAmCWpkHQPhMDE6eJXEoUFlFjO4SUIxpXqtDxVSQvCav5Ox5MxugCtttqITNyNE9YYggYoT7i5sAnNEVAIHCHxEEhEAIfkEBQoADwAsBwAiAB8ACwAABFrwSXmImTjPBa6mTXh82cA4qJcdYdscSlIGBmo7KujuxATcQNyEtStOgsGLosg8IoGBB4K5cz5RUUlCQA1ZkYWBBkGgfm+ALEnBrUqCBTVpkkAc2s6CISD+RAAAIfkEBQoADwAsAAAYABUAFQAABF+wydnIuzhjSpP+j8BJCqgdY3OYGZI2Hvsk7yqHr3Err3UTKZvMxRHeRBOhAbBg0SRKh5TBckWlWENg8CldDNgwFmACi8+gwHltUq/DrEHhLb0FAO/bJWCG6y8DfHMOEQAh+QQFCgAPACwAAAcACwAfAAAEYPBJqaaVqJ0rU/vbJXyglZGlRKDkprAk8YxwY3j1dsLSkUs0VuVRayQkNRlnyWxeHNCoAzCRSgeSghUakBi2DoMkAHZgB2VGtrx4kMHUBwAsdm/r6yhegobuJ2R/Fl0WEQAh+QQFCgAPACwAAAAAFQAVAAAEYvDJSWtCR7RWu1TaJnoUQogoRyZhOnqI63qKPHuHjVbBlOsESsBh8LkOigRl4GgWJb/GgVRoOn2EZ2dovZIogK5VS+KKHYCvpHp2LNTMNkP9MIvpD0ObTG336G0OA3htaXgRADs=" />';

function rsmSetStatusBar(icon, text) {
	var strIcon = '';
	var color = '';
	var strLink = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">';

	switch (icon) {
		case 1: strIcon = '<i class="fa fa-warning" style="font-size:24px"></i>'; color = '#F7D358'; break;
		case 2: strIcon = '<i class="fa fa-exclamation-circle" style="font-size:24px"></i>'; color = '#F78181'; break;
		case 3: strIcon = '<i class="fa fa-info-circle" style="font-size:24px"></i>'; color = '#81BEF7'; break;
		case 4: strIcon = '<i class="fa fa-minus-circle" style="font-size:24px"></i>'; color = '#BDBDBD'; break;
		default: strIcon = '<i class="fa fa-warning" style="font-size:24px"></i>'; color = '#F7D358'; break;
	}

	var strStyle = '<style>	.container { padding: 20px;	background-color: ' + color + '; font-size: 20px; width: 100%; }';
	strStyle += '.closebtn { margin-left: 15px; font-weight: bold; float: right; font-size: 32px; line-height: 20px; cursor: pointer; }';
	strStyle += '.closebtn:hover { color: white; }';
	strStyle += '.hidden { display: none; } </style>';

	var strDiv = '<div class="container"><span class="closebtn" onclick="this.parentElement.classList.toggle(\'hidden\');">&times;</span>';
	strDiv += strIcon + '<span style="display:inline-block; width: 10px;"></span><span>' + text + '</span></div>';

	return strLink + strStyle + strDiv;
}
//función encargada de crear un mensaje de alerta con icono incorporado (disponible para eventos de usuario).
//	- pId = identificador del campo de netsuite (opcional)
//	- icon = identificador de icono para mostrar (opcional)
//	- text = texto que se mostrará en el compo (opcional)
//	- pSublist = identificador de la sublista (obligatorio solo para contenido de campos de sublista, para campo de cabecera es nulo)
//	- line = línea de la sublista a la que corresponde el contenido. (obligatorio solo para contenido de campos de sublista, para campo de cabecera es nulo)
function setFieldContent(icon, text, pId, pSublist, line){
	if (pId != null){
		if (pSublist != null && line != null)
			nlapiSetLineItemValue(pSublist, pId, line, iconos[icon] + '<span style="display:inline-block; width: 10px;"></span><span id="'+pId+'">' + text + '</span>');
		else
			nlapiSetFieldValue(pId, iconos[icon] + '<span style="display:inline-block; width: 10px;"></span><span id="'+pId+'">' + text + '</span>');
	}else{
		return iconos[icon] + '<span style="display:inline-block; width: 10px;"></span><span>' + text + '</span>';
	}
	return null;
}

//función encargada de resaltar un texto, haciendo que parpadee de forma lineal.(Solo modo edición).
//	- pId = identificador del campo de netsuite (obligatorio)
//	- icon = identificador de icono para mostrar (opcional)
//	- onlytxt = booleano que al ser true indica que el solo el texto parpadea, no el icono. (opcional: defecto false.)
//	- bool = booleano que al ser true indica que el texto parpadee, en caso contrario deja de hacerlo. (opcional: defecto false.)
//	- isNetsuiteFld = booleano que al ser true indica que es un campo de Netsuite y le añade el sufijo _fs. (opcional: defecto false.)
function setBlinkTextInterval(pId, icon, onlytxt, bool, isNetsuiteFld){
	var id = null;
	isNetsuiteFld ? id= pId + "_fs" : id = pId;
	var box = document.getElementById(id);
	if (box == null)
		return true;
	if (icon != null && iconos[icon] != null){
		if (onlytxt){
			box.innerHTML = iconos[icon] + '<span style="display:inline-block; width: 10px;"></span><span id="'+pId+'">' + box.innerHTML + '</span>';
			box = document.getElementById(pId);
		}else{
			box.innerHTML = iconos[icon] + '<span style="display:inline-block; width: 10px;"></span>' + box.innerHTML;
		}
	}
	clearInterval(intervalsMap[id]);
	var i = 0.05;
	if (bool){
		intervalsMap[id] = setInterval(function () {
			var opacity = window.getComputedStyle(box).opacity;
			box.style.opacity = parseFloat(opacity) - parseFloat(i);
			if (opacity == 0.3){
				i = -0.05;
			}else if (opacity == 1){
				i = 0.05;
			}
		}, 35);
	}
}

//función encargada de resaltar un texto, haciendo que parpadee.(Solo modo edición).
//	- pId = identificador del campo de netsuite (obligatorio)
//	- icon = identificador de icono para mostrar (opcional)
//	- bool = booleano que al ser true indica que el texto parpadee, en caso contrario deja de hacerlo. (opcional: defecto false.)
//	- onlytxt = booleano que al ser true indica que el solo el texto parpadea, no el icono. (opcional: defecto false.)
function setBlinkSingleTextInterval(pId, icon, bool, onlytxt){
	id = pId+"_fs";
	var box = document.getElementById(id);
	if (box == null)
		return true;
	if (icon != null && iconos[icon] != null){
		if (onlytxt){
			box.innerHTML = iconos[icon] + '<span style="display:inline-block; width: 10px;"></span><span id="'+pId+'">' + box.innerHTML + '</span>';
			box = document.getElementById(pId);
		}else{
			box.innerHTML = iconos[icon] + '<span style="display:inline-block; width: 10px;"></span>' + box.innerHTML;
		}
	}
	clearInterval(intervalsMap[id]);
	var i = 0.05;
	if (bool){
		intervalsMap[id] = setInterval(function () {
			var opacity = window.getComputedStyle(box).opacity;
			box.style.opacity = parseFloat(opacity) - parseFloat(i);
			if (opacity == 0.5){
				box.style.opacity = 1;
			}else if (opacity == 1){
				i = 0.05;
			}
		}, 100);
	}
}

//función encargada de resaltar más de un texto, haciendo que parpadeen y alternen secuencialmente (Solo modo edición).
//	- pId = identificador del campo de netsuite (obligatorio)
//	- text = array de textos para alternar (ie: ['text1', 'text2']) (obligatorio)
//	- icon = identificador de icono para mostrar (opcional)
//	- bool = booleano que al ser true indica que el texto parpadee, en caso contrario deja de hacerlo. (opcional: defecto false.)
//	- onlytxt = booleano que al ser true indica que el solo el texto parpadea, no el icono. (opcional: defecto false.)
function setBlinkMultipleTextInterval(pId, text, icon, bool, onlytxt){
	id = pId+"_fs";
	var box = document.getElementById(id);
	if (box == null || text == null)
		return true;
	
	var i = 0.05;
	var module = text.length;
	clearInterval(intervalsMap[id]);
	box.innerHTML = "";
	if (icon != null && iconos[icon] != null){
		if (onlytxt){
			box.innerHTML = iconos[icon] + '<span style="display:inline-block; width: 10px;"></span><span id="'+pId+'">' + text[0] + '</span>';
			box = document.getElementById(pId);
		}else{
			box.innerHTML = iconos[icon] + '<span style="display:inline-block; width: 10px;"></span>' + text[0];
		}
	}
	
	var intervalMod = 0;
	if (bool){
		intervalsMap[id] = setInterval(function () {
			var opacity = window.getComputedStyle(box).opacity;
			box.style.opacity = parseFloat(opacity) - parseFloat(i);
			if (opacity <= 0.5){
				intervalMod++;
				box.style.opacity = 1;
				if (icon != null && iconos[icon] != null)
					box.innerHTML = iconos[icon] + '<span style="display:inline-block; width: 10px;"></span>' + text[intervalMod%module];
				else
					box.innerHTML = text[intervalMod%module];
			}else if (opacity == 1){
				i = 0.05;
			}
		}, 140);
	}
}

//función encargada de resaltar un campo haciéndolo parpadear y resaltándolo en rojo. Útil como método de aviso de un campo erróneo. (Solo modo edición)
//	- pId = identificador del campo de netsuite (obligatorio)
//	- bool = booleano que al ser true indica que el texto parpadee, en caso contrario deja de hacerlo. (opcional: defecto false.)
function setBlinkFieldInterval(pId, bool){
	var box = document.getElementById(pId);
	if (box == null)
		return true;
	box.style.background = "#FFFFFF";
	box.style.opacity = 1;
	clearInterval(intervalsMap[pId]);
	bool == null ? bool = false : null;
	
	if (bool){
		var i = 0.05;
		box.style.background = "#F8E0E0";
			intervalsMap[pId] = setInterval(function () {
			var opacity = window.getComputedStyle(box).opacity;
			box.style.opacity = parseFloat(opacity) - parseFloat(i);
			if (opacity <= 0.5){
				box.style.opacity = 1;
			}else if (opacity == 1){
				i = 0.05;
			}
		}, 50)
	}
}

//función encargada de ocultar un campo atacando al dom directamente.
//	- pId = identificador del campo de netsuite (obligatorio)
function setFieldHidden(pId){
	pId = pId+"_fs";
	var box = document.getElementById(pId);
	if (box == null)
		return true;
	box.style.display = 'none';
}

//función encargada de mostrar un campo atacando al dom directamente.
//	- pId = identificador del campo de netsuite (obligatorio)
function setFieldDisplay(pId){
	pId = pId+"_fs";
	var box = document.getElementById(pId);
	if (box == null)
		return true;
	box.style.display = 'inline';
}

//función encargada de comprobar la obligatoriedad de un campo.
//	- pId = identificador del campo de netsuite (obligatorio)
function isMandatory(pId){
	pId = pId+"_fs";
	if (document.getElementById(pId) == null || document.getElementById(pId).className.indexOf("inputreq") < 0)
		return false;
	
	return true;
}

//función encargada de resaltar de color amarillo los campos obligatorios del formulario que se esté visualizando (Solo modo edición)
function setColorInMandatoryFields(){
	var elementsArray = document.getElementsByClassName("inputreq")
	if (elementsArray != null){
		var nElements = elementsArray.length;
			
		for (i = 0; i < nElements; i++){
			elementsArray[i].style.background = "#FFFFC2";
		}
	}
}

//función encargada de poner el foco en un campo específico, siempre que este esté activo y no se esté visualizando ya por la pantalla. (Solo modo edición)
//	- pId = identificador del campo de netsuite (obligatorio)
function setFocusToTextBox(pId){
	document.getElementById(pId) != null ? document.getElementById(pId).focus() : null;
}

//función encargada de comprobar si el parámetro es numérico o no.
//	- n = valor contenido en un campo de netsuite a comprobar (obligatorio)
function isNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

//función encargada de devolver una fecha dependiendo del offset especificado (GMT).
//	- offset = valor numérico correspondiente al GMT (ie: GMT +2) (obligatorio)
function calcTime(offset) {
	if (!isNumeric(offset))
		return null;
	
	d = new Date();
	utc = d.getTime() + (d.getTimezoneOffset() * 60000);
	nd = new Date(utc + (3600000*offset));
	return nd.getDate() + "/" + (nd.getMonth() + 1) + "/" + nd.getFullYear();
}

//función que crea la tabla de resumen para totales de una transacción.
//	- netAmt = importe bruto total de la transacción (defecto 0). (opcional)
//	- totalTax = importe impuestos total de la transacción (defecto 0). (opcional)
//	- grossAmt = importe neto total de la transacción (defecto 0). (opcional)
//	- currencySymbol = símbolo de la moneda utilizada (defecto €). (opcional)
//	- currInFront = booleano que al ser true indica si el símbolo está en la parte delantera o trasera del importe (defecto falso) (opcional)
//	- lang = idioma en el que se muestra el texto, para español 'es', por defecto inglés. (opcional)
function rsmSetSummaryTable(netAmt, totalTax, grossAmt, currencySymbol, currInFront, lang) {
	var net = '0'; var tax = '0'; var gross = '0'; var labels = [];
	!isNumeric(netAmt) ? net = '0' : net = netAmt;
	!isNumeric(totalTax) ? tax = '0' : tax = totalTax;
	!isNumeric(grossAmt) ? gross = '0' : gross = grossAmt;
	currencySymbol == null ? symbol = '€' : symbol = currencySymbol;
	lang != null && lang.trim().toUpperCase() == 'ES' ? labels = ['Resumen', 'Subtotal', 'Impuesto', 'Total'] : labels = ['Summary', 'Subtotal', 'Total Tax', 'Total'];
	currInFront == null ? currInFront = false : null;
	
	var summaryTable = '<span class="bgmd totallingbg" style="display:inline-block; position:relative;left: -20px; padding: 10px 25px; margin-bottom:5px;">'
	summaryTable += '<table class="totallingtable" cellspacing="2" cellpadding="0px" border="0px"><caption style="font-weight: bold;">'+labels[0]+'</caption>';
	summaryTable += '<tr>';
	summaryTable += '<td>';
	summaryTable += '<div class="uir-field-wrapper"><span id="subtotal_fs_lbl_uir_label" class="smalltextnolink uir-label "><span id="subtotal_fs_lbl" class="smalltextnolink" style="">'+labels[1]+'</span></span>';
	if (currInFront)
		summaryTable += '<span id="summarynet" class="uir-field" style="font-weight: bold;">'+net+'</span><span class="uir-field">'+symbol+'</span>';		
	else
		summaryTable += '<span class="uir-field">'+symbol+'</span><span id="summarynet" class="uir-field" style="font-weight: bold;">'+net+'</span>';
	summaryTable += '</div>';
	summaryTable += '</td>';
	summaryTable += '<td></td>';
	summaryTable += '</tr><tr>';
	summaryTable += '<td>';
	summaryTable += '<div class="uir-field-wrapper"><span id="taxtotal_fs_lbl_uir_label" class="smalltextnolink uir-label "><span id="taxtotal_fs_lbl" class="smalltextnolink" style="">'+labels[2]+'</span></span>';
	if (currInFront)
		summaryTable += '<span id="summarytax" class="uir-field" style="font-weight: bold;">'+gross+'</span><span class="uir-field">'+symbol+'</span>'
	else
		summaryTable += '<span class="uir-field">'+symbol+'</span><span id="summarytax" class="uir-field" style="font-weight: bold;">'+tax+'</span>';
	summaryTable += '</div>';
	summaryTable += '</td>';
	summaryTable += '<td></td>';
	summaryTable += '</tr><tr>';
	summaryTable += '<td colspan="3" class="uir-totallingtable-seperator"><div style="border-bottom: 1px solid #000000; width: 100%; font-size: 0px;"></div></td>';
	summaryTable += '</tr><tr>';
	summaryTable += '<td>';
	summaryTable += '<div class="uir-field-wrapper"><span id="total_fs_lbl_uir_label" class="smalltextnolink uir-label "><span id="total_fs_lbl" class="smalltextnolink" style="">'+labels[3]+'</span></span>';
	if (currInFront)
		summaryTable += '<span id="summarygross" class="uir-field" style="font-weight: bold;">'+gross+'</span><span class="uir-field">'+symbol+'</span>'
	else
		summaryTable += '<span class="uir-field">'+symbol+'</span><span id="summarygross" class="uir-field" style="font-weight: bold;">'+gross+'</span>';
	summaryTable += '</div>';
	summaryTable += '</td>';
	summaryTable += '<td></td>';
	summaryTable += '</tr><tr>';
	summaryTable += '</table>';
	summaryTable += '</span>';
	
	return summaryTable;
}

//función encargada de actualizar los valores de la tabla resumen.
//	- netAmt = importe bruto total de la transacción (defecto 0). (opcional)
//	- totalTax = importe impuestos total de la transacción (defecto 0). (opcional)
//	- grossAmt = importe neto total de la transacción (defecto 0). (opcional)
function rsmRefreshSummaryTable(amt, taxAmt, grossAmt){
	document.getElementById('summarynet') != null ? document.getElementById('summarynet').innerHTML = amt : null; 
	document.getElementById('summarytax') != null ? document.getElementById('summarytax').innerHTML = taxAmt : null; 
	document.getElementById('summarygross') != null ? document.getElementById('summarygross').innerHTML = grossAmt : null;
}

//ventana explorador extra.
function abrirVentanaExplorador(url, title, w, h) {
	var left = (screen.width/2)-(w/2);
	var top = (screen.height/2)-(h/2);
	return window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
} 

//función encargada de crear un popup invocando al ExtOpenWindow y generando un listener de cierre que refresca la sublista del formulario.
//	- url = url de la ventana para mostrar el contenido. (obligatorio)
//	- anchura = valor numérico que indica la anchura de la ventana modal. (obligatorio)
//	- altura = valor numérico que indica la altura de la ventana modal. (obligatorio)
//	- titulo = título de la ventana modal. (opcional)
//	- sublista = nombre de la sublista que se refrescará automáticamente al cerrar el popup. (opcional)
function creadorPopup(url, anchura, altura, titulo, sublista) {
	var listener = {
		'close': function(win){
			if (sublista != null) {
                actualizarSublista(sublista);
            } else {
				window.onbeforeunload = null;
                location.reload();
            }
		}
	};
	nlNewExtOpenWindow(url, 'childdrecord', anchura, altura, true, titulo, listener);
}

//función encargada de actualizar los registros de una sublista sin refrescar la página entera.
//	- sublista = nombre de la sublista que se refrescará automáticamente. (opcional)
function actualizarSublista(sublista){
	var divContent = '';
	var div = document.getElementById(sublista+'_div');
	if (div) {
		divContent = div.innerHTML;
	}

	refreshmachine(sublista);
	setSublistaLinea(sublista);
	function startPolling() {
		var interval = setInterval(function() {
			var div = document.getElementById(sublista+'_div');

			if (div && div.innerHTML != divContent) {
				setSublistaLinea(sublista);
				clearInterval(interval);
			} else if(!div) {
				clearInterval(interval);
			}
		}, 1000);
	}
	startPolling();
}

//función que genera una ventana popup modal que se sobrepone a la ventana principal con lógicas integradas.
//	- url = url de la ventana para mostrar el contenido. (obligatorio)
//	- winname = nombre de la ventana e identificador único de la misma. (obligatorio)
//	- width = valor numérico que indica la anchura de la ventana modal. (obligatorio)
//	- height = valor numérico que indica la altura de la ventana modal. (obligatorio)
//	- scrollbars = booleano que al ser true indica que se mostrarán las barras de desplazamiento horizontal y vertical. (obligatorio)
//	- winTitle = título de la ventana modal. (opcional)
//	- listeners = map de eventos para la ventana, definiendo funciones que se ejcutarán en el momento en que el evento se active. (opcional)
//	- triggerObj = importe neto total de la transacción (defecto 0). (opcional)
function nlNewExtOpenWindow(url, winname, width, height, scrollbars, winTitle, listeners, triggerObj, closable){
	//este parámetro es el encargado de eliminar toda la barra de menú de netsuite
	url = addParamToURL (url, "ifrmcntnr", "T", true );
	
    if (!listeners)
		listeners = {};
	
    if ( window.doPageLogging )
        logStartOfRequest( 'extpopup' );

    var xPos = null;
    var yPos = null;

    if (triggerObj != null && typeof triggerObj != 'undefined'){
        xPos = findPosX(triggerObj);
        yPos = findPosY(triggerObj);
    }

	var extWindow = new Ext.Window({
		title: (winTitle != undefined ? winTitle : winname),
		id: winname,
		name: winname,
		stateful: false,
		modal: true,
		draggable : true,
		autoScroll: scrollbars,
		width: parseInt(''+width) + 20,
		height: parseInt(''+height) + 30,
		style: 'background-color: #FFFFFF;',
		bodyStyle: 'background-color: #FFFFFF;',
		resizable: true,
		closable: closable ? true : false,
		listeners : listeners,
		bodyCfg: {
			tag: 'iframe',
			name: winname+'_frame',
			id: winname+'_frame',
			src: url,
			width: (width+4)+'px',
			height: height+'px',
			style: 'border: 0 none; background-color: #FFFFFF;'
		 }
	});

    if ((!isValEmpty(xPos))&&(!isValEmpty(yPos))){
        extWindow.x = xPos;
        extWindow.y = yPos;
    }

    extWindow.show();
    extWindow.syncSize();
}

//función que genera un icono de tipo fa_icon encapsulado.
	//pendiente...

//{FUNCIONES PARA AREA DE FILTROS EN LAS SUBLISTAS

//CREADOR DE SUBLISTA A PARTIR DE RESULTADOS
function rsmSetViewResultSublist(view, sublist) {
	var results = rsmUltraSearch(null, view);
	if (results != null) {
		var nResults = results.length;
		var columns = results[0].getAllColumns();
		var nColumns = columns.length;
		var filtrosSL = [];
		var placeHoldersSL = [];

		for (var col = 0; col < columns.length; col++) {
			if (columns[col].getName() == 'internalid' || columns[col].getName() == 'custbody_xremcheck') {
				continue;
			}

			if (columns[col].getLabel() != null && columns[col].getLabel() != '') {
				sublist.addField('col' + col, 'text', columns[col].getLabel());
				placeHoldersSL.push(columns[col].getLabel());
			} else {
				sublist.addField('col' + col, 'text', columns[col].getName());
				placeHoldersSL.push(columns[col].getName());
			}
			filtrosSL.push('col' + col);
		}

		var line = 1;
		var text = '';
		for (var i = 0; i < nResults; i++) {
			sublist.setLineItemValue('internalid', line, nlapiResolveURL('RECORD', results[i].getRecordType(), results[i].getId()));
			for (var col = 0; col < nColumns; col++) {
				text = results[i].getText(columns[col]);
				text != null ? sublist.setLineItemValue('col' + col, line, text): sublist.setLineItemValue('col' + col, line, results[i].getValue(columns[col]));
			}
			line++;
		}
		sublist.setHelpText(rsmSetFilterArea(filtrosSL, 'Available filters', 'custpage_sl1', nResults, subTab1, "Results", placeHoldersSL));
	}
	rsmSetFilterArea()
	return sublist;
}


/**
 * Filtros para la sublista
 * @Añade filtros para la sublista indicada en su helptext
 *
 * @param {string[]} 	filtros ids de los campos (m).
 * @param {string} 		titulo título del tab (m).
 * @param {string} 		sublista id de la sublista (m).
 * @param {number} 		nlines nº lineas sublista (m).
 * @param {Object} 		tab
 * @param {string} 		tabtitulo
 * @param {string[]} 	filterholder etiquetas de los campos.
 * @param {string} 		lang idioma (EN def).
 * @return {string}  	Devuelve un string tipado en formato html.
 *
 * @since 02/08/2017
 */
function rsmSetFilterArea(filtros, titulo, sublista, nlines, tab, tabtitulo, filterholder, lang){
	var fh = [];
	var nFiltros = filtros.length;
	var lblPag = 'All';
	var lblFilter = '';
	var labels = false;

	if (filtros == null)
		return "";
	if (tabtitulo == null)
		tabtitulo = "Lineas";
	if (nlines == null)
		nlines = 0;
	if (filterholder != null) {
		labels = true;
		fh = filterholder.toString().split(",");
	}		
	if (lang == null)
		lang = 'EN';
	
	var str = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">';
	str += '<div class="uir-machine-table-container" id="custpage_'+sublista+'_filterarea_div">'
	str += '<table class="uir-machine-table-container" style="border: 1px solid #dddddd; border-radius: 5px;"><tr style="background-color: #dddddd;">';
	str += '<th height="100%" style="padding: 3px;" colspan="'+nFiltros+'">';
	str += '<a onclick="rsmCollapseExpandFilters(); return false;" style="text-decoration:none"><img id="collapseexpandbox" src="/images/forms/minus.svg" border="0" width="12" height="12"></a>';
	str += '<span style="display:inline-block; width: 5px;"></span><span><b>'+titulo+'</b></span></th>';
	str += '</tr><tr>';
	for (var i = 0; i < nFiltros; i++){
		var valor = filtros[i].split(":");
		lblFilter = valor[0];
		if (i > 0 && i%10 == 0){
			str += '</tr><tr>';
		}
		if (labels && fh.length == nFiltros) {
			lblFilter = fh[i];
		}
		
		str += '<td id="filterline'+i+'" name="filterline" height="100%" style="padding: 3px;">';
		if (valor.length < 2 || valor[1] == null || valor[1] == "" || valor[1].toLowerCase() == 'input') {
			str += '<input style="border: 1px solid #dddddd;" id="colfilter'+valor[0]+'" name="'+valor[0]+'" placeholder="'+lblFilter+'" onchange="rsmApFilterArea(\''+sublista+'\', \''+filtros+'\')">';
		} else if(valor[1].toLowerCase() == 'checkbox') {
			if (lang == 'ES') {
				str += lblFilter+' <select id="colfilter'+valor[0]+'" name="'+valor[0]+'" onchange="rsmApFilterArea(\''+sublista+'\', \''+filtros+'\')"><option value="-">Todo</option><option value="T">Si</option><option value="F">No</option></select>';
			} else {
				str += lblFilter+' <select id="colfilter'+valor[0]+'" name="'+valor[0]+'" onchange="rsmApFilterArea(\''+sublista+'\', \''+filtros+'\')"><option value="-">All</option><option value="T">Yes</option><option value="F">No</option></select>'
			}
		}
		str += '</td>';
	}
	str += '</tr></table>';
	if (lang == 'ES') {
		lblPag = 'Todo';
		str += '<span id="faalert' + sublista + '" style="display:none"><i class="fa fa-warning" style="font-size:18px; color:#FFBF00;"></i><span style="display:inline-block; width: 5px;"></span><b>Aviso!</b> Los datos de la lista tienen filtros aplicados.</span>';
	} else {
		str += '<span id="faalert' + sublista + '" style="display:none"><i class="fa fa-warning" style="font-size:18px; color:#FFBF00;"></i><span style="display:inline-block; width: 5px;"></span><b>Warning!</b> filters applied.</span>';
	}
	str += '</div>';

	var pag = 0;
	var strPag = '<span style="display:inline-block; width: 10px;"></span><select id="selpag' + sublista + '" onchange="rsmSublistPagination(\'' + sublista + '\')"><option value=-1>' + lblPag + '</option>';
	for (var i = 0; nlines > splitPag && i < nlines; i++) {
		if (i % splitPag == 0) {
			strPag += '<option value=' + pag + '>Pag #' + (++pag) + '</option>';
		}
	}
	strPag += '</select>';

	if (tab != null) {
		tab.setLabel(tabtitulo + ' - <span id="linfil'+sublista+'" style="color:red">' + nlines + '</span> / <span>' + nlines + '</span>' + strPag);
	}

	return str;
}

//COLAPSAR LOS FILTROS PARA QUE NO APAREZCAN
function rsmCollapseExpandFilters(){
	var nElements = 0;
	var res = null;
	
	if (document.getElementsByName('filterline') != null)
		nElements = document.getElementsByName('filterline').length;
	
	for (i = 0; i < nElements; i++){
		if (document.getElementsByName('filterline')[i].style.display == 'none'){
			document.getElementsByName('filterline')[i].style.display = null;
			document.getElementById('collapseexpandbox').src = '/images/forms/minus.svg';
		}else{
			document.getElementsByName('filterline')[i].style.display = 'none';
			document.getElementById('collapseexpandbox').src = '/images/forms/plus.svg';
		}
	}
}

//FUNCIONES DE BÚSQUEDA EN LAS SUBLISTAS DE NETSUITE, BUSCA POR EL ATRIBUTO NOMBRE. SI SE CUMPLE LA CONDICIÓN DEL FILTRO NO LO OCULTA (requiere ejecución setSublistaLinea(sublista) en onPageInit!)
//PARA CAMPOS COMPLEJOS, DE TIPO INNERHTML POR EJEMPLO, PARA QUE EL FILTRO SE APLIQUE DEBE ENCUADRARSE EN ORIGEN CON EL SÍMBOLO '¬' PRECEDIDO DE data_value Ej: <a data_value="¬' + mivariable + '¬" ...
//PARA QUE UN TIPO DE REGISTRO NO SE TENGA EN CUENTA EN EL FILTRO DEBE INDICARSE CON EL ATRIBUTO data_nofiltrable Ej: <a data_nofiltrable ...
function rsmApFilterArea(sublista, filtros){
	if (sublista == null || filtros == null)
		return true;

	var nLineas = nlapiGetLineItemCount(sublista);
	var filtrosSplit = filtros.split(",");
	var nFiltros = filtrosSplit.length;
	var excludeFilter = [];
	var filtersApplied;
	var linesNoFiltered = nLineas;
	
	for(i = 1; i <= nLineas; i++) {
		filtersApplied = false;
		for (j = 0; j < nFiltros; j++){
			var filtro = filtrosSplit[j].split(":");
			if (document.getElementById('colfilter'+filtro[0]) == null || document.getElementById('colfilter'+filtro[0]).value == "") {
				document.getElementById('colfilter'+filtro[0]).style = 'padding: 3px; border: 1px solid #dddddd;';
				continue;
			}
				
			if (excludeFilter.indexOf(sublista+"row"+i) < 0){
				var filterValue = document.getElementById('colfilter'+filtro[0]).value;
				if (filterValue != '-') { //anulación para filtros de tipo selección (=todo)
					if (filterValue.toLowerCase() == '@none@') { //se muestran valores vacíos o nulos
						filterValue = (nlapiGetLineItemValue(sublista, filtro[0], i).toLowerCase() == '') 
					} else {
						if (!nlapiGetLineItemValue(sublista, filtro[0], i).toLowerCase().includes('data_value')) {
							filterValue = (
								nlapiGetLineItemValue(sublista, filtro[0], i).toLowerCase().includes(filterValue.toLowerCase()) &&
								!nlapiGetLineItemValue(sublista, filtro[0], i).toLowerCase().includes('data_nofiltrable')
							);
						} else {
							var fld = nlapiGetLineItemValue(sublista, filtro[0], i).toLowerCase();
							filterValue = (
								fld.substring(fld.indexOf('¬'), fld.lastIndexOf('¬')).includes(filterValue.toLowerCase())
							);
						}
					}
				}
				if (filterValue != '-' && !filterValue) {
					excludeFilter.push(sublista+"row"+i);
					linesNoFiltered--;
					document.getElementsByName(sublista+"row"+i)[0].style.display = 'none';
				}else{
					document.getElementsByName(sublista+"row"+i)[0].style.display = null;
				}
				filtersApplied = true;
				document.getElementById('colfilter'+filtro[0]).style = 'padding: 3px; border: 1px solid #dddddd; box-shadow: 0 0 3px #CC0000;';
			}
		}
		
		if (!filtersApplied) {
			document.getElementsByName(sublista+"row"+i)[0].style.display = null;
		}	
	}

	if (document.getElementById("linfil"+sublista) != null) {
		document.getElementById("linfil"+sublista).innerHTML = linesNoFiltered;
	}

	if (nLineas == linesNoFiltered) {
		setBlinkTextInterval('faalert' + sublista, null, null, false);
		document.getElementById('faalert' + sublista).style.display = 'none';
	} else {
		document.getElementById('faalert' + sublista).style.display = null;
		setBlinkTextInterval('faalert' + sublista, null, null, true);
	}

	return linesNoFiltered;
}

//FUNCIONES DE BÚSQUEDA EN LAS SUBLISTAS DE NETSUITE, BUSCA POR EL ATRIBUTO NOMBRE. SI SE CUMPLE LA CONDICIÓN DEL FILTRO NO LO OCULTA (requiere ejecución setSublistaLinea(sublista) en onPageInit!)
//PARA CAMPOS COMPLEJOS, DE TIPO INNERHTML POR EJEMPLO, PARA QUE EL FILTRO SE APLIQUE DEBE ENCUADRARSE EN ORIGEN CON EL SÍMBOLO '¬' PRECEDIDO DE data_value Ej: <a data_value="¬' + mivariable + '¬" ...
//PARA QUE UN TIPO DE REGISTRO NO SE TENGA EN CUENTA EN EL FILTRO DEBE INDICARSE CON EL ATRIBUTO data_nofiltrable Ej: <a data_nofiltrable ...
function rsmSublistPagination(sublista){
	if (sublista == null)
		return true;

	var pagina = document.getElementById("selpag"+sublista).value;
	var nLineas = nlapiGetLineItemCount(sublista);
	var limiteInf =  parseInt(pagina, 10) * parseInt(splitPag, 10);
	var limiteSup =  parseInt(limiteInf, 10) + parseInt(splitPag, 10);
	if (pagina > -1) {
		for(i = 0; i < nLineas; i++) {
			if (i >= limiteInf && i < limiteSup) {
				document.getElementById(sublista+"row"+i).style.display = null;
			}else{
				document.getElementById(sublista+"row"+i).style.display = 'none';
			}
		}
		var element = document.getElementById('linfil'+sublista);
		element != null ? element.innerHTML = splitPag: null;
	} else {
		for(i = 0; i < nLineas; i++) {
			document.getElementById(sublista+"row"+i).style.display = null;
		}
		var element = document.getElementById('linfil'+sublista);
		element != null ? element.innerHTML = nLineas: null;
	}
}

//INDICA EL NÚMERO DE LÍNEA DE UNA SUBLISTA, MANTENIÉNDOLO INDEPENDIENTEMENTE DEL ORDEN (NO SE REENUMERA) - ONPAGEINIT SIEMPRE
function setSublistaLinea(sublista, listener){
	if (sublista == null)
		return true;

	var lineaHtml = 0;
	var nLineas = nlapiGetLineItemCount(sublista);
	for(i = 1; i <= nLineas; i++){
		if (document.getElementById(sublista+"row"+lineaHtml) != null){
			document.getElementById(sublista+"row"+lineaHtml).setAttribute('name', sublista+"row"+i);
			listener ? document.getElementById(sublista+"row"+lineaHtml).setAttribute('class', document.getElementById(sublista+"row"+lineaHtml).className + ' selectlink'+i) : null;
		}
		lineaHtml++;
	}
}

//FUNCIÓN PARA BUSCAR MASIVAMENTE SIN LIMITACIÓN DE 1000 REGISTROS. EL SEARCHid ES OBLIGATORIO, EL RECORDTYPE ES OPCIONAL
function rsmUltraSearch(recordType, searchId, filters, columns, deleteSearch) {
	if (searchId != null) {
		var savedSearch = nlapiLoadSearch(recordType, searchId);
		if (filters != null) {
			savedSearch.addFilters(filters);
		}
	} else {
		var savedSearch = nlapiCreateSearch(recordType, filters, columns);
	}

	var resultset = savedSearch.runSearch();
	var returnSearchResults = [];
	var searchid = 0;
	do {
		var resultslice = resultset.getResults(searchid, searchid + 1000);
		for ( var rs in resultslice) {
			returnSearchResults.push(resultslice[rs]);
			searchid++;
		}
	} while (Array.isArray(resultslice) && resultslice.length >= 1000);
	
	deleteSearch ? savedSearch.deleteSearch() : null;
	return returnSearchResults;
}

//FUNCIÓN PARA BUSCAR PAGINADAMENTE REGISTROS. EL SEARCHid ES OBLIGATORIO, EL RECORDTYPE ES OPCIONAL
function rsmSplittedSearch(recordType, searchId, filters, columns, min, max, deleteSearch) {
    if (searchId != null) {
        var savedSearch = nlapiLoadSearch(recordType, searchId);
        if (filters != null) {
            savedSearch.addFilters(filters);
        }
    } else {
        var savedSearch = nlapiCreateSearch(recordType, filters, columns);
    }

    var resultset = savedSearch.runSearch();
    var returnSearchResults = [];
	var resultslice = resultset.getResults(min, max);
	for ( var rs in resultslice) {
		returnSearchResults.push(resultslice[rs]);
	}

	deleteSearch ? savedSearch.deleteSearch() : null;
    return returnSearchResults;
}

/**
 * RSM set client parameter
 * @Modifica el valor de un parámetro o lo crea si no existe (evento cliente)
 *
 * @param {string} 	nombre del parámetro a modificar (m).
 * @param {string} 	nuevo valor del parámetro (m).
 * @return {string}  Devuelve la nueva url modificada.
 *
 * @since 29/09/2017
 */
function rsmSetClientParameter(nParametro, vParametro) {
	var url = window.location.href;
	var hash = location.hash;
	url = url.replace(hash, '');

	if (url.indexOf(nParametro + "=") >= 0) {
		var prefijo = url.substring(0, url.indexOf(nParametro));
		var sufijo = url.substring(url.indexOf(nParametro));
		sufijo = sufijo.substring(sufijo.indexOf("=") + 1);
		sufijo = (sufijo.indexOf("&") >= 0) ? sufijo.substring(sufijo.indexOf("&")) : "";
		url = prefijo + nParametro + "=" + vParametro + sufijo;
	} else {
		if (url.indexOf("?") < 0) {
			url += "?" + nParametro + "=" + vParametro;
		} else {
			url += "&" + nParametro + "=" + vParametro;
		}
	}
	return url + hash;
}


function rsmConversorHorasNumero(pValor) {
	var patronHorario = new RegExp('^([0-9]|0[0-9]|1[0-9]|2[0-3])((:[0-5][0-9])|([\.,][0-9][0-9]?))?$');
	var chkNumero = false;
	var objResultado = {
		numerico: 0,
		hora: '0:00'
	};

	if (!patronHorario.test(pValor)) {
		return null;
	} else {
		if (pValor.indexOf(':') >= 0) {
			objResultado.hora = pValor;
			pValor = pValor.split(':');
		} else if (pValor.indexOf(',') >= 0) {
			objResultado.numerico = +(pValor.replace(',', '.')).toFixed(2);
			pValor = String(pValor).split('.');
			chkNumero = true;
		} else { //se puede hacer con el módulo, pero siempre hay un iluminati que pone , y javascript no sabe que es y me cruje. Mato moscas a cañonazos con un (String())
			objResultado.numerico = pValor;
			pValor = String(pValor).split('.');
			chkNumero = true;
		}
		
		var hora = pValor[0];
		var minuto = pValor[1] | 0;

		if (chkNumero) {
			parseInt(minuto/10, 10) == 0 ? minuto = minuto*10 : minuto = minuto;
			objResultado.hora = hora + ':' + parseInt(+(minuto*0.6), 10);
		} else {
			objResultado.numerico = +(parseFloat(hora) + parseFloat(minuto/60)).toFixed(2);
			if (minuto == 0) { 
				objResultado.hora = hora+':00'; 
			}
		}
	}

	return objResultado;
}

// Dado un registro en texto (ejemplo: 'salesorder'), devuelve el equivalente en valor numérico.
function retornaNumeroRegistroTipo(pTipo) {
    var regex = new RegExp("[\\?&]rectype=([^&#]*)");
    var resultado = regex.exec(nlapiResolveURL('RECORD', pTipo));
    return resultado === null ? '' : resultado[1];
};

function estadoPeriodo(pFechaFactura) {
	var filtros = [];
	filtros.push(new nlobjSearchFilter('startdate', null, 'onorbefore', nlapiStringToDate(pFechaFactura)));
	filtros.push(new nlobjSearchFilter('isquarter', null, 'is', 'F'));
	filtros.push(new nlobjSearchFilter('isyear', null, 'is', 'F'));

	var columnas = [];
	columnas.push(new nlobjSearchColumn('startdate').setSort(true));
	columnas.push(new nlobjSearchColumn('closed'));
	columnas.push(new nlobjSearchColumn('allownonglchanges'));

	var sPeriodo = nlapiSearchRecord('accountingperiod', null, filtros, columnas);
	if (sPeriodo != null) {
		if (sPeriodo[0].getValue('closed') == 'T' && sPeriodo[0].getValue('allownonglchanges') == 'F') {
			return true;
		}
	}

	return false;
}

function primeraFechaPeriodoAbierto() {
	var filtros = [];
	filtros.push(new nlobjSearchFilter('closed', null, 'is', 'F'));
	filtros.push(new nlobjSearchFilter('isquarter', null, 'is', 'F'));
	filtros.push(new nlobjSearchFilter('isyear', null, 'is', 'F'));

	var columnas = [];
	columnas.push(new nlobjSearchColumn('startdate').setSort());

	var sPeriodo = nlapiSearchRecord('accountingperiod', null, filtros, columnas);
	if (sPeriodo != null) {
		return sPeriodo[0].getValue('startdate');
	}

	return null;
}

function numberWithCommas(x) {
	return x.toString().replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function setNotas(pTipo, pId, pTitulo, pMensaje) {
	var tipoRegistro = retornaNumeroRegistroTipo(pTipo);
	if (tipoRegistro != '') {
		var objNota = nlapiCreateRecord('note');
		objNota.setFieldValue('record', pId);
		objNota.setFieldValue('recordtype', tipoRegistro);
		objNota.setFieldValue('title', pTitulo);
		objNota.setFieldValue('note', pMensaje);
		nlapiSubmitRecord(objNota);
	}

	function retornaNumeroRegistroTipo(pTipo) {
		var regex = new RegExp("[\\?&]rectype=([^&#]*)");
		var resultado = regex.exec(nlapiResolveURL('RECORD', pTipo));
		return resultado === null ? '' : resultado[1];
	};
}

// comprueba si es un entorno de oneworld o no
function esOneWorld() {
	return nlapiGetContext().getFeature('SUBSIDIARIES');
}

/**
 * Dependiendo del parámetro, busca el script en DOM y lo ejecuta o lo retorna
 *
 * @param {string} 	pName Indica el nombre de la función a buscar.
 * @param {boolean} pExecute Si encuentra el script especificado en pName en el DOM lo ejecuta y retorna el resultado de su ejecución
 * @return {any} Dependiendo del parámetro pExecute, devuelve la función en modo string o la ejecuta y retorna su resultado.
 */
function getDomScripts(pName, pExecute) {
    var scripts = document.getElementsByTagName('script');
    for (var script in scripts) {
        if (scripts[script].innerHTML.includes(pName)) {
            if (pExecute) {
                eval('var fn = ' + scripts[script].innerHTML);
                return fn();
            } else {
                return scripts[script].innerHTML;
            }
        }
    }
}

function setAlert(pId, pMessage, pDetails, pType) {
	if (pType == null) { pType = 'warning'; }
	if (pMessage) {
		var alertaHtml = 
		'<div id="' + pId + '" class="uir-alert-box ' + pType + '" width="undefined" role="status" style="">' +
		'<div class="icon ' + pType + '"></div>' +
		'<div class="content"><div class="title">' + pMessage + '</div><hr/>' + pDetails + '</div>' +
		'</div>';
	} else {
		var alertaHtml = 
		'<div id="' + pId + '" class="uir-alert-box ' + pType + '" width="undefined" role="status" style="">' +
		'<div class="icon ' + pType + '"></div>' +
		'<div class="content">' + pDetails + '</div>' +
		'</div>';
	}

    var cusAlertDiv = document.getElementById( 'div_cus_alert_' + pId);
    if (cusAlertDiv == null) {
        cusAlertDiv = document.createElement("div");
        cusAlertDiv.id = 'div_cus_alert_' + pId;
    }

    cusAlertDiv.innerHTML = alertaHtml;
    var alertDiv = document.getElementById('div__alert');
    if (alertDiv == null) {
        document.getElementById('div__title').parentElement.insertBefore(cusAlertDiv, document.getElementById('div__title'));
    } else {
        alertDiv.parentElement.insertBefore(cusAlertDiv, alertDiv);
    }
}

function deleteAlert(pId) {
    var parent = document.getElementById('div_cus_alert_' + pId);
    var child = document.getElementById(pId);
    if (parent != null && child != null) {
        parent.removeChild(child);
    }
}

function validateIBAN(input) {
    var CODE_LENGTHS = {
        AD: 24, AE: 23, AT: 20, AZ: 28, BA: 20, BE: 16, BG: 22, BH: 22, BR: 29,
        CH: 21, CR: 21, CY: 28, CZ: 24, DE: 22, DK: 18, DO: 28, EE: 20, ES: 24,
        FI: 18, FO: 18, FR: 27, GB: 22, GI: 23, GL: 18, GR: 27, GT: 28, HR: 21,
        HU: 28, IE: 22, IL: 23, IS: 26, IT: 27, JO: 30, KW: 30, KZ: 20, LB: 28,
        LI: 21, LT: 20, LU: 20, LV: 21, MC: 27, MD: 24, ME: 22, MK: 19, MR: 27,
        MT: 31, MU: 30, NL: 18, NO: 15, PK: 24, PL: 28, PS: 29, PT: 25, QA: 29,
        RO: 24, RS: 22, SA: 24, SE: 24, SI: 19, SK: 24, SM: 27, TN: 24, TR: 26
    };

    var iban = String(input).toUpperCase().replace(/[^A-Z0-9]/g, ''),
        code = iban.match(/^([A-Z]{2})(\d{2})([A-Z\d]+)$/),
        digits;

    if(!code || iban.length !== CODE_LENGTHS[code[1]]) {
      return false;
    }

    digits = (code[3] + code[1] + code[2]).replace(/[A-Z]/g, function (letter) {
      return letter.charCodeAt(0) - 55;
    });

    // final check
    return mod97(digits) === 1;

    function mod97(string) {
        var checksum = string.slice(0, 2),
            fragment;

        for(var offset = 2 ; offset < string.length ; offset += 7) {
          fragment = String(checksum) + string.substring(offset, offset + 7);
          checksum = parseInt(fragment, 10) % 97;
        }

        return checksum;
    }
}

//CHECK NIF-DNI
// Comprueba si es un DNI correcto (entre 5 y 8 letras seguidas de la letra que corresponda).
// Acepta NIEs (Extranjeros con X, Y o Z al principio)
function validateDNI(dni) {
    var numero, letraDNI, letra;
	var expresion_regular_dni = /^[XYZ]?\d{5,8}[A-Z]$/;
	
	if (!dni || dni == '') {
		return false;
	}

    dni = dni.toUpperCase();

    if (expresion_regular_dni.test(dni) === true) {
        numero = dni.substr(0,dni.length-1);
        numero = numero.replace('X', 0);
        numero = numero.replace('Y', 1);
        numero = numero.replace('Z', 2);
        letraDNI = dni.substr(dni.length-1, 1);
        numero = numero % 23;
        letra = 'TRWAGMYFPDXBNJZSQVHLCKET';
        letra = letra.substring(numero, numero+1);
        if (letra != letraDNI) {
            //alert('Dni erroneo, la letra del NIF no se corresponde');
            return false;
        } else {
            //alert('Dni correcto');
            return true;
        }
    } else {
        //alert('Dni erroneo, formato no válido');
        return false;
    }
}
//CHECK NIF-DNI END

//CHECK CIF
function validateCif(cif) {
	if (!cif || cif.length !== 9) {
		return false;
	}

	var letters = ['J', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
	var digits = cif.substr(1, cif.length - 2);
	var letter = cif.substr(0, 1);
	var control = cif.substr(cif.length - 1);
	var sum = 0;
    var i;
	var digit;

	if (!letter.match(/[A-Z]/)) {
		return false;
	}

	for (i = 0; i < digits.length; ++i) {
		digit = parseInt(digits[i]);

		if (isNaN(digit)) {
			return false;
		}

		if (i % 2 === 0) {
			digit *= 2;
			if (digit > 9) {
				digit = parseInt(digit / 10) + (digit % 10);
			}

			sum += digit;
		} else {
			sum += digit;
		}
	}

	sum %= 10;
	if (sum !== 0) {
		digit = 10 - sum;
	} else {
		digit = sum;
	}

	if (letter.match(/[ABEH]/)) {
		return String(digit) === control;
	}
	if (letter.match(/[NPQRSW]/)) {
		return letters[digit] === control;
	}

	if (String(digit) === control || letters[digit] === control){
		return true;
	}else{
		return false;
	}
}
//CHECK CIF END

var hasOwnProperty = Object.prototype.hasOwnProperty;

function isEmpty(obj) {

    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // If it isn't an object at this point
    // it is empty, but it can't be anything *but* empty
    // Is it empty?  Depends on your application.
    if (typeof obj !== "object") return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}

function ocultarSublista(idSublista) {
    var element = document.getElementById(idSublista);
    if (element != null) {
		do {
			element = element.parentElement;
        } while (
			element != null && element != '' 
			&& 'TABLE' != element.parentElement.nodeName 
			&& element.parentElement.className != 'uir-table-block'
		);
    }
    return element ? element.parentElement : element;
}