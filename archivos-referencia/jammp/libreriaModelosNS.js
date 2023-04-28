var modelTemplateNS = function (model, id, key, type) {
    var o = {
        model: model,
        id: id,
        key: (key || 'numero'), //campo índice del map
        type: type,
        recordtype: 'customrecord_x_ledis_modelos_lineas',
        prefix: 'custrecord_x_lelin_',
        parent: 'custrecord_x_lelin_modelo',
        tiporegistro: 'custrecord_x_lelin_tiporegistro', 
        getFields: function() {
            return {
                modelo: this.parent,
                numero: this.prefix + 'numero',
                posicion: this.prefix + 'posicion',
                tipo: this.prefix + 'tipo',
                descripcion: this.prefix + 'descripcion_',
                contenido: this.prefix + 'contenido',
                longitud: this.prefix + 'longitud',
                tipocontenido: this.prefix + 'tipocontenido',
                clavesigno_p: this.prefix + 'clavesigno_p',
                clavesigno_n: this.prefix + 'clavesigno_n',
                tiporegistro: this.tiporegistro
            }
        },
        getColumns: function() {
            var arr = [];
            var fields = this.getFields();
            for (var fld in fields) {
                if (fld == this.key) {
                    arr.push(new nlobjSearchColumn(fields[fld]).setSort());
                    continue;
                }
                arr.push(new nlobjSearchColumn(fields[fld]));
            }
            return arr;
        },
        getResults: function(filters) {
            return nlapiSearchRecord(this.recordtype, null, filters, this.getColumns());
        },
        getValues: function() {
            return this.export.join('').toString();
        },
        setTable: function() { 
            this.table = [];
            var instance = this;
            var fields = this.getFields();
            var sRes = this.getResults([new nlobjSearchFilter(this.parent, null, 'anyof', this.id),
                new nlobjSearchFilter(this.tiporegistro, null, 'anyof', this.type)]);
            for (var r in sRes) {
                var row = {};
                for (var fld in fields) {
                    row[fld] = sRes[r].getValue(fields[fld]);
                }
                this.table.push(setContent(row));
            }

            function setContent(row) {
                switch (row.tipocontenido) {
                    case '1':
                        row.value = instance.decoder(row.contenido).toUpperCase();
                    break;
                    case '2':
                        row.value = [];
                        var it = 0;
                        while (it < parseInt(row.longitud, 10)) {
                            row.value[it] = ' '; 
                            it++;
                        }
                        row.value = row.value.join('');
                    break;
                    case '3':
                        row.value = valueParser(row);
                    break;
                    case '4': //free text
                        row.value = row.value;
                    break;
                    default: // CRLF
                        row.value = '\r\n';
                    break;
                }
                return row;
            }

            function valueParser(row) {
                switch (row.tipo) {
                    case '1': case '2': // A & An
                        return instance.parseText(row.longitud, row.value || '').field;
                    case '3': // Num
                        return instance.parseNum(row.longitud, row.value || 0, false, row.clavesigno_n, row.clavesigno_p).field;
                    case '4': // Float
                        return instance.parseNum(row.longitud, row.value || 0, true, row.clavesigno_n, row.clavesigno_p).field;
                    default:
                        return '?';
                }
            }
        },
        setValues: function(params) {
            this.export = [];
            var instance = this;
            for (var param in params) {
                for (var key in params[param]) {
                    for (var index in this.table) {
                        if (this.table[index][instance.key] == key) {
                            this.table[index].value = this.table[index].tipo == '3' ? 
                            this.parseNum(this.table[index].longitud, params[param][key], false, this.table[index].clavesigno_n, this.table[index].clavesigno_p).field :
                            this.table[index].value = this.table[index].tipo == '4' ? 
                            this.parseNum(this.table[index].longitud, params[param][key], true, this.table[index].clavesigno_n, this.table[index].clavesigno_p).field :
                            this.parseText(this.table[index].longitud, params[param][key]).field;
                        }
                    }
                }

                for (var index in this.table) this.export.push(this.table[index].value);
            }
        },
        padding: function(input, max, value) {
            return (input + '').length < max ? this.padding((value || ' ') + input, max, value) : input;
        },
        parseNum: function(long, value, isfloat, sign_negative, sign_positive) {
            var field = [];
            var value_parsed = (!!isfloat ? (parseFloat(value || 0).toFixed(2)) : parseFloat(value || 0) + '').trim().replace(/(\-|\.|\,|\%)/g,'').split('');
            sign_negative = !!sign_negative ? sign_negative.replace(/\_/g, ' ') : 'N';
            sign_positive = !!sign_positive ? sign_positive.replace(/\_/g, ' ') : sign_positive;

            for (var it = 0; it < long; it++) { field[it] = '0'; }
            for (var it = 0; it < value_parsed.length && it < field.length; it++) { field[field.length - value_parsed.length + it] = value_parsed[it]; }

            field[0] = value < 0 ? sign_negative: (sign_positive || field[0]);

            return {value: value, field: field.join('')}
        },
        parseText: function(long, value) {
            var field = [];
            value = (value || '').toString().trim();

            for (var it = 0; it < long; it++) { field[it] = ' '; }
            for (var it = 0; it < value.length && it < field.length; it++) { field[it] = value[it]; }

            return {value: value, field: field.join('')}
        },
        parseChar: function(input) {
            return (input || '').toString().trim().replace(/(\.|\(|\)|\,|\·)/g, '').replace(/(à|á|â|ä)/g, 'a').replace(/(è|é|ê|ë)/g, 'e').replace(/(ì|í|î|ï)/g, 'i')
            .replace(/(ò|ó|ô|ö)/g, 'o').replace(/(ù|ú|ü|û)/g, 'u').replace(/ç/g, 'c').replace(/ñ/g, 'n').replace(/(À|Á|Â|Ä)/g, 'A').replace(/(\+|\-|\s+)/g, ' ')
            .replace(/(È|É|Ê|Ë)/g, 'E').replace(/(Ì|Í|Î|Ï)/g, 'I').replace(/(Ò|Ó|Ô|Ö)/g, 'O').replace(/(Ù|Ú|Ü|Û)/g, 'U').replace(/Ç/g, 'C').replace(/Ñ/g, 'N');
        },
        parseDate: function(input) {
            input = input instanceof Date ? input: nlapiStringToDate(input);

            return {
                day: (input.getDate() + '').length > 1 ? input.getDate() + '' : '0' + input.getDate(),
                month: ((input.getMonth() + 1) + '').length > 1 ? (input.getMonth() + 1) + '' : '0' + (input.getMonth() + 1),
                year: input.getFullYear() + ''
            }
        },
        decoder: function(input) {
            return (input || '').toString().toLowerCase().trim().replace(/(à|á|â|ä)/g, 'a').replace(/(è|é|ê|ë)/g, 'e')
            .replace(/(ì|í|î|ï)/g, 'i').replace(/(ò|ó|ô|ö)/g, 'o').replace(/(ù|ú|ü|û)/g, 'u').replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/\n/g, '')
            .replace(/\r/g, '').replace(/&apos;/g, '\'').replace(/[^0-9A-Za-z\<\>\/]/g, '');
        }
    };
    o.setTable();
    return o;
};

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

