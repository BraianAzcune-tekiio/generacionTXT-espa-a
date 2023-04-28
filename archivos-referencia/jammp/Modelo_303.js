/**************************************************************************************
TITULO: Modelo 303
AUTOR: RSM Spain
FECHA: 03/12/2020
VERSION: 6.1.0
****************************************************************************************/
/**
 * Copyright 2018 RSM Spain Consultores S.L.  User may not copy, modify, distribute, or re-bundle or otherwise make available this code.
 */
/* v4 - Versión 2019 " 
/* v5 - Añadida la columna de "servicio" y añadidos los nuevos cálculos; Añadidas casillas 12 y 13, 14 y 15, 40 y 41. Recalculadas 1-9, 28 y 29, 32 y 33
/* v5.1 - Solucionado error de los decimales en autorepercutido
/* v5.2 - Añadido CardRfnd y CardChrg (Targetas de crédito)
/* v5.3 - Añadido filtro Fecha Alternativa
/** v 6.0  - ***** Versión 2021 ******
 *  v 6.1 - Añadido IVA diferido
 *  v 6.2 - Apañado cambio OSS, necesario hacerlo bien
 * 
 * */ 

//CONSTANTES
var currentYear = new Date().getFullYear();

//END CONSTANTES 

function formulario303 (request, response){
    if ( request.getMethod() == 'GET' ){
        var form = nlapiCreateForm('Exportar Modelo 303');
        var oneWorld = esOneWorld();
        var idFechaFiltro = 'trandate';
        var pFechaAlternativa = nlapiGetContext().getSetting('SCRIPT', 'custscript_x_m303_fechaalternativa');
        if(pFechaAlternativa == 'T'){
            var idFechaFiltro = 'custbody_x_sii_fecha_alt_liquidacion';
        }

        form.setScript('customscript_export303client');
        if (request.getParameter('fileid') != null && request.getParameter('fileid') != '') {
            var fichero = nlapiLoadFile(request.getParameter('fileid'));
            form.addField('custpage_xficheroexp', 'url', 'FICHERO EXPORTACIÓN').setLinkText('Descargar fichero').setDisplayType('inline').setDefaultValue(fichero.getURL());
        }
        form.addSubmitButton('Exportar 303');
        var Tab = form.addTab('303tab', 'Modelo 303');
        var subTab = form.addSubTab('303subtab', 'Modelo303', '303tab');
        form.addFieldGroup('grupo1', 'Identificación', '303subtab').setShowBorder(true);
        if(oneWorld){
            form.addField('subsid', 'select', 'SUBSIDIARIA', 'subsidiary', 'grupo1').setMandatory(true).setLayoutType('startrow').setDisplaySize('5');
        }
        // Selector de Ejercicio. Solo se muestra el ejercicio actual y el anterior.
        
        var ejercicioSelector = form.addField('ejerciciosel', 'select', 'EJERCICIO', 'null', 'grupo1').setMandatory(true).setLayoutType('midrow');
        for (i = currentYear-1; i <= currentYear; i++){
            if (currentYear == i) {
                ejercicioSelector.addSelectOption(i, i, true);
            } else {
                ejercicioSelector.addSelectOption(i, i);
            }
        }
        var ejercicio = currentYear;
        
        //Selector del Periodo. 
        var periodo = form.addField('xperiodo', 'select', 'PERIODO', null, 'grupo1').setLayoutType('midrow');
        periodo.addSelectOption("01","Enero",true);
        periodo.addSelectOption("02","Febrero");
        periodo.addSelectOption("03","Marzo");
        periodo.addSelectOption("04","Abril");
        periodo.addSelectOption("05","Mayo");
        periodo.addSelectOption("06","Junio");
        periodo.addSelectOption("07","Julio");
        periodo.addSelectOption("08","Agosto");
        periodo.addSelectOption("09","Septiembre");
        periodo.addSelectOption("10","Octubre");
        periodo.addSelectOption("11","Noviembre");
        periodo.addSelectOption("12","Diciembre");
        periodo.addSelectOption("1T","Primer Trimestre");
        periodo.addSelectOption("2T","Segundo Trimestre");
        periodo.addSelectOption("3T","Tercer Trimestre");
        periodo.addSelectOption("4T","Cuarto Trimestre");

        var periodoSel = 1;

        var tipoDeclaracion = form.addField('xtipodecl', 'select', 'Tipo Declaración', null, 'grupo1').setLayoutType('midrow');
        tipoDeclaracion.addSelectOption("C","Solicitud de Compensación");
        tipoDeclaracion.addSelectOption("D","Devolución");
        tipoDeclaracion.addSelectOption("G","Cuenta corriente Tributaria - Ingreso");
        tipoDeclaracion.addSelectOption("I","Ingreso", true);
        tipoDeclaracion.addSelectOption("N","sin actividad/resultado cero");
        tipoDeclaracion.addSelectOption("V","Cuenta corriente tributaria -devolució");
        tipoDeclaracion.addSelectOption("U","Domiciliacion del ingreso en CCC");
       

        form.addField('declaranterazon', 'text', 'RAZON SOCIAL / APELLIDOS Y NOMBRE', null, 'grupo1').setDisplaySize(25).setMandatory(true).setLayoutType('startrow');
        form.addField('declarantenif', 'text', 'NIF DECLARANTE', null, 'grupo1').setMandatory(true).setLayoutType('midrow');
        //form.addField('declarantenombre', 'text', 'NOMBRE', null, 'grupo1').setMandatory(true).setLayoutType('endrow');

        form.addFieldGroup('grupo2', 'Grupo 2', '303subtab').setShowBorder(false);
        form.addField('xriva', 'checkbox', '¿Inscrito en el registro de devolución mensual?', null, 'grupo2').setLayoutType('startrow');
        var xregimensimpli = form.addField('xregimensimplificado', 'select', '¿Tributa exclusivamente en Régimen Simplificado?', null, 'grupo2').setLayoutType('startrow');
        xregimensimpli.addSelectOption("1","Sí");
        xregimensimpli.addSelectOption("2","No (RG + RS)");
        xregimensimpli.addSelectOption("3","No (sólo RG)",true);
        //form.addField('xregimensimplificado', 'checkbox', '¿Tributa exclusivamente en Régimen Simplificado?', null, 'grupo2').setLayoutType('startrow');
        form.addField('xautoliquidacion', 'checkbox', '¿Es autoliquidación conjunta?', null, 'grupo2').setLayoutType('startrow');
        form.addField('xconcursoacree', 'checkbox', '¿Declarado en concurso de acreedores en el presente período?', 'null', 'grupo2').setLayoutType('startrow');
        form.addField('xfechaconcurso', 'date', 'Fecha declaración', null, 'grupo2').setLayoutType('startrow').setHelpText('Fecha en que se dictó el auto de declaración de concurso');
        form.addField('xivadiferido', 'checkbox', 'IVA DIFERIDO', 'null', 'grupo2').setLayoutType('startrow');
        var autodeclaracion = form.addField('xautodeclaracion', 'select', 'Auto de declaración de concurso dictado en el período', null, 'grupo2').setLayoutType('startrow', 'startcol');
        autodeclaracion.addSelectOption(" ","No",true);
        autodeclaracion.addSelectOption("01","Preconcursal");
        autodeclaracion.addSelectOption("02","Postconcursal");
        form.addField('xcriteriocaja', 'checkbox', '¿Sujeto pasivo acogido al régimen especial del criterio de Caja (art. 163 undecies LIVA)?', null, 'grupo2');
        form.addField('xdestinatariocriterio', 'checkbox', '¿Destinatario de las operaciones a las que se aplique el régimen especial del criterio de Caja?', null, 'grupo2');
        form.addField('xaplprorrata', 'checkbox', '¿Opción por la aplicación de la prorrata especial?', null, 'grupo2');
        form.addField('xrenprorrata', 'checkbox', '¿Revocación de la opción por la aplicación de la prorrata especial?', null, 'grupo2');
        var exonerado = form.addField('xvoloperaciones', 'select', '¿Existe volumen de operaciones (art. 121 LIVA)?', null, 'grupo2');
        exonerado.addSelectOption("00","No Exonerado",true);
        exonerado.addSelectOption("01","Sí (Exonerado)");
        exonerado.addSelectOption("02","No (Exonerado)");
        form.addField('xsujetopasivo', 'checkbox', 'Tributación exclusivamente foral', null, 'grupo2');
        form.addField('xacogidosii', 'checkbox', '¿Sujeto pasivo acogido voluntariamente al SII?', null, 'grupo2');
        form.addField('xexonerado', 'checkbox', '¿Está exonerado de la Declaración-resumen anual del IVA, modelo 390?', null, 'grupo2');
        form.addField('territoriocomun', 'integer', 'Información de la tributación por razón de territorio: Territorio común [107]', null, 'grupo2');
        form.addFieldGroup('grupo3', 'Resultado', '303subtab').setShowBorder(true);
        form.addField('sumtotal','currency','Importe',null,'grupo3').setDisplayType('inline');
        form.addField('xcuotascomp', 'float', 'Cuotas a compensar pendientes de periodos anteriores', null, 'grupo3').setLayoutType('startrow');
        form.addField('xcuotascompactual', 'float', 'Cuotas a compensar de periodos anteriores aplicadas en este periodo', null, 'grupo3');
        form.addField('xporcentatrib', 'float', '% Atribuible a la Admin', null, 'grupo3').setDefaultValue("100.00");
        form.addField('xdeducir', 'float', 'A Deducir', null, 'grupo3');
        form.addField('xswift', 'float', 'Código SWIFT', null, 'grupo3');
        form.addField('xiban', 'text', 'IBAN', null, 'grupo3');

        var exportList = form.addSubList('custpage_303_sublist','list', 'Modelo 303','303subtab');
        exportList.addField('xnumlinea', 'integer', 'Línea');
        exportList.addField('xtasa', 'float', 'Tasa');
        exportList.addField('xcodigoce', 'text', 'Codigo CE').setDisplayType('inline');
        exportList.addField('xautorepercutido', 'text', 'Autorepercutido').setDisplayType('inline');
        exportList.addField('ximportacion', 'text', 'Importacion');
        exportList.addField('xexportar', 'text', 'Exportar');
        exportList.addField('xarticuloimp', 'text', 'Articulo de Impuesto');
        exportList.addField('ximportedebito', 'currency', 'Importe Débito');
        exportList.addField('ximportecredito', 'currency', 'Importe Crédito');
        exportList.addField('xbaseimp', 'currency', 'Base Imponible');
        exportList.addField('ximpuestos', 'currency', 'Impuestos');
        if(oneWorld){
            exportList.addField('xsubsidiaria', 'text', 'Subsidiaria');
        }
        exportList.addField('xtasaparent', 'float', 'Impuesto Derivado');
        exportList.addField('xtipoop', 'text', 'Tipo Operación');
        exportList.addField('xnosujeto', 'text', 'No Sujeto');
        exportList.addField('xbienesinversion', 'text', 'IVA Bienes Inmuebles');
        exportList.addField('xservicio', 'text', 'Aplica al servicio');

        //PARAMETROS
        if (request.getParameter('riva') != null && request.getParameter('riva').trim() != ""){
            form.setFieldValues({xriva:request.getParameter('riva')});
        }
        if (request.getParameter('tipodecl') != null && request.getParameter('tipodecl').trim() != ""){
            form.setFieldValues({xtipodecl:request.getParameter('tipodecl')});
        }
        if (request.getParameter('declnombre') != null && request.getParameter('declnombre').trim() != ""){
            form.setFieldValues({declarantenombre:request.getParameter('declnombre')});
        }
        if (request.getParameter('declnif') != null && request.getParameter('declnif').trim() != ""){
            form.setFieldValues({declarantenif:request.getParameter('declnif')});
        }
        if (request.getParameter('declrazon') != null && request.getParameter('declrazon').trim() != ""){
            form.setFieldValues({declaranterazon:request.getParameter('declrazon')});
        }
        if (request.getParameter('perio') != null && request.getParameter('perio').trim() != ""){
            form.setFieldValues({xperiodo:request.getParameter('perio')});
            periodoSel = request.getParameter('perio');
        }
        if (request.getParameter('regimensimplificado') != null && request.getParameter('regimensimplificado').trim() != ""){
            form.setFieldValues({xregimensimplificado:request.getParameter('regimensimplificado')});
        }
        if (request.getParameter('autoliquidacion') != null && request.getParameter('autoliquidacion').trim() != ""){
            form.setFieldValues({xautoliquidacion:request.getParameter('autoliquidacion')});
        }
        if (request.getParameter('concursoacree') != null && request.getParameter('concursoacree').trim() != ""){
            form.setFieldValues({xconcursoacree:request.getParameter('concursoacree')});
        }
        if (request.getParameter('fechaconcurso') != null && request.getParameter('fechaconcurso').trim() != ""){
            form.setFieldValues({xfechaconcurso:request.getParameter('fechaconcurso')});
        }
        if (request.getParameter('autodeclaracion') != null && request.getParameter('autodeclaracion').trim() != ""){
            form.setFieldValues({xautodeclaracion:request.getParameter('autodeclaracion')});
        }
        if (request.getParameter('criteriocaja') != null && request.getParameter('criteriocaja').trim() != ""){
            form.setFieldValues({xcriteriocaja:request.getParameter('criteriocaja')});
        }
        if (request.getParameter('destinatariocriterio') != null && request.getParameter('destinatariocriterio').trim() != ""){
            form.setFieldValues({xdestinatariocriterio:request.getParameter('destinatariocriterio')});
        }
        if (request.getParameter('aplprorrata') != null && request.getParameter('aplprorrata').trim() != ""){
            form.setFieldValues({xaplprorrata:request.getParameter('aplprorrata')});
        }
        if (request.getParameter('renprorrata') != null && request.getParameter('renprorrata').trim() != ""){
            form.setFieldValues({xrenprorrata:request.getParameter('renprorrata')});
        }
        if (request.getParameter('voloperaciones') != null && request.getParameter('voloperaciones').trim() != ""){
            form.setFieldValues({xvoloperaciones:request.getParameter('voloperaciones')});
        }
        if (request.getParameter('sujetopasivo') != null && request.getParameter('sujetopasivo').trim() != ""){
            form.setFieldValues({xsujetopasivo:request.getParameter('sujetopasivo')});
        }
        if (request.getParameter('acogidosii') != null && request.getParameter('acogidosii').trim() != ""){
            form.setFieldValues({xacogidosii:request.getParameter('acogidosii')});
        }
        if (request.getParameter('porcentatrib') != null && request.getParameter('porcentatrib').trim() != ""){
            form.setFieldValues({xporcentatrib:request.getParameter('porcentatrib')});
        }
        if (request.getParameter('cuotascomp') != null && request.getParameter('cuotascomp').trim() != ""){
            form.setFieldValues({xcuotascomp:request.getParameter('cuotascomp')});
        }
        if (request.getParameter('cuotascompactual') != null && request.getParameter('cuotascompactual').trim() != ""){
            form.setFieldValues({xcuotascompactual:request.getParameter('cuotascompactual')});
        }
        if (request.getParameter('swift') != null && request.getParameter('swift').trim() != ""){
            form.setFieldValues({xswift:request.getParameter('swift')});
        }
        if (request.getParameter('iban') != null && request.getParameter('iban').trim() != ""){
            form.setFieldValues({xiban:request.getParameter('iban')});
        }
        if (request.getParameter('exonerado') != null && request.getParameter('exonerado').trim() != ""){
            form.setFieldValues({xexonerado:request.getParameter('exonerado')});
        }
        if (request.getParameter('ivadiferido') != null && request.getParameter('ivadiferido').trim() != ""){
            form.setFieldValues({xivadiferido:request.getParameter('ivadiferido')});
        }
        //END PARAMETROS
        var filtroAutorepercutido = 'F';
        var searchTotales = ejecutarBusqueda('customsearch_x303',oneWorld,form,ejercicio,periodoSel,exportList,filtroAutorepercutido, idFechaFiltro);
        var filtroAutorepercutido = 'T';
        var searchAutorep = ejecutarBusqueda('customsearch_x303_isp',oneWorld,form,ejercicio,periodoSel,exportList,filtroAutorepercutido, idFechaFiltro);
       
        form.setFieldValues({sumtotal:searchTotales});
        response.writePage(form);
    }else{
        dumpResponse(request,response);
    }
}

