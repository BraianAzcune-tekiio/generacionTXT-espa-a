/**
 *@NApiVersion 2.1
 *@NScriptType Suitelet
 *@NModuleScope Public
 */

define(["N/record", "N/search", "N/runtime", "N/log", "N/ui/serverWidget", "N/file", "N/render", "N/format"],
    function (record, search, runtime, log, serverWidget, file, render, format) {

        // ! HARDCODE TIPO TXT USADO
        const TIPO_TXT_EMPLEADO = "303";

        /* global define */
        /***
         * Esto es compartido por el script de cliente, se define un objeto que contiene los id, para hacer facil copy paste y no fallar.
         */
        const idCamposFormulario = {
            erro_texto: "custpage_field_error_mensaje",
            subsidiaria: "custpage_subsidiaria",
            tipo_txt: "custpage_tipo_txt",
            periodo: "custpage_periodo",
            tipoDeclaracion: "custpage_tipo_declaracion",
            inscriptoDevolucionMensual: "custpage_inscripto_devolucion_mensual",
            tributaExclusivamenteRegimenSimplificado: "custpage_tributa_exclusivamente_regimen_simplificado",
            autoLiquidacionConjunta: "custpage_auto_liquidacion_conjunta",
            declaradoConcursoAcreedoresPresentePeriodo: "custpage_declarado_concurso_acreedores_presente_periodo",
            fechaDeclaracion: "custpage_fecha_declaracion",
            ivaDiferido: "custpage_iva_diferido",
            razonSocial: "custpage_razon_social",
            nifDeclarante: "custpage_nif_declarante",
            autoDeclaracionConcursoDictadoEnPeriodo: "custpage_auto_declaracion_concurso_dictado_en_periodo",
            sujetoPasivoAcogidoCriterioCaja: "custpage_sujeto_pasivo_acogido_criterio_caja",
            destinatarioOperacionCriterioCaja: "custpage_destinatario_operacion_criterio_caja",
            opcionAplicacionProrrataEspecial: "custpage_opcion_aplicacion_prorrata_especial",
            revocacionOpcionPorAplicacionProrrataEspecial: "custpage_revocacion_opcion_por_aplicacion_prorrata_especial",
            existeVolumenOperaciones: "custpage_existe_volumen_operaciones",
            tributacionExclusivamenteForal: "custpage_tributacion_exclusivamente_foral",
            sujetoPasivoAcogidoSII: "custpage_sujeto_pasivo_acogido_sii",
            exoneradoResumenAnualIVA390: "custpage_exonerado_resumen_anual_iva_390",
            informacionTributariaRazonTerritorioComun107: "custpage_informacion_tributaria_razon_territorio_comun_107"
        };

        function onRequest(context){
            const proceso = "onRequest";
            log.audit({
                title: proceso,
                details: "INICIO Dibujando SuiteLet"
            });

            const form = serverWidget.createForm({
                title: "Panel de generación de TXT del Modelo "+TIPO_TXT_EMPLEADO
            });
            form.clientScriptModulePath = "./L34 - Generacion TXT 303 (cliente).js";
            try {
                if(context.request.method === "GET"){
                    construirFormulario303(form);
                }else if(context.request.method === "POST"){
                    generarTXT303(context, form);
                }else{
                    log.error(proceso, "context.request.method invalido= "+context.request.method);
                    throw {
                        mostrarUsuario: true,
                        mensaje: "Error en como se envia la solicitud, contactar con el administrador"
                    };
                }
            } catch (error) {
                log.error(proceso, "error= "+JSON.stringify(error));
                const myInlineHtml = form.addField({
                    id: idCamposFormulario.erro_texto,
                    label: "Mensaje error",
                    type: serverWidget.FieldType.INLINEHTML
                });
                if(error.mostrarUsuario){
                    myInlineHtml.defaultValue = `<html><body><h2 style="color: red; margin: 10px;"> ${error.mensaje} </h2></body></html>`;
                }else{
                    myInlineHtml.defaultValue = "<html><body><h2 style=\"color: red; margin: 10px;\">Ocurrio un error contacte al administrador</h2></body></html>";   
                }
            }
            
            log.debug({
                title: proceso,
                details: "FIN Dibujando SuiteLet"
            });
            context.response.writePage(form);
        }

        function construirFormulario303(form){
            
            construirTabIdentificacion();
            // ! si se crean mas campos de tipo record hay que agregar la carga a parsearCamposFormularios
            form.addSubmitButton({
                label: "Generar TXT"
            });

            
            function construirTabIdentificacion(){
                const idTab = "Gidentificacion";
                form.addFieldGroup({
                    id: idTab,
                    label: "Identificación",
                });

                construirTipoTXT();
                construirSubsidiaria();
                construirPeriodo();
                construirTipoDeclaracion();
                construirInscriptoDevolucionMensual();
                construirTributaExclusivamenteRegimenSimplificado();
                construirAutoLiquidacionConjunta();
                construirDeclaradoConcursoAcreedoresPresentePeriodo();
                construirFechaDeclaracion();
                construirIvaDiferido();
                construirRazonSocial();
                construirNifDeclarante();
                construirAutoDeclaracionConcursoDictadoEnPeriodo();
                construirSujetoPasivoAcogidoCriterioCaja();
                construirDestinatarioOperacionCriterioCaja();
                construirOpcionAplicacionProrrataEspecial();
                construirRevocacionOpcionPorAplicacionProrrataEspecial();
                construirExisteVolumenOperaciones();
                construirTributacionExclusivamenteForal();
                construirSujetoPasivoAcogidoSII();
                construirExoneradoResumenAnualIVA390();
                construirInformacionTributariaRazonTerritorioComun107();

                function construirSubsidiaria(){
                    if(runtime.isFeatureInEffect({
                        feature: "MULTISUBSIDIARYCUSTOMER"
                    })){
                        const subsidiaria = form.addField({
                            id: idCamposFormulario.subsidiaria,
                            label: "Subsidiaria",
                            type: "select",
                            source: "subsidiary",
                            container: idTab
                        });
                        subsidiaria.isMandatory = true;
                    }
                }
                function construirTipoTXT(){
                    // ! actualmente no se usa para nada, se piensa existan mas tipos txt que el 303, ahi tendra que cambiarse como se obtiene
                    const tipoTXT = form.addField({
                        id: idCamposFormulario.tipo_txt,
                        label: "Tipo TXT",
                        type: "INLINEHTML",
                        source: null,
                        container: idTab
                    });
                    tipoTXT.defaultValue = `<html><body><p>Tipo TXT: ${runtime.getCurrentScript().getParameter("custscript_l32_generacion_txt_tipo_txt")}</p></body></html>`;
                }
                function construirPeriodo(){
                    const periodo = form.addField({
                        id: idCamposFormulario.periodo,
                        label: "Periodo",
                        type: "select",
                        container: idTab
                    });
                    periodo.isMandatory = true;
                    const searchResults = search.load({
                        id: "customsearch_l34_periodo_contable",
                    }).run().getRange({start:0, end : 1000});

                    searchResults.forEach(result => {
                        const columns = result.columns;
                        periodo.addSelectOption({
                            value: result.getValue(columns[0]),
                            text: result.getValue(columns[1]),
                        });
                    });
                        
                    
                }
                function construirTipoDeclaracion(){
                    const tipoDeclaracion = form.addField({
                        id: idCamposFormulario.tipoDeclaracion,
                        label: "Tipo Declaración",
                        type: "select",
                        source: "customrecord_l34_tipo_declaracion",
                        container: idTab
                    });
                    tipoDeclaracion.isMandatory = true;
                    tipoDeclaracion.defaultValue;
                }
                function construirInscriptoDevolucionMensual(){
                    const inscripcion = form.addField({
                        id: idCamposFormulario.inscriptoDevolucionMensual,
                        label: "Inscripto en el registro de devolución mensual",
                        type: "checkbox",
                        source: null,
                        container: idTab
                    });
                }
                function construirTributaExclusivamenteRegimenSimplificado(){
                    const tributa = form.addField({
                        id: idCamposFormulario.tributaExclusivamenteRegimenSimplificado,
                        label: "Tributa exclusivamente en regimen simplificado",
                        type: "select",
                        source: "customrecord_l34_tributa_exclusiva_regim",
                        container: idTab
                    });
                    tributa.isMandatory = true;
                }
                function construirAutoLiquidacionConjunta(){
                    const liquidacion = form.addField({
                        id: idCamposFormulario.autoLiquidacionConjunta,
                        label: "Auto liquidacion conjunta",
                        type: "checkbox",
                        source: null,
                        container: idTab
                    });
                }
                function construirDeclaradoConcursoAcreedoresPresentePeriodo(){
                    const declarado = form.addField({
                        id: idCamposFormulario.declaradoConcursoAcreedoresPresentePeriodo,
                        label: "Declarado en concurso de acreedores en el presente período",
                        type: "checkbox",
                        source: null,
                        container: idTab
                    });
                }
                function construirFechaDeclaracion(){
                    form.addField({
                        id: idCamposFormulario.fechaDeclaracion,
                        label: "Fecha Declaración",
                        type: "DATE",
                        container: idTab
                    });
                }
                function construirIvaDiferido(){
                    form.addField({
                        id: idCamposFormulario.ivaDiferido,
                        label: "Iva Diferido",
                        type: "checkbox",
                        container: idTab
                    });
                }
                function construirRazonSocial(){
                    const razonSocial = form.addField({
                        id: idCamposFormulario.razonSocial,
                        label: "Razon social / Apellidos y Nombre",
                        type: "TEXT",
                        container: idTab
                    });
                    razonSocial.isMandatory = true;
                }
                function construirNifDeclarante(){
                    const nifDeclarante = form.addField({
                        id: idCamposFormulario.nifDeclarante,
                        label: "Nif Declarante",
                        type: "TEXT",
                        container: idTab
                    });
                    nifDeclarante.isMandatory = true;
                }
                function construirAutoDeclaracionConcursoDictadoEnPeriodo(){
                    const auto = form.addField({
                        id: idCamposFormulario.autoDeclaracionConcursoDictadoEnPeriodo,
                        label: "Auto de declaración de concurso dictado en el período",
                        type: "select",
                        source: "customrecord_l34_auto_declaracion_concur",
                        container: idTab
                    });
                    auto.isMandatory = true;
                }
                function construirSujetoPasivoAcogidoCriterioCaja(){
                    form.addField({
                        id: idCamposFormulario.sujetoPasivoAcogidoCriterioCaja,
                        label: "Sujeto pasivo acogido al régimen especial del criterio de Caja (art. 163 undecies LIVA)",
                        type: "checkbox",
                        container: idTab
                    });
                }
                function construirDestinatarioOperacionCriterioCaja(){
                    form.addField({
                        id: idCamposFormulario.destinatarioOperacionCriterioCaja,
                        label: "Destinatario de las operaciones a las que se aplique el régimen especial del criterio de Caja",
                        type: "checkbox",
                        container: idTab
                    });
                }
                function construirOpcionAplicacionProrrataEspecial(){
                    form.addField({
                        id: idCamposFormulario.opcionAplicacionProrrataEspecial,
                        label: "Opción por la aplicación de la prorrata especial",
                        type: "checkbox",
                        container: idTab
                    });
                }
                function construirRevocacionOpcionPorAplicacionProrrataEspecial(){
                    form.addField({
                        id: idCamposFormulario.revocacionOpcionPorAplicacionProrrataEspecial,
                        label: "Revocación de la opción por la aplicación de la prorrata especial",
                        type: "checkbox",
                        container: idTab
                    });
                }
                function construirExisteVolumenOperaciones(){
                    const existeVolumen = form.addField({
                        id: idCamposFormulario.existeVolumenOperaciones,
                        label: "Existe volumen de operaciones (art. 121 LIVA)",
                        type: "select",
                        source: "customrecord_l34_existe_volumen_operacio",
                        container: idTab
                    });
                    existeVolumen.isMandatory = true;
                }
                function construirTributacionExclusivamenteForal(){
                    form.addField({
                        id: idCamposFormulario.tributacionExclusivamenteForal,
                        label: "Tributación exclusivamente foral",
                        type: "checkbox",
                        container: idTab
                    });
                }
                function construirSujetoPasivoAcogidoSII(){
                    form.addField({
                        id: idCamposFormulario.sujetoPasivoAcogidoSII,
                        label: "Sujeto pasivo acogido voluntariamente al SII",
                        type: "checkbox",
                        container: idTab
                    });
                }
                function construirExoneradoResumenAnualIVA390(){
                    form.addField({
                        id: idCamposFormulario.exoneradoResumenAnualIVA390,
                        label: "Está exonerado de la Declaración-resumen anual del IVA, modelo 390",
                        type: "checkbox",
                        container: idTab
                    });
                }
                function construirInformacionTributariaRazonTerritorioComun107(){
                    form.addField({
                        id: idCamposFormulario.informacionTributariaRazonTerritorioComun107,
                        label: "Información de la tributación por razón de territorio: Territorio común [107]",
                        type: "INTEGER",
                        container: idTab
                    });
                }
                

            }
        }
        function esCheckBox(valorCampo){
            if(valorCampo == "F" || valorCampo == "T" ||  valorCampo === true || valorCampo ===false) return true;
            return false;
        }
        function parsearCheckBoxParaTXT(valorCampo){
            //convertir a como acepta el TXT 1 para si 2 para no
            if(valorCampo == "T" || valorCampo === true){
                return "1";
            }else if (valorCampo == "F" || valorCampo === false){
                return "2";
            }
        }
        function bool(s){
            if(s == "T" || s === true) return true;
            if(s == "F" || s === false) return false;
            throw new Error("Este campo no es un booleano, para ser enviado"+JSON.stringify(s));
        }
        /**
         * Dado el recordType del periodo, devuelve un objeto con ejercicio, periodo, en el formato que se necesita para el TXT de España
         * Ademas de una propiedad ultimoMesQ, que es true si estamos en el mes 12 o trimestre 4.
         * @param {recordType id= accountingperiod} recordPeriodo 
         * @returns {{ejercicio: string, periodo: string, ultimoMesQ: boolean}} - Un objeto con las siguientes propiedades:
         *     - {string} ejercicio - El año fiscal del período.
         *     - {string} periodo - El período, en formato "MM" para los períodos mensuales y "T1"-"T4" para los trimestrales.
         *     - {boolean} ultimoMesQ - Verdadero si estamos en el último mes o trimestre del año fiscal.
         */
        function NOUSARparsearPeriodoEjercicio(recordPeriodo){
            const fecha = recordPeriodo.getValue("startdate");
            const ejercicio = fecha.getFullYear().toString();
            let periodo = "";
            let ultimoMesQ = false;
            if(bool(recordPeriodo.getValue("isquarter"))){
                // cambiar Q{numero} por T{numero}
                const nombre = String(recordPeriodo.getValue("periodname"));
                periodo = nombre.replace(/.*Q([1-4]).*/,"T$1");
                ultimoMesQ = periodo === "T4";
            }else{
                periodo = String(fecha.getMonth()).padStart(2,"0");
                ultimoMesQ = periodo === "12";
            }
            return {
                ejercicio,
                periodo,
                ultimoMesQ
            };
        }
        /**
         * Probar mover logica a freemarker, este codigo recibe el recordType y devuelve
         * un objeto que tiene la fecha y si es quarter.
         * @param {recordType id= accountingperiod} recordPeriodo 
         * @return {{periodoFecha: Date, esTrimestre: boolean}}
         */
        function parsearPeriodo(recordPeriodo){
            const fecha = new Date(recordPeriodo.getValue("startdate"));

            const esTrimestre = bool(recordPeriodo.getValue("isquarter"));
            let trimestre = "";
            if(esTrimestre){
                const nombre = String(recordPeriodo.getValue("periodname"));
                trimestre = nombre.replace(/.*Q([1-4]).*/,"$1");
            }
            return {
                periodoFecha: {
                    yyyy: String(fecha.getFullYear()),
                    MM: String(fecha.getMonth()+1),
                    dd: String(fecha.getDay())
                },
                esTrimestre: esTrimestre,
                trimestre: trimestre
            };
        }

        function parsearCamposFormularios(parameters){
            // obtener valores
            const rta = Object.assign({}, idCamposFormulario); 

            for(const campo of Object.keys(idCamposFormulario)){
                const campoCustPage = idCamposFormulario[campo];
                let valorCampo = parameters[campoCustPage];
                if(esCheckBox(valorCampo)){
                    valorCampo = parsearCheckBoxParaTXT(valorCampo);
                }
                rta[campo] = valorCampo;
            }
            // ! hardcodeado
            rta.tipo_txt =TIPO_TXT_EMPLEADO;
            // cargar periodo y ejercicio

            const periodoObj = parsearPeriodo(record.load({
                type: "accountingperiod",
                id: rta.periodo
            }));
            // cargar los CODIGO TXT, para los campos records
            rta.tipoDeclaracion = record.load({
                type: "customrecord_l34_tipo_declaracion",
                id: rta.tipoDeclaracion,
            }).getValue("custrecord_l34_tipo_declaraci_codigo_txt");
            
            rta.tributaExclusivamenteRegimenSimplificado = record.load({
                type: "customrecord_l34_tributa_exclusiva_regim",
                id: rta.tributaExclusivamenteRegimenSimplificado,
            }).getValue("custrecord_l34_tributa_codigo_txt");
            
            rta.autoDeclaracionConcursoDictadoEnPeriodo = record.load({
                type: "customrecord_l34_auto_declaracion_concur",
                id: rta.autoDeclaracionConcursoDictadoEnPeriodo,
            }).getValue("custrecord_l34_auto_declaracion_codigo");

            rta.existeVolumenOperaciones = record.load({
                type: "customrecord_l34_existe_volumen_operacio",
                id: rta.existeVolumenOperaciones,
            }).getValue("custrecord_l34_existe_volumen_codigo_txt");

            return {
                ...rta,
                periodoObj
            };
        }

        /**
         * Carga la configuracion del primer recordType que coincida subsidiaria y tipoTXT no inactivo.
         * 
         * @param {string} subsidiaria (es el id de la subsidiaria)
         * @param {string} tipoTXT  (texto plano)
         */
        function getConfiguracionTXT(subsidiaria, tipoTXT){
            const configuracion = {
                internalid: "",
                custrecord_l34_conf_gen_txt_nom_archivo: "",
                custrecord_l34_conf_gen_txt_plantilla: "",
                custrecord_l34_conf_gen_txt_software_ver: "",
                custrecord_l34_conf_gen_txt_nif_ed_sw: ""
            };

            const filtros = [
                { name: "isinactive", operator: "IS", values: false },
                {
                    name: "custrecord_l34_conf_gen_txt_subsidiaria",
                    operator: "ANYOF",
                    values: subsidiaria
                },
                {
                    name: "custrecord_l34_conf_gen_txt_tipo_txt",
                    operator: "IS", // ANYOF NO FUNCIONA SI ES DE TIPO TEXTO
                    values: tipoTXT
                },
            ];
            // cuidado netsuite muta lo que le envias, esta columnas no se pueden volver a usar
            let columnas = Object.keys(configuracion);
            log.debug("prueba braian, columnas", JSON.stringify(columnas));
            const resultSet = search.create({
                type: "customrecord_l34_conf_gen_txt",
                filters: filtros,
                columns: columnas
            }).run().getRange({start:0,end:1});

            if(!resultSet || resultSet.length <= 0){
                throw {
                    mostrarUsuario: true,
                    mensaje: "Error no se encuentra configuracion TXT para subsidiaria: "+subsidiaria+" y tipoTXT: "+tipoTXT
                };
            }
            const result = resultSet[0];
            columnas = Object.keys(configuracion);
            columnas.forEach(columna=>{
                configuracion[columna] = result.getValue(columna);
            });

            const listaVacios = getListaPropiedadesVacias(configuracion);
            if(listaVacios.length >0 ){
                throw {
                    mostrarUsuario: true,
                    mensaje: "Error no se encuentran campos rellenados para la configuracion de TXT para subsidiaria: "+subsidiaria+" y tipoTXT: "+tipoTXT+" lista: "+JSON.stringify(listaVacios)
                };
            }

            return configuracion;
        }
        /**
         * 
         * @param {string} nombreTemplate 
         * @param {string} nif 
         * @param {Date} fecha 
         */
        function getNombreArchivo(nombreTemplate, nif, fecha){
            log.debug("recibo", JSON.stringify([nombreTemplate,nif,fecha]));
            let nombre = nombreTemplate;
            nombre = nombre.replace("{NIF_DECLARANTE}",nif);
            const fechaFormateada = `${fecha.getFullYear()}${(fecha.getMonth()+1).toString().padStart(2, "0")}${fecha.getDate().toString().padStart(2, "0")}${fecha.getHours().toString().padStart(2, "0")}${fecha.getMinutes().toString().padStart(2, "0")}`;
            nombre = nombre.replace("{YYMMDDHHmm}", fechaFormateada);
            return nombre;
        }

        function isEmpty(value) {
            if (value === "" || value === null || value === undefined)  return true;
            return false;
        }

        function getListaPropiedadesVacias(obj){
            const listaVacios = [];
            const keys = Object.keys(obj);
            keys.forEach(key=>{
                if(isEmpty(obj[key])){
                    listaVacios.push(key);
                }
            });
            return listaVacios;
        }

        function generarTXT303(context, form){
            const camposFormulario = parsearCamposFormularios(context.request.parameters);
            log.debug("generarTXT303 campos formularios", JSON.stringify(camposFormulario));
            const configuracionObj = getConfiguracionTXT(camposFormulario.subsidiaria, camposFormulario.tipo_txt);
            log.debug("generarTXT303 configuracionObj", JSON.stringify(configuracionObj));


            const renderer = render.create();
            const templateFile = file.load({
                id: configuracionObj.custrecord_l34_conf_gen_txt_plantilla
            });
            renderer.templateContent = templateFile.getContents();
            renderer.addCustomDataSource({
                alias: "camposFormulario",
                format: render.DataSource.OBJECT,
                data: camposFormulario
            });
            renderer.addCustomDataSource({
                alias: "configuracionObj",
                format: render.DataSource.OBJECT,
                data: configuracionObj
            });
            let stringTXT="";
            try {
                stringTXT = renderer.renderAsString();    
            } catch (error) {
                log.error("Error renderizando template", JSON.stringify(error));
                throw {
                    mostrarUsuario: true,
                    mensaje: "Plantilla mal configurada contacte con el administrador"
                };
            }
            
            
            log.debug("generarTXT303 stringTXT", stringTXT);
            // ! debugging borrar despues
            const myInlineHtml = form.addField({
                id: "custpage_field_texto",
                label: "Mensaje",
                type: serverWidget.FieldType.INLINEHTML
            });
            myInlineHtml.defaultValue = `<html><body><pre style="font-size: 2em;"> ${stringTXT.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")} </pre></body></html>`;
            
            
            // const nombreArchivo = getNombreArchivo(configuracionObj.custrecord_l34_conf_gen_txt_nom_archivo, camposFormulario.nifDeclarante, new Date());
            // log.debug("nombre del archivo", nombreArchivo);
        }


        return {
            onRequest: onRequest
        };
    });