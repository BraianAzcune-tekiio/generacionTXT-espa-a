/**************************************************************************************
TITULO: Exportación Modelos AEAT Localización Española (Suitelet)
AUTOR: RSM Spain
FECHA: 20/11/2018
VERSION: 1.4.0
****************************************************************************************/
/**
* Copyright 2018 RSM Spain Consultores S.L.  User may not copy, modify, distribute, or re-bundle or otherwise make available this code.
*/
/**
 * v.1.1 - Se incorporan los modelos 216 y los campos de soporte de los modelos Canarios 420 y 425.
 * v.1.2 - Se añade el modelo 410
 * v.1.3 - Añadido modelo 190 y 390
 * v.1.4 -16.04.2020 - Añadido modelo 111 
 */

//#region Constantes
var currentYear = new Date().getFullYear();
var fldContainer = function() {
    var o = {
        fields: {},
        get: function() {
            return this.fields;
        },
        set: function(key, value) {
            this.fields[key] = value;
        },
        void: function() {
            this.fields = {};
        }
    }
    return o;
}

periodos = {
    Mensual: '1',
    Trimestral: '2',
    Anual: '3',
    Todo: '0'
}

var flds = new fldContainer();
//#endregion
//#region ENUMERACIONES
MODELOS = {
    m111:{id:'15',nombre:'111',resumen:'customsearch_le111resumen', deploy:'customdeploy_x_exp_mod111'},
    m115:{id:'4',nombre:'115',resumen:'customsearch_le115resumen', deploy:'customdeploy_x_exp_mod115',},
    m123:{id:'5',nombre:'123',resumen:'customsearch_le123resumen', deploy:'customdeploy_x_exp_mod123'},
    m180:{id:'6',nombre:'180',resumen:'customsearch_le180resumen', deploy:'customdeploy_x_exp_mod180'},
    m190:{id:'16',nombre:'190',resumen:'customsearch_le190resumen', deploy:'customdeploy_x_exp_mod190'},
    m193:{id:'7',nombre:'193',resumen:'customsearch_le193resumen', deploy:'customdeploy_x_exp_mod193'},
    m216:{id:'8',nombre:'216',resumen:'customsearch_le216resumen', deploy:'customdeploy_x_exp_mod216'},
    m296:{id:'9',nombre:'296',resumen:'customsearch_le296resumen', deploy:'customdeploy_x_exp_mod296'},
    m303:{id:'1',nombre:'303',resumen:''},
    m347:{id:'2',nombre:'347',resumen:''},
    m349:{id:'3',nombre:'349',resumen:'customsearch_x349', deploy:'customdeploy_x_exp_mod349'},
    m410:{id:'13',nombre:'410',resumen:'customsearch_le420resumen'},
    m415:{id:'12',nombre:'415',resumen:''},
    m417:{id:'14',nombre:'417',resumen:'customsearch_le420resumen'},
    m420:{id:'10',nombre:'420',resumen:'customsearch_le420resumen'},
    m425:{id:'11',nombre:'425',resumen:''},
    m390:{id:'17',nombre:'390',resumen:'customsearch_le390resumen'}
};


TIPO = {
    A:'1',
    AN:'2',//Alfanumérico
    NUM:'3'///Numérico
}

//#endregion

