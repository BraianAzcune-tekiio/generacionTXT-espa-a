/**************************************************************************************
TITULO: Exportación Modelos AEAT Localización Española (Cliente)
AUTOR: RSM Spain
FECHA: 20/11/2018
VERSION: 1.2.0
****************************************************************************************/
/**
* Copyright 2018 RSM Spain Consultores S.L.  User may not copy, modify, distribute, or re-bundle or otherwise make available this code.
*/
/**
 * v. 1.1.0 - Añadido ejecución popup Modelo 420
 * v. 1.2.0 - Añadido ejecución popup Modelo 390
 */

//#region CONSTANTES
var campos = JSON.parse(nlapiGetFieldValue('arraycampos') || '{}'); 
//#endregion

if (nlapiGetFieldValue('proc') == 'T') {
    var rsm = new rsmLib();
    rsm.createAnnouncer('announcer', 'Confirmación', 'Se está procesando su petición de exportación de modelo.', 'confirmation');
    window.setTimeout(function(){rsm.destroyAnnouncer('announcer')}, 5000);
}

function onFieldChange(type, name, linenum){
    //La redirección del modelo se hace aparte ya que cuando cambia este campo, el resto de campos todavía no existen en el formulario y por tanto rellena la URL de 'nulls'
    if (name == 'fld_modelo'){
        var oldurl =  window.location.href;
        var header = "";
        oldurl.indexOf("&deploy=1") > 0 ? header = oldurl.substr(0, oldurl.indexOf("deploy=1")) : header = oldurl; 
        var url = header + "deploy=1&fld_modelo=" + nlapiGetFieldValue('fld_modelo');
        window.onbeforeunload = null;
        window.open(url, "_self");
    }

    if (name == 'xejercicio' || name == 'xperiodo' || name == 'fld_riva' || name == 'fld_version' || name == 'subsid' || name == 'fld_tipodeclarante' || name == 'fld_declaracomplementaria' || name == 'fld_tipodeclaracion' || name == 'fld_declarasustitutiva'){
        nlapiGetField
        var oldurl =  window.location.href;
        var header = "";
        oldurl.indexOf("&deploy=1") > 0 ? header = oldurl.substr(0, oldurl.indexOf("deploy=1")) : header = oldurl; 
       //Pasamos todos los campos que tienen valor como parámetro.
        var url = header + "deploy=1";
        for(var cam in campos){
            if(nlapiGetFieldValue(campos[cam]) != ""){
                url = url+"&"+campos[cam]+"="+nlapiGetFieldValue(campos[cam]);
            }  
        }
        window.onbeforeunload = null;
        window.open(url, "_self");
    }
	return true;
}

function modelo410client(){
    paramsSuitelet = "";
    paramsSuitelet += "&subsid="+nlapiGetFieldValue('subsid');
    paramsSuitelet += "&xperiodo="+nlapiGetFieldValue('xperiodo');
    paramsSuitelet += "&xejercicio="+nlapiGetFieldValue('xejercicio');
    var url = nlapiResolveURL('SUITELET', 'customscript_x_modelo_410', 'customdeploy_x_modelo_410', false) + paramsSuitelet;
    window.open(url, '_blank');
}

function modelo417client(){
    paramsSuitelet = "";
    paramsSuitelet += "&subsid="+nlapiGetFieldValue('subsid');
    paramsSuitelet += "&xperiodo="+nlapiGetFieldValue('xperiodo');
    paramsSuitelet += "&xejercicio="+nlapiGetFieldValue('xejercicio');
    var url = nlapiResolveURL('SUITELET', 'customscript_x_modelo_417', 'customdeploy_x_modelo_417', false) + paramsSuitelet;
    window.open(url, '_blank');
}

function modelo420client(){
    paramsSuitelet = "";
    paramsSuitelet += "&subsid="+nlapiGetFieldValue('subsid');
    paramsSuitelet += "&xperiodo="+nlapiGetFieldValue('xperiodo');
    paramsSuitelet += "&xejercicio="+nlapiGetFieldValue('xejercicio');
    var url = nlapiResolveURL('SUITELET', 'customscript_x_modelo_420', 'customdeploy_x_modelo_420', false) + paramsSuitelet;
    window.open(url, '_blank');
}

function modelo425client(){
    paramsSuitelet = "";
    paramsSuitelet += "&subsid="+nlapiGetFieldValue('subsid');
    paramsSuitelet += "&xperiodo="+nlapiGetFieldValue('xperiodo');
    paramsSuitelet += "&xejercicio="+nlapiGetFieldValue('xejercicio');
    var url = nlapiResolveURL('SUITELET', 'customscript_x_modelo_425', 'customdeploy_x_modelo_425', false) + paramsSuitelet;
    window.open(url, '_blank');
}

function modelo390client(){
    paramsSuitelet = "";
    paramsSuitelet += "&subsid="+nlapiGetFieldValue('subsid');
    paramsSuitelet += "&xperiodo="+nlapiGetFieldValue('xperiodo');
    paramsSuitelet += "&xejercicio="+nlapiGetFieldValue('xejercicio');
    var url = nlapiResolveURL('SUITELET', 'customscript_x_modelo_390', 'customdeploy_x_modelo_390', false) + paramsSuitelet;
    window.open(url, '_blank');
}