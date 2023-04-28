/**************************************************************************************
TITULO: Exportación Modelos AEAT Localización Española (Scheduler)
AUTOR: RSM Spain
FECHA: 17/12/2018
VERSION: 1.3.0
****************************************************************************************/
/**
* Copyright 2018 RSM Spain Consultores S.L.  User may not copy, modify, distribute, or re-bundle or otherwise make available this code.
*/
/**
 * v1.2.0 - Añadido registro de Modelos creados en el Cabinet
 * v1.3.0 - 16/04/2020 - Añadido modelo 111
 */

//#region Constantes
var tiporeg = {
    tipo1:1,
    tipo2:2,
    unico:3,
    tipo3:4,
    tipo4:5
};

MODELOS = {
    m111:{id:'15',nombre:'111'},
    m115:{id:'4',nombre:'115'},
    m123:{id:'5',nombre:'123'},
    m180:{id:'6',nombre:'180'},
    m190:{id:'16',nombre:'190'},
    m193:{id:'7',nombre:'193'},
    m216:{id:'8',nombre:'216'},
    m296:{id:'9',nombre:'296'},
    m303:{id:'1',nombre:'303'},
    m347:{id:'2',nombre:'347'},
    m349:{id:'3',nombre:'349'},
    m415:{id:'12',nombre:'123'},
    m420:{id:'10',nombre:'420'},
    m425:{id:'11',nombre:'425'}
};

var nifDesarrollo = 'B66719337';
var versionPrograma = '0001';
var ctx = nlapiGetContext();
    var subsidiaria = ctx.getSetting('SCRIPT', 'custscript_x_expmod_subsidiaria');
    var periodoSel = ctx.getSetting('SCRIPT', 'custscript_x_expmod_periodo');
    var ejercicio = ctx.getSetting('SCRIPT', 'custscript_x_expmod_ejercicio') || new Date().getFullYear();
    var searchResumen = ctx.getSetting('SCRIPT', 'custscript_x_expmod_idbusqueda');
    var campos = JSON.parse(ctx.getSetting('SCRIPT', 'custscript_x_expmod_campos') || '{}');
    var ccaja = ctx.getSetting('SCRIPT', 'custscript_x_expmod_ccaja');

//#endregion