function formularioExportaciones(request, response){
    if (request.getMethod() == 'GET') {
        var form = nlapiCreateForm('Exportar Modelos AEAT');
        form.setScript('customscript_x_exp_modelos_cliente');

        if (request.getParameter('proc') == 'T') {
            form.addField('proc', 'checkbox').setDisplayType('hidden').setDefaultValue('T');
        }

        
        //#region Variables
        var modeloSel = 0;
        //var versionsel = 0;
        //#endregion
        
        var oneWorld = esOneWorld();

        

        var fmodelo = form.addField('fld_modelo', 'select', 'MODELO', 'customrecord_x_list_modelos', null).setLayoutType('midrow');
        var fversion = form.addField('fld_version', 'select', 'VERSIÓN', null, null).setLayoutType('midrow');

        if (request.getParameter('fld_modelo') != null && request.getParameter('fld_modelo').trim() != ""){
            form.setFieldValues({fld_modelo:request.getParameter('fld_modelo')});
            var modeloSel = request.getParameter('fld_modelo');
            fmodelo.setDefaultValue(modeloSel);
            //Mostramos desplegable con las versiones del Modelo. 
            var sFiltros = [];
            sFiltros.push(new nlobjSearchFilter('custrecord_x_ledis_modelo', null, 'is', modeloSel));
            sFiltros.push(new nlobjSearchFilter('isinactive', null, 'is', 'F'));
            var sColumnas = [];
            sColumnas.push(new nlobjSearchColumn('name'));
            sColumnas.push(new nlobjSearchColumn('internalid').setSort(true));
            sColumnas.push(new nlobjSearchColumn('custrecord_x_ledis_modelo'));
            var sVersiones = nlapiSearchRecord('customrecord_x_ledis_modelos', null, sFiltros, sColumnas);
            for(var ver in sVersiones){
                fversion.addSelectOption(sVersiones[ver].getValue('internalid'),sVersiones[ver].getValue('name'),ver == 0 ? true : false);
            }
            if(request.getParameter('fld_modelo') != MODELOS.m390.id && request.getParameter('fld_modelo') != MODELOS.m420.id && request.getParameter('fld_modelo') != MODELOS.m425.id && request.getParameter('fld_modelo') != MODELOS.m410.id && request.getParameter('fld_modelo') != MODELOS.m417.id){
                form.addSubmitButton('Ejecutar');
            }
        }

        if (request.getParameter('ver') != null && request.getParameter('ver').trim() != ""){
            form.setFieldValues({fld_verion:request.getParameter('ver')});
            var versoinsel = request.getParameter('ver');
        }

        var Tab = form.addTab('expmodelos', 'Exportación Modelos AEAT');
        //En función del modelo seleccionado, se llama a su correspondiente función que cargará los filtros y datos correspondientes a cada uno de los modelos.
        switch(modeloSel){
            case MODELOS.m111.id:
                form111(oneWorld, form, modeloSel,MODELOS.m111.nombre);
            break;
            case MODELOS.m115.id:
                form115(oneWorld, form, modeloSel,MODELOS.m115.nombre);
            break;
            case MODELOS.m123.id:
                form123(oneWorld, form, modeloSel,MODELOS.m123.nombre);
            break;
            case MODELOS.m180.id:
                form180(oneWorld, form, modeloSel,MODELOS.m180.nombre);
            break;
            case MODELOS.m190.id:
                form190(oneWorld, form, modeloSel,MODELOS.m190.nombre);
            break;
            case MODELOS.m193.id:
                form193(oneWorld, form, modeloSel,MODELOS.m193.nombre);
            break;
            case MODELOS.m216.id:
                form216(oneWorld, form, modeloSel,MODELOS.m216.nombre);
            break;
            case MODELOS.m296.id:
                form296(oneWorld, form, modeloSel,MODELOS.m296.nombre);
            break;
            case MODELOS.m349.id:
                form349(oneWorld, form, modeloSel,MODELOS.m349.nombre);
            break;
            case MODELOS.m410.id:
                form410(oneWorld, form, modeloSel,MODELOS.m410.nombre);
            break;
            case MODELOS.m415.id:
                response.sendRedirect('SUITELET', 'customscript_x_modelo_415', 'customdeploy_x_modelo_415', false, {year:currentYear});
            break;
            case MODELOS.m417.id:
                form417(oneWorld, form, modeloSel,MODELOS.m417.nombre);
            break;
            case MODELOS.m420.id:
                form420(oneWorld, form, modeloSel,MODELOS.m420.nombre);
            break;
            case MODELOS.m425.id:
                form425(oneWorld, form, modeloSel,MODELOS.m425.nombre);
            break;      
            case MODELOS.m390.id:
                form390(oneWorld, form, modeloSel,MODELOS.m390.nombre);
            break;           
        }

        nlapiLogExecution('debug',"Punto 4");
        //#region Parametros Campos
        //Recuperamos todos los campos para pasarlos a la URL en el Cliente 
        form.addField('arraycampos', 'longtext', 'Arraycampos', null, 'datoscomunes').setLayoutType('startrow').setDisplayType('hidden');
        var params = form.getAllFields();
        var arrayCampos = [];
        for (var param in params) {
            if(params[param] != 'arraycampos'){
                arrayCampos.push(params[param]);
            }
        }
        form.setFieldValues({arraycampos:JSON.stringify(arrayCampos)});
        //#endregion
        nlapiLogExecution('debug',"Punto 5");
        recuperarDatos(form,oneWorld);  
        response.writePage(form);
    } else {
        dump(request, response)
    }
}
function form303(oneWorld, form, modeloSel,nombreModelo){
filtrosComunes(oneWorld,form, nombreModelo);
datosComunes(oneWorld, form, nombreModelo);

var tipoDeclaracion = form.addField('xtipodeclaracion', 'select', 'Tipo Declaración', null, 'filtroscomunes').setLayoutType('midrow');
tipoDeclaracion.addSelectOption("C","Solicitud de Compensación");
tipoDeclaracion.addSelectOption("D","Devolución");
tipoDeclaracion.addSelectOption("G","Cuenta corriente Tributaria - Ingreso");
tipoDeclaracion.addSelectOption("I","Ingreso", true);
tipoDeclaracion.addSelectOption("N","sin actividad/resultado cero");
tipoDeclaracion.addSelectOption("V","Cuenta corriente tributaria -devolució");
tipoDeclaracion.addSelectOption("U","Domiciliacion del ingreso en CCC");

//Campos Adicionales modelo 303

form.addField('xsujetopasivo', 'checkbox', 'Sujeto pasivo que tributa a una Admin. tributaria Foral con IVA a la importación liquidado por la Aduana pte de ingreso', null, 'datoscomunes').setLayoutType('startrow').setHelpText('Sujeto pasivo que tributa exclusivamente a una Administración tributaria Foral con IVA a la importación liquidado por la Aduana pendiente de ingreso');
form.addField('xriva', 'checkbox', '¿Está inscrito en el registro de devolución mensual?', null, 'datoscomunes').setLayoutType('startrow');
var xregimensimpli = form.addField('xregimensimplificado', 'select', '¿Tributa exclusivamente en Régimen Simplificado?', null, 'datoscomunes').setLayoutType('startrow');
    xregimensimpli.addSelectOption("1","Sí");
    xregimensimpli.addSelectOption("2","No (RG + RS)");
    xregimensimpli.addSelectOption("3","No (sólo RG)",true);
form.addField('xautoliquidacion', 'checkbox', '¿Es autoliquidación conjunta?', null, 'datoscomunes').setLayoutType('startrow');
form.addField('xconcursoacree', 'checkbox', '¿Declarado en concurso de acreedores en el presente período?', 'null', 'datoscomunes').setLayoutType('startrow');
form.addField('xfechaconcurso', 'date', 'Fecha en que se dictó el auto de declaración de concurso', null, 'datoscomunes').setLayoutType('startrow').setHelpText('Fecha en que se dictó el auto de declaración de concurso');
var autodeclaracion = form.addField('xautodeclaracion', 'select', 'Auto de declaración de concurso dictado en el período', null, 'datoscomunes').setLayoutType('startrow');
    autodeclaracion.addSelectOption(" ","No",true);
    autodeclaracion.addSelectOption("01","Preconcursal");
    autodeclaracion.addSelectOption("02","Postconcursal");
form.addField('xcriteriocaja', 'checkbox', '¿Opción por el régimen especial de criterio de Caja?', null, 'datoscomunes').setLayoutType('startrow');
form.addField('xdestinatariocriterio', 'checkbox', '¿Destinatario de las operaciones a las que se aplique el régimen especial del criterio de Caja?', null, 'datoscomunes').setLayoutType('startrow');
form.addField('xaplprorrata', 'checkbox', '¿Opción por la aplicación de la prorrata especial?', null, 'datoscomunes').setLayoutType('startrow');
form.addField('xrenprorrata', 'checkbox', '¿Revocación de la opción por la aplicación de la prorrata especial?', null, 'datoscomunes').setLayoutType('startrow');
var exonerado = form.addField('xvoloperaciones', 'select', '¿Existe volumen de operaciones (art. 121 LIVA)?', null, 'datoscomunes').setLayoutType('startrow');
    exonerado.addSelectOption("00","No Exonerado",true);
    exonerado.addSelectOption("01","Sí (Exonerado)");
    exonerado.addSelectOption("02","No (Exonerado)");
form.addField('xlibrosiva', 'checkbox', '¿Ha llevado voluntariamente los Libros registro del IVA a través de la Sede electrónica de la AEAT durante el ejercicio?', null, 'datoscomunes').setLayoutType('startrow');
//form.addField('sumtotal','currency','Importe',null,'datoscomunes').setDisplayType('inline');
form.addField('xcuotascomp', 'float', 'Cuotas a compensar de periodos anteriores', null, 'datoscomunes').setLayoutType('startrow');
form.addField('xporcentatrib', 'float', '% Atribuible a la Admin', null, 'datoscomunes').setDefaultValue("100.00");
form.addField('xdeducir', 'float', 'A Deducir', null, 'datoscomunes').setLayoutType('startrow');
form.addField('xswift', 'float', 'Código SWIFT', null, 'datoscomunes').setLayoutType('startrow');
form.addField('xiban', 'text', 'IBAN', null, 'datoscomunes').setLayoutType('startrow');

}