function datosResumen(searchResumen, subsidiaria,ejercicio, periodoSel){
    var bisiesto = nlapiStringToDate("01/03/"+ejercicio);
    var xbisiesto = nlapiAddDays(bisiesto,-1);
    var filtrosResumen = [];


    !!subsidiaria ? filtrosResumen.push(new nlobjSearchFilter('subsidiary', null, 'anyof', subsidiaria)) : null;

    switch(periodoSel){
        case "0A": 
            filtrosResumen.push(new nlobjSearchFilter('trandate', null, 'within', "01/01/"+ejercicio,"31/12/"+ejercicio));
        break;
        case "1T": 
            filtrosResumen.push(new nlobjSearchFilter('trandate', null, 'within', "01/01/"+ejercicio,"31/03/"+ejercicio));
        break;
        case "2T": 
            filtrosResumen.push(new nlobjSearchFilter('trandate', null, 'within', "01/04/"+ejercicio,"30/06/"+ejercicio));
        break;
        case "3T": 
            filtrosResumen.push(new nlobjSearchFilter('trandate', null, 'within', "01/07/"+ejercicio,"30/09/"+ejercicio));
        break;
        case "4T": 
            filtrosResumen.push(new nlobjSearchFilter('trandate', null, 'within', "01/10/"+ejercicio,"31/12/"+ejercicio));
        break;
        case "01": 
            filtrosResumen.push(new nlobjSearchFilter('trandate', null, 'within', "01/01/"+ejercicio,"31/01/"+ejercicio));
        break;
        case "02": 
            filtrosResumen.push(new nlobjSearchFilter('trandate', null, 'within', "01/02/"+ejercicio,xbisiesto));
        break;
        case "03": 
            filtrosResumen.push(new nlobjSearchFilter('trandate', null, 'within', "01/03/"+ejercicio,"31/03/"+ejercicio));
        break;
        case "04": 
            filtrosResumen.push(new nlobjSearchFilter('trandate', null, 'within', "01/04/"+ejercicio,"30/04/"+ejercicio));
        break;
        case "05": 
            filtrosResumen.push(new nlobjSearchFilter('trandate', null, 'within', "01/05/"+ejercicio,"31/05/"+ejercicio));
        break;
        case "06": 
            filtrosResumen.push(new nlobjSearchFilter('trandate', null, 'within', "01/06/"+ejercicio,"30/06/"+ejercicio));
        break;
        case "07": 
            filtrosResumen.push(new nlobjSearchFilter('trandate', null, 'within', "01/07/"+ejercicio,"31/07/"+ejercicio));
        break;
        case "08": 
            filtrosResumen.push(new nlobjSearchFilter('trandate', null, 'within', "01/08/"+ejercicio,"31/08/"+ejercicio));
        break;
        case "09": 
            filtrosResumen.push(new nlobjSearchFilter('trandate', null, 'within', "01/09/"+ejercicio,"30/09/"+ejercicio));
        break;
        case "10": 
            filtrosResumen.push(new nlobjSearchFilter('trandate', null, 'within', "01/10/"+ejercicio,"31/10/"+ejercicio));
        break;
        case "11": 
            filtrosResumen.push(new nlobjSearchFilter('trandate', null, 'within', "01/11/"+ejercicio,"30/11/"+ejercicio));
        break;
        case "12": 
            filtrosResumen.push(new nlobjSearchFilter('trandate', null, 'within', "01/12/"+ejercicio,"31/12/"+ejercicio));
        break;
        default:
            filtrosResumen.push(new nlobjSearchFilter('trandate', null, 'within', "01/01/"+ejercicio,"31/01/"+ejercicio));
        break;
    }

    var lineasResumen = nlapiSearchRecord(null, searchResumen, filtrosResumen, null);

    if(lineasResumen == null){
        throw nlapiCreateError('LOCKDOWN', 'El periodo seleccionado no tiene resultados. Por favor, modifique los filtros de búsqueda');
    }

    var aSearch = [];
    if(lineasResumen != 0){
        var columns = lineasResumen[0].getAllColumns();
    }
    
    for(var lin in lineasResumen){
        var aSearchLineas = {};
        for(var col in columns){
            aSearchLineas["col"+col] = lineasResumen[lin].getValue(columns[col]);
            aSearchLineas["colT"+col] = lineasResumen[lin].getText(columns[col]);
        }
        aSearch.push(aSearchLineas);
    }
    return aSearch;
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