function dumpResponse(request,response){
    var doctxt = "";
    var xtemporales = "000.00";
    var tot = request.getParameter('sumtotal');
    var oneWorld = esOneWorld();
   
    //Cabecera
    doctxt += "<T"; // Constante "<T"    
    doctxt += "303"; // Constante "303" 
    doctxt += "0"; // Discriminante
    doctxt += request.getParameter('ejerciciosel'); // Ejercicio del devengo
    doctxt += request.getParameter('xperiodo'); // Periodo. 2 Posiciones
    doctxt += "0000>"; // Constante "0000>" 
    doctxt += "<AUX>";  // Constante "<AUX>" 
    doctxt += padTxt("",70);//Blancos; 70
    doctxt += "0001"; // Debe consignarse el identificador de la versión del SW desarrollado por la ED. 4 Posiciones
    doctxt += padTxt("",4);//Blancos; 4
    doctxt += "B65795015";//Debe consignarse el NIF de la ED del SW. 9 Posiciones
    doctxt += padTxt("",213);//Blancos; 213
    doctxt += "</AUX>"; // Constante "</AUX>" 
    //Página 1
        doctxt += "<T"; // Constante "<T"    
        doctxt += "303"; // Constante "303" 
        doctxt += "01000"; // Constante Página
        doctxt += ">"; // Constante ">"
        doctxt += " "; // Indicador de página complementaria. 1 Blanco
        doctxt += request.getParameter('xtipodecl'); // El tipo de declaración puede ser: C (solicitud de compensación) D (devolución) G (cuenta corriente tributaria-ingreso) I (ingreso) N (sin actividad/resultado cero) V (cuenta corriente tributaria -devolución)
        doctxt += padTxt(limpiarChar(request.getParameter('declarantenif').toUpperCase()),9);// NIF Declarante. 9 Campos
        doctxt += padTxt(limpiarChar(request.getParameter('declaranterazon').toUpperCase()),80); // Apellidos y nombre o Razón social. 60 posiciones
        //doctxt += padTxt(limpiarChar(request.getParameter('declarantenombre').toUpperCase()),20); // Nombre. 20 Posiciones
        doctxt += request.getParameter('ejerciciosel');; // Ejercicio del devengo. 4 posiciones
        doctxt += request.getParameter('xperiodo'); // Periodo. 2 Posiciones
        //POS437 - Identificación (1) - Tributación exclusivamente foral. Sujeto pasivo que tributa exclusivamente a una Administración tributaria Foral con IVA a la importación liquidado por la Aduana pendiente de ingreso
        if(request.getParameter('xsujetopasivo') == "T"){
            doctxt += 1; 
        } else {
            doctxt += 2; 
        } 
        //POS438 Identificación (1) - Inscrito en el Registro de devolución mensual (Art. 30 RIVA) 
        if(request.getParameter('xriva') == "T"){
            doctxt += 1;            
        } else {
            doctxt += 2;        
        }
        //POS439 Identificación (1) - Tributa exclusivamente en Régimen Simplificado (RS) || "1" SI (sólo RS), "2" NO (RG + RS),"3" NO (sólo RG)            
        doctxt += request.getParameter('xregimensimplificado');

        //POS440 Identificación (1) - Autoliquidación conjunta || "1" SI, "2" NO
        if(request.getParameter('xautoliquidacion') == "T"){
            doctxt += 1; 
        } else {
            doctxt += 2; 
        }
        //POS441 Identificación (1) - Sujeto pasivo acogido al régimen especial del criterio de Caja (art. 163 undecies LIVA) || "1" SI, "2" NO
        if(request.getParameter('xcriteriocaja') == "T"){
            doctxt += 1; 
        } else {
            doctxt += 2; 
        } 

        //POS442 Identificación (1) - Sujeto pasivo destinatario de operaciones acogidas al régimen especial del criterio de caja || "1" SI, "2" NO
        if(request.getParameter('xdestinatariocriterio') == "T"){
            doctxt += 1; 
        } else {
            doctxt += 2; 
        }

        //POS443 Identificación (1) - Opción por la aplicación de la prorrata especial (art. 103.Dos.1º LIVA) || "1" SI, "2" NO
        if(request.getParameter('xaplprorrata') == "T"){
            doctxt += 1; 
        } else {
            doctxt += 2; 
        }

        //POS444 Identificación (1) - Revocación de la opción por la aplicación de la prorrata especial || "1" SI, "2" NO
        if(request.getParameter('xrenprorrata') == "T"){
            doctxt += 1; 
        } else {
            doctxt += 2; 
        }

        //POS445 Identificación (1) - Sujeto pasivo declarado en concurso de acreedores en el presente período de liquidación || "1" SI, "2" NO
        if(request.getParameter('xconcursoacree') == "T"){
            doctxt += 1; 
        } else {
            doctxt += 2; 
        }
        // Identificación (1) - Fecha en que se dictó el auto de declaración de concurso
        doctxt += padTxt("",8);
        //Identificación (1) - Auto de declaración de concurso dictado en el período || blanco NO,"1" SI Preconcursal, "2" SI Postconcursal
        doctxt += request.getParameter('xautodeclaracion');
        
        //POS455 Identificación (1) - Identificación (1) - Sujeto pasivo acogido voluntariamente al SII || "1" SI, "2" NO
        if(request.getParameter('xacogidosii') == "T"){
            doctxt += 1; 
        } else {
            doctxt += 2; 
        }

        //POS456 Identificación (1) - ¿Está exonerado de la Declaración-resumen anual del IVA, modelo 390? || Para todos los periodos distintos del último (12 y 4T) || Sí = 1 || No = 2	
        if(request.getParameter('xperiodo') == "12" || request.getParameter('xperiodo') == "4T"){
            if(request.getParameter('xexonerado') == "T"){
                doctxt += 1;
            }else{
                doctxt += 2;
            }
        }else{
            doctxt += 0;
        }

        //POS457  Identificación (1) - Sujeto pasivo con volumen anual de operaciones distinto de cero (art. 121 LIVA) || "0" ültimo Periodo , "1" SI, "2" NO
        if(request.getParameter('xvoloperaciones') == "00"){
            doctxt += 0; 
        } else if (request.getParameter('xvoloperaciones') == "01"){
            if(request.getParameter('xperiodo') == "12" && request.getParameter('xperiodo') == "4T"){
                doctxt += 0; 
            }else{
                doctxt += 1; 
            }
        }else{
            if(request.getParameter('xperiodo') == "12" && request.getParameter('xperiodo') == "4T"){
                doctxt += 0; 
            }else{
                doctxt += 2; 
            }
        }


        
        
        
        

        /*********************************************************** IVA ****************************************/

        var base4 = 0;
        var base10 = 0;
        var base21 = 0;
        var baseRE = 0;
        var imp4 = 0;
        var imp10 = 0;
        var imp21 = 0;
        var impRE52 = 0;
        var impRE21 = 0;
        var baseS = 0;
        var TipoS = 0;
        var ImpTot = 0;
        var ImpS = 0;
        var baseAdq = 0;
        var impAdq = 0;
        var baseAdqS = 0;
        var impAdqS = 0;
        var totalCuota = 0;
        var baseDed = 0;
        var impDed = 0;
        var baseBienes = 0;
        var imprBienes = 0;
        var totalDeducir = 0;
        var resGen = 0;
        var entregasIntracom = 0;
        var exportaciones = 0;
        var operacionesNosujetas = 0;
        var operacionesSujetasISP= 0;
        var interioresBIBase = 0;
        var importacionesBIBase = 0;
        var intracomunitariasBIBase = 0;
        var interioresBIImp = 0;
        var importacionesBIImp = 0;
        var intracomunitariasBIImp = 0;
        var adqIntraBase = 0;
        var adqINtraImp = 0;
        var baseCas14 = 0;
        var impCas15 = 0;
        var baseCas12 = 0;
        var impCas13 = 0;
        var baseRecDed = 0;
        var impRecDed = 0;



        for (var i=1; i <= request.getLineItemCount('custpage_303_sublist'); i++){
            var tasa = request.getLineItemValue('custpage_303_sublist', 'xtasa', i);
            var codCE = request.getLineItemValue('custpage_303_sublist', 'xcodigoce', i);
            var impor = request.getLineItemValue('custpage_303_sublist', 'ximportacion', i);
            var exporta = request.getLineItemValue('custpage_303_sublist', 'xexportar', i);;
            var disp = request.getLineItemValue('custpage_303_sublist', 'xtipoop', i);
            var operaNo = request.getLineItemValue('custpage_303_sublist', 'xnosujeto', i);
            var bienesInv = request.getLineItemValue('custpage_303_sublist', 'xbienesinversion', i);
            var tasaParent = request.getLineItemValue('custpage_303_sublist', 'xtasaparent', i);
            var esServicio = request.getLineItemValue('custpage_303_sublist', 'xservicio', i);
            var autorepercutido = request.getLineItemValue('custpage_303_sublist', 'xautorepercutido', i);
            
            //Devengado - Base e Impuestos 4% [01][03]
            if ((tasa == 4 && (disp == "CustInvc" || disp == "CashSale") && operaNo == null)){
                var tasa4 = i;
                base4 = (parseFloat(parseFloat(base4) + parseFloat(request.getLineItemValue('custpage_303_sublist', 'xbaseimp', i))).toFixed(2)).toString();
                imp4 = (parseFloat(parseFloat(imp4) + parseFloat(request.getLineItemValue('custpage_303_sublist', 'ximpuestos', i))).toFixed(2)).toString();
            }
            //Devengado - Base e Impuestos 10% [04][06]
            if ((tasa == 10 && (disp == "CustInvc" || disp == "CashSale") && operaNo == null)){
                var tasa10 = i;
                base10 = (parseFloat(parseFloat(base10) + parseFloat(request.getLineItemValue('custpage_303_sublist', 'xbaseimp', i))).toFixed(2)).toString();
                imp10 = (parseFloat(parseFloat(imp10) + parseFloat(request.getLineItemValue('custpage_303_sublist', 'ximpuestos', i))).toFixed(2)).toString();
                
            }
            //Devengado - Base e Impuestos 21% [07][09]
            if ((tasa == 21 && (disp == "CustInvc" || disp == "CashSale") && operaNo == null)){
                var tasa21 = i;
                base21 = (parseFloat(parseFloat(base21) + parseFloat(request.getLineItemValue('custpage_303_sublist', 'xbaseimp', i))).toFixed(2)).toString();
                imp21 = (parseFloat(parseFloat(imp21) + parseFloat(request.getLineItemValue('custpage_303_sublist', 'ximpuestos', i))).toFixed(2)).toString();
                
            }
            //Devengado - Otras operaciones con inversión del sujeto pasivo (excepto. adq. intracom) [12][13]
            if(((impor != "T" && codCE != "T") && autorepercutido == "T" && bienesInv != "T" && (disp == "VendBill" || disp == "CardChrg" || disp == "VendCred" || disp == "CardRfnd"))
            || ((impor == "T" && codCE != "T") && autorepercutido == "T" && bienesInv != "T" && esServicio == "T" && (disp == "VendBill" || disp == "CardChrg" || disp == "VendCred" || disp == "CardRfnd"))){
                var cas12 = i;
                baseCas12 = (parseFloat(parseFloat(baseCas12) + parseFloat(request.getLineItemValue('custpage_303_sublist', 'xbaseimp', i))).toFixed(2)).toString();
                impCas13= (parseFloat(parseFloat(impCas13) + parseFloat(request.getLineItemValue('custpage_303_sublist', 'ximpuestos', i))).toFixed(2)).toString();
            }
            //Devengado - Modificación bases y cuotas [14][15]
            if((disp == "CustCred" || disp == "CashRfnd")  && operaNo == null && (tasa == 10 || tasa == 4 || tasa == 21)){
                var cas14 = i;
                baseCas14 = (parseFloat(parseFloat(baseCas14) + parseFloat(request.getLineItemValue('custpage_303_sublist', 'xbaseimp', i)) * -1).toFixed(2)).toString();
                impCas15 = (parseFloat(parseFloat(impCas15) + parseFloat(request.getLineItemValue('custpage_303_sublist', 'ximpuestos', i))).toFixed(2)).toString();
            }
            //Devengado - Base e Impuestos 26% [16][17][18]
            if ((tasa == 26.20 && (disp == "CustInvc" || disp == "CashSale")) || (tasa == 26.20 && (disp == "CustCred" || disp == "CashRfnd"))){
                var tasaRE = i;
                var tasa21 = i;
                baseRE = (parseFloat(parseFloat(baseRE) + parseFloat(request.getLineItemValue('custpage_303_sublist', 'xbaseimp', i))).toFixed(2)).toString();
                base21 = (parseFloat(parseFloat(base21) + parseFloat(request.getLineItemValue('custpage_303_sublist', 'xbaseimp', i))).toFixed(2)).toString();

                //Calculamos Impuestos de Recargo de Equiivalencia para el 21% y el 5,2%
                impRE52 = (parseFloat(parseFloat(impRE52)+parseFloat(request.getLineItemValue('custpage_303_sublist', 'xbaseimp', i)*parseFloat(-0.052))).toFixed(2)).toString();
                imp21 = (parseFloat(parseFloat(imp21)+parseFloat(request.getLineItemValue('custpage_303_sublist', 'xbaseimp', i)*parseFloat(-0.21))).toFixed(2)).toString();
               
            }
            //Adquisiciones Intracomunitarias [10][11][36][37]
            if (tasa == 0 && codCE == "T" && tasaParent > 0 && (disp == "VendBill" || disp == "CardChrg" || disp == "VendCred" || disp == "CardRfnd")){
                if(bienesInv == "T"){
                    var baseAdqIntra = i;
                    adqIntraBase = (parseFloat(parseFloat(adqIntraBase) + parseFloat(request.getLineItemValue('custpage_303_sublist', 'xbaseimp', i))).toFixed(2)).toString();
                    adqINtraImp = (parseFloat(parseFloat(adqINtraImp) + parseFloat(request.getLineItemValue('custpage_303_sublist', 'ximpuestos', i))).toFixed(2)).toString();
                }else{
                    var baseContador = i;
                    //nlapiLogExecution("ERROR", "autorep " + request.getLineItemValue('custpage_303_sublist', 'xnumlinea', i), request.getLineItemValue('custpage_303_sublist', 'ximpuestos', i))
                    baseAdq = (parseFloat(parseFloat(baseAdq) + parseFloat(request.getLineItemValue('custpage_303_sublist', 'xbaseimp', i))).toFixed(2)).toString();
                    impAdq = (parseFloat(parseFloat(impAdq) + parseFloat(request.getLineItemValue('custpage_303_sublist', 'ximpuestos', i))).toFixed(2)).toString();
                }
               
            }
            //Deducible - Base Deducción [28][29]
            if (((tasa == 4 && (disp == "VendBill" || disp == "CardChrg") && bienesInv != "T" && impor != "T") 
              || (tasa == 10 && (disp == "VendBill" || disp == "CardChrg") && bienesInv != "T" && impor != "T") 
              || (tasa == 21 && (disp == "VendBill" || disp == "CardChrg") && bienesInv != "T" && impor != "T")) 
              || (codCE != "T" && autorepercutido == "T" && bienesInv != "T" /*&& esServicio == "T"*/ && (disp == "VendBill" || disp == "CardChrg" || disp == "VendCred" || disp == "CardRfnd")) /*|| (tasa == 0 && disp == "VendBill" && impor != "T" && codCE != "T" && autorepercutido != "T")*/)
              
            {
                var tasaDed = i;
                baseDed = (parseFloat(parseFloat(baseDed) + parseFloat(request.getLineItemValue('custpage_303_sublist', 'xbaseimp', i))).toFixed(2)).toString();
                impDed = (parseFloat(parseFloat(impDed) + parseFloat(request.getLineItemValue('custpage_303_sublist', 'ximpuestos', i))).toFixed(2)).toString();
            }
            // Importaciones Bienes Corrientes [32][33]
            if(impor == "T" && bienesInv != "T" && esServicio != "T" && (disp == "VendBill" || disp == "CardChrg" || disp == "VendCred" || disp == "CardRfnd")){
                var tasaBien = i;
                baseBienes = (parseFloat(parseFloat(baseBienes) + parseFloat(request.getLineItemValue('custpage_303_sublist', 'xbaseimp', i))).toFixed(2)).toString();
                imprBienes = (parseFloat(parseFloat(imprBienes) + parseFloat(request.getLineItemValue('custpage_303_sublist', 'ximpuestos', i))).toFixed(2)).toString();
            }
            //Entregas Intracomunitarias [59]
            if(codCE == "T" && ((disp == "CustCred" || disp == "CashRfnd") || (disp == "CustInvc" || disp == "CashSale"))){
                entregasIntracom = (parseFloat(parseFloat(entregasIntracom) + parseFloat(request.getLineItemValue('custpage_303_sublist', 'xbaseimp', i)  * -1)).toFixed(2)).toString();
            }
             //Exportaciones y operaciones asimiladas [60]
            if(exporta == "T" && ((disp == "CustCred" || disp == "CashRfnd") || (disp == "CustInvc" || disp == "CashSale"))){
                exportaciones = (parseFloat(parseFloat(exportaciones) + parseFloat(request.getLineItemValue('custpage_303_sublist', 'xbaseimp', i) * -1)).toFixed(2)).toString();
            }
            
            //Operaciones No Sujetas [61]
            if(operaNo != null &&  bienesInv != "T" && ((disp == "CustInvc" || disp == "CashSale") || (disp == "CustCred" || disp == "CashRfnd")) && exporta != "T" && codCE != "T"){
                operacionesNosujetas = (parseFloat(parseFloat(operacionesNosujetas) + parseFloat(request.getLineItemValue('custpage_303_sublist', 'xbaseimp', i) * -1)).toFixed(2)).toString();
            }

            //Operaciones Sujetas con Inversion del sujeto pasivo [122]
            if(operaNo == null &&  bienesInv != "T" && ((disp == "CustInvc" || disp == "CashSale") || (disp == "CustCred" || disp == "CashRfnd")) && exporta != "T" && codCE != "T" && autorepercutido == "T"){
                operacionesSujetasISP = (parseFloat(parseFloat(operacionesSujetasISP) + parseFloat(request.getLineItemValue('custpage_303_sublist', 'xbaseimp', i) * -1)).toFixed(2)).toString();
            }
            
            //IVA Bienes Inversion [30],[31],[34],[35],[38],[39]
            if(bienesInv == "T" && (disp == "VendBill" || disp == "CardChrg")){
                if(impor == "T"){
                    var tasaBIImp = i;
                    //Bienes Inversión de Importaciones
                    importacionesBIBase = (parseFloat(parseFloat(importacionesBIBase) + parseFloat(request.getLineItemValue('custpage_303_sublist', 'xbaseimp', i))).toFixed(2)).toString();
                    importacionesBIImp = (parseFloat(parseFloat(importacionesBIImp) + parseFloat(request.getLineItemValue('custpage_303_sublist', 'ximpuestos', i))).toFixed(2)).toString();
                } else if(codCE == "T"){
                    var tasaBIIntra = i;
                    intracomunitariasBIBase = (parseFloat(parseFloat(intracomunitariasBIBase) + parseFloat(request.getLineItemValue('custpage_303_sublist', 'xbaseimp', i))).toFixed(2)).toString();
                    intracomunitariasBIImp = (parseFloat(parseFloat(intracomunitariasBIImp) + parseFloat(request.getLineItemValue('custpage_303_sublist', 'ximpuestos', i))).toFixed(2)).toString();
                }else{
                    var tasaBIInt = i;
                    interioresBIBase = (parseFloat(parseFloat(interioresBIBase) + parseFloat(request.getLineItemValue('custpage_303_sublist', 'xbaseimp', i))).toFixed(2)).toString();
                    interioresBIImp = (parseFloat(parseFloat(interioresBIImp) + parseFloat(request.getLineItemValue('custpage_303_sublist', 'ximpuestos', i))).toFixed(2)).toString();
                }

            }
            //Deducible - Rectificación de deducciones [40][41]
            if (((tasa == 4 && (disp == "VendCred" || disp == "CardRfnd")) || (tasa == 10 && (disp == "VendCred" || disp == "CardRfnd")) || (tasa == 21 && (disp == "VendCred" || disp == "CardRfnd"))) || ((disp == "VendCred" || disp == "CardRfnd") && impor == "T" && codCE != "T" && autorepercutido != "T")){
                var tasaRecDed = i;
                baseRecDed = (parseFloat(parseFloat(baseRecDed) + parseFloat(request.getLineItemValue('custpage_303_sublist', 'xbaseimp', i))).toFixed(2)).toString();
                impRecDed = (parseFloat(parseFloat(impRecDed) + parseFloat(request.getLineItemValue('custpage_303_sublist', 'ximpuestos', i) * -1)).toFixed(2)).toString();
            }

        }

        /*********************************************************** IVA DEVENGADO  ****************************************/
       
        // IVA Devengado - Regimen General 
        if (tasa4 != null){
            baseS = base4.split(".");
            tipoS = (request.getLineItemValue('custpage_303_sublist', 'xtasa', tasa4)).split(".");
            ImpTot = imp4;
            ImpS = ImpTot.split(".");
            if (baseS[0] < 0){
                doctxt += padNum(-baseS[0],15);//[01]
            } else {
                doctxt += padNum(baseS[0],15);//[01]
            }
            doctxt += padNum(baseS[1],2);//[01]
            doctxt += padNum(tipoS[0],3);//[02]
            doctxt += padNum(tipoS[1],2);//[02]
            if (ImpS[0] < 0){
                doctxt += padNum(-ImpS[0],15);//[03]
                ImpTot = -ImpTot;
            } else {
                doctxt += padNum(ImpS[0],15);//[03]
            } 
            doctxt += padNum(ImpS[1],2);//[03]
            totalCuota = (parseFloat(parseFloat(totalCuota) + parseFloat(ImpTot)).toFixed(2)).toString();
           // nlapiLogExecution('debug',"03:",ImpTot ? ImpTot : 0);
        } else {
            doctxt += padNum("0",17);//[01]
            doctxt += padNum("0",5);//[02]
            doctxt += padNum("0",17);//[03]
        }
        
        if (tasa10 != null){
            baseS = base10.split(".");
            tipoS = (request.getLineItemValue('custpage_303_sublist', 'xtasa', tasa10)).split(".");
            ImpS = imp10.split(".");
            ImpTot = imp10;
            if (baseS[0] < 0){
                doctxt += padNum(-baseS[0],15);//[04]
            } else {
                doctxt += padNum(baseS[0],15);//[04]
            }
            doctxt += padNum(baseS[1],2);//[04]
            doctxt += padNum(tipoS[0],3);//[05]
            doctxt += padNum(tipoS[1],2);//[05]
            if (ImpS[0] < 0){
                doctxt += padNum(-ImpS[0],15);//[06]
                ImpTot = -ImpTot;
            } else {
                doctxt += padNum(ImpS[0],15);//[06]
            } 
            doctxt += padNum(ImpS[1],2);//[06]
            
            totalCuota = (parseFloat(parseFloat(totalCuota) + parseFloat(ImpTot)).toFixed(2)).toString();
           // nlapiLogExecution('debug',"06:",ImpTot ? ImpTot : 0);
        } else {
            doctxt += padNum("0",17);//[04]
            doctxt += padNum("0",5);//[05]
            doctxt += padNum("0",17);//[06]
        }
        

        if (tasa21 != null){
            
            baseS = base21.split(".");
            tipoS = (request.getLineItemValue('custpage_303_sublist', 'xtasa', tasa21)).split(".");
            ImpS = imp21.split(".");
            ImpTot = imp21;
            if (baseS[0] < 0){
                doctxt += padNum(-baseS[0],15);//[07]
            } else {
                doctxt += padNum(baseS[0],15);//[07]
            }
            doctxt += padNum(baseS[1],2);//[07]
            doctxt += padNum(tipoS[0],3);//[08]
            doctxt += padNum(tipoS[1],2);//[08]

            if (ImpS[0] < 0){
                doctxt += padNum(-ImpS[0],15);//[09]
                ImpTot = -ImpTot;
            } else {
                doctxt += padNum(ImpS[0],15);//[09]
            } 
            doctxt += padNum(ImpS[1],2);//[09]
            
            totalCuota = (parseFloat(parseFloat(totalCuota) + parseFloat(ImpTot)).toFixed(2)).toString();
           // nlapiLogExecution('debug',"09:",ImpTot ? ImpTot : 0);
        } else {
            doctxt += padNum("0",17);//[07]
            doctxt += padNum("0",5);//[08]
            doctxt += padNum("0",17);//[09]
        }
        

        // IVA Devengado - Adquisiciones Intracomunitarias
        if(baseContador != null){
            var baseAdqS = baseAdq.split(".");
            var impAdqS = impAdq.split(".");
            if (baseAdqS[0] < 0){
                doctxt += padNum(-baseAdqS[0],15);//[10]
            } else {
                doctxt += padNum(baseAdqS[0],15);//[10]
            }
            doctxt += padNum(baseAdqS[1],2);//[10]
            
            if (impAdqS[0] < 0){
                doctxt += padNum(-impAdqS[0],15);//[11]
                impAdq = -impAdq;
            } else {
                doctxt += padNum(impAdqS[0],15);//[11]
            }
            doctxt += padNum(impAdqS[1],2);//[11]

            totalCuota = (parseFloat(parseFloat(totalCuota) + parseFloat(impAdq)).toFixed(2)).toString();
           // nlapiLogExecution('debug',"11:",impAdq ? impAdq : 0);
        } else {
            doctxt += padNum("0",17);//[10]
            doctxt += padNum("0",17);//[11]
        }
        
        
 
        // IVA Devengado - Otras operaciones con inversión del sujeto pasivo (excepto. adq. intracom)
        if(!!cas12){
            var baseCas12S = baseCas12.split(".");
            var impCas13S = impCas13.split(".");
            if (baseCas12S[0] < 0){
                doctxt += padNum(-baseCas12S[0],15);//[12]
            } else {
                doctxt += padNum(baseCas12S[0],15);//[12]
            }
            doctxt += padNum(baseCas12S[1],2);//[12]
            
            if (impCas13S[0] < 0){
                doctxt += padNum(-impCas13S[0],15);//[13]
                impCas13 = -impCas13;
            } else {
                doctxt += padNum(impCas13S[0],15);//[13]
            }
            doctxt += padNum(impCas13S[1],2);//[13]

            totalCuota = (parseFloat(parseFloat(totalCuota) + parseFloat(impCas13)).toFixed(2)).toString();
           // nlapiLogExecution('debug',"13:",impCas13 ? impCas13 : 0);
        } else {
            doctxt += padNum("0",17);//[12]
            doctxt += padNum("0",17);//[13]
        }

        


        // IVA Devengado - Modificación bases y cuota
        if(!!cas14){
            var baseCas14S = baseCas14.split(".");
            var impCas15S = impCas15.split(".");
            if (baseCas14S[0] < 0){
                doctxt += "N";
                doctxt += padNum(-baseCas14S[0],14);//[14]
            } else {
                doctxt += padNum(baseCas14S[0],15);//[14]
            }
            doctxt += padNum(baseCas14S[1],2);//[14]
            
            if (impCas15S[0] < 0){
                doctxt += "N";
                doctxt += padNum(-impCas15S[0],14);//[15]
                impAdq = -impAdq;
            } else {
                doctxt += padNum(impCas15S[0],15);//[15]
            }
            doctxt += padNum(impCas15S[1],2);//[15]

            totalCuota = (parseFloat(parseFloat(totalCuota) + parseFloat(impCas15)).toFixed(2)).toString();
           // nlapiLogExecution('debug',"15:",impCas15 ? impCas15 : 0);
        } else {
            doctxt += padNum("0",17);//[14]
            doctxt += padNum("0",17);//[15]
        }

        

        // IVA Devengado - Recargo Equivalencia 5,2%
        if (tasaRE != null){
            baseS = baseRE.split(".");
            tipoS = (request.getLineItemValue('custpage_303_sublist', 'xtasa', tasaRE)).split(".");
            ImpS = impRE52.split(".");
            ImpTot = impRE52;
            if (baseS[0] < 0){
                doctxt += padNum(-baseS[0],15);//[16]
            } else {
                doctxt += padNum(baseS[0],15);//[16]
            }
            doctxt += padNum(baseS[1],2);//[16]
            
            doctxt += padNum("00520",5);//[17]
 
            if (ImpS[0] < 0){
                doctxt += padNum(-ImpS[0],1);//[18]
                ImpTot = -ImpTot;
            } else {
                doctxt += padNum(ImpS[0],15);//[18]
            } 
            doctxt += padNum(ImpS[1],2);//[18]
            totalCuota = (parseFloat(parseFloat(totalCuota) + parseFloat(ImpTot)).toFixed(2)).toString();
           // nlapiLogExecution('debug',"18:",ImpTot ? ImpTot : 0);
        }else{
            doctxt += padNum("0",17);//[16]
            doctxt += padNum("00520",5);//[17]
            doctxt += padNum("0",17);//[18]
        }
        
        

        doctxt += padNum("0",17);//[19]
        doctxt += padNum("00140",5);//[20]
        doctxt += padNum("0",17);//[21]
        doctxt += padNum("0",17);//[22]
        doctxt += padNum("0",5);//[23]
        doctxt += padNum("0",17);//[24]
        
        // IVA Devengado - Modificación bases y cuota Recargo de Equivalencia
        doctxt += padNum("0",17);//[25] SI ES NEGATIVO LLEVA UNA N DELANTE
        doctxt += padNum("0",17);//[26] SI ES NEGATIVO LLEVA UNA N DELANTE
        // IVA Devengado - Total Quota Devengada
        nlapiLogExecution('debug',"Total: "+totalCuota);
  		if(totalCuota == 0){
          totalCuota = "0.00"
        }

        var totalCuotaSpl = totalCuota.split(".");
        if (totalCuotaSpl[0] < 0){
            doctxt += "N";
            doctxt += padNum(-totalCuotaSpl[0],14);//[27] SI ES NEGATIVO LLEVA UNA N DELANTE
        } else {
            doctxt += padNum(totalCuotaSpl[0],15);//[27]
        }
        doctxt += padNum(totalCuotaSpl[1],2);//[27]
        
        /*************************IVA DEDUCIBLE*************************************/

        // IVA Deducible - Por cuotas soportadas en operaciones interiores corrientes 
        if(tasaDed != null){
            var baseDedS = baseDed.split(".");
            var impDedS = impDed.split(".");
            if (baseDedS[0] < 0){
                doctxt += padNum(-baseDedS[0],15);//[28]
            } else {
                doctxt += padNum(baseDedS[0],15);//[28]
            }
            doctxt += padNum(baseDedS[1],2); //[28]

            if (impDedS[0] < 0){
                doctxt += padNum(-impDedS[0],15);//[29]
                impDed = -impDed;
            } else {
                doctxt += padNum(impDedS[0],15);//[29]
            }
            doctxt += padNum(impDedS[1],2);//[29]
         }else{
            doctxt += padNum("0",17);//[28]
            doctxt += padNum("0",17);//[29]
         }
        totalDeducir = (parseFloat(parseFloat(totalDeducir) + parseFloat(impDed)).toFixed(2)).toString();

        // IVA Deducible - Por cuotas soportadas en operaciones interiores con bienes de inversión [30][31]
        if(tasaBIInt != null){
            var baseBIINteriores = interioresBIBase.split(".");
            var impBIINteriores = interioresBIImp.split(".");
            if (baseBIINteriores[0] < 0){
                doctxt += padNum(-baseBIINteriores[0],15);//[30]
            } else {
                doctxt += padNum(baseBIINteriores[0],15);//[30]
            }
            doctxt += padNum(baseBIINteriores[1],2); //[30]

            if (impBIINteriores[0] < 0){
                doctxt += padNum(-impBIINteriores[0],15);//[31]
                interioresBIImp = -interioresBIImp;
            } else {
                doctxt += padNum(impBIINteriores[0],15);//[31]
            }
            doctxt += padNum(impBIINteriores[1],2);//[31]
         }else{
            doctxt += padNum("0",17);//[30]
            doctxt += padNum("0",17);//[31]
         }
         totalDeducir = (parseFloat(parseFloat(totalDeducir) + parseFloat(interioresBIImp)).toFixed(2)).toString();

        // IVA Deducible - Por cuotas soportadas en las importaciones de bienes corrientes [32][33]

        if(tasaBien != null && request.getParameter('xivadiferido') == "F"){
            var baseBienesS = baseBienes.split(".");
            var imprBienesS = imprBienes.split(".");
            if (baseBienesS[0] < 0){
                doctxt += padNum(-baseBienesS[0],15);//[32]
            } else {
                doctxt += padNum(baseBienesS[0],15);//[32]
            }
            doctxt += padNum(baseBienesS[1],2); //[32]

            if (imprBienesS[0] < 0){
                doctxt += padNum(-imprBienesS[0],15);//[33]
                imprBienes = -imprBienes;
            } else {
                doctxt += padNum(imprBienesS[0],15);//[33]
            }
            doctxt += padNum(imprBienesS[1],2);//[33]
        } else{
            doctxt += padNum("0",17);//[32]
            doctxt += padNum("0",17);//[33]
            imprBienes = 0;
        }
        totalDeducir = (parseFloat(parseFloat(totalDeducir) + parseFloat(imprBienes)).toFixed(2)).toString();

        // IVA Deducible - Por cuotas soportadas en las importaciones de bienes de inversión
        if(tasaBIImp != null){
            var baseBIImp = importacionesBIBase.split(".");
            var impBIImp = importacionesBIImp.split(".");
            if (baseBIImp[0] < 0){
                doctxt += padNum(-baseBIImp[0],15);//[34]
            } else {
                doctxt += padNum(baseBIImp[0],15);//[34]
            }
            doctxt += padNum(baseBIImp[1],2); //[34]

            if (impBIImp[0] < 0){
                doctxt += padNum(-impBIImp[0],15);//[35]
                importacionesBIImp = -importacionesBIImp;
            } else {
                doctxt += padNum(impBIImp[0],15);//[35]
            }
            doctxt += padNum(impBIImp[1],2);//[35]
         }else{
            doctxt += padNum("0",17);//[34]
            doctxt += padNum("0",17);//[35]
         }
         totalDeducir = (parseFloat(parseFloat(totalDeducir) + parseFloat(importacionesBIImp)).toFixed(2)).toString();
        // IVA Deducible - En adquisiciones intracomunitarias de bienes y servicios corrientes
       if(baseContador != null){
            if (baseAdqS[0] < 0){
                doctxt += padNum(-baseAdqS[0],15);//[36]
            } else {
                doctxt += padNum(baseAdqS[0],15);//[36]
            }
            doctxt += padNum(baseAdqS[1],2);//[36]
            if(impAdq < 0){
                impAdq = -impAdq;
            }
            if (impAdqS[0] < 0){
                doctxt += padNum(-impAdqS[0],15);//[37]   
            } else {
                doctxt += padNum(impAdqS[0],15);//[37]  
            }
            doctxt += padNum(impAdqS[1],2);//[37]
            totalDeducir = (parseFloat(parseFloat(totalDeducir) + parseFloat(impAdq)).toFixed(2)).toString();
        } else {
            doctxt += padNum("0",17);//[36]
            doctxt += padNum("0",17);//[37]
        }
        
        
        // IVA Deducible - En adquisiciones intracomunitarias de bienes de inversión
        if(tasaBIIntra != null){
            var baseBIIntra = intracomunitariasBIBase.split(".");
            var impBIIntra = intracomunitariasBIImp.split(".");
            if (baseBIIntra[0] < 0){
                doctxt += padNum(-baseBIIntra[0],15);//[38]
            } else {
                doctxt += padNum(baseBIIntra[0],15);//[38]
            }
            doctxt += padNum(baseBIIntra[1],2); //[38]

            if (impBIIntra[0] < 0){
                doctxt += padNum(-impBIIntra[0],15);//[39]
                intracomunitariasBIImp = -intracomunitariasBIImp;
            } else {
                doctxt += padNum(impBIIntra[0],15);//[39]
            }
            doctxt += padNum(impBIIntra[1],2);//[39]
         }else{
            doctxt += padNum("0",17);//[38]
            doctxt += padNum("0",17);//[39]
         }
         totalDeducir = (parseFloat(parseFloat(totalDeducir) + parseFloat(intracomunitariasBIImp)).toFixed(2)).toString();

        // IVA Deducible - Rectificación de deducciones
        if(!!tasaRecDed){
            var baseRecDedS = baseRecDed.split(".");
            var impRecDedS = impRecDed.split(".");
            if (baseRecDedS[0] < 0){
                doctxt += "N";
                doctxt += padNum(-baseRecDedS[0],14);//[40]
            } else {
                doctxt += padNum(baseRecDedS[0],15);//[40]
            }
            doctxt += padNum(baseRecDedS[1],2); //[40]

            if (impRecDedS[0] < 0){
                doctxt += "N";
                doctxt += padNum(-impRecDedS[0],14);//[41]
                impDed = -impDed;
            } else {
                doctxt += padNum(impRecDedS[0],15);//[41]
            }
            doctxt += padNum(impRecDedS[1],2);//[41]
         }else{
            doctxt += padNum("0",17);//[41]
            doctxt += padNum("0",17);//[41]
         }
        totalDeducir = (parseFloat(parseFloat(totalDeducir) + parseFloat(impRecDed)).toFixed(2)).toString();
       
        // IVA Deducible - Compensaciones Régimen Especial A.G. y P. - Cuota [42] SI ES NEGATIVO LLEVA UNA N DELANTE
        doctxt += padNum("0",17);//[42]
        
        // Regularización inversiones - Cuota [43] SI ES NEGATIVO LLEVA UNA N DELANTE
        doctxt += padNum("0",17);//[43]

        // IVA Deducible - Regularización por aplicación del porcentaje definitivo de prorrata
        doctxt += padNum("0",17);//[44] SI ES NEGATIVO LLEVA UNA N DELANTE

        // IVA Deducible - Total a deducir
        var totalDeducirS = totalDeducir.split(".");
        if (totalDeducirS[0] < 0){
            doctxt += "N";
            doctxt += padNum(-totalDeducirS[0],14);//[45] SI ES NEGATIVO LLEVA UNA N DELANTE
        } else {
            doctxt += padNum(totalDeducirS[0],15);//[45]
        }
        doctxt += padNum(totalDeducirS[1],2);//[45]

        // IVA Deducible - Resultado régimen general
        resGen = (parseFloat(parseFloat(totalCuota) - parseFloat(totalDeducir)).toFixed(2)).toString();
        var resGenS = resGen.split(".");
        if (resGenS[0] < 0){
            doctxt += "N";
            doctxt += padNum(-resGenS[0],14);//[46] SI ES NEGATIVO LLEVA UNA N DELANTE
        } else {
            doctxt += padNum(resGenS[0],15);//[46]
        }
        doctxt += padNum(resGenS[1],2);//[46]

        
        /**********************FIN IVA **********************************/
        /* Se ha intentado realizar una carga del ejercicio 2018 con la opción Presentación 2018 y solicita que se informen los cambios del 2019. Temporalmente metemos los valores a "fuego"*/
  
        

        doctxt += padTxt("",613);//Reservardo AEAT. Blancos; 600 en versión 2021

        doctxt += "</T30301000>"; //  Constante "</T30301000>"
    //Página 2 - Actividades Agricolas
        if(request.getParameter('xregimensimplificado') != "3"){
            doctxt += "<T"; // Constante "<T"    
            doctxt += "303"; // Constante "303" 
            doctxt += "02000"; // Constante Página
            doctxt += ">"; // Constante ">"
            doctxt += " "; // Indicador de página complementaria. Blanco (No complementaria) o "C" (Complementaria)
            /*********************************************************** IVA *****************************************/
            doctxt += padNum("0",1092);//Reservardo AEAT. Blancos; 590
            doctxt += padTxt("",590);//Reservardo AEAT. Blancos; 590
            doctxt += "</T30302000>"; //  Constante "</T30301000>"
        }
        //Página 3
            doctxt += "<T"; // Constante "<T"    
            doctxt += "303"; // Constante "303" 
            doctxt += "03000"; // Constante Página
            doctxt += ">"; // Constante ">"
        /*********************************************************** Información adicional ****************************************/
        // Entregas intracomunitarias de bienes y servicios
        if(entregasIntracom == 0){
            entregasIntracom = "0.00";
        } 
        var entregasIntracomS = entregasIntracom.split(".");
        if (entregasIntracomS[0] < 0){
            doctxt += "N";
            doctxt += padNum(-entregasIntracomS[0],14);//[59]
        } else {
            doctxt += padNum(entregasIntracomS[0],15);//[59]
        }
        doctxt += padNum(entregasIntracomS[1],2);//[59]

        //Exportaciones y operaciones asimiladas
        if(exportaciones == 0){
            exportaciones = "0.00";
        } 
        var exportacionesS = exportaciones.split(".");
        if (exportacionesS[0] < 0){
            doctxt += "N";
            doctxt += padNum(-exportacionesS[0],14);//[60]
        } else {
            doctxt += padNum(exportacionesS[0],15);//[60]
        }
        doctxt += padNum(exportacionesS[1],2);//[60]

        //CAMBIO 07.2021 OSS
		
		if (
            parseInt(request.getParameter('ejerciciosel')) > 2021 
            ||
            (
                parseInt(request.getParameter('ejerciciosel')) == 2021 && 
                (request.getParameter('xperiodo') == "07" || request.getParameter('xperiodo') == "08" || request.getParameter('xperiodo') == "09" || request.getParameter('xperiodo') == "10" || request.getParameter('xperiodo') == "11" || request.getParameter('xperiodo') == "12" || request.getParameter('xperiodo') == "3T" || request.getParameter('xperiodo') == "4T" )
            )
        )
    {
        doctxt += padNum("0",17);
    }

    // Operaciones no sujetas
    if(operacionesNosujetas == 0){
        operacionesNosujetas = "0.00";
    } 
    var operacionesNosujetasS = operacionesNosujetas.split(".");
    if (operacionesNosujetasS[0] < 0){
        doctxt += "N";
        doctxt += padNum(-operacionesNosujetasS[0],14);//[61]
    } else {
        doctxt += padNum(operacionesNosujetasS[0],15);//[61]
    }
    doctxt += padNum(operacionesNosujetasS[1],2);//[61]

    if (
            parseInt(request.getParameter('ejerciciosel')) > 2021 
            ||
            (
                parseInt(request.getParameter('ejerciciosel')) == 2021 && 
                (request.getParameter('xperiodo') == "07" || request.getParameter('xperiodo') == "08" || request.getParameter('xperiodo') == "09" || request.getParameter('xperiodo') == "10" || request.getParameter('xperiodo') == "11" || request.getParameter('xperiodo') == "12" || request.getParameter('xperiodo') == "3T" || request.getParameter('xperiodo') == "4T" )
            )
        )
    {
        //RESERVADOS AEAT
        doctxt += padNum("0",17);
        
        //[122]
        if(operacionesSujetasISP == 0){
            operacionesSujetasISP = "0.00";
        } 
        var operacionesSujetasISPS = operacionesSujetasISP.split(".");
        if (operacionesSujetasISPS[0] < 0){
            doctxt += "N";
            doctxt += padNum(-operacionesSujetasISPS[0],14);//[122]
        } else {
            doctxt += padNum(operacionesSujetasISPS[0],15);//[122]
        }
        doctxt += padNum(operacionesSujetasISPS[1],2);//[122]

        //RESERVADOS AEAT
        doctxt += padNum("0",17);
        doctxt += padNum("0",17);
    }else{
        //RESERVADOS AEAT
        doctxt += padNum("0",17);
        doctxt += padNum("0",17);
        doctxt += padNum("0",17);
        doctxt += padNum("0",17);
        doctxt += padNum("0",17);
    }     
    
    //FIN CAMBIO 07.2021 OSS
        
        // Bienes y prestaciones de servicios Criterio de caja
        doctxt += padNum("0",17);//[62]
        doctxt += padNum("0",17);//[63]
        doctxt += padNum("0",17);//[74]
        doctxt += padNum("0",17);//[75]
        doctxt += padNum("0",17);//[76]

        // Resultado - Suma de resultados
        if (resGenS[0] < 0){
            doctxt += "N";
            doctxt += padNum(-resGenS[0],14);//[64]
        } else {
            doctxt += padNum(resGenS[0],15);//[64]
        }
        doctxt += padNum(resGenS[1],2);//[64]

        //Resultado - % Atribuible a la Administración del Estado
        var atribuiblePorc = request.getParameter('xporcentatrib');
        var atribuiblePorcS = atribuiblePorc.split(".");
        doctxt +=  padNum(atribuiblePorcS[0],3);//[65]
        doctxt +=  padNum(atribuiblePorcS[1],2);//[65]
        //Resultado - Atribuible a la Administración del Estado
        var atribuible = (parseFloat(parseFloat(resGen*atribuiblePorc)/100).toFixed(2)).toString();
        var atribuibleS = atribuible.split(".");
        if (atribuibleS[0] < 0){
            doctxt += "N";
            doctxt += padNum(-atribuibleS[0],14);//[66]
        } else {
            doctxt += padNum(atribuibleS[0],15);//[66]
        }
        doctxt += padNum(atribuibleS[1],2);//[66]

        //Resultado - IVA a la importación liquidado por la Aduana pendiente de ingreso  [77]
        if(tasaBien != null && request.getParameter('xivadiferido') == "T"){
            //var baseBienesS = baseBienes.split(".");
            var imprBienesS = imprBienes.split(".");
            /*if (baseBienesS[0] < 0){
               // doctxt += padNum(-baseBienesS[0],15);//[32]
            } else {
                //doctxt += padNum(baseBienesS[0],15);//[32]
            }
            doctxt += padNum(baseBienesS[1],2); //[32]*/

            if (imprBienesS[0] < 0){
                doctxt += padNum(-imprBienesS[0],15);//[77]
                imprBienes = -imprBienes;
            } else {
                doctxt += padNum(imprBienesS[0],15);//[77]
            }
            doctxt += padNum(imprBienesS[1],2);//[77]
        } else{
            imprBienes = 0;
            doctxt += padNum("0",17);//[77]
        }

        nlapiLogExecution("AUDIT","xcuotascomp", request.getParameter('xcuotascomp'))
        //Resultado - Cuotas a compensar pendientes de periodos anteriores [110]
        var cuotasCompens = request.getParameter('xcuotascomp');
        if(cuotasCompens == null || cuotasCompens == ""){
            cuotasCompens = "0.00";
        }else{
            cuotasCompens = parseFloat(cuotasCompens).toFixed(2);
        }
        var cuotasCompensS = cuotasCompens.split(".");
        doctxt += padNum(cuotasCompensS[0],15);//[110]
        doctxt += padNum(cuotasCompensS[1],2);//[110]
        
        nlapiLogExecution("AUDIT","xcuotascompactual", request.getParameter('xcuotascompactual'))
        //Resultado - Cuotas a compensar de periodos anteriores aplicadas en este periodo [78]
        var cuotasCompensActual = request.getParameter('xcuotascompactual');
        if(cuotasCompensActual == null || cuotasCompensActual == ""){
            cuotasCompensActual = "0.00";
        }else{
            cuotasCompensActual = parseFloat(cuotasCompensActual).toFixed(2);
        }
        var cuotasCompensActS = cuotasCompensActual.split(".");
        doctxt += padNum(cuotasCompensActS[0],15);//[78]
        doctxt += padNum(cuotasCompensActS[1],2);//[78]

        nlapiLogExecution("AUDIT",cuotasCompens,cuotasCompensActual)
        //Resultado - Cuotas a compensar de periodos previos pendientes para periodos posteriores ([110] - [78]) [87]
        var cuotasPosteriores = (parseFloat(parseFloat(cuotasCompens)-parseFloat(cuotasCompensActual)).toFixed(2)).toString();
        var cuotasPosterioresS = cuotasPosteriores.split(".");
        if (cuotasPosterioresS[0] < 0){
            doctxt += padNum(-cuotasPosterioresS[0],15);//[87]
        } else {
            doctxt += padNum(cuotasPosterioresS[0],15);//[87]
        }
        doctxt += padNum(cuotasPosterioresS[1],2);//[87]


        //Resultado - Exclusivamente para sujetos pasivos que tributan conjuntamente a la Administración del Estado y a las Diputaciones Forales Resultado de la regularización anual [68]
        doctxt += padNum("0",17);//[68]

        // Resultado
        var resultado69 = (parseFloat(parseFloat(parseFloat(atribuible)+parseFloat(imprBienes))-parseFloat(cuotasCompensActual)).toFixed(2)).toString();
        var resultado69S = resultado69.split(".");
        if (resultado69S[0] < 0){
            doctxt += "N";
            doctxt += padNum(-resultado69S[0],14);//[69]
        } else {
            doctxt += padNum(resultado69S[0],15);//[69]
        }
        doctxt += padNum(resultado69S[1],2);//[69]

        // A Deducir
        var deducir70 = request.getParameter('xdeducir');
        if(deducir70 == null || deducir70 == ""){
            deducir70 = "0.00";
        }
        var deducir70S = deducir70.split(".");
        if (deducir70S[0] < 0){
            doctxt += "N";
            doctxt += padNum(-deducir70S[0],14);//[70]
        } else {
            doctxt += padNum(deducir70S[0],15);//[70]
        }
        doctxt += padNum(deducir70S[1],2);//[70]

        //Resultado - Resultado de la liquidación
        var resultadoLiquidacion = (parseFloat(parseFloat(resultado69)-parseFloat(deducir70)).toFixed(2)).toString();
        var resultadoLiquidacionS = resultadoLiquidacion.split(".");
        if (resultadoLiquidacionS[0] < 0){
            doctxt += "N";
            doctxt += padNum(-resultadoLiquidacionS[0],14);//[71]
        } else {
            doctxt += padNum(resultadoLiquidacionS[0],15);//[71]
        }
        doctxt += padNum(resultadoLiquidacionS[1],2);//[71]

        //Declaración complementaria / Número justificante declaración anterior / Declaración Sin actividad
        doctxt += padTxt("",15);

        //Swift & IBAN
        doctxt += padTxt(request.getParameter('xswift'),11); 
        doctxt += padTxt(request.getParameter('xiban'),34);

        doctxt += padTxt("",600);//Reservardo AEAT. Blancos; 600

        doctxt += "</T30303000>"; //  Constante "</T30303000>"

         //Página 4
        /*doctxt += "<T"; // Constante "<T"    
        doctxt += "303"; // Constante "303" 
        doctxt += "04000"; // Constante Página
        doctxt += ">"; // Constante ">"

        //Información Adicional
        doctxt += "0";
        doctxt += padTxt("",4);
        doctxt += "0";
        doctxt += padTxt("",4);
        doctxt += "0";
        doctxt += padTxt("",4);
        doctxt += "0";
        doctxt += padTxt("",4);
        doctxt += "0";
        doctxt += padTxt("",4);
        doctxt += "0";
        doctxt += padTxt("",4);
        doctxt += padTxt("",1);
        doctxt += padNum("0",17);//[80]
        doctxt += padNum("0",17);//[81]
        doctxt += padNum("0",17);//[82]
        doctxt += padNum("0",17);//[83]
        doctxt += padNum("0",17);//[84]
        doctxt += padNum("0",17);//[85]
        doctxt += padNum("0",17);//[86]
        doctxt += padNum("0",17);//[87]
        doctxt += padNum("0",17);//[88]
        doctxt += padNum("0",1);//Reservado AEAT
        doctxt += padNum("0",5);//[89]
        doctxt += padNum("0",5);//[90]
        doctxt += padNum("0",5);//[91]
        doctxt += padNum("0",5);//[92]
        doctxt += padNum("0",17);//[94]
        doctxt += padNum("0",17);//[95]
        doctxt += padNum("0",17);//[95]
        doctxt += padNum("0",17);//[97]
        doctxt += padNum("0",17);//[98]
        doctxt += padNum("0",17);//[99]
       
        var territorioComun = request.getParameter('territoriocomun'); //[107]
        if(territorioComun == null || territorioComun == ""){
            territorioComun = "0.00";
        }
        var territorioComunS = territorioComun.split(".");
        doctxt += padNum(territorioComunS[0],3);//[107]
        doctxt += padNum(territorioComunS[1],2);//[107]

        /*
        doctxt += padTxt("",1500);//Reservardo AEAT. Blancos; 1500
        doctxt += "</T30304000>"; //  Constante "</T30301000>"*/

    doctxt += "</T"; // Constante "<T"    
    doctxt += "303"; // Constante "303" 
    doctxt += "0"; // Discriminante
    doctxt += request.getParameter('ejerciciosel'); // Ejercicio del devengo
    doctxt += request.getParameter('xperiodo'); // Periodo. 2 Posiciones
    doctxt += "0000>"; // Constante "0000>" 
   //doctxt += "\r\n"; --> En la versión de 2019 se elimina el salto de linea.

    //Comprobamos si existe la carpeta en el Cabinet y si no, la creamos. De esta manera nos ahorramos tener que controlar el id de una carpeta en diferentes clientes.
    var nombreCarpeta = 'Modelo 303';//Nombre de la carpeta.
    var filter = new nlobjSearchFilter('name', null, 'is', nombreCarpeta);
    var column = new nlobjSearchColumn('internalid', 'file');
    var resultadoCarpeta = nlapiSearchRecord('folder', null , filter , column);
    
    if (resultadoCarpeta != null){
        var nuevaCarpetaid = resultadoCarpeta[0].getId();
    } else {
        var nuevaCarpeta = nlapiCreateRecord('folder');
        nuevaCarpeta.setFieldValue('name','Modelo 303');
        var nuevaCarpetaid = nlapiSubmitRecord(nuevaCarpeta);
    }

    var now = new Date();
    var nombreFichero = request.getParameter('declarantenif')+"_303_"+''+now.getUTCFullYear() + getMes(now) + getDia(now)+ getHora(now) + now.getMinutes();

    var file = nlapiCreateFile(nombreFichero+'.txt', 'CSV', doctxt);
    file.setFolder(nuevaCarpetaid);
    var id = nlapiSubmitFile(file);

    //Creamos registro en la tabla de Modelos generados
    var newModelo = nlapiCreateRecord('customrecord_x_modelosgenerados');
    newModelo.setFieldValue('custrecord_x_modgen_modelo',1);
    newModelo.setFieldValue('custrecord_x_modgen_fichero',id);
    newModelo.setFieldValue('custrecord_x_modgen_ejercicio',request.getParameter('ejerciciosel'));
    if(oneWorld){
        newModelo.setFieldValue('custrecord_x_modgen_subsidiaria',request.getParameter('subsid'));
    }
    nlapiSubmitRecord(newModelo);

    var params = {};
    params['fileid'] = id;
    if(oneWorld){
        params['subs'] = request.getParameter('subsid');
    }
    params['year'] = request.getParameter('ejerciciosel');
    params['declrazon'] = request.getParameter('declaranterazon');
    params['declnombre'] = request.getParameter('declarantenombre');
    params['declnif'] = request.getParameter('declarantenif');
    params['riva'] = request.getParameter('xriva');
    params['declnombre'] = request.getParameter('declarantenombre');
    params['perio'] = request.getParameter('xperiodo');
    params['tipodecl'] = request.getParameter('xtipodecl');
    params['regimensimplificado'] = request.getParameter('xregimensimplificado');
    params['autoliquidacion'] = request.getParameter('xautoliquidacion');
    params['concursoacree'] = request.getParameter('xconcursoacree');
    params['fechaconcurso'] = request.getParameter('xfechaconcurso');
    params['autodeclaracion'] = request.getParameter('xautodeclaracion');
    params['criteriocaja'] = request.getParameter('xcriteriocaja');
    params['destinatariocriterio'] = request.getParameter('xdestinatariocriterio');
    params['aplprorrata'] = request.getParameter('xaplprorrata');
    params['renprorrata'] = request.getParameter('xrenprorrata');
    params['voloperaciones'] = request.getParameter('xvoloperaciones');
    params['sujetopasivo'] = request.getParameter('xsujetopasivo');
    params['acogidosii'] = request.getParameter('xacogidosii');
    params['porcentatrib'] = request.getParameter('xporcentatrib');
    params['cuotascomp'] = request.getParameter('xcuotascomp');
    params['cuotascompactual'] = request.getParameter('xcuotascompactual');
    params['deducir'] = request.getParameter('xdeducir');
    params['swift'] = request.getParameter('xswift');
    params['iban'] = request.getParameter('xiban');
    params['exonerado'] = request.getParameter('xexonerado');
    params['ivadiferido'] = request.getParameter('xivadiferido');
    response.sendRedirect('SUITELET', 'customscript_xexport303', 'customdeploy_xexport303', false, params);	
}
function padTxt (str, max) {
    str = str.toString();
    return str.length < max ? padTxt(str + " ", max) : str;
}