function ejecutarExportacion(){
    var bisiesto = nlapiStringToDate("01/03/"+ejercicio);
    var xbisiesto = nlapiAddDays(bisiesto,-1);
    var filtrosResumen = [];
    var filtrosResumen_2 = [];
    //Columnas para el modelo 349
    var colTotalesc = 7;//Total columnas credito
    var colTotalesd = 24;//Total columnas credito
    
    !!subsidiaria ? filtrosResumen.push(new nlobjSearchFilter('subsidiary', null, 'anyof', subsidiaria)) : null;
    !!subsidiaria ? filtrosResumen_2.push(new nlobjSearchFilter('subsidiary', null, 'anyof', subsidiaria)) : null;

    switch(periodoSel){
        case "0A": 
            filtrosResumen.push(new nlobjSearchFilter('trandate', null, 'within', "01/01/"+ejercicio,"31/12/"+ejercicio));
            filtrosResumen_2.push(new nlobjSearchFilter('trandate', null, 'onorbefore', "31/12/"+ejercicio));
            filtrosResumen_2.push(new nlobjSearchFilter('trandate', "appliedToTransaction", 'within', "01/01/"+ejercicio,"31/12/"+ejercicio));
            colTotalesc = 7;
            colTotalesd = 24;
        break;
        case "1T": 
            filtrosResumen.push(new nlobjSearchFilter('trandate', null, 'within', "01/01/"+ejercicio,"31/03/"+ejercicio));
            filtrosResumen_2.push(new nlobjSearchFilter('trandate', null, 'onorbefore', "31/03/"+ejercicio));
            filtrosResumen_2.push(new nlobjSearchFilter('trandate', "appliedToTransaction", 'within', "01/01/"+ejercicio,"31/03/"+ejercicio));
            colTotalesc = 8;
            colTotalesd = 25;
        break;
        case "2T": 
            filtrosResumen.push(new nlobjSearchFilter('trandate', null, 'within', "01/04/"+ejercicio,"30/06/"+ejercicio));
            filtrosResumen_2.push(new nlobjSearchFilter('trandate', null, 'onorbefore', "30/06/"+ejercicio));
            filtrosResumen_2.push(new nlobjSearchFilter('trandate', "appliedToTransaction", 'within', "01/04/"+ejercicio,"30/06/"+ejercicio));
            colTotalesc = 9;
            colTotalesd = 26;
        break;
        case "3T": 
            filtrosResumen.push(new nlobjSearchFilter('trandate', null, 'within', "01/07/"+ejercicio,"30/09/"+ejercicio));
            filtrosResumen_2.push(new nlobjSearchFilter('trandate', null, 'onorbefore', "30/09/"+ejercicio));
            filtrosResumen_2.push(new nlobjSearchFilter('trandate', "appliedToTransaction", 'within', "01/07/"+ejercicio,"30/09/"+ejercicio));
            colTotalesc = 10;
            colTotalesd = 27;
        break;
        case "4T": 
            filtrosResumen.push(new nlobjSearchFilter('trandate', null, 'within', "01/10/"+ejercicio,"31/12/"+ejercicio));
            filtrosResumen_2.push(new nlobjSearchFilter('trandate', null, 'onorbefore', "31/12/"+ejercicio));
            filtrosResumen_2.push(new nlobjSearchFilter('trandate', "appliedToTransaction", 'within', "01/10/"+ejercicio,"31/12/"+ejercicio));
            colTotalesc = 11;
            colTotalesd = 28;
        break;
        case "01": 
            filtrosResumen.push(new nlobjSearchFilter('trandate', null, 'within', "01/01/"+ejercicio,"31/01/"+ejercicio));
            filtrosResumen_2.push(new nlobjSearchFilter('trandate', null, 'onorbefore', "31/01/"+ejercicio));
            filtrosResumen_2.push(new nlobjSearchFilter('trandate', "appliedToTransaction", 'within', "01/01/"+ejercicio,"31/01/"+ejercicio));
            colTotalesc = 12;
            colTotalesd = 29;
        break;
        case "02": 
            filtrosResumen.push(new nlobjSearchFilter('trandate', null, 'within', "01/02/"+ejercicio,xbisiesto));
            filtrosResumen_2.push(new nlobjSearchFilter('trandate', null, 'onorbefore', xbisiesto));
            filtrosResumen_2.push(new nlobjSearchFilter('trandate', "appliedToTransaction", 'within', "01/02/"+ejercicio,xbisiesto));
            colTotalesc = 13;
            colTotalesd = 30;
        break;
        case "03": 
            filtrosResumen.push(new nlobjSearchFilter('trandate', null, 'within', "01/03/"+ejercicio,"31/03/"+ejercicio));
            filtrosResumen_2.push(new nlobjSearchFilter('trandate', null, 'onorbefore', "31/03/"+ejercicio));
            filtrosResumen_2.push(new nlobjSearchFilter('trandate', "appliedToTransaction", 'within', "01/03/"+ejercicio,"31/03/"+ejercicio));
            colTotalesc = 14;
            colTotalesd = 31;
        break;
        case "04": 
            filtrosResumen.push(new nlobjSearchFilter('trandate', null, 'within', "01/04/"+ejercicio,"30/04/"+ejercicio));
            filtrosResumen_2.push(new nlobjSearchFilter('trandate', null, 'onorbefore', "30/04/"+ejercicio));
            filtrosResumen_2.push(new nlobjSearchFilter('trandate', "appliedToTransaction", 'within', "01/04/"+ejercicio,"30/04/"+ejercicio));
            colTotalesc = 15;
            colTotalesd = 32;
        break;
        case "05": 
            filtrosResumen.push(new nlobjSearchFilter('trandate', null, 'within', "01/05/"+ejercicio,"31/05/"+ejercicio));
            filtrosResumen_2.push(new nlobjSearchFilter('trandate', null, 'onorbefore', "31/05/"+ejercicio));
            filtrosResumen_2.push(new nlobjSearchFilter('trandate', "appliedToTransaction", 'within', "01/05/"+ejercicio,"31/05/"+ejercicio));
            colTotalesc = 16;
            colTotalesd = 33;
        break;
        case "06": 
            filtrosResumen.push(new nlobjSearchFilter('trandate', null, 'within', "01/06/"+ejercicio,"30/06/"+ejercicio));
            filtrosResumen_2.push(new nlobjSearchFilter('trandate', null, 'onorbefore', "31/06/"+ejercicio));
            filtrosResumen_2.push(new nlobjSearchFilter('trandate', "appliedToTransaction", 'within', "01/06/"+ejercicio,"30/06/"+ejercicio));
            colTotalesc = 17;
            colTotalesd = 34;
        break;
        case "07": 
            filtrosResumen.push(new nlobjSearchFilter('trandate', null, 'within', "01/07/"+ejercicio,"31/07/"+ejercicio));
            filtrosResumen_2.push(new nlobjSearchFilter('trandate', null, 'onorbefore', "31/07/"+ejercicio));
            filtrosResumen_2.push(new nlobjSearchFilter('trandate', "appliedToTransaction", 'within', "01/07/"+ejercicio,"31/07/"+ejercicio));
            colTotalesc = 18;
            colTotalesd = 35;
        break;
        case "08": 
            filtrosResumen.push(new nlobjSearchFilter('trandate', null, 'within', "01/08/"+ejercicio,"31/08/"+ejercicio));
            filtrosResumen_2.push(new nlobjSearchFilter('trandate', null, 'onorbefore', "31/08/"+ejercicio));
            filtrosResumen_2.push(new nlobjSearchFilter('trandate', "appliedToTransaction", 'within', "01/08/"+ejercicio,"31/08/"+ejercicio));
            colTotalesc = 19;
            colTotalesd = 36;
        break;
        case "09": 
            filtrosResumen.push(new nlobjSearchFilter('trandate', null, 'within', "01/09/"+ejercicio,"30/09/"+ejercicio));
            filtrosResumen_2.push(new nlobjSearchFilter('trandate', null, 'onorbefore', "30/09/"+ejercicio));
            filtrosResumen_2.push(new nlobjSearchFilter('trandate', "appliedToTransaction", 'within', "01/09/"+ejercicio,"30/09/"+ejercicio));
            colTotalesc = 20;
            colTotalesd = 37;
        break;
        case "10": 
            filtrosResumen.push(new nlobjSearchFilter('trandate', null, 'within', "01/10/"+ejercicio,"31/10/"+ejercicio));
            filtrosResumen_2.push(new nlobjSearchFilter('trandate', null, 'onorbefore', "31/10/"+ejercicio));
            filtrosResumen_2.push(new nlobjSearchFilter('trandate', "appliedToTransaction", 'within', "01/10/"+ejercicio,"31/10/"+ejercicio));
            colTotalesc = 21;
            colTotalesd = 38;
        break;
        case "11": 
            filtrosResumen.push(new nlobjSearchFilter('trandate', null, 'within', "01/11/"+ejercicio,"30/11/"+ejercicio));
            filtrosResumen_2.push(new nlobjSearchFilter('trandate', null, 'onorbefore', "30/11/"+ejercicio));
            filtrosResumen_2.push(new nlobjSearchFilter('trandate', "appliedToTransaction", 'within', "01/11/"+ejercicio,"30/11/"+ejercicio));
            colTotalesc = 22;
            colTotalesd = 39;
        break;
        case "12": 
            filtrosResumen.push(new nlobjSearchFilter('trandate', null, 'within', "01/12/"+ejercicio,"31/12/"+ejercicio));
            filtrosResumen_2.push(new nlobjSearchFilter('trandate', null, 'onorbefore', "31/12/"+ejercicio));
            filtrosResumen_2.push(new nlobjSearchFilter('trandate', "appliedToTransaction", 'within', "01/12/"+ejercicio,"31/12/"+ejercicio));
            colTotalesc = 23;
            colTotalesd = 40;
        break;
        default:
            filtrosResumen.push(new nlobjSearchFilter('trandate', null, 'within', "01/01/"+ejercicio,"31/01/"+ejercicio));
            filtrosResumen_2.push(new nlobjSearchFilter('trandate', null, 'onorbefore', "31/01/"+ejercicio));
            filtrosResumen_2.push(new nlobjSearchFilter('trandate', "appliedToTransaction", 'within', "01/01/"+ejercicio,"31/01/"+ejercicio));
            colTotalesc = 7;
            colTotalesd = 24;
        break;
    }

    if (ccaja == "T"){ //CRITRIO DE CAJA
        var pagosApli = new Object();
        var pagosApliDate = new Object();
        var searchPagos = ultraSearch(null,"customsearch_le_resumen_pagos",filtrosResumen,null);
        for(var res in searchPagos){
            var key = searchPagos[res].getValue("internalid", null, "GROUP") + "-" + searchPagos[res].getValue("internalid", "appliedToTransaction", "GROUP");
            var keyDate = searchPagos[res].getValue("internalid", null, "GROUP") + "-" + searchPagos[res].getValue("internalid", "appliedToTransaction", "GROUP") + "-" + searchPagos[res].getValue("trandate", null, "GROUP"); //NEW
            pagosApli[key] = searchPagos[res].getValue("appliedtoforeignamount", null, "SUM");
            pagosApliDate[keyDate] = searchPagos[res].getValue("appliedtoforeignamount", null, "SUM");
        }

        var searchPagos = ultraSearch(null,"customsearch_le_resumen_pagos",filtrosResumen_2,null);
        for(var res in searchPagos){
            var key = searchPagos[res].getValue("internalid", null, "GROUP") + "-" + searchPagos[res].getValue("internalid", "appliedToTransaction", "GROUP");
            var keyDate = searchPagos[res].getValue("internalid", null, "GROUP") + "-" + searchPagos[res].getValue("internalid", "appliedToTransaction", "GROUP") + "-" + searchPagos[res].getValue("trandate", null, "GROUP"); //NEW
            if(!pagosApli.hasOwnProperty(key)){
                pagosApli[key] = searchPagos[res].getValue("appliedtoforeignamount", null, "SUM");
            }

            if(!pagosApliDate.hasOwnProperty(keyDate)){
                pagosApli[keyDate] = searchPagos[res].getValue("appliedtoforeignamount", null, "SUM");
            }
        }
        
        var pagosFacs = new Object();
        for (k in Object.keys(pagosApli)){
            var key1 = Object.keys(pagosApli)[k];
            var key = key1.split("-")[1];

            if(!pagosFacs.hasOwnProperty(key)){
                pagosFacs[key] = pagosApli[key1];
            }else{
                pagosFacs[key] = +(pagosApli[key1]) + +(pagosFacs[key]);
            }
        }

        var pagosFacsDate = new Object();
        for (k in Object.keys(pagosApliDate)){
            var key1 = Object.keys(pagosApliDate)[k];
            var key = key1.split("-")[1] + "-" + key1.split("-")[2];

            if(!pagosFacsDate.hasOwnProperty(key)){
                pagosFacsDate[key] = pagosApliDate[key1];
            }else{
                pagosFacsDate[key] = +(pagosApliDate[key1]) + +(pagosFacsDate[key]);
            }
        }

        var facturasFacs = new Object();
        var searchFacturas = ultraSearch(null,"customsearch_le_resumen_facturas", [new nlobjSearchFilter("internalid", null, "anyof", Object.keys(pagosFacs))], null);

        for(var res in searchFacturas){
            facturasFacs[searchFacturas[res].getValue("internalid", null, "GROUP")] = searchFacturas[res].getValue("fxamount", null, "SUM");
        }

        var relacionFacs = new Object();
        var relacionFacsDate = new Object();

        for (k in Object.keys(pagosFacs)){
            var key = Object.keys(pagosFacs)[k];
            relacionFacs[key] = pagosFacs[key] / facturasFacs[key];
        }

        for (k in Object.keys(pagosFacsDate)){
            var key = Object.keys(pagosFacsDate)[k];
            var keyFac = key.split("-")[0];
            relacionFacsDate[key] = pagosFacsDate[key] / facturasFacs[keyFac];
        }

        filtrosResumen.push(new nlobjSearchFilter("type", null, "anyof", ["VendCred"]));
        var searchFacturas = ultraSearch(null,"customsearch_le_resumen_facturas", filtrosResumen, null);
        for(var res in searchFacturas){
            relacionFacs[searchFacturas[res].getValue("internalid", null, "GROUP")] = 1;
            relacionFacsDate[searchFacturas[res].getValue("internalid", null, "GROUP") + "-" + searchFacturas[res].getValue("trandate", null, "GROUP")] = 1;
        }
        

        var aSearch = [];
        var searchResult = ultraSearch(null,searchResumen,[new nlobjSearchFilter("internalid", null, "anyof", Object.keys(relacionFacs))],null);
        if(searchResult != 0){
            var columns = searchResult[0].getAllColumns();
        }

        for(var res in searchResult){
            var aSearchLineas = {};
            for(var col in columns){
                if(searchResult[res].getText(columns[col]) == null){
                    aSearchLineas["col"+col] = searchResult[res].getValue(columns[col]);
                }else{
                    aSearchLineas["col"+col] = searchResult[res].getText(columns[col]);
                }
                
            }
            aSearch.push(aSearchLineas);
        }

        var searchImportes = ultraSearch(null,searchResumen+"_cc",[new nlobjSearchFilter("internalid", null, "anyof", Object.keys(relacionFacs))],null);
        if(searchImportes != 0){
            var columns = searchImportes[0].getAllColumns();
        }

        switch(campos['fld_modelo']){
            case MODELOS.m111.id:
                var mapImportes = {};
                for(var res in searchImportes){
                    var key = "" +searchImportes[res].getValue(columns[3]) + searchImportes[res].getValue(columns[4]); //valore de la clave + la subclave

                    if (!mapImportes.hasOwnProperty(key)){
                        mapImportes[key] = {};
                        mapImportes[key].base = 0;
                        mapImportes[key].reten = 0;
                    }
                    mapImportes[key].base = +mapImportes[key].base + (searchImportes[res].getValue(columns[1])||0)*relacionFacs[searchImportes[res].getValue(columns[5])]
                    mapImportes[key].reten = +mapImportes[key].reten + (searchImportes[res].getValue(columns[2])||0)*relacionFacs[searchImportes[res].getValue(columns[5])]
                }

                for (a in aSearch){
                    var key = "" +aSearch[a].col3 + aSearch[a].col4;
                    aSearch[a].col1 = +(mapImportes[key].base);
                    aSearch[a].col2 = +(mapImportes[key].reten);
                }


            break;

            case MODELOS.m190.id:
                var mapImportes = {};
                for(var res in searchImportes){
                    var key = "" +searchImportes[res].getValue(columns[0]) + searchImportes[res].getValue(columns[1]) + searchImportes[res].getValue(columns[2]) + searchImportes[res].getValue(columns[3]);

                    if (!mapImportes.hasOwnProperty(key)){
                        mapImportes[key] = {};
                        mapImportes[key].base = 0;
                        mapImportes[key].reten = 0;
                    }
                    mapImportes[key].base = +mapImportes[key].base + (searchImportes[res].getValue(columns[4])||0)*relacionFacs[searchImportes[res].getValue(columns[8])]
                    mapImportes[key].reten = +mapImportes[key].reten + (searchImportes[res].getValue(columns[5])||0)*relacionFacs[searchImportes[res].getValue(columns[8])]
                }


                for (a in aSearch){
                    var key = "" +aSearch[a].col0 + aSearch[a].col1 + aSearch[a].col2 + aSearch[a].col3;
                    aSearch[a].col4 = +(mapImportes[key].base);
                    aSearch[a].col5 = +(mapImportes[key].reten);
                }
            break;

            case MODELOS.m216.id:
                var baseIRPF = 0;
                var retenIRPF = 0;
                var base = 0;
                for(var res in searchImportes){
                    baseIRPF = +(baseIRPF) + +(searchImportes[res].getValue(columns[1])*relacionFacs[searchImportes[res].getValue(columns[5])]);
                    retenIRPF = +(retenIRPF) + +(searchImportes[res].getValue(columns[2])*relacionFacs[searchImportes[res].getValue(columns[5])]);
                    base = +(base) + +(searchImportes[res].getValue(columns[4])*relacionFacs[searchImportes[res].getValue(columns[5])]);
                }
                aSearch[0].col1 = baseIRPF.toFixed(2);
                aSearch[0].col2 = retenIRPF.toFixed(2);
                aSearch[0].col4 = base.toFixed(2);
            break;

            case MODELOS.m296.id:
                var mapImportes = {};
                for(var res in searchImportes){
                    mapImportes[searchImportes[res].getValue(columns[0])] = {};
                    mapImportes[searchImportes[res].getValue(columns[0])].base = searchImportes[res].getValue(columns[5])||0;
                    mapImportes[searchImportes[res].getValue(columns[0])].reten = searchImportes[res].getValue(columns[7])||0;
                }

                var aSearchOld = aSearch;
                
                var aSearch = [];

                for (k in Object.keys(relacionFacsDate)){
                    var key = Object.keys(relacionFacsDate)[k];
                    var fac = key.split("-")[0];
                    var date = key.split("-")[1];

                    for (a in aSearchOld){
                        if (aSearchOld[a].col0 == fac){
                            var aSearchLineas = {};
                            aSearchLineas.col0 = aSearchOld[a].col0;
                            aSearchLineas.col1 = aSearchOld[a].col1;
                            aSearchLineas.col2 = aSearchOld[a].col2;
                            aSearchLineas.col3 = aSearchOld[a].col3;
                            aSearchLineas.col4 = date;
                            aSearchLineas.col5 = +(mapImportes[fac].base*relacionFacsDate[key]);
                            aSearchLineas.col6 = aSearchOld[a].col6;
                            aSearchLineas.col7 = +(mapImportes[fac].reten*relacionFacsDate[key]);
                            aSearchLineas.col8 = aSearchOld[a].col8;
                            aSearchLineas.col9 = aSearchOld[a].col9;
                            aSearchLineas.col10 = aSearchOld[a].col10;
                            aSearchLineas.col11 = aSearchOld[a].col11;
                            aSearchLineas.col12 = aSearchOld[a].col12;
                            aSearch.push(aSearchLineas);
                        }
                    }
                }

            break;
            
        }

    } else{ //NORMAL
        var aSearch = [];
        var searchResult = ultraSearch(null,searchResumen,filtrosResumen,null);
        if(searchResult != 0){
            var columns = searchResult[0].getAllColumns();
        }

        for(var res in searchResult){
            var aSearchLineas = {};
            for(var col in columns){
                if(searchResult[res].getText(columns[col]) == null){
                    aSearchLineas["col"+col] = searchResult[res].getValue(columns[col]);
                }else{
                    aSearchLineas["col"+col] = searchResult[res].getText(columns[col]);
                }
                
            }
            aSearch.push(aSearchLineas);
        }
    }


    switch(campos['fld_modelo']){
        case MODELOS.m111.id:
            mod111Export(aSearch);
        break;
        case MODELOS.m115.id:
            mod115Export(aSearch);
        break;
        case MODELOS.m123.id:
            mod123Export(aSearch);
        break;
        case MODELOS.m180.id:
            mod180Export(aSearch);
        break;
        case MODELOS.m190.id:
            mod190Export(aSearch);
        break;
        case MODELOS.m193.id:
            mod193Export(aSearch);
        break;
        case MODELOS.m216.id:
            mod216Export(aSearch);
        break;
        case MODELOS.m296.id:
            mod296Export(aSearch);
        break;
        case MODELOS.m349.id:
            mod349Export(aSearch,colTotalesc,colTotalesd);
        break;
    }

}