function form111(oneWorld, form, modeloSel,nombreModelo){
    var fccaja = form.addField('fld_ccaja', 'checkbox', 'Criterio de Caja', null, null).setLayoutType('midrow');
    var filtroPeriodo = periodos.Todo;
    datosComunes(oneWorld, form, nombreModelo);
    filtrosComunes(oneWorld, form, nombreModelo,filtroPeriodo);
    declaracionComplementaria(form)
    tipoDeclaracion(form)

}

function form115(oneWorld, form, modeloSel,nombreModelo){
    var filtroPeriodo = periodos.Todo;
    datosComunes(oneWorld, form, nombreModelo);
    filtrosComunes(oneWorld, form, nombreModelo,filtroPeriodo);

    form.addFieldGroup('datosliquidacion', 'Datos Liquidación', 'modsubtab').setShowBorder(true);
    form.addField('fld_resejercicioanterior', 'float', 'Resultado de anteriores declaraciones [04]', null, 'datosliquidacion').setLayoutType('startrow');

    declaracionComplementaria(form);
    tipoDeclaracion(form);
}

function form123(oneWorld, form, modeloSel,nombreModelo){
    var filtroPeriodo = periodos.Todo;
    datosComunes(oneWorld, form, nombreModelo);
    filtrosComunes(oneWorld, form, nombreModelo,filtroPeriodo);

    //#region Datos Liquidacion [04][05][07]
    form.addFieldGroup('datosliquidacion', 'Datos Liquidación', 'modsubtab').setShowBorder(true);
    form.addField('fld_ingejercicioanterior', 'float', 'Ingresos Ejercicios Anteriores [04]', null, 'datosliquidacion').setMandatory(true).setLayoutType('startrow');
    form.addField('fld_regularizacion', 'float', 'Regularización [05]', null, 'datosliquidacion').setMandatory(true).setLayoutType('midrow');
    form.addField('fld_resejercicioanterior', 'float', 'Resultado de anteriores declaraciones [07]', null, 'datosliquidacion').setMandatory(false).setLayoutType('endrow').setDisplayType('disabled');
    //#endregion
    
    declaracionComplementaria(form);
    tipoDeclaracion(form);
}