function padNum (str, max) {
    str = str.toString();
    return str.length < max ? padNum("0" + str, max) : str;
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
    } 
function limpiarChar(original){
    var result = original;
    result = result.replaceAll("Á", "A");
    result = result.replaceAll("É", "E");
    result = result.replaceAll("Í", "I");
    result = result.replaceAll("Ó", "O");
    result = result.replaceAll("Ú", "U");
    result = result.replaceAll("á", "a");
    result = result.replaceAll("é", "e");
    result = result.replaceAll("í", "i");
    result = result.replaceAll("ó", "o");
    result = result.replaceAll("ú", "u");
    result = result.replaceAll("Ä", "A");
    result = result.replaceAll("Ë", "E");
    result = result.replaceAll("Ï", "I");
    result = result.replaceAll("Ö", "O");
    result = result.replaceAll("Ü", "U");
    result = result.replaceAll("ä", "a");
    result = result.replaceAll("ë", "e");
    result = result.replaceAll("ï", "i");
    result = result.replaceAll("ö", "o");
    result = result.replaceAll("ü", "u");
    result = result.replaceAll("À", "A");
    result = result.replaceAll("È", "E");
    result = result.replaceAll("Ì", "I");
    result = result.replaceAll("Ò", "O");
    result = result.replaceAll("Ù", "U");
    result = result.replaceAll("à", "a");
    result = result.replaceAll("è", "e");
    result = result.replaceAll("ì", "i");
    result = result.replaceAll("ò", "o");
    result = result.replaceAll("ù", "u");
    result = result.replaceAll("Â", "A");
    result = result.replaceAll("Ê", "E");
    result = result.replaceAll("Î", "I");
    result = result.replaceAll("Ô", "O");
    result = result.replaceAll("Û", "U");
    result = result.replaceAll("â", "a");
    result = result.replaceAll("ê", "e");
    result = result.replaceAll("î", "i");
    result = result.replaceAll("ô", "o");
    result = result.replaceAll("û", "u");
    result = result.replaceAll("Ç", "C");
    result = result.replaceAll("ç", "c");
    result = result.replaceAll("Ñ", "N");
    result = result.replaceAll("ñ", "n");
    result = result.replaceAll("·", ".");
    result = result.replaceAll("(", "");
    result = result.replaceAll(")", "");
    result = result.replaceAll("+", " ");
    result = result.replaceAll("-", " ");
    result = result.replaceAll(",", "");
    result = result.replaceAll(".", " ");
    result = result.replaceAll("  ", " ");
    return result;
}