function mod111Export(aSearch){
    var nombreModelo = MODELOS.m111.nombre;
    var idModelos = MODELOS.m111.id;

    var totalPerceptores = 0;
    var totalBase = 0;
    var totalRetenciones = 0;
    var totalComplementaria = campos['fld_justificanteanterior'] || 0;
    
    for(var lin in aSearch){
        totalPerceptores = parseFloat(parseFloat(totalPerceptores)+parseFloat(aSearch[lin].col0)).toFixed(2);
        totalBase = parseFloat(parseFloat(totalBase)+parseFloat(aSearch[lin].col1)).toFixed(2);
        totalRetenciones = parseFloat(parseFloat(totalRetenciones)+(parseFloat(aSearch[lin].col2) *-1)).toFixed(2);
    }
    var resultadoIngresar = parseFloat(parseFloat(totalRetenciones)-parseFloat(totalComplementaria)).toFixed(2);

    var params = [{
        '4': ejercicio,
        '5': periodoSel,
        '9': versionPrograma,
        '11': nifDesarrollo,
        '19': campos['fld_tipodeclaracion'],
        '20': campos['fld_declarantenif'],
        '21': limpiarChar(campos['fld_declaranterazon']).toUpperCase(),
        '22': campos['fld_tipodeclarante'] == 'T' ? limpiarChar(campos['fld_declarantenombre']).toUpperCase() : "",
        '23': ejercicio,
        '24': periodoSel,
        '25': totalPerceptores,//Casilla [7]
        '26': totalBase,//Casilla [8]
        '27': totalRetenciones, //Casilla [9]
        '52': totalRetenciones, //Casilla [28]
        '53': campos['fld_justificanteanterior'], //Casilla [29]
        '54': resultadoIngresar, //Casilla [30]
        '55': campos['fld_declaracomplementaria'] == 'T' ? "X" : " ",
        '56': campos['fld_justificanteanterior'],
        '58': campos['fld_iban'],
        '63': ejercicio,
        '64': periodoSel
    }];
    var m = new modelTemplateNS('modelo111', campos['fld_version'], 'numero', tiporeg.unico);
    m.setValues(params);
    guardarGabinet(nombreModelo, idModelos, m.getValues(), campos['fld_declarantenif'], ejercicio, subsidiaria);
}
function mod115Export(aSearch){
    var nombreModelo = MODELOS.m115.nombre;
    var idModelos = MODELOS.m115.id;

    var casilla29 = parseFloat(parseFloat(aSearch[0].col2)-parseFloat(campos['fld_resejercicioanterior'] || 0)).toFixed(2);
    var params = [{
        '4': ejercicio,
        '5': periodoSel,
        '9': versionPrograma,
        '11': nifDesarrollo,
        '18': campos['fld_declaracomplementaria'] == 'T' ? "C" : " ",
        '19': campos['fld_tipodeclaracion'],
        '20': campos['fld_declarantenif'],
        '21': limpiarChar(campos['fld_declaranterazon']).toUpperCase(),
        '22': campos['fld_tipodeclarante'] == 'T' ? limpiarChar(campos['fld_declarantenombre']).toUpperCase() : "",
        '23': ejercicio,
        '24': periodoSel,
        '25': aSearch[0].col0,
        '26': aSearch[0].col1,
        '27': aSearch[0].col2,
        '28': campos['fld_resejercicioanterior'],
        '29': casilla29,
        '30': campos['fld_declaracomplementaria'] == 'T' ? "X" : " ",
        '31': campos['fld_justificanteanterior'],
        '32': campos['fld_iban'],
        '37': ejercicio,
        '38': periodoSel
    }];
    var m = new modelTemplateNS('modelo115', campos['fld_version'], 'numero', tiporeg.unico);
    m.setValues(params);
    guardarGabinet(nombreModelo, idModelos, m.getValues(), campos['fld_declarantenif'], ejercicio, subsidiaria);
}