function form180(oneWorld, form, modeloSel,nombreModelo){
    var filtroPeriodo = periodos.Anual;
    datosComunes(oneWorld, form, nombreModelo);
    filtrosComunes(oneWorld, form, nombreModelo,filtroPeriodo);

    form.addFieldGroup('personarelacionada', 'Persona con quien relacionarse', 'modsubtab').setShowBorder(true);
    form.addField('fld_tlfcontacto', 'text', 'Teléfono Contacto', null, 'personarelacionada').setMandatory(true).setLayoutType('startrow');
    form.addField('fld_nombrecontacto', 'text', 'Apellidos y Nombre de contacto', null, 'personarelacionada').setMandatory(true).setLayoutType('midrow');

    complementariaOsustitutiva(form);

    //#region Filtros Modelo
    form.addFieldGroup('otrosdatos', 'otros Datos', 'modsubtab').setShowBorder(true);
    var tipoSoporte = form.addField('fld_tiposoporte', 'select', 'Tipo de Soporte', null, 'otrosdatos').setLayoutType('startrow').setMandatory(true);
    tipoSoporte.addSelectOption("C","Cinta magnética");
    tipoSoporte.addSelectOption("T","Transmisión telemática");
    form.addField('fld_numeroidentificativo', 'text', 'Número identificativo de la declaración', null, 'otrosdatos').setMandatory(true).setLayoutType('midrow');
    form.addField('fld_nifrepresentante', 'text', 'NIF Representante Legal', null, 'otrosdatos').setLayoutType('midrow');
    form.addField('fld_referenciacatastral', 'text', 'Referencia Catastral', null, 'otrosdatos').setLayoutType('midrow');
    form.addField('fld_ejerciciodevengo', 'float', 'Ejercicio Devengo', null, 'otrosdatos').setLayoutType('midrow');

    //#endregion
}

function form190(oneWorld, form, modeloSel,nombreModelo){
    var fccaja = form.addField('fld_ccaja', 'checkbox', 'Criterio de Caja', null, null).setLayoutType('midrow');
    var filtroPeriodo = periodos.Anual;
    datosComunes(oneWorld, form, nombreModelo);
    filtrosComunes(oneWorld, form, nombreModelo,filtroPeriodo);

    form.addFieldGroup('personarelacionada', 'Persona y teléfono de contacto', 'modsubtab').setShowBorder(true);
    form.addField('fld_tlfcontacto', 'text', 'Teléfono Contacto', null, 'personarelacionada').setMandatory(true).setLayoutType('startrow');
    form.addField('fld_nombrecontacto', 'text', 'Apellidos y Nombre de contacto', null, 'personarelacionada').setMandatory(true).setLayoutType('midrow');
    form.addField('fld_nifrepresentante', 'text', 'NIF Representante Legal', null, 'personarelacionada').setLayoutType('midrow');    
    
    complementariaOsustitutiva(form);
}