//{EVENTOS DE CLIENTE
function onPageInit(type){
    var oldurl =  window.location.href;
    if (document.getElementById('subsid_display') != null) {
        document.getElementById('subsid_display').size = 25;
    }
	return true;
}

function onSaveRecord(){
  
	return true;
}

function onValidateField(type, name, linenum){
  
	return true;
}

function onFieldChange(type, name, linenum){
    if (name == 'subsid' || name == 'ejerciciosel' || name == 'xperiodo' || name == 'xriva'|| name == 'xtipodecl'){
        var oldurl =  window.location.href;
        var header = "";
        oldurl.indexOf("&deploy=1") > 0 ? header = oldurl.substr(0, oldurl.indexOf("deploy=1")) : header = oldurl; 
        var url = header + "deploy=1&subs=" + nlapiGetFieldValue('subsid')
            + "&year=" +nlapiGetFieldValue('ejerciciosel')
            + "&perio=" +nlapiGetFieldValue('xperiodo')
            + "&riva=" +nlapiGetFieldValue('xriva')
            +"&decl=" +nlapiGetFieldValue('declaranteexterno')
            + "&declnombre=" +nlapiGetFieldValue('declarantenombre')
            + "&declrazon=" +nlapiGetFieldValue('declaranterazon')
            + "&declnif=" +nlapiGetFieldValue('declarantenif')
            + "&tipodecl=" +nlapiGetFieldValue('xtipodecl')
            + "&regimensimplificado=" +nlapiGetFieldValue('xregimensimplificado')
            + "&autoliquidacion=" +nlapiGetFieldValue('xautoliquidacion')
            + "&concursoacree=" +nlapiGetFieldValue('xconcursoacree')
            + "&fechaconcurso=" +nlapiGetFieldValue('xfechaconcurso')
            + "&autodeclaracion=" +nlapiGetFieldValue('xautodeclaracion')
            + "&criteriocaja=" +nlapiGetFieldValue('xcriteriocaja')
            + "&destinatariocriterio=" +nlapiGetFieldValue('xdestinatariocriterio')
            + "&aplprorrata=" +nlapiGetFieldValue('xaplprorrata')
            + "&porcentatrib=" +nlapiGetFieldValue('xporcentatrib')
            + "&cuotascomp=" +nlapiGetFieldValue('xcuotascomp')
            + "&cuotascompactual=" +nlapiGetFieldValue('xcuotascompactual')
            + "&deducir=" +nlapiGetFieldValue('xdeducir')
            + "&swift=" +nlapiGetFieldValue('xswift')
            + "&iban=" +nlapiGetFieldValue('xiban')
            + "&renprorrata=" +nlapiGetFieldValue('xrenprorrata')
            + "&voloperaciones=" +nlapiGetFieldValue('xvoloperaciones')
            + "&sujetopasivo=" +nlapiGetFieldValue('xsujetopasivo')
            + "&exonerado=" +nlapiGetFieldValue('xexonerado')
            + "&acogidosii=" +nlapiGetFieldValue('xacogidosii');
        window.onbeforeunload = null;
        window.open(url, "_self");
    }
	return true;
}

function onPostSourcing(type, name){
  
	return true;
}

function onLineInit(type){

	return true;
}

function onValidateLine(type){

	return true;
}

function onRecalc(type){
  
	return true;
}

function onValidateInsert(type){

	return true;
}

function onValidateDelete(type){

	return true;
}
function esOneWorld() {
    try {
    nlapiSearchRecord('subsidiary', null, null, null);
    } catch (e) {
    if (e.name == 'FEATURE_DISABLED')
    return false;
    }
    return true;
}

//El mes debe tener siempre dos digitos
function getMes(date) {
    var mes = date.getUTCMonth() + 1;
    return mes < 10 ? '0' + mes : '' + mes;
}
//El dia debe tener siempre dos digitos
function getDia(date) {
    var dia = date.getUTCDate();
    return dia < 10 ? '0' + dia : '' + dia;
}
//La hora debe tener siempre dos digitos
function getHora(date) {
    var hora = date.getUTCHours();
    return hora < 10 ? '0' + hora : '' + hora;
}

function roundNum(value, units) {
    var factor = 1;
    for (var i = 0; i < (units || 4); i++){
        factor *= 10;
    }
    return parseInt(Math.round(value * factor), 10) / factor;
}

function ejecutarBusqueda(idSearch,oneWorld,form,ejercicio,periodoSel,exportList,filtroAutorepercutido,idFechaFiltro){
    var search = nlapiLoadSearch('transaction',idSearch);
        //Cogemos parametros de la URL y los almacenamos en los campos al recargar.
    search.addFilter(new nlobjSearchFilter('custrecord_post_notional_tax_amount', 'taxitem', 'is', filtroAutorepercutido));
    if(oneWorld){
        if (request.getParameter('subs') != null && request.getParameter('subs').trim() != ""){
            search.addFilter(new nlobjSearchFilter('subsidiary', null, 'anyof', request.getParameter('subs')));
            form.setFieldValues({subsid:request.getParameter('subs')});
            form.setFieldValues({xivadiferido:nlapiLookupField('subsidiary', request.getParameter('subs'), 'custrecord_le_ivadiferido')});
            
        }
    }
    
    if (request.getParameter('year') != null && request.getParameter('year').trim() != ""){
        form.setFieldValues({ejerciciosel:request.getParameter('year')});
        search.addFilter(new nlobjSearchFilter(idFechaFiltro, null, 'within', "01/01/"+request.getParameter('year'),"31/12/"+request.getParameter('year')));
        ejercicio = request.getParameter('year');
    } else {
        search.addFilter(new nlobjSearchFilter(idFechaFiltro, null, 'within', "01/01/"+currentYear,"31/12/"+currentYear));
    }
    

    var bisiesto = nlapiStringToDate("01/03/"+ejercicio);
    var xbisiesto = nlapiAddDays(bisiesto,-1);
    //Controlamos la selección de trimestres
    switch(periodoSel){
        case "1T": 
            search.addFilter(new nlobjSearchFilter(idFechaFiltro, null, 'within', "01/01/"+ejercicio,"31/03/"+ejercicio));
        break;
        case "2T": 
            search.addFilter(new nlobjSearchFilter(idFechaFiltro, null, 'within', "01/04/"+ejercicio,"30/06/"+ejercicio));
        break;
        case "3T": 
            search.addFilter(new nlobjSearchFilter(idFechaFiltro, null, 'within', "01/07/"+ejercicio,"30/09/"+ejercicio));
        break;
        case "4T": 
            search.addFilter(new nlobjSearchFilter(idFechaFiltro, null, 'within', "01/10/"+ejercicio,"31/12/"+ejercicio));
        break;
        case "01": 
            search.addFilter(new nlobjSearchFilter(idFechaFiltro, null, 'within', "01/01/"+ejercicio,"31/01/"+ejercicio));
        break;
        case "02": 
            search.addFilter(new nlobjSearchFilter(idFechaFiltro, null, 'within', "01/02/"+ejercicio,xbisiesto));
        break;
        case "03": 
            search.addFilter(new nlobjSearchFilter(idFechaFiltro, null, 'within', "01/03/"+ejercicio,"31/03/"+ejercicio));
        break;
        case "04": 
            search.addFilter(new nlobjSearchFilter(idFechaFiltro, null, 'within', "01/04/"+ejercicio,"30/04/"+ejercicio));
        break;
        case "05": 
            search.addFilter(new nlobjSearchFilter(idFechaFiltro, null, 'within', "01/05/"+ejercicio,"31/05/"+ejercicio));
        break;
        case "06": 
            search.addFilter(new nlobjSearchFilter(idFechaFiltro, null, 'within', "01/06/"+ejercicio,"30/06/"+ejercicio));
        break;
        case "07": 
            search.addFilter(new nlobjSearchFilter(idFechaFiltro, null, 'within', "01/07/"+ejercicio,"31/07/"+ejercicio));
        break;
        case "08": 
            search.addFilter(new nlobjSearchFilter(idFechaFiltro, null, 'within', "01/08/"+ejercicio,"31/08/"+ejercicio));
        break;
        case "09": 
            search.addFilter(new nlobjSearchFilter(idFechaFiltro, null, 'within', "01/09/"+ejercicio,"30/09/"+ejercicio));
        break;
        case "10": 
            search.addFilter(new nlobjSearchFilter(idFechaFiltro, null, 'within', "01/10/"+ejercicio,"31/10/"+ejercicio));
        break;
        case "11": 
            search.addFilter(new nlobjSearchFilter(idFechaFiltro, null, 'within', "01/11/"+ejercicio,"30/11/"+ejercicio));
        break;
        case "12": 
            search.addFilter(new nlobjSearchFilter(idFechaFiltro, null, 'within', "01/12/"+ejercicio,"31/12/"+ejercicio));
        break;
        default:
            search.addFilter(new nlobjSearchFilter(idFechaFiltro, null, 'within', "01/01/"+ejercicio,"31/01/"+ejercicio));
        break;
    }
    nlapiLogExecution('debug',exportList.getLineItemCount(),exportList.getLineItemCount()+parseInt(1));
    if(exportList.getLineItemCount() < 0){
        var linea = 0;
    }else{
        var linea = exportList.getLineItemCount();
    }
    
    var totales = 0;
    var etiquetaCol = "";
    var resultSet = search.runSearch();
    resultSet.forEachResult(function (resultado) {
        var cols = resultado.getAllColumns();
       if (linea == 1){
              for (i=0; i < cols.length; i++){
               // nlapiLogExecution("DEBUG", "Etiquetas",  i + " - " + cols[i].getLabel()+" / "+resultado.getValue(cols[12])+" / "+resultado.getValue(cols[13]));
            }
        }

        var importeDebito = resultado.getValue(cols[12]) || 0; //Columna debito con descuentos aplicados.
        var importeCredito = resultado.getValue(cols[13]) || 0; //Columna crédito con descuentos aplicados.
      
        var tipoOperacion = resultado.getValue('type', null, 'GROUP');
        var impuestoDerivado = roundNum(resultado.getValue('custrecord_x_sii_tasaderivada', 'taxitem', 'GROUP')/100,2);
        var impuestos = resultado.getValue(cols[9]) || 0;
        var tasa = resultado.getValue('rate', 'taxitem', 'MAX');
        var codigoce = resultado.getValue('iseccode', 'taxitem', 'MAX');
        var autorepercutido = resultado.getValue('custrecord_post_notional_tax_amount', 'taxitem', 'MAX');
        var importacion = resultado.getValue('custrecord_4110_import', 'taxitem', 'GROUP');
        var exportar = resultado.getValue('isexport', 'taxitem', 'GROUP');
        var artImpuesto = resultado.getText('taxcode', null, 'GROUP');
        var noSujeto = resultado.getValue('custrecord_x_sii_tiponosujeta', 'taxitem', 'GROUP');
        var ivaBienesInversion = resultado.getValue('custrecord_x_sii_iva_bienes_inversion', 'taxitem', 'GROUP');
        var aplicaServicio = resultado.getValue('appliestoservice', 'taxitem', 'GROUP');

        exportList.setLineItemValue('xnumlinea', ++linea, parseFloat(linea).toFixed(0));
        exportList.setLineItemValue('xtasa', linea, tasa);
        exportList.setLineItemValue('xcodigoce', linea, codigoce);
        exportList.setLineItemValue('xautorepercutido', linea, autorepercutido);
        exportList.setLineItemValue('ximportacion', linea, importacion);
        exportList.setLineItemValue('xexportar', linea, exportar);
        exportList.setLineItemValue('xarticuloimp', linea, artImpuesto);
        exportList.setLineItemValue('ximportedebito', linea, importeDebito);
        exportList.setLineItemValue('ximportecredito', linea, importeCredito);
        exportList.setLineItemValue('xservicio', linea, aplicaServicio);
        
        var baseImponible = roundNum(roundNum(importeDebito,2)-roundNum(importeCredito,2),2);
        exportList.setLineItemValue('xbaseimp', linea, baseImponible || 0);
        if (autorepercutido == 'T' && impuestoDerivado > 0){
            impuestos = parseFloat(parseFloat(baseImponible*(1 + roundNum(impuestoDerivado,2))*parseFloat(-1)).toFixed(2) - parseFloat(baseImponible*parseFloat(-1)).toFixed(2)).toFixed(2);
            //nlapiLogExecution('debug',"Impuestos",roundNum(baseImponible,2));
        }
        exportList.setLineItemValue('ximpuestos', linea, impuestos || 0);
        if(oneWorld){
            exportList.setLineItemValue('xsubsidiaria', linea, resultado.getValue(cols[0]));
        }
        exportList.setLineItemValue('xtasaparent', linea, impuestoDerivado || 0);
        exportList.setLineItemValue('xtipoop', linea, tipoOperacion || 0);
        exportList.setLineItemValue('xnosujeto', linea, noSujeto);
        exportList.setLineItemValue('xbienesinversion', linea, ivaBienesInversion);
        if (autorepercutido != "T"){
            totales = parseFloat(parseFloat(totales) + parseFloat(impuestos)).toFixed(2);
        }
        nlapiLogExecution('debug',"Totales "+parseFloat(linea).toFixed(0),totales+" // "+impuestos);
        return true;
    });

    return totales;
}