function mod123Export(aSearch){
    var nombreModelo = MODELOS.m123.nombre;
    var idModelos = MODELOS.m123.id;
    var regularizacion = parseFloat(campos['fld_regularizacion'] || 0).toFixed(2);
    var casilla30 = parseFloat(parseFloat(aSearch[0].col2)+parseFloat(regularizacion)).toFixed(2);
    if(campos['fld_declaracomplementaria'] == 'T'){
        var casilla31 = parseFloat(campos['fld_resejercicioanterior'] || 0).toFixed(2);
        var casilla32 = parseFloat(parseFloat(casilla30)-parseFloat(casilla31)).toFixed(2);
    }else{
        var casilla31 = '0';
        var casilla32 = casilla30;
    }

    var params = [{
        '4': ejercicio,
        '5': periodoSel,
        '9': versionPrograma,
        '11': nifDesarrollo,
        '19': campos['fld_tipodeclaracion'],
        '20': campos['fld_declarantenif'],
        '21': limpiarChar(campos['fld_declaranterazon']).toUpperCase(),
        '22': campos['fld_tipodeclarante'] == 'T' ? limpiarChar(campos['fld_declarantenombre']).toUpperCase() : "",
        '23': ejercicio,
        '24': periodoSel,
        '25': aSearch[0].col0, //Perceptores
        '26': aSearch[0].col1,
        '27': aSearch[0].col2,
        '28': campos['fld_ingejercicioanterior'],
        '29': regularizacion,
        '30': casilla30,
        '31': casilla31,
        '32': casilla32,
        '33': campos['fld_declaracomplementaria'] == 'T' ? "X" : " ",
        '34': campos['fld_declaracomplementaria'] == 'T' ?  campos['fld_justificanteanterior'] : "",
        '35': campos['fld_iban'],
        '40': ejercicio,
        '41': periodoSel
    }];
    var m = new modelTemplateNS('modelo123', campos['fld_version'], 'numero', tiporeg.unico);
    m.setValues(params);
    guardarGabinet(nombreModelo, idModelos, m.getValues(), campos['fld_declarantenif'], ejercicio, subsidiaria);
}