function form193(oneWorld, form, modeloSel,nombreModelo){
    var filtroPeriodo = periodos.Anual;
    datosComunes(oneWorld, form, nombreModelo);
    filtrosComunes(oneWorld, form, nombreModelo,filtroPeriodo);

    form.addFieldGroup('personarelacionada', 'Persona y teléfono de contacto', 'modsubtab').setShowBorder(true);
    form.addField('fld_tlfcontacto', 'text', 'Teléfono Contacto', null, 'personarelacionada').setMandatory(true).setLayoutType('startrow');
    form.addField('fld_nombrecontacto', 'text', 'Apellidos y Nombre de contacto', null, 'personarelacionada').setMandatory(true).setLayoutType('midrow');
    form.addField('fld_nifrepresentante', 'text', 'NIF Representante Legal', null, 'personarelacionada').setLayoutType('midrow');

    complementariaOsustitutiva(form);
}

function form216(oneWorld, form, modeloSel,nombreModelo){
    var fccaja = form.addField('fld_ccaja', 'checkbox', 'Criterio de Caja', null, null).setLayoutType('midrow');
    var filtroPeriodo = periodos.Todo;
    datosComunes(oneWorld, form, nombreModelo);
    filtrosComunes(oneWorld, form, nombreModelo,filtroPeriodo);


    //form.addFieldGroup('datosliquidacion', 'Datos Liquidación', 'modsubtab').setShowBorder(true);

    form.addFieldGroup('liquidacioncomplementaria', 'Autoliquidación complementaria', 'modsubtab').setShowBorder(true); 
    
    declaracionComplementaria(form);
    tipoDeclaracion(form);
}

function form296(oneWorld, form, modeloSel,nombreModelo){
    var fccaja = form.addField('fld_ccaja', 'checkbox', 'Criterio de Caja', null, null).setLayoutType('midrow');
    var filtroPeriodo = periodos.Anual;
    datosComunes(oneWorld, form, nombreModelo);
    filtrosComunes(oneWorld, form, nombreModelo,filtroPeriodo);

    form.addFieldGroup('personarelacionada', 'Persona y teléfono de contacto', 'modsubtab').setShowBorder(true);
    form.addField('fld_tlfcontacto', 'text', 'Teléfono Contacto', null, 'personarelacionada').setMandatory(true).setLayoutType('startrow');
    form.addField('fld_nombrecontacto', 'text', 'Apellidos y Nombre de contacto', null, 'personarelacionada').setMandatory(true).setLayoutType('midrow');
    form.addField('fld_nifrepresentante', 'text', 'NIF Representante Legal', null, 'personarelacionada').setLayoutType('midrow');

    complementariaOsustitutiva(form);
    
    tipoDeclaracion(form);
 
}

function form349(oneWorld, form, modeloSel,nombreModelo){
    var filtroPeriodo = periodos.Todo;
    datosComunes(oneWorld, form, nombreModelo);
    filtrosComunes(oneWorld, form, nombreModelo,filtroPeriodo);
    form.getField('fld_tipodeclarante').setDisplayType('hidden');
    form.addField('fld_nifrepresentante', 'text', 'NIF Representante Legal', null, 'datoscomunes').setLayoutType('endrow');
 
    form.addFieldGroup('personarelacionada', 'Persona con quien relacionarse', 'modsubtab').setShowBorder(true);
    form.addField('fld_tlfcontacto', 'text', 'Teléfono Contacto', null, 'personarelacionada').setMandatory(true).setLayoutType('startrow');
    form.addField('fld_nombrecontacto', 'text', 'Apellidos y Nombre de contacto', null, 'personarelacionada').setMandatory(true).setLayoutType('midrow');

    form.addFieldGroup('declaracioncomplsust', 'Declaración complementaria o sustitutiva', 'modsubtab').setShowBorder(true);
    form.addField('fld_declaracomplementaria', 'checkbox', 'Declaración Complementaria', null, 'declaracioncomplsust').setLayoutType('startrow');
    form.addField('fld_declarasustitutiva', 'checkbox', 'Declaración Sustitutiva', null, 'declaracioncomplsust').setLayoutType('startrow');
    form.addField('fld_identificativoanterior', 'text', 'Numero Identificativo declaración Anterior', null, 'declaracioncomplsust').setLayoutType('startrow');


    if (request.getParameter('fld_declaracomplementaria') != null && request.getParameter('fld_declaracomplementaria').trim() != ""){
        if (request.getParameter('fld_declaracomplementaria') == 'T'){
            form.getField('fld_identificativoanterior').setMandatory(true).setDisplayType('normal');
            form.getField('fld_declarasustitutiva').setDisplayType('disabled');
        }else if (request.getParameter('fld_declarasustitutiva') == 'T'){
            form.getField('fld_identificativoanterior').setMandatory(true).setDisplayType('normal');
            form.getField('fld_declaracomplementaria').setDisplayType('disabled');
        }
    }

    //#region Filtros Modelo
    /*form.addFieldGroup('otrosdatos', 'otros Datos', 'modsubtab').setShowBorder(true);
    var tipoSoporte = form.addField('fld_tiposoporte', 'select', 'Tipo de Soporte', null, 'otrosdatos').setLayoutType('startrow').setMandatory(true);
    tipoSoporte.addSelectOption("C","Cinta magnética");
    tipoSoporte.addSelectOption("T","Transmisión telemática");
    form.addField('fld_numeroidentificativo', 'text', 'Número identificativo de la declaración', null, 'otrosdatos').setMandatory(true).setLayoutType('midrow');
    form.addField('fld_nifrepresentante', 'text', 'NIF Representante Legal', null, 'otrosdatos').setLayoutType('midrow');
    form.addField('fld_referenciacatastral', 'text', 'Referencia Catastral', null, 'otrosdatos').setLayoutType('midrow');
    form.addField('fld_ejerciciodevengo', 'float', 'Ejercicio Devengo', null, 'otrosdatos').setLayoutType('midrow');*/
    //#endregion
}

function filtrosComunes(oneWorld, form, modeloSel,filtroPeriodo){
    var nombreFiltro = "filtroscomunes";
    form.addFieldGroup(nombreFiltro, 'Filtros', 'modsubtab').setShowBorder(true);

    //Selector Subsidiaria
    if(oneWorld){
        form.addField('subsid', 'select', 'SUBSIDIARIA', 'subsidiary', nombreFiltro).setMandatory(true).setLayoutType('startrow');
        flds.set('subsid', 'select',true);
    }

    //selector Ejercicio
    var minYear = 2017;
    var maxYear = 2050;
    var ejercicioSelector = form.addField('xejercicio', 'select', 'EJERCICIO', null, nombreFiltro).setMandatory(true).setLayoutType('midrow');
    for(var i = minYear; i <= maxYear;i++){
        if(i <= currentYear){
            if (currentYear == i) {
                ejercicioSelector.addSelectOption(i, i, true);
            } else {
                ejercicioSelector.addSelectOption(i, i);
            }
        }
    }

    //Selector del Periodo. 
    var periodo = form.addField('xperiodo', 'select', 'PERIODO', null, nombreFiltro).setLayoutType('startrow', 'startcol');
    if(filtroPeriodo == periodos.Mensual || filtroPeriodo == periodos.Todo){
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
    }

    if(filtroPeriodo == periodos.Trimestral || filtroPeriodo == periodos.Todo){
        periodo.addSelectOption("1T","Primer Trimestre", filtroPeriodo == periodos.Trimestral ? true : false);
        periodo.addSelectOption("2T","Segundo Trimestre");
        periodo.addSelectOption("3T","Tercer Trimestre");
        periodo.addSelectOption("4T","Cuarto Trimestre");
    }
    
    if(filtroPeriodo == periodos.Anual || filtroPeriodo == periodos.Todo){
        periodo.addSelectOption("0A","Anual",filtroPeriodo == periodos.Anual ? true : false);
    }
        

    var periodoSel = 1;

    //Cogemos parametros de la URL y los almacenamos en los campos al recargar.
    if(oneWorld){
        if (request.getParameter('subsid') != null && request.getParameter('subsid').trim() != ""){
            form.setFieldValues({subsid:request.getParameter('subsid')});
        }
    }
    flds.set('xejercicio', 'select',true);
    flds.set('xperiodo', 'select');
}

function datosComunes(oneWorld, form, modeloSel){
    var nombreCampos = "datoscomunes";
    form.addFieldGroup(nombreCampos, 'Datos Identidicativos', 'modsubtab').setShowBorder(true);
    form.addField('fld_tipodeclarante', 'checkbox', 'DECLARANTE ES PERSONA FÍSICA?', null, nombreCampos).setLayoutType('startrow');
    form.addField('fld_declarantenif', 'text', 'NIF DECLARANTE', null, nombreCampos).setMandatory(true).setLayoutType('startrow');
    if (request.getParameter('fld_tipodeclarante') != null && request.getParameter('fld_tipodeclarante').trim() != ""){
        if(request.getParameter('fld_tipodeclarante') == 'T'){
            form.addField('fld_declaranterazon', 'text', 'APELLIDOS', null, nombreCampos).setDisplaySize(25).setMandatory(true).setLayoutType('midrow');
            form.addField('fld_declarantenombre', 'text', 'NOMBRE', null, nombreCampos).setLayoutType('endrow');
        }else{
            form.addField('fld_declaranterazon', 'text', 'RAZON SOCIAL', null, nombreCampos).setDisplaySize(25).setMandatory(true).setLayoutType('midrow');
        }
    }else{
        form.addField('fld_declaranterazon', 'text', 'RAZON SOCIAL', null, nombreCampos).setDisplaySize(25).setMandatory(true).setLayoutType('midrow');
    }
}

function complementariaOsustitutiva(form){
    form.addFieldGroup('declaracioncomplsust', 'Declaración complementaria o sustitutiva', 'modsubtab').setShowBorder(true);
    form.addField('fld_declaracomplementaria', 'checkbox', 'Declaración Complementaria', null, 'declaracioncomplsust').setLayoutType('startrow');
    form.addField('fld_declarasustitutiva', 'checkbox', 'Declaración Sustitutiva', null, 'declaracioncomplsust').setLayoutType('startrow');
    form.addField('fld_identificativoanterior', 'text', 'Numero Identificativo declaración Anterior', null, 'declaracioncomplsust').setLayoutType('startrow');


    if (request.getParameter('fld_declaracomplementaria') != null && request.getParameter('fld_declaracomplementaria').trim() != ""){
        if (request.getParameter('fld_declaracomplementaria') == 'T'){
            form.getField('fld_identificativoanterior').setMandatory(true).setDisplayType('normal');
            form.getField('fld_declarasustitutiva').setDisplayType('disabled');
        }else if (request.getParameter('fld_declarasustitutiva') == 'T'){
            form.getField('fld_identificativoanterior').setMandatory(true).setDisplayType('normal');
            form.getField('fld_declaracomplementaria').setDisplayType('disabled');
        }
    }
}

function tipoDeclaracion(form){
    form.addFieldGroup('tipodeclaracion', 'Tipo Declaración', 'modsubtab').setShowBorder(true);
    var tipoDeclaracion = form.addField('fld_tipodeclaracion', 'select', 'Tipo Declaración', null, 'tipodeclaracion').setLayoutType('startrow').setMandatory(true);
        tipoDeclaracion.addSelectOption("I","Ingreso");
        tipoDeclaracion.addSelectOption("U","Domiciliación");
        tipoDeclaracion.addSelectOption("G","Ingreso a anotar en CCT");
        tipoDeclaracion.addSelectOption("N","Negativa");
    form.addField('fld_iban', 'text', 'IBAN', null, 'tipodeclaracion').setLayoutType('midrow').setDisplayType('hidden');

    if (request.getParameter('fld_tipodeclaracion') != null && request.getParameter('fld_tipodeclaracion').trim() != ""){
        if(request.getParameter('fld_tipodeclaracion') == "U"){
            form.getField('fld_iban').setLayoutType('midrow').setDisplayType('normal').setMandatory(true);
        }           
    }
}

function declaracionComplementaria(form){
    form.addFieldGroup('declaracioncomplementaria', 'Declaración Complementaria', 'modsubtab').setShowBorder(true);
    form.addField('fld_declaracomplementaria', 'checkbox', 'Declaración Complementaria', null, 'declaracioncomplementaria').setLayoutType('startrow');
    form.addField('fld_justificanteanterior', 'text', 'Numero Justificante declaración Anterior', null, 'declaracioncomplementaria').setLayoutType('startrow').setMandatory(false).setDisplayType('disabled');

    if (request.getParameter('fld_declaracomplementaria') != null && request.getParameter('fld_declaracomplementaria').trim() != ""){
        if (request.getParameter('fld_declaracomplementaria') == 'T'){
            form.getField('fld_justificanteanterior').setMandatory(true).setDisplayType('normal');
        }
    }
}

function recuperarDatos(form, oneWorld){
    //Cogemos parametros de la URL y los almacenamos en los campos al recargar.
    var params = request.getAllParameters();
    for (var param in params) {
        if (form.getField(param) != null){
            form.getField(param).setDefaultValue(params[param]);
        }
    }
}

function dump(request, response) {
    var ctx = nlapiGetContext();
    var searchResumen = 'customsearch_le115resumen';
    var deploy = 'customdeploy_x_exp_mod115';
    var periodoSel = request.getParameter('xperiodo');
    var ejercicio = request.getParameter('xejercicio');
    var subsidiaria = request.getParameter('subsid');
    var modelo = request.getParameter('fld_modelo');
    var ccaja = request.getParameter('fld_ccaja');
    switch(modelo){
        case MODELOS.m111.id:
            searchResumen = MODELOS.m111.resumen;
            deploy = MODELOS.m111.deploy;
        break;
        case MODELOS.m115.id:
            searchResumen = MODELOS.m115.resumen;
            deploy = MODELOS.m115.deploy;
        break;
        case MODELOS.m123.id:
            searchResumen = MODELOS.m123.resumen;
            deploy = MODELOS.m123.deploy;
        break;
        case MODELOS.m180.id:
            searchResumen = MODELOS.m180.resumen;
            deploy = MODELOS.m180.deploy;
        break;
        case MODELOS.m193.id:
            searchResumen = MODELOS.m193.resumen;
            deploy = MODELOS.m193.deploy;
        break;
        case MODELOS.m190.id:
            searchResumen = MODELOS.m190.resumen;
            deploy = MODELOS.m190.deploy;
        break;
        case MODELOS.m216.id:
            searchResumen = MODELOS.m216.resumen;
            deploy = MODELOS.m216.deploy;
        break;
        case MODELOS.m296.id:
            searchResumen = MODELOS.m296.resumen;
            deploy = MODELOS.m296.deploy;
        break;
        case MODELOS.m349.id:
            searchResumen = MODELOS.m349.resumen;
            deploy = MODELOS.m349.deploy;
        break;
        case MODELOS.m420.id:
            searchResumen = MODELOS.m420.resumen;
        break;
    }

    var paramsURL = {};
    var params = request.getAllParameters();

    for (var param in params) {
        if (param.indexOf('fld_') == 0) {
            flds.set(param, params[param]);
            paramsURL[param] = params[param];
        }
    }

    //Comprobamos que la búsqueda de NS tenga datos y si no devolvemos error.
    datosResumen(searchResumen, subsidiaria,ejercicio, periodoSel);

    paramsURL['subsid'] = subsidiaria;
    paramsURL['xperiodo'] = periodoSel;
    paramsURL['xejercicio'] = ejercicio;
    paramsURL['proc'] = 'T';
        
    nlapiScheduleScript('customscript_x_exp_modelos_scheduler', deploy, {
        custscript_x_expmod_subsidiaria: subsidiaria,
        custscript_x_expmod_periodo: periodoSel, 
        custscript_x_expmod_ejercicio: ejercicio,
        custscript_x_expmod_idbusqueda: searchResumen,
        custscript_x_expmod_ccaja : ccaja,
        custscript_x_expmod_campos: JSON.stringify(flds.get())});
    
    response.sendRedirect('SUITELET', ctx.getScriptId(), ctx.getDeploymentId(), false, paramsURL);
}
/*START FUNCIONES GENERALES COMUNES*/

function esOneWorld() {
    return nlapiGetContext().getFeature('SUBSIDIARIES');
}


/*END FUNCIONES GENERALES COMUNES*/
/*START MODELOS CANARIOS*/ 
function form410(oneWorld, form, modeloSel,nombreModelo){
    var filtroPeriodo = periodos.Mensual;
    form.addButton('btn_genmodel', 'Mostrar Datos', 'modelo410client');
    filtrosComunes(oneWorld, form, nombreModelo,filtroPeriodo);
}

function form417(oneWorld, form, modeloSel,nombreModelo){
    var filtroPeriodo = periodos.Mensual;
    form.addButton('btn_genmodel', 'Mostrar Datos', 'modelo417client');
    filtrosComunes(oneWorld, form, nombreModelo,filtroPeriodo);
}

function form420(oneWorld, form, modeloSel,nombreModelo){
    var filtroPeriodo = periodos.Trimestral;
    form.addButton('btn_genmodel', 'Mostrar Datos', 'modelo420client');
    filtrosComunes(oneWorld, form, nombreModelo,filtroPeriodo);
}

function form425(oneWorld, form, modeloSel,nombreModelo){
    var filtroPeriodo = periodos.Anual;
    form.addButton('btn_genmodel', 'Mostrar Datos', 'modelo425client');
    filtrosComunes(oneWorld, form, nombreModelo,filtroPeriodo);
}
/*END MODELOS CANARIOS*/

/*MODELO 390 */

function form390(oneWorld, form, modeloSel,nombreModelo){
    var filtroPeriodo = periodos.Anual;
    form.addButton('btn_genmodel', 'Mostrar Datos', 'modelo390client');
    filtrosComunes(oneWorld, form, nombreModelo,filtroPeriodo);
}