function mod180Export(aSearch){
    var nombreModelo = MODELOS.m180.nombre;
    var idModelos = MODELOS.m180.id;

    var totalPerceptores = aSearch.length;
    var totalBase = 0;
    var totalRetenciones = 0;
    for(var lin in aSearch){
        totalBase = parseFloat(parseFloat(totalBase)+parseFloat(aSearch[lin].col4)).toFixed(2);
        totalRetenciones = parseFloat(parseFloat(totalRetenciones)+(parseFloat(aSearch[lin].col6) *-1)).toFixed(2);
    }
    var params = [{
        '3': ejercicio,
        '4': campos['fld_declarantenif'].toUpperCase(),
        '5': limpiarChar(campos['fld_declaranterazon']).toUpperCase(),
        '6': campos['fld_tiposoporte'],
        '7': campos['fld_tlfcontacto'],
        '8': campos['fld_nombrecontacto'].toUpperCase(),
        '9': campos['fld_numeroidentificativo'],
        '10': (campos['fld_declaracomplementaria'] == 'T' ? "C" : " ")+(campos['fld_declarasustitutiva'] == 'T' ? "S" : " "),
        '11': campos['fld_identificativoanterior'],
        '12': totalPerceptores,//Suma de Perceptores
        '13': totalBase < 0 ? "N" : " ",
        '14': totalBase,
        '15': totalRetenciones
    }];
    var result = "";
    var m1 = new modelTemplateNS('modelo180', campos['fld_version'], 'numero', tiporeg.tipo1);
    m1.setValues(params);
    result += m1.getValues();
    
    //#endregion
    for(var lin in aSearch){
        params = [{
            '3': ejercicio,
            '4': campos['fld_declarantenif'].toUpperCase(),
            '5': aSearch[lin].col0, //NIF Perceptor
            '6': campos['fld_nifrepresentante'].toUpperCase(),
            '7': aSearch[lin].col1.toUpperCase(), //Razon Social
            '8': aSearch[lin].col12, //Provincia
            '9': aSearch[lin].col3, //Modalidad
            '10': aSearch[lin].col4 < 0 ? "N" : " ",
            '11': aSearch[lin].col4, //Base
            '12': parseFloat(aSearch[lin].col5.replace("%","")).toFixed(2), //% Retencion
            '13': (aSearch[lin].col6 *-1), //Retencion
            '14': campos['fld_ejerciciodevengo'],
            '16': aSearch[lin].col2, //referencia catastral
            '17': aSearch[lin].col7, //tipo de via
            '18': aSearch[lin].col9, //nombre calle
            '19': aSearch[lin].col8, //tipo numeracion
            '20': aSearch[lin].col14, //numero de casa
            '22': aSearch[lin].col15, //bloque
            '24': aSearch[lin].col16, //Escalera
            '25': aSearch[lin].col17, //Planta o piso
            '26': aSearch[lin].col18, //puerta
            '28': aSearch[lin].col10, //Localidad
            '29': aSearch[lin].col10, //Municipio
            '31': aSearch[lin].col12, //Provincia
            '32': aSearch[lin].col13 //Código Postal
        }];
        var m2 = new modelTemplateNS('modelo180', campos['fld_version'], 'numero', tiporeg.tipo2);
        m2.setValues(params);
        result += m2.getValues();
    }

    guardarGabinet(nombreModelo, idModelos, result, campos['fld_declarantenif'], ejercicio, subsidiaria);
}

function mod190Export(aSearch){
    var nombreModelo = MODELOS.m190.nombre;
    var idModelos = MODELOS.m190.id;

    var totalPerceptores = aSearch.length;
    var totalBase = 0;
    var totalRetenciones = 0;

    for(var lin in aSearch){
        totalBase = parseFloat(parseFloat(totalBase)+parseFloat(aSearch[lin].col4)).toFixed(2) || 0;
        totalRetenciones = parseFloat(parseFloat(totalRetenciones)+(parseFloat(aSearch[lin].col5)).toFixed(2)*-1) || 0;
    }

    var params = [{
        '3': ejercicio,
        '4': campos['fld_declarantenif'].toUpperCase(),
        '5': limpiarChar(campos['fld_declaranterazon']).toUpperCase(),
        '7': campos['fld_tlfcontacto'],
        '8': campos['fld_nombrecontacto'].toUpperCase(),
        '9': campos['fld_numeroidentificativo'],
        '10': (campos['fld_declaracomplementaria'] == 'T' ? "C" : " "),
        '11': (campos['fld_declarasustitutiva'] == 'T' ? "S" : " "),
        '12': campos['fld_identificativoanterior'],
        '13': totalPerceptores,
        '14': totalBase < 0 ? "N" : " ",
        '15': totalBase,
        '16': totalRetenciones
    }];
    var result = "";
    var m1 = new modelTemplateNS('modelo190', campos['fld_version'], 'numero', tiporeg.tipo1);
    m1.setValues(params);
    result += m1.getValues();
    
    //#endregion
    for(var lin in aSearch){
        var basePerceptor = parseFloat(aSearch[lin].col4).toFixed(2) || 0;
        var retencionPerceptor = parseFloat(aSearch[lin].col5).toFixed(2)*-1 || 0;
        params = [{
            '3': ejercicio, //ejercicio
            '4': campos['fld_declarantenif'].toUpperCase(),
            '5': aSearch[lin].col1, //NIF Perceptor
            '6': campos['fld_nifrepresentante'].toUpperCase(),
            '7': aSearch[lin].col0.toUpperCase(), //Razon Social
            '8': aSearch[lin].col2, //Provincia
            '9': aSearch[lin].col6, //Clave Percepción
            '10': aSearch[lin].col7, //Subclave
            '12': basePerceptor,
            '13': retencionPerceptor,
            '18': aSearch[lin].col3 == ejercicio ? '' : aSearch[lin].col3 //ejercicio del devengo
            
        }];
        var m2 = new modelTemplateNS('modelo190', campos['fld_version'], 'numero', tiporeg.tipo2);
        m2.setValues(params);
        result += m2.getValues();
    }
    guardarGabinet(nombreModelo, idModelos, result, campos['fld_declarantenif'], ejercicio, subsidiaria);
}

function mod193Export(aSearch){
    var nombreModelo = MODELOS.m193.nombre;
    var idModelos = MODELOS.m193.id;

    var totalPerceptores = aSearch.length;
    var totalBase = 0;
    var totalRetenciones = 0;
    for(var lin in aSearch){
        totalBase = parseFloat(parseFloat(totalBase)+parseFloat(aSearch[lin].col8)||0).toFixed(2);
        totalRetenciones = parseFloat(parseFloat(totalRetenciones)+parseFloat(aSearch[lin].col7)||0).toFixed(2);
    }
    var params = [{
        '3': ejercicio,
        '4': campos['fld_declarantenif'].toUpperCase(),
        '5': limpiarChar(campos['fld_declaranterazon']).toUpperCase(),
        '6': 'T', //campos['fld_tiposoporte'],
        '7': campos['fld_tlfcontacto'],
        '8': campos['fld_nombrecontacto'].toUpperCase(),
        '9': campos['fld_numeroidentificativo'],
        '10': (campos['fld_declaracomplementaria'] == 'T' ? "C" : " ")+(campos['fld_declarasustitutiva'] == 'T' ? "S" : " "),
        '11': campos['fld_identificativoanterior'],
        '12': '',
        '13': totalPerceptores,//Suma de Perceptores
        '14': totalBase,
        '15': totalRetenciones
    }];
    var result = "";
    var m1 = new modelTemplateNS('modelo193', campos['fld_version'], 'numero', tiporeg.tipo1);
    m1.setValues(params);
    result += m1.getValues();
    
    //#endregion
    for(var lin in aSearch){
        params = [{
            '3': ejercicio,
            '4': campos['fld_declarantenif'].toUpperCase(),
            '5': aSearch[lin].col0, //NIF Perceptor
            '6': '',
            '7': aSearch[lin].col1.toUpperCase(), //Razon Social
            '8': '', //(aSearch[lin].col3 == "A" || aSearch[lin].col3 == "B" ||aSearch[lin].col3 == "D") ? "X" : '', //Pago a un mediador
            '9':  aSearch[lin].col2, //Modalidad
            '10': '',
            '11': '',
            '12': aSearch[lin].col3, //clave
            '13': aSearch[lin].col4, //naturaleza
            '14': '',
            '15': '',
            '16': '',
            '17': '',
            '18': (aSearch[lin].col3 == "A" || aSearch[lin].col3 == "B" ||aSearch[lin].col3 == "D") ? campos['fld_ejerciciodevengo'] : '',
            '19': aSearch[lin].col5,
            '20': aSearch[lin].col8, //IMPORTE DE PERCEPCIONES / REMUNERACIÓN AL PRESTAMISTA 
            '23': aSearch[lin].col8, //Base
            '24': parseFloat(aSearch[lin].col9.replace("%","")).toFixed(2), //% Retencion
            '25': aSearch[lin].col7, //Retencion
            '28': 'S', //naturaleza
            '29': '',
            '30': '',
            '31': '',
            '32': ''
            /*'10': aSearch[lin].col7 < 0 ? "N" : " ",
            '11': aSearch[lin].col7, //Base
            '12': parseFloat(aSearch[lin].col9.replace("%","")).toFixed(2), //% Retencion
            '13': aSearch[lin].col8, //Retencion
            '14': campos['fld_ejerciciodevengo'],
            '16': campos['fld_referenciacatastral'],
            '17': aSearch[lin].col7, //tipo de via
            '18': aSearch[lin].col9, //nombre calle
            '19': aSearch[lin].col8, //tipo numeracion
            '20': aSearch[lin].col14, //numero de casa
            '22': aSearch[lin].col15, //bloque
            '24': aSearch[lin].col16, //Escalera
            '25': aSearch[lin].col17, //Planta o piso
            '26': aSearch[lin].col18, //puerta
            '28': aSearch[lin].col10, //Localidad
            '29': aSearch[lin].col10, //Municipio
            '31': aSearch[lin].col12, //Provincia
            '32': aSearch[lin].col13 //Código Postal*/
        }];
        var m2 = new modelTemplateNS('modelo193', campos['fld_version'], 'numero', tiporeg.tipo2);
        m2.setValues(params);
        result += m2.getValues();
    }
    guardarGabinet(nombreModelo, idModelos, result, campos['fld_declarantenif'], ejercicio, subsidiaria);
}

function mod216Export(aSearch){
    var nombreModelo = MODELOS.m216.nombre;
    var idModelos = MODELOS.m216.id;

    var resultadoAnterior = parseFloat(campos['fld_declaracomplementaria'] == 'T' ?  campos['fld_resultadoanterior'] : 0).toFixed(2);
    var casilla27 = parseFloat(parseFloat(aSearch[0].col2||0)-parseFloat(resultadoAnterior)).toFixed(2);
   

    var params = [{
        '4': ejercicio,
        '5': periodoSel,
        '9': versionPrograma,
        '11': nifDesarrollo,
        '19': campos['fld_tipodeclaracion'],
        '20': campos['fld_declarantenif'],
        '21': limpiarChar(campos['fld_declaranterazon']).toUpperCase(),
        '12': campos['fld_tipodeclarante'] == 'T' ? limpiarChar(campos['fld_declarantenombre']).toUpperCase() : "",
        '23': ejercicio,
        '24': periodoSel,
        '25': aSearch[0].col0, //PARTIDA 1 - NÚM. RENTAS
        '26': aSearch[0].col1, //PARTIDA 2 - BASE RET. ING. CUENTA
        '27': aSearch[0].col2, //PARTIDA 3 - RETENCIONES INGRESOS A CUENTA
        '28': aSearch[0].col3, //PARTIDA 4 - NÚM. RENTAS
        '29': aSearch[0].col4, //PARTIDA 5 - BASE RET. ING. CUENTA
        '30': resultadoAnterior, //PARTIDA 6 - RESULTADO ING. ANTERIORES DECLARACIONES.
        '31': casilla27, //PARTIDA 7 - RESULTADO A INGRESAR. */
        '32': campos['fld_iban'],
        '33': campos['fld_declaracomplementaria'] == 'T' ? "X" : " ",
        '34': campos['fld_declaracomplementaria'] == 'T' ?  campos['fld_justificanteanterior'] : "",
        '39': ejercicio,
        '40': periodoSel
    }];
    //nlapiLogExecution('ERROR', 'params 216', JSON.stringify(params));
    var m = new modelTemplateNS('modelo216', campos['fld_version'], 'numero', tiporeg.unico);
    m.setValues(params);
    guardarGabinet(nombreModelo, idModelos, m.getValues(), campos['fld_declarantenif'], ejercicio, subsidiaria);
}

function mod296Export(aSearch){
    var nombreModelo = MODELOS.m296.nombre;
    var idModelos = MODELOS.m296.id;
    
    //Revisar, es un copy/paste del modelo 180
    var totalPerceptores = aSearch.length;
    var totalBase = 0;
    var totalRetenciones = 0;
    for(var lin in aSearch){
        totalBase = parseFloat(parseFloat(totalBase)+parseFloat(aSearch[lin].col5)).toFixed(2);
        totalRetenciones = parseFloat(parseFloat(totalRetenciones)+parseFloat(aSearch[lin].col7)||0).toFixed(2);
    }
    var params = [{
        '3': ejercicio,
        '4': campos['fld_declarantenif'].toUpperCase(),
        '5': limpiarChar(campos['fld_declaranterazon']).toUpperCase(),
        '6': "C",
        '7': campos['fld_tlfcontacto'],
        '8': campos['fld_nombrecontacto'].toUpperCase(),
        '9': campos['fld_numeroidentificativo'],
        '10': (campos['fld_declaracomplementaria'] == 'T' ? "C" : " ")+(campos['fld_declarasustitutiva'] == 'T' ? "S" : " "),
        '11': campos['fld_identificativoanterior'],
        '12': totalPerceptores,//Suma de Perceptores
        '13': totalBase,
        '15': totalRetenciones*-1,
        //'16': totalRetenciones, //Pendiente validar origen de RETENCIONES E INGRESOS A CUENTAINGRESADOS	
        '18': campos['fld_nifrepresentante'].toUpperCase()
    }];
    var result = "";
    var m1 = new modelTemplateNS('modelo296', campos['fld_version'], 'numero', tiporeg.tipo1);
    m1.setValues(params);
    result += m1.getValues();
    
    //#endregion
    for(var lin in aSearch){
        params = [{
            '3': ejercicio, 
            '4': "",//campos['fld_declarantenif'].toUpperCase(),//NIF DECLARANTE
            '5': '',//aSearch[lin].col9, //NIF Perceptor //solo para test,... los nifs están todos mal...
            '6': '', //--solo para menores de 14 años se necesita el nif del representante, sino ha de estar vacio... lógica pendiente, de momento hardcoded a vacios.//separar combinado
            '7': aSearch[lin].col1.toUpperCase() + aSearch[lin].col3.toUpperCase(), //F/J + Razon Social.
            //'8': '', //Razon Social
            '9': dateFormat(nlapiStringToDate(aSearch[lin].col4)), //Fecha del Devengo
            '10': aSearch[lin].col10, //NATURALEZA
            '11': aSearch[lin].col11, //CLAVE
            '12': aSearch[lin].col12, //SUBCLAVE
            '13': aSearch[lin].col5, //BASE RETENCIONES E INGRESOS A CUENTA
            '14': padNum(aSearch[lin].col5 < 0 ? parseFloat(aSearch[lin].col6 || 0).toFixed(2).replace(/\./g, '') : 0, 4), //% RETENCIÓN
            '15': aSearch[lin].col5 < 0 ? aSearch[lin].col7 : 0, //RETENCIONES E INGRESOS A CUENTA --> si es negativo el campo BASE RETENCIONES E INGRESOS A CUENTA todo se ha de establecer a 0
            /*'16': '', //MEDIADOR
            '17': '', //CÓDIGO
            '18': '', //CÓDIGO EMISOR
            '19': '', //PAGO
            '20': '', //TIPO CÓDIGO
            '21': '', //CÓDIGO CUENTA VALORES
            '22': '', //PENDIENTE*/
            '23': aSearch[lin].col11 == '1' || aSearch[lin].col11 == '2' ? ejercicio : '', //EJERCICIO DEL DEVENGO
            /*'24': '', //FECHA DE INICIO DEL PRÉSTAMO
            '25': '', //FECHA DE VENCIMIENTO DEL PRÉSTAMO
            '26': '', //REMUNERACIÓN AL PRESTAMISTA
            '27': '', //COMPENSACIONES
            '28': '', //GARANTÍAS
            '29': '', //DIRECCIÓN DEL PERCEPTOR
            '30': '', //COMPLEMENTO DIRECCIÓN
            '31': '', //POBLACIÓN
            '32': '', //PROVINCIA
            '33': '', //CÓDIGO POSTAL*/
            '34': '', //CÓDIGO PAÍS
            '36': aSearch[lin].col9.replaceAll(aSearch[lin].col8, ""), //NIF EN EL PAÍS DE RESIDENCIA FISCAL
            '37': '', // aSearch[lin].col1.toUpperCase() == 'F' ? dateFormat(nlapiStringToDate('24/11/1988')) : '', //FECHA DE NACIMIENTO pendiente
            '38': '', //aSearch[lin].col1.toUpperCase() == 'F' ? 'BARCELONA' : '', //LUGAR DE NACIMIENTO (CIUDAD) pendiente
            '39': '', //aSearch[lin].col1.toUpperCase() == 'F' ? 'ES' : '', //LUGAR DE NACIMIENTO (PAIS) pendiente
            '40': aSearch[lin].col8, //PAÍS O TERRITORIO DE RESIDENCIA FISCALDEL PERCEPTOR

        }];
        //nlapiLogExecution('ERROR', 'params 296', JSON.stringify(params));
        var m2 = new modelTemplateNS('modelo296', campos['fld_version'], 'numero', tiporeg.tipo2);
        m2.setValues(params);
        result += m2.getValues();
    }

    guardarGabinet(nombreModelo, idModelos, result, campos['fld_declarantenif'], ejercicio, subsidiaria);
}

function mod349Export(aSearch,colTotalesc,colTotalesd){
    var contadorIntracomunitaria = 0;
    var sumaIntracomunitaria = 0;
    var contadorRectificaciones = 0;
    var sumaRectificaciones = 0;
    var tmp_intracomunitarias = "";
    var tmp_rectificaciones = "";

    for(var lin in aSearch){
        var xsubsidiaria = aSearch[lin].col0;
        var xafiscal = aSearch[lin].col1;
        var xnifsubsidiaria = aSearch[lin].col2;
        var xnifoperador = aSearch[lin].col3;
        var xnombrecliente = aSearch[lin].col4;
        var xaplica = aSearch[lin].col5; //Solo se utiliza para filtrar. No se pinta.
        var xclave = aSearch[lin].col6;
        var ctotal = aSearch[lin].col7;
        var xrazonsocial = aSearch[lin].col41;
        var valorCredito = aSearch[lin]["col"+colTotalesc];
        var valorDebito = aSearch[lin]["col"+colTotalesd];

        if (xclave == "E" || xclave == "S"){
            var colValor = parseFloat(parseFloat(valorCredito)-parseFloat(valorDebito)).toFixed(2);
            var colValor_rectificaciones = parseFloat((parseFloat(valorCredito)-parseFloat(valorDebito))*(-1)).toFixed(2);
        } else {
            var colValor = parseFloat(parseFloat(valorDebito)-parseFloat(valorCredito)).toFixed(2);
            var colValor_rectificaciones = parseFloat((parseFloat(valorDebito)-parseFloat(valorCredito))*(-1)).toFixed(2);
        }


        if (colValor > 0){
            contadorIntracomunitaria = parseFloat(contadorIntracomunitaria + 1);
            sumaIntracomunitaria = parseFloat(parseFloat(sumaIntracomunitaria) + parseFloat(colValor)).toFixed(2); 
        } else {
            contadorRectificaciones = parseFloat(contadorRectificaciones + 1);
            sumaRectificaciones = parseFloat(parseFloat(sumaRectificaciones) + parseFloat(parseFloat(colValor)*(-1))).toFixed(2);
        }

        //TIPO DE REGISTRO 2: REGISTRO DE OPERADOR INTRACOMUNITARIO
        if(colValor > 0){
            params_intracomunitario = [{
                '3': ejercicio,
                '4': campos['fld_declarantenif'].toUpperCase(),
                '6': xnifoperador, //NIF Operador
                '7': xnombrecliente, //Nombre Cliente
                '8': xclave, //Clave de Operación
                '9': colValor
            }];

            var m2 = new modelTemplateNS('modelo349', campos['fld_version'], 'numero', tiporeg.tipo2);
            m2.setValues(params_intracomunitario);
            tmp_intracomunitarias += m2.getValues();
        }
        //TIPO DE REGISTRO 2: REGISTRO DE RECTIFICACIONES 
        if(colValor_rectificaciones > 0){
            params_rectificaciones = [{
                '3': ejercicio,
                '4': campos['fld_declarantenif'].toUpperCase(),
                '6': xnifoperador, //NIF Operador
                '7': xnombrecliente, //Nombre Cliente
                '8': xclave, //Clave de Operación
                '10': ejercicio,
                '11': periodoSel,
                '12': colValor //Base imponible rectificada                
            }];
            var m3 = new modelTemplateNS('modelo349', campos['fld_version'], 'numero', tiporeg.tipo3);
            m3.setValues(params_rectificaciones);
            tmp_rectificaciones += m3.getValues();
        }
        
    }
    /*var totalesc = sumaIntracomunitaria;
    var totalesd = sumaRectificaciones;*/

    var nombreModelo = MODELOS.m349.nombre;
    var idModelos = MODELOS.m349.id;

    var params_cabecera = [{
        '3': ejercicio,
        '4': campos['fld_declarantenif'],
        '5': limpiarChar(campos['fld_declaranterazon']).toUpperCase(),
        '7': campos['fld_tlfcontacto'],
        '8': limpiarChar(campos['fld_nombrecontacto']).toUpperCase(),
        '9': campos['fld_numeroidentificativo'],
        '10': (campos['fld_declaracomplementaria'] == 'T' ? "C" : " "),
        '11': (campos['fld_declarasustitutiva'] == 'T' ? "S" : " "),
        '12': campos['fld_identificativoanterior'],
        '13': periodoSel,
        '14': contadorIntracomunitaria,
        '15': sumaIntracomunitaria,
        '16': contadorRectificaciones,
        '17': sumaRectificaciones,
        '18': " ",
        '20': campos['fld_nifrepresentante']
    }];
    var result = "";
    var m1 = new modelTemplateNS('modelo349', campos['fld_version'], 'numero', tiporeg.tipo1);
    m1.setValues(params_cabecera);
    result += m1.getValues();
    result += tmp_intracomunitarias;
    result += tmp_rectificaciones;

    guardarGabinet(nombreModelo, idModelos, result, campos['fld_declarantenif'], ejercicio, subsidiaria);
}

function guardarGabinet(nombreModelo, idModelos, datos, NIFDeclarante, ejercicio, subsidiaria){
       //Comprobamos si existe la carpeta en el Cabinet y si no, la creamos. De esta manera nos ahorramos tener que controlar el id de una carpeta en diferentes clientes.
       var nombreCarpeta = 'Modelo '+nombreModelo;//Nombre de la carpeta.
       var filter = new nlobjSearchFilter('name', null, 'is', nombreCarpeta);
       var column = new nlobjSearchColumn('internalid', 'file');
       var resultadoCarpeta = nlapiSearchRecord('folder', null , filter , column);
       
       if (resultadoCarpeta != null){
           var nuevaCarpetaid = resultadoCarpeta[0].getId();
       } else {
           var nuevaCarpeta = nlapiCreateRecord('folder');
           nuevaCarpeta.setFieldValue('name','Modelo '+nombreModelo);
           var nuevaCarpetaid = nlapiSubmitRecord(nuevaCarpeta);
       }

        var now = new Date();
        var nombreFichero = NIFDeclarante + "_" + nombreModelo + "_" + '' + now.getUTCFullYear() + getMes(now) + getDia(now)+ getHora(now) + now.getMinutes();


        var file = nlapiCreateFile(nombreFichero+'.txt', 'CSV', datos);
        file.setFolder(nuevaCarpetaid);
  		file.setEncoding('ISO-8859-1');
        var id = nlapiSubmitFile(file);

        //Creamos registro en la tabla de Modelos generados
        var newModelo = nlapiCreateRecord('customrecord_x_modelosgenerados');
        newModelo.setFieldValue('custrecord_x_modgen_modelo',idModelos);
        newModelo.setFieldValue('custrecord_x_modgen_fichero',id);
        newModelo.setFieldValue('custrecord_x_modgen_ejercicio',ejercicio);
        if(!!subsidiaria){
            newModelo.setFieldValue('custrecord_x_modgen_subsidiaria',subsidiaria);
        }
        nlapiSubmitRecord(newModelo);
}

function padNum(str, max) {
    str = str.toString();
    return str.length < max ? padNum("0" + str, max) : str;
}

function dateFormat(now){
    try{
        day = String(now.getDate()).length > 1 ? now.getDate() : "0"+now.getDate();
        month = String(parseInt(now.getMonth()) +1).length > 1 ? parseInt(now.getMonth()) +1 : "0"+(parseInt(now.getMonth()) +1);
        year = parseInt(now.getFullYear());
        return day + "" + month + "" + year;
    }catch(e){
        return null;
    }
}

function ultraSearch(recordType, searchId, filters, columns) {
    var savedSearch = nlapiLoadSearch(recordType, searchId);
    if (filters != null)
        savedSearch.addFilters(filters);
    if (columns != null)
        savedSearch.addColumns(columns);
    
    var resultset = savedSearch.runSearch();
    var returnSearchResults = [];
    var searchid = 0;
    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        if (resultslice == null)
            return null;
        for ( var rs in resultslice) {
            returnSearchResults.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice.length >= 1000);

    return returnSearchResults;
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
}