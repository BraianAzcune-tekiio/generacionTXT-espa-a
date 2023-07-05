/**
 *@NApiVersion 2.1
 *@NScriptType Suitelet
 *@NModuleScope Public
 *@NAmdConfig /SuiteScripts/configuration.json
 */

define(["L34/Utilidades", "N/record", "N/search", "N/runtime", "N/log", "N/ui/serverWidget", "N/file", "N/render", "N/format", "N/url"],
    function (utilidades, record, search, runtime, log, serverWidget, file, render, format, url) {

        // ! HARDCODE TIPO TXT USADO
        const TIPO_TXT_POR_DEFECTO = "303";

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

        function onRequest(context) {


            const proceso = "onRequest";
            log.audit({
                title: proceso,
                details: "INICIO Dibujando SuiteLet"
            });

            const form = serverWidget.createForm({
                title: "Panel de generación de TXT del Modelo " + TIPO_TXT_POR_DEFECTO
            });
            form.clientScriptModulePath = "./L34 - Generacion TXT 303 (cliente).js";
            try {
                if (context.request.method === "GET") {
                    construirFormulario303(form);
                } else if (context.request.method === "POST") {
                    generarTXT303(context, form);
                } else {
                    log.error(proceso, "context.request.method invalido= " + context.request.method);
                    throw {
                        mostrarUsuario: true,
                        mensaje: "Error en como se envia la solicitud, contactar con el administrador"
                    };
                }
            } catch (error) {
                log.error(proceso, "error= " + JSON.stringify(error));
                const myInlineHtml = form.addField({
                    id: idCamposFormulario.erro_texto,
                    label: "Mensaje error",
                    type: serverWidget.FieldType.INLINEHTML
                });
                if (error.mostrarUsuario) {
                    myInlineHtml.defaultValue = `<html><body><h2 style="color: red; margin: 10px;"> ${error.mensaje} </h2></body></html>`;
                } else {
                    myInlineHtml.defaultValue = "<html><body><h2 style=\"color: red; margin: 10px;\">Ocurrio un error contacte al administrador</h2></body></html>";
                }
            }

            log.debug({
                title: proceso,
                details: "FIN Dibujando SuiteLet"
            });
            context.response.writePage(form);
        }

        function esOneWorld() {
            let subsidiariesEnabled = false;
            try {
                search.lookupFields({ type: search.Type.EMPLOYEE, id: "-5", columns: ["subsidiary"] }).subsidiary;
                subsidiariesEnabled = true;
            } catch (e) {
                subsidiariesEnabled = false;
            }
            log.debug("Subsidiary enabled: ", subsidiariesEnabled);
            return subsidiariesEnabled;
        }

        function construirFormulario303(form) {

            construirTabIdentificacion();
            // ! si se crean mas campos de tipo record hay que agregar la carga a parsearCamposFormularios
            form.addSubmitButton({
                label: "Generar TXT"
            });


            function construirTabIdentificacion() {
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

                function construirSubsidiaria() {
                    if (esOneWorld() == true) {
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
                function construirTipoTXT() {
                    // ! actualmente no se usa para nada, se piensa existan mas tipos txt que el 303, ahi tendra que cambiarse como se obtiene
                    const tipoTXT = form.addField({
                        id: idCamposFormulario.tipo_txt,
                        label: "Tipo TXT",
                        type: "TEXT",
                        container: idTab,
                    });
                    tipoTXT.defaultValue = TIPO_TXT_POR_DEFECTO;
                    tipoTXT.updateDisplayType({
                        displayType: serverWidget.FieldDisplayType.DISABLED
                    });

                }
                function construirPeriodo() {
                    const periodo = form.addField({
                        id: idCamposFormulario.periodo,
                        label: "Periodo",
                        type: "select",
                        container: idTab
                    });
                    periodo.isMandatory = true;
                    const searchResults = search.load({
                        id: "customsearch_l34_periodo_contable",
                    }).run().getRange({ start: 0, end: 1000 });

                    searchResults.forEach(result => {
                        const columns = result.columns;
                        periodo.addSelectOption({
                            value: result.getValue(columns[0]),
                            text: result.getValue(columns[1]),
                        });
                    });


                }
                function construirTipoDeclaracion() {
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
                function construirInscriptoDevolucionMensual() {
                    const inscripcion = form.addField({
                        id: idCamposFormulario.inscriptoDevolucionMensual,
                        label: "Inscripto en el registro de devolución mensual",
                        type: "checkbox",
                        source: null,
                        container: idTab
                    });
                }
                function construirTributaExclusivamenteRegimenSimplificado() {
                    const tributa = form.addField({
                        id: idCamposFormulario.tributaExclusivamenteRegimenSimplificado,
                        label: "Tributa exclusivamente en regimen simplificado",
                        type: "select",
                        source: "customrecord_l34_tributa_exclusiva_regim",
                        container: idTab
                    });
                    tributa.isMandatory = true;
                }
                function construirAutoLiquidacionConjunta() {
                    const liquidacion = form.addField({
                        id: idCamposFormulario.autoLiquidacionConjunta,
                        label: "Auto liquidacion conjunta",
                        type: "checkbox",
                        source: null,
                        container: idTab
                    });
                }
                function construirDeclaradoConcursoAcreedoresPresentePeriodo() {
                    const declarado = form.addField({
                        id: idCamposFormulario.declaradoConcursoAcreedoresPresentePeriodo,
                        label: "Declarado en concurso de acreedores en el presente período",
                        type: "checkbox",
                        source: null,
                        container: idTab
                    });
                }
                function construirFechaDeclaracion() {
                    form.addField({
                        id: idCamposFormulario.fechaDeclaracion,
                        label: "Fecha Declaración",
                        type: "DATE",
                        container: idTab
                    });
                }
                function construirIvaDiferido() {
                    form.addField({
                        id: idCamposFormulario.ivaDiferido,
                        label: "Iva Diferido",
                        type: "checkbox",
                        container: idTab
                    });
                }
                function construirRazonSocial() {
                    const razonSocial = form.addField({
                        id: idCamposFormulario.razonSocial,
                        label: "Razon social / Apellidos y Nombre",
                        type: "TEXT",
                        container: idTab
                    });
                    razonSocial.isMandatory = true;
                    razonSocial.setHelpText({
                        help: "No coloque caracteres con tilde"
                    });
                }
                function construirNifDeclarante() {
                    const nifDeclarante = form.addField({
                        id: idCamposFormulario.nifDeclarante,
                        label: "Nif Declarante",
                        type: "TEXT",
                        container: idTab
                    });
                    nifDeclarante.isMandatory = true;
                    nifDeclarante.setHelpText({
                        help: "No coloque caracteres con tilde"
                    });
                }
                function construirAutoDeclaracionConcursoDictadoEnPeriodo() {
                    const auto = form.addField({
                        id: idCamposFormulario.autoDeclaracionConcursoDictadoEnPeriodo,
                        label: "Auto de declaración de concurso dictado en el período",
                        type: "select",
                        source: "customrecord_l34_auto_declaracion_concur",
                        container: idTab
                    });
                    auto.isMandatory = true;
                }
                function construirSujetoPasivoAcogidoCriterioCaja() {
                    form.addField({
                        id: idCamposFormulario.sujetoPasivoAcogidoCriterioCaja,
                        label: "Sujeto pasivo acogido al régimen especial del criterio de Caja (art. 163 undecies LIVA)",
                        type: "checkbox",
                        container: idTab
                    });
                }
                function construirDestinatarioOperacionCriterioCaja() {
                    form.addField({
                        id: idCamposFormulario.destinatarioOperacionCriterioCaja,
                        label: "Destinatario de las operaciones a las que se aplique el régimen especial del criterio de Caja",
                        type: "checkbox",
                        container: idTab
                    });
                }
                function construirOpcionAplicacionProrrataEspecial() {
                    form.addField({
                        id: idCamposFormulario.opcionAplicacionProrrataEspecial,
                        label: "Opción por la aplicación de la prorrata especial",
                        type: "checkbox",
                        container: idTab
                    });
                }
                function construirRevocacionOpcionPorAplicacionProrrataEspecial() {
                    form.addField({
                        id: idCamposFormulario.revocacionOpcionPorAplicacionProrrataEspecial,
                        label: "Revocación de la opción por la aplicación de la prorrata especial",
                        type: "checkbox",
                        container: idTab
                    });
                }
                function construirExisteVolumenOperaciones() {
                    const existeVolumen = form.addField({
                        id: idCamposFormulario.existeVolumenOperaciones,
                        label: "Existe volumen de operaciones (art. 121 LIVA)",
                        type: "select",
                        source: "customrecord_l34_existe_volumen_operacio",
                        container: idTab
                    });
                    existeVolumen.isMandatory = true;
                }
                function construirTributacionExclusivamenteForal() {
                    const tributaForal = form.addField({
                        id: idCamposFormulario.tributacionExclusivamenteForal,
                        label: "Tributación exclusivamente foral",
                        type: "checkbox",
                        container: idTab
                    });
                    tributaForal.updateDisplayType({
                        displayType: serverWidget.FieldDisplayType.DISABLED
                    });

                }
                function construirSujetoPasivoAcogidoSII() {
                    form.addField({
                        id: idCamposFormulario.sujetoPasivoAcogidoSII,
                        label: "Sujeto pasivo acogido voluntariamente al SII",
                        type: "checkbox",
                        container: idTab
                    });
                }
                function construirExoneradoResumenAnualIVA390() {
                    form.addField({
                        id: idCamposFormulario.exoneradoResumenAnualIVA390,
                        label: "Está exonerado de la Declaración-resumen anual del IVA, modelo 390",
                        type: "checkbox",
                        container: idTab
                    });
                }
                function construirInformacionTributariaRazonTerritorioComun107() {
                    form.addField({
                        id: idCamposFormulario.informacionTributariaRazonTerritorioComun107,
                        label: "Información de la tributación por razón de territorio: Territorio común [107]",
                        type: "INTEGER",
                        container: idTab
                    });
                }


            }
        }
        function esCheckBox(valorCampo) {
            if (valorCampo == "F" || valorCampo == "T" || valorCampo === true || valorCampo === false) return true;
            return false;
        }
        function parsearCheckBoxParaTXT(valorCampo) {
            //convertir a como acepta el TXT 1 para si 2 para no
            if (valorCampo == "T" || valorCampo === true) {
                return "1";
            } else if (valorCampo == "F" || valorCampo === false) {
                return "2";
            }
        }
        function bool(s) {
            if (s == "T" || s === true) return true;
            if (s == "F" || s === false) return false;
            if (s === "") return false;
            throw new Error("Este campo no es un booleano, para ser enviado" + JSON.stringify(s));
        }

        /**
         * Probar mover logica a freemarker, este codigo recibe el recordType y devuelve
         * un objeto que tiene la fecha y si es quarter.
         * @param {recordType id= accountingperiod} recordPeriodo 
         * @return {{esTrimestre: boolean, periodoFecha: Date,
         * periodoFechaFin: Date}}
         */
        function parsearPeriodo(recordPeriodo) {
            const fecha = recordPeriodo.getValue("startdate");

            const esTrimestre = bool(recordPeriodo.getValue("isquarter"));
            let trimestre = "";
            if (esTrimestre) {
                const nombre = String(recordPeriodo.getValue("periodname"));
                trimestre = nombre.replace(/.*Q([1-4]).*/, "$1");
            }
            const fechaFin = recordPeriodo.getValue("enddate");

            return {
                periodoFecha: fecha,
                periodoFechaFin: fechaFin,
                esTrimestre: esTrimestre,
                trimestre: trimestre
            };
        }

        /**
         * 
         * @param {Date} date
         * @return {{yyyy: String, MM: String, dd: String}}
         */
        function dateToyyyyMMdd(date) {
            return {
                yyyy: String(date.getFullYear()),
                MM: String(date.getMonth() + 1),
                dd: String(date.getDay())
            };
        }

        function parsearCamposFormularios(parameters) {
            // obtener valores
            const rta = Object.assign({}, idCamposFormulario);

            for (const campo of Object.keys(idCamposFormulario)) {
                const campoCustPage = idCamposFormulario[campo];
                let valorCampo = parameters[campoCustPage];
                if (esCheckBox(valorCampo)) {
                    valorCampo = parsearCheckBoxParaTXT(valorCampo);
                }

                rta[campo] = valorCampo;
            }
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

            log.debug("fecha declaracion antes de parse", rta.fechaDeclaracion);

            let fechaDeclaracion = {
                yyyy: "",
                MM: "",
                dd: ""
            };
            if (!utilidades.isEmpty(rta.fechaDeclaracion)) {
                const fechaDeclaracionTemp = format.parse({ value: rta.fechaDeclaracion, type: format.Type.DATE });
                fechaDeclaracion = {
                    yyyy: String(fechaDeclaracionTemp.getFullYear()),
                    MM: String(fechaDeclaracionTemp.getMonth() + 1),
                    dd: String(fechaDeclaracionTemp.getDate())
                };
            }
            log.debug("fecha declaracion parse", fechaDeclaracion);
            return {
                ...rta,
                periodoObj,
                fechaDeclaracion
            };
        }

        /**
         * Carga la configuracion del primer recordType que coincida subsidiaria y tipoTXT no inactivo.
         * 
         * @param {string} subsidiaria (es el id de la subsidiaria)
         * @param {string} tipoTXT  (texto plano)
         */
        function getConfiguracionTXT(subsidiaria, tipoTXT) {
            const configuracion = {
                internalid: "",
                custrecord_l34_conf_gen_txt_nom_archivo: "",
                custrecord_l34_conf_gen_txt_plantilla: "",
                custrecord_l34_conf_gen_txt_software_ver: "",
                custrecord_l34_conf_gen_txt_nif_ed_sw: "",
                custrecord_l34_conf_gen_carpeta_txt: ""
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

            const resultSet = search.create({
                type: "customrecord_l34_conf_gen_txt",
                filters: filtros,
                columns: columnas
            }).run().getRange({ start: 0, end: 1 });

            if (!resultSet || resultSet.length <= 0) {
                throw {
                    mostrarUsuario: true,
                    mensaje: "Error no se encuentra configuracion TXT para subsidiaria: " + subsidiaria + " y tipoTXT: " + tipoTXT
                };
            }
            const result = resultSet[0];
            columnas = Object.keys(configuracion);
            columnas.forEach(columna => {
                configuracion[columna] = result.getValue(columna);
            });

            const listaVacios = getListaPropiedadesVacias(configuracion);
            if (listaVacios.length > 0) {
                throw {
                    mostrarUsuario: true,
                    mensaje: "Error no se encuentran campos rellenados para la configuracion de TXT para subsidiaria: " + subsidiaria + " y tipoTXT: " + tipoTXT + " lista: " + JSON.stringify(listaVacios)
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
        function getNombreArchivo(nombreTemplate, nif, fecha) {
            log.debug("recibo", JSON.stringify([nombreTemplate, nif, fecha]));
            let nombre = nombreTemplate;
            nombre = nombre.replace("{NIF_DECLARANTE}", nif);
            const fechaFormateada = `${fecha.getFullYear()}${(fecha.getMonth() + 1).toString().padStart(2, "0")}${fecha.getDate().toString().padStart(2, "0")}${fecha.getHours().toString().padStart(2, "0")}${fecha.getMinutes().toString().padStart(2, "0")}`;
            nombre = nombre.replace("{YYMMDDHHmm}", fechaFormateada);
            return nombre;
        }

        function getListaPropiedadesVacias(obj) {
            const listaVacios = [];
            const keys = Object.keys(obj);
            keys.forEach(key => {
                if (utilidades.isEmpty(obj[key])) {
                    listaVacios.push(key);
                }
            });
            return listaVacios;
        }
        /**
         * 
         * @returns {any[]}
         */
        function getTaxReportDetailSS(camposFormulario) {
            const proceso = "getTaxReportDetail";
            const filtros = [];
            // ! CONSULTAR A SEBASTIAN, QUE FILTROS PONERLE A ESTA BUSQUEDA. tienen que ser los mismos que ejecutarBusqueda ?
            // ! search.addFilter(new nlobjSearchFilter('custrecord_post_notional_tax_amount', 'taxitem', 'is', filtroAutorepercutido)); // donde filtroAutorepercutido esta hardcodeado en "T"
            if (esOneWorld() == true) {
                filtros.push({
                    name: "subsidiary",
                    operator: "ANYOF",
                    values: camposFormulario.subsidiaria,
                });
            }
            const fechaInicio = format.format({
                value: camposFormulario.periodoObj.periodoFecha,
                type: format.Type.DATE
            });
            const fechaFin = format.format({
                value: camposFormulario.periodoObj.periodoFechaFin,
                type: format.Type.DATE
            });
            log.debug(proceso, "buscar entre " + fechaInicio + " - " + fechaFin);
            filtros.push({
                name: "trandate",
                operator: "WITHIN",
                values: [fechaInicio, fechaFin],
            });


            const objResultSet = utilidades.searchSavedPro("customsearchgenerictaxreportdetail", filtros);

            if (objResultSet.error == true) {
                log.error(proceso, "entramos al error");
                throw new Error(objResultSet.error);
            }

            const resultSet = objResultSet.objRsponseFunction.result;
            const resultSearch = objResultSet.objRsponseFunction.search;
            log.audit(proceso, "cantidad de registros obtenidos= " + resultSet.length);
            if (utilidades.isEmpty(resultSet) || resultSet.length <= 0) {
                log.error(proceso, "no hay registros");
                throw {
                    mostrarUsuario: true,
                    mensaje: "No se encotraron resultados del reporte de detalle de impuestos"
                };
            }
            const columnas = resultSearch.columns;
            log.debug("getTaxReportDetail", "columnas obtenidas= " + JSON.stringify(columnas.map(x => ({ name: x.name, label: x.label }))));
            const rta = resultSet.map(results => {
                const obj = {};
                for (const col of columnas) {
                    obj[col.name] = results.getValue({ name: col });
                }
                return obj;
            });

            return rta;
        }

        function renderizarTXT(configuracionObj, camposFormulario, taxReportDetail) {
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

            renderer.addCustomDataSource({
                alias: "taxReportDetail",
                format: render.DataSource.OBJECT,
                data: taxReportDetail
            });

            let stringTXT = "";
            try {
                stringTXT = renderer.renderAsString();
            } catch (error) {
                log.error("Error renderizando template", JSON.stringify(error));
                throw {
                    mostrarUsuario: true,
                    mensaje: "Plantilla mal configurada contacte con el administrador"
                };
            }
            return stringTXT;
        }

        function generarArchivo(configuracionObj, camposFormulario, stringTXT) {
            const nombreArchivo = getNombreArchivo(configuracionObj.custrecord_l34_conf_gen_txt_nom_archivo, camposFormulario.nifDeclarante, new Date());

            const fileObj = file.create({
                name: nombreArchivo,
                fileType: file.Type.PLAINTEXT,
                contents: stringTXT,
                folder: configuracionObj.custrecord_l34_conf_gen_carpeta_txt
            });
            const fileId = fileObj.save();
            return fileId;
        }

        function imprimirMensajeArchivoGenerado(form, fileId) {
            // es necesario re cargarlo, para obtener la url actualizada.
            const fileObj = file.load({ id: fileId });
            log.debug("imprimirMensajeArchivoGenerado", JSON.stringify({ id_archivo: fileId, url: fileObj.url }));
            const myInlineHtml = form.addField({
                id: "custpage_field_texto",
                label: "Mensaje",
                type: serverWidget.FieldType.INLINEHTML
            });

            const fileUrl = url.resolveDomain({
                hostType: url.HostType.APPLICATION,
                accountId: runtime.accountId,
            });

            myInlineHtml.defaultValue = `<html><body><p style="font-size: 2em;">Archivo generado <p/><a href="${fileObj.url}" download>Descargar archivo ${fileObj.name}</a></body></html>`;
        }
        /**
         * 
         * @param {Object} taxReportDetailSS 
         */
        function calcularTaxReport(taxReportDetailSS, camposFormulario) {
            const proceso = "POST calcularTaxReport";
            //Liquidación (3) - Regimen General - IVA Devengado - Régimen general - 0% [150][152]
            const baseEImpuesto150 = {
                base150: 0,
                impuesto152: 0,
                existeTasa: false,
            };
            //Devengado - Base e Impuestos 4% [01][03]
            const baseEImpuesto4 = {
                base4: 0,
                impuesto4: 0,
                existeTasa: false,
            };
            //Liquidación (3) - Regimen General - IVA Devengado - Régimen general - 5% [153][155]
            const baseEImpuesto153 = {
                base153: 0,
                impuesto155: 0,
                existeTasa: false,
            };
            //Devengado - Base e Impuestos 10% [04][06]
            const baseEImpuesto10 = {
                base10: 0,
                impuesto10: 0,
                existeTasa: false,
            };
            //Devengado - Base e Impuestos 21% [07][09]
            const baseEImpuesto21 = {
                base21: 0,
                impuesto21: 0,
                existeTasa: false,
            };
            //Devengado - Otras operaciones con inversión del sujeto pasivo (excepto. adq. intracom) [12][13]
            const baseEImpuesto12 = {
                base12: 0,
                impuesto13: 0,
                existeTasa: false,
            };
            //Devengado - Modificación bases y cuotas [14][15]
            const baseEImpuesto14 = {
                base14: 0,
                impuesto15: 0,
                existeTasa: false,
            };
            //Liquidación (3) - Regimen General - IVA Devengado - Recargo equivalencia - 1.75% [156][158]
            const baseEImpuesto156 = {
                base156: 0,
                impuesto158: 0,
                existeTasa: false,
            };
            //Devengado - Base e Impuestos 26% [16][17][18]
            const baseEImpuestoRE = {
                baseRE: 0,
                impuestoRE5_2: 0,
                existeTasa: false,
            };
            //Adquisiciones Intracomunitarias [10][11][36][37]
            const baseEImpuestoAdqIntra = {
                baseAdqIntra: 0,
                impuestoAdqIntra: 0,
                // existeTasa: false,
            };
            const baseEImpuestoAdq = {
                baseAdq: 0,
                impuestoAdq: 0,
                existeTasa: false,
            };
            //Deducible - Base Deducción [28][29]
            const baseEImpuestoDeduccion = {
                baseDed: 0,
                impuestoDed: 0,
                existeTasa: false,
            };
            // Importaciones Bienes Corrientes [32][33]
            const baseEImpuestoBienes = {
                baseBienes: 0,
                impuestoBienes: 0,
                existeTasa: false,
            };
            //Entregas Intracomunitarias [59]
            let entregasIntracom = 0;
            //Exportaciones y operaciones asimiladas [60]
            let exportaciones = 0;
            //Operaciones No Sujetas [61]
            let operacionesNosujetas = 0;
            //Operaciones Sujetas con Inversion del sujeto pasivo [122]
            let operacionesSujetasISP = 0;
            //IVA Bienes Inversion [30],[31],[34],[35],[38],[39]
            const baseEImpuestoImportacionesBI = {
                importacionesBIBase: 0,
                importacionesBIImp: 0,
                existeTasa: false,
            };
            const baseEImpuestoIntracomunitariasBI = {
                intracomunitariasBIBase: 0,
                intracomunitariasBIImp: 0,
                existeTasa: false,
            };
            const baseEImpuestoInterioresBI = {
                interioresBIBase: 0,
                interioresBIImp: 0,
                existeTasa: false,
            };
            //Deducible - Rectificación de deducciones [40][41]
            const baseEImpuestoRecDed = {
                baseRecDed: 0,
                impRecDed: 0,
                existeTasa: false,
            };


            for (let i = 0; i < taxReportDetailSS.length; i++) {
                const obj = taxReportDetailSS[i];
                //Tipo de Transacción
                const tipoTransaccion = obj["type"];
                //Tasa de Impuesto
                let tasaString = obj["taxrate"];
                const tasa = parseFloat(tasaString.replace(/%/g, ""));
                tasaString = tasa.toFixed(2).toString();
                // Base imponible
                const baseImponible = parseFloat(obj["amount"]);
                // Cargo de Impuesto
                const cargoImpuestos = parseFloat(obj["taxamount"]);
                // IMPORTACION
                const importacion = bool(obj["custbody_esp_importacion"]);
                // CODIGO CE
                const codCE = bool(obj["custbody_esp_codigo_ce"]);
                // AUTOREPERCUTIDO 
                const autorepercutido = bool(obj["custbody_esp_autorepercutido"]);
                // IVA BIENES INMUEBLES 
                const ivaBienesInmuebles = bool(obj["custbody_iva_bienes_inmuebles"]);
                // APLICA AL SERVICIO 
                const aplicaAlServicio = bool(obj["custbody_aplica_servicio"]);
                // IMPUESTO DERIVADO
                const impuestoDerivado = parseFloat(obj["custbody_es_impuesto_derivado"]);
                // EXPORTAR 
                const exportar = bool(obj["custbody_esp_exportar"]);
                // NO SUJETO
                const noSujeto = bool(obj["custbody_esp_no_sujeto"]);

                log.debug("taxReportDetailSS[" + i + "]", "obj= " + JSON.stringify({
                    tipoTransaccion: tipoTransaccion,
                    tasa: tasaString,
                    baseImponible: baseImponible,
                    cargoImpuestos: cargoImpuestos,
                    impor: importacion,
                    codCE: codCE,
                    autorepercutido: autorepercutido,
                    bienesInv: ivaBienesInmuebles,
                    esServicio: aplicaAlServicio,
                    tasaParent: impuestoDerivado,
                    exporta: exportar,
                    operaNo: noSujeto
                }));


                // * todos los valores deben utilizar el parseFloat, y toFixed 2, con toString, para que el motor de la plantilla pueda separar por "."

                //Liquidación (3) - Regimen General - IVA Devengado - Régimen general - 0% [150][152]
                if ((tasa == 0 && (tipoTransaccion == "CustInvc" || tipoTransaccion == "CashSale") && noSujeto == null)) {
                    baseEImpuesto150.existeTasa = true;
                    baseEImpuesto150.base150 = (parseFloat(parseFloat(baseEImpuesto150.base150) + baseImponible).toFixed(2)).toString();
                    baseEImpuesto150.impuesto152 = (parseFloat(parseFloat(baseEImpuesto150.impuesto152) + cargoImpuestos).toFixed(2)).toString();
                }
                //Devengado - Base e Impuestos 4% [01][03]
                if ((tasa == 4 && (tipoTransaccion == "CustInvc" || tipoTransaccion == "CashSale") && noSujeto == null)) {
                    baseEImpuesto4.existeTasa = true;
                    baseEImpuesto4.base4 = (parseFloat(parseFloat(baseEImpuesto4.base4) + baseImponible).toFixed(2)).toString();
                    baseEImpuesto4.impuesto4 = (parseFloat(parseFloat(baseEImpuesto4.impuesto4) + cargoImpuestos).toFixed(2)).toString();
                }

                //Liquidación (3) - Regimen General - IVA Devengado - Régimen general - 5% [153][155]
                if ((tasa == 5 && (tipoTransaccion == "CustInvc" || tipoTransaccion == "CashSale") && noSujeto == null)) {
                    baseEImpuesto153.existeTasa = true;
                    baseEImpuesto153.base153 = (parseFloat(parseFloat(baseEImpuesto153.base153) + baseImponible).toFixed(2)).toString();
                    baseEImpuesto153.impuesto155 = (parseFloat(parseFloat(baseEImpuesto153.impuesto155) + cargoImpuestos).toFixed(2)).toString();
                }

                //Devengado - Base e Impuestos 10% [04][06]
                if ((tasa == 10 && (tipoTransaccion == "CustInvc" || tipoTransaccion == "CashSale") && noSujeto == null)) {
                    baseEImpuesto10.existeTasa = true;
                    baseEImpuesto10.base10 = (parseFloat(parseFloat(baseEImpuesto10.base10) + baseImponible).toFixed(2)).toString();
                    baseEImpuesto10.impuesto10 = (parseFloat(parseFloat(baseEImpuesto10.impuesto10) + cargoImpuestos).toFixed(2)).toString();
                }
                //Devengado - Base e Impuestos 21% [07][09]
                if ((tasa == 21 && (tipoTransaccion == "CustInvc" || tipoTransaccion == "CashSale") && noSujeto == null)) {
                    baseEImpuesto21.existeTasa = true;
                    baseEImpuesto21.base21 = (parseFloat(parseFloat(baseEImpuesto21.base21) + baseImponible).toFixed(2)).toString();
                    baseEImpuesto21.impuesto21 = (parseFloat(parseFloat(baseEImpuesto21.impuesto21) + cargoImpuestos).toFixed(2)).toString();
                }
                //Devengado - Otras operaciones con inversión del sujeto pasivo (excepto. adq. intracom) [12][13]
                if ((
                    (importacion != true && codCE != true) && autorepercutido == true && ivaBienesInmuebles != true &&
                    (tipoTransaccion == "VendBill" || tipoTransaccion == "CardChrg" || tipoTransaccion == "VendCred" || tipoTransaccion == "CardRfnd"))
                    ||
                    (
                        (importacion == true && codCE != true) && autorepercutido == true && ivaBienesInmuebles != true && aplicaAlServicio == true
                        && (tipoTransaccion == "VendBill" || tipoTransaccion == "CardChrg" || tipoTransaccion == "VendCred" || tipoTransaccion == "CardRfnd")
                    )) {
                    baseEImpuesto12.existeTasa = true;
                    baseEImpuesto12.base12 = (parseFloat(parseFloat(baseEImpuesto12.base12) + baseImponible).toFixed(2)).toString();
                    baseEImpuesto12.impuesto13 = (parseFloat(parseFloat(baseEImpuesto12.impuesto13) + cargoImpuestos).toFixed(2)).toString();
                }
                //Devengado - Modificación bases y cuotas [14][15]
                if ((tipoTransaccion == "CustCred" || tipoTransaccion == "CashRfnd") && noSujeto == null && (tasa == 10 || tasa == 4 || tasa == 21)) {
                    baseEImpuesto14.existeTasa = true;
                    baseEImpuesto14.base14 = (parseFloat(parseFloat(baseEImpuesto14.base14) + baseImponible).toFixed(2)).toString();
                    baseEImpuesto14.impuesto15 = (parseFloat(parseFloat(baseEImpuesto14.impuesto15) + cargoImpuestos).toFixed(2)).toString();
                }

                //Liquidación (3) - Regimen General - IVA Devengado - Recargo equivalencia - 1.75% [156][158]
                if ((tasa == 1.75 && (tipoTransaccion == "CustInvc" || tipoTransaccion == "CashSale") && noSujeto == null)) {
                    baseEImpuesto156.existeTasa = true;
                    baseEImpuesto156.base156 = (parseFloat(parseFloat(baseEImpuesto156.base156) + baseImponible).toFixed(2)).toString();
                    baseEImpuesto156.impuesto158 = (parseFloat(parseFloat(baseEImpuesto156.impuesto158) + cargoImpuestos).toFixed(2)).toString();
                }

                // ! en el codigo v1, se ve que utiliza base21, aunque esto esta con la tasa 26...
                //Devengado - Base e Impuestos 26% [16][18]
                if ((tasa == 26.20 && (tipoTransaccion == "CustInvc" || tipoTransaccion == "CashSale")) || (tasa == 26.20 && (tipoTransaccion == "CustCred" || tipoTransaccion == "CashRfnd"))) {
                    baseEImpuestoRE.existeTasa = true;

                    baseEImpuestoRE.baseRE = (parseFloat(parseFloat(baseEImpuestoRE.baseRE) + baseImponible).toFixed(2)).toString();

                    baseEImpuesto21.existeTasa = true;
                    baseEImpuesto21.tasa21 = tasaString;
                    baseEImpuesto21.base21 = (parseFloat(parseFloat(baseEImpuesto21.base21) + baseImponible).toFixed(2)).toString();

                    //Calculamos Impuestos de Recargo de Equiivalencia para el 21% y el 5,2%
                    // ! se multiplica por -0.052
                    baseEImpuestoRE.impuestoRE5_2 = (parseFloat(parseFloat(baseEImpuestoRE.impuestoRE5_2) + parseFloat(cargoImpuestos * parseFloat(-0.052))).toFixed(2)).toString();
                    // ! se multiplica por -0.21
                    baseEImpuesto21.impuesto21 = (parseFloat(parseFloat(baseEImpuesto21.impuesto21) + parseFloat(cargoImpuestos * parseFloat(-0.21))).toFixed(2)).toString();
                }
                //Adquisiciones Intracomunitarias [10][11][36][37]
                if (tasa == 0 && codCE == true && impuestoDerivado > 0 && (tipoTransaccion == "VendBill" || tipoTransaccion == "CardChrg" || tipoTransaccion == "VendCred" || tipoTransaccion == "CardRfnd")) {
                    if (ivaBienesInmuebles == true) {
                        // ! las variables de este if, no se utilizan en el codigo v1, ni aqui tampoco, solo se calcula pero no se hace nada...
                        baseEImpuestoAdqIntra.baseAdqIntra = (parseFloat(parseFloat(baseEImpuestoAdqIntra.baseAdqIntra) + baseImponible).toFixed(2)).toString();
                        baseEImpuestoAdqIntra.impuestoAdqIntra = (parseFloat(parseFloat(baseEImpuestoAdqIntra.impuestoAdqIntra) + cargoImpuestos).toFixed(2)).toString();
                    } else {
                        baseEImpuestoAdq.existeTasa = true;
                        baseEImpuestoAdq.baseAdq = (parseFloat(parseFloat(baseEImpuestoAdq.baseAdq) + baseImponible).toFixed(2)).toString();
                        baseEImpuestoAdq.impuestoAdq = (parseFloat(parseFloat(baseEImpuestoAdq.impuestoAdq) + cargoImpuestos).toFixed(2)).toString();
                    }
                }
                //Deducible - Base Deducción [28][29]
                if (((tasa == 4 && (tipoTransaccion == "VendBill" || tipoTransaccion == "CardChrg") && ivaBienesInmuebles != true && importacion != true)
                    || (tasa == 10 && (tipoTransaccion == "VendBill" || tipoTransaccion == "CardChrg") && ivaBienesInmuebles != true && importacion != true)
                    || (tasa == 21 && (tipoTransaccion == "VendBill" || tipoTransaccion == "CardChrg") && ivaBienesInmuebles != true && importacion != true))
                    || (codCE != true && autorepercutido == true && ivaBienesInmuebles != true && (tipoTransaccion == "VendBill" || tipoTransaccion == "CardChrg" || tipoTransaccion == "VendCred" || tipoTransaccion == "CardRfnd"))) {
                    baseEImpuestoDeduccion.existeTasa = true;
                    baseEImpuestoDeduccion.baseDed = (parseFloat(parseFloat(baseEImpuestoDeduccion.baseDed) + baseImponible).toFixed(2)).toString();
                    baseEImpuestoDeduccion.impuestoDed = (parseFloat(parseFloat(baseEImpuestoDeduccion.impuestoDed) + cargoImpuestos).toFixed(2)).toString();
                }
                // Importaciones Bienes Corrientes [32][33]
                if (importacion == true && ivaBienesInmuebles != true && aplicaAlServicio != true && (tipoTransaccion == "VendBill" || tipoTransaccion == "CardChrg" || tipoTransaccion == "VendCred" || tipoTransaccion == "CardRfnd")) {
                    baseEImpuestoBienes.existeTasa = true;
                    baseEImpuestoBienes.baseBienes = (parseFloat(parseFloat(baseEImpuestoBienes.baseBienes) + baseImponible).toFixed(2)).toString();
                    baseEImpuestoBienes.impuestoBienes = (parseFloat(parseFloat(baseEImpuestoBienes.impuestoBienes) + cargoImpuestos).toFixed(2)).toString();
                }
                //Entregas Intracomunitarias [59]
                if (codCE == true && ((tipoTransaccion == "CustCred" || tipoTransaccion == "CashRfnd") || (tipoTransaccion == "CustInvc" || tipoTransaccion == "CashSale"))) {
                    // ! se multiplica por -1, se utiliza en Página 2 - Actividades Agricolas (no para crear 30301)
                    entregasIntracom = (parseFloat(parseFloat(entregasIntracom) + parseFloat(baseImponible * -1)).toFixed(2)).toString();
                }
                //Exportaciones y operaciones asimiladas [60]
                if (exportar == true && ((tipoTransaccion == "CustCred" || tipoTransaccion == "CashRfnd") || (tipoTransaccion == "CustInvc" || tipoTransaccion == "CashSale"))) {
                    // ! se multiplica por -1, se utiliza en Página 2 - Actividades Agricolas (no para crear 30301)
                    exportaciones = (parseFloat(parseFloat(exportaciones) + parseFloat(baseImponible * -1)).toFixed(2)).toString();
                }
                //Operaciones No Sujetas [61]
                if (noSujeto != null && ivaBienesInmuebles != true && ((tipoTransaccion == "CustInvc" || tipoTransaccion == "CashSale") || (tipoTransaccion == "CustCred" || tipoTransaccion == "CashRfnd")) && exportar != true && codCE != true) {
                    // ! se multiplica por -1, se utiliza en Página 2 - Actividades Agricolas (no para crear 30301)
                    operacionesNosujetas = (parseFloat(parseFloat(operacionesNosujetas) + parseFloat(baseImponible * -1)).toFixed(2)).toString();
                }
                //Operaciones Sujetas con Inversion del sujeto pasivo [122]
                if (noSujeto == null && ivaBienesInmuebles != true && ((tipoTransaccion == "CustInvc" || tipoTransaccion == "CashSale") || (tipoTransaccion == "CustCred" || tipoTransaccion == "CashRfnd")) && exportar != true && codCE != true && autorepercutido == true) {
                    // ! se multiplica por -1, se utiliza en Página 2 - Actividades Agricolas (no para crear 30301)
                    operacionesSujetasISP = (parseFloat(parseFloat(operacionesSujetasISP) + parseFloat(baseImponible * -1)).toFixed(2)).toString();
                }
                //IVA Bienes Inversion [30],[31],[34],[35],[38],[39]
                if (ivaBienesInmuebles == true && (tipoTransaccion == "VendBill" || tipoTransaccion == "CardChrg")) {
                    if (importacion == true) {
                        //Bienes Inversión de Importaciones
                        baseEImpuestoImportacionesBI.existeTasa = true;
                        baseEImpuestoImportacionesBI.importacionesBIBase = (parseFloat(parseFloat(baseEImpuestoImportacionesBI.importacionesBIBase) + baseImponible).toFixed(2)).toString();
                        baseEImpuestoImportacionesBI.importacionesBIImp = (parseFloat(parseFloat(baseEImpuestoImportacionesBI.importacionesBIImp) + cargoImpuestos).toFixed(2)).toString();
                    } else if (codCE == true) {
                        baseEImpuestoIntracomunitariasBI.existeTasa = true;
                        baseEImpuestoIntracomunitariasBI.intracomunitariasBIBase = (parseFloat(parseFloat(baseEImpuestoIntracomunitariasBI.intracomunitariasBIBase) + baseImponible).toFixed(2)).toString();
                        baseEImpuestoIntracomunitariasBI.intracomunitariasBIImp = (parseFloat(parseFloat(baseEImpuestoIntracomunitariasBI.intracomunitariasBIImp) + cargoImpuestos).toFixed(2)).toString();
                    } else {
                        baseEImpuestoInterioresBI.existeTasa = true;
                        baseEImpuestoInterioresBI.interioresBIBase = (parseFloat(parseFloat(baseEImpuestoInterioresBI.interioresBIBase) + baseImponible).toFixed(2)).toString();
                        baseEImpuestoInterioresBI.interioresBIImp = (parseFloat(parseFloat(baseEImpuestoInterioresBI.interioresBIImp) + cargoImpuestos).toFixed(2)).toString();
                    }
                }
                //Deducible - Rectificación de deducciones [40][41]
                if (((tasa == 4 && (tipoTransaccion == "VendCred" || tipoTransaccion == "CardRfnd")) || (tasa == 10 && (tipoTransaccion == "VendCred" || tipoTransaccion == "CardRfnd")) || (tasa == 21 && (tipoTransaccion == "VendCred" || tipoTransaccion == "CardRfnd"))) || ((tipoTransaccion == "VendCred" || tipoTransaccion == "CardRfnd") && importacion == "T" && codCE != "T" && autorepercutido != "T")) {
                    baseEImpuestoRecDed.existeTasa = true;
                    baseEImpuestoRecDed.baseRecDed = (parseFloat(parseFloat(baseEImpuestoRecDed.baseRecDed) + baseImponible).toFixed(2)).toString();
                    // ! se multiplica por -1
                    baseEImpuestoRecDed.impRecDed = (parseFloat(parseFloat(baseEImpuestoRecDed.impRecDed) + parseFloat(cargoImpuestos * -1)).toFixed(2)).toString();
                }
            }

            //Liquidación (3) - Regimen General - IVA Devengado - Total cuota devengada ( [152] + [03] + [155] + [06] + [09] + [11] + [13] + [15] + [158] + [18] + [21] + [24] + [26] ) resultando en el valor= [27]
            // ! se suma el valor si existe tasa en el codigo v1, aunque para la totalizacion del iva deducible, esta condicion no se considera, quiza esta mal la primera o la segunda?, o ambas deben ser como son...
            const totalCuota = parseFloat(
                // [152]
                ((baseEImpuesto150.existeTasa) ? parseFloat(Math.abs(baseEImpuesto150.impuesto152)) : 0) +
                // [03]
                ((baseEImpuesto4.existeTasa) ? parseFloat(Math.abs(baseEImpuesto4.impuesto4)) : 0) +
                // [155]
                ((baseEImpuesto153.existeTasa) ? parseFloat(Math.abs(baseEImpuesto153.impuesto155)) : 0) +
                // [06]
                ((baseEImpuesto10.existeTasa) ? parseFloat(Math.abs(baseEImpuesto10.impuesto10)) : 0) +
                // [09]
                ((baseEImpuesto21.existeTasa) ? parseFloat(Math.abs(baseEImpuesto21.impuesto21)) : 0) +
                // [11]
                ((baseEImpuestoAdq.existeTasa) ? parseFloat(Math.abs(baseEImpuestoAdq.impuestoAdq)) : 0) +
                // [13]
                ((baseEImpuesto12.existeTasa) ? parseFloat(Math.abs(baseEImpuesto12.impuesto13)) : 0) +
                // ! [15] en el codigo viejo no esta haciendo valor absoluto como el resto de valores. (parece que es un error, porque hacen una asignacion sin sentido)
                ((baseEImpuesto14.existeTasa) ? parseFloat(Math.abs(baseEImpuesto14.impuesto15)) : 0) +
                // [158]
                ((baseEImpuesto156.existeTasa) ? parseFloat(Math.abs(baseEImpuesto156.impuesto158)) : 0) +
                // [18]
                ((baseEImpuestoRE.existeTasa) ? parseFloat(Math.abs(baseEImpuestoRE.impuestoRE5_2)) : 0)
                // ! [21] + [24] + [26] ) no existe
            ).toFixed(2).toString();


            // Liquidación (3) - Regimen General - IVA Deducible - Total a deducir ( [29] + [31] + [33] + [35] + [37] + [39] + [41] + [42] + [43] + [44] ) - Cuota [45]
            const totalDeducir = parseFloat(
                // [29]
                parseFloat(Math.abs(baseEImpuestoDeduccion.impuestoDed)) +
                // [31]
                parseFloat(Math.abs(baseEImpuestoInterioresBI.interioresBIImp)) +
                // ! [33] el codigo v1 en el else lo pone a 0 si no cumple esta condicion.
                ((baseEImpuestoBienes.existeTasa && camposFormulario.ivaDiferido == "2") ? parseFloat(Math.abs(baseEImpuestoBienes.impuestoBienes)) : 0) +
                // [35]
                parseFloat(Math.abs(baseEImpuestoImportacionesBI.importacionesBIImp)) +
                // [37]
                ((baseEImpuestoAdq.existeTasa) ? parseFloat(Math.abs(baseEImpuestoAdq.impuestoAdq)) : 0) +
                // [39] 
                parseFloat(Math.abs(baseEImpuestoIntracomunitariasBI.intracomunitariasBIImp)) +
                // ! [41] no hacen valor absoluto, raro, aunque para el calculo en el for hacen * -1
                parseFloat(baseEImpuestoRecDed.impRecDed)
                // ! [42] no existe valor calculado
                // ! [43] no existe valor calculado
                // ! [44] no existe valor calculado
            ).toFixed(2).toString();

            // Liquidación (3) - Regimen General - IVA Deducible - Resultado régimen general ( [27] - [45] ) - Cuota [46]
            const resultadoRegimenGeneral = parseFloat(
                parseFloat(totalCuota) - parseFloat(totalDeducir)
            ).toFixed(2).toString();

            return {
                baseEImpuesto4,
                baseEImpuesto10,
                baseEImpuesto21,
                baseEImpuesto12,
                baseEImpuesto14,
                baseEImpuestoRE,
                baseEImpuestoAdqIntra,
                baseEImpuestoAdq,
                baseEImpuestoDeduccion,
                baseEImpuestoBienes,
                entregasIntracom,
                exportaciones,
                operacionesNosujetas,
                operacionesSujetasISP,
                baseEImpuestoImportacionesBI,
                baseEImpuestoIntracomunitariasBI,
                baseEImpuestoInterioresBI,
                baseEImpuestoRecDed,
                totalCuota,
                totalDeducir,
                resultadoRegimenGeneral
            };
        }

        function generarTXT303(context, form) {
            const proceso = "POST generarTXT303";
            const currentScript = runtime.getCurrentScript();
            log.audit(proceso, "Unidades Disponibles :" + currentScript.getRemainingUsage());

            const camposFormulario = parsearCamposFormularios(context.request.parameters);
            log.debug("generarTXT303 campos formularios", JSON.stringify(camposFormulario));
            const configuracionObj = getConfiguracionTXT(camposFormulario.subsidiaria, camposFormulario.tipo_txt);
            log.debug("generarTXT303 configuracionObj", JSON.stringify(configuracionObj));

            const taxReportDetailSS = getTaxReportDetailSS(camposFormulario);
            log.audit(proceso, "Unidades Disponibles :" + currentScript.getRemainingUsage());
            const taxReportDetail = calcularTaxReport(taxReportDetailSS, camposFormulario);
            // ! prueba
            taxReportDetail.baseEImpuesto21.existeTasa = true;
            taxReportDetail.baseEImpuesto21.base21 = "-23.00";
            taxReportDetail.baseEImpuesto21.tasa21 = "131.00";
            taxReportDetail.baseEImpuesto21.impuesto21 = "2.00";
            // [10][11]
            taxReportDetail.baseEImpuestoAdq.existeTasa = true;
            taxReportDetail.baseEImpuestoAdq.baseAdq = "150.00";
            taxReportDetail.baseEImpuestoAdq.impuestoAdq = "20.00";
            //[12][13]
            taxReportDetail.baseEImpuesto12.existeTasa = true;
            taxReportDetail.baseEImpuesto12.base12 = "200.00";
            taxReportDetail.baseEImpuesto12.impuesto13 = "220.00";
            //[14][15]
            taxReportDetail.baseEImpuesto14.existeTasa = true;
            taxReportDetail.baseEImpuesto14.base14 = "-300.00";
            taxReportDetail.baseEImpuesto14.impuesto15 = "-320.00";
            //[16][17][18]
            taxReportDetail.baseEImpuestoRE.existeTasa = true;
            taxReportDetail.baseEImpuestoRE.baseRE = "-400.00";
            taxReportDetail.baseEImpuestoRE.impuestoRE5_2 = "-420.20";
            // [27]
            taxReportDetail.totalCuota = "-2000.00";
            // [28][29]
            taxReportDetail.baseEImpuestoDeduccion.existeTasa = true;
            taxReportDetail.baseEImpuestoDeduccion.baseDed = "120.20";
            taxReportDetail.baseEImpuestoDeduccion.impuestoDed = "140.40";
            // [30][31]
            taxReportDetail.baseEImpuestoInterioresBI.existeTasa = true;
            taxReportDetail.baseEImpuestoInterioresBI.interioresBIBase = "200.30";
            taxReportDetail.baseEImpuestoInterioresBI.interioresBIImp = "300.30";
            // [32][33]
            taxReportDetail.baseEImpuestoBienes.existeTasa = true;
            taxReportDetail.baseEImpuestoBienes.baseBienes = "460.20";
            taxReportDetail.baseEImpuestoBienes.impuestoBienes = "480.28";
            // [34][35]
            taxReportDetail.baseEImpuestoImportacionesBI.existeTasa = true;
            taxReportDetail.baseEImpuestoImportacionesBI.importacionesBIBase = "560.23";
            taxReportDetail.baseEImpuestoImportacionesBI.importacionesBIImp = "580.33";
            // se omite [36][37] utilizan las mismas variables que [10][11]
            // [38][39]
            taxReportDetail.baseEImpuestoIntracomunitariasBI.existeTasa = true;
            taxReportDetail.baseEImpuestoIntracomunitariasBI.intracomunitariasBIBase = "620.80";
            taxReportDetail.baseEImpuestoIntracomunitariasBI.intracomunitariasBIImp = "630.70";
            // [40][41]
            taxReportDetail.baseEImpuestoRecDed.existeTasa = true;
            taxReportDetail.baseEImpuestoRecDed.baseRecDed = "760.11";
            taxReportDetail.baseEImpuestoRecDed.impRecDed = "770.14";
            // [45]
            taxReportDetail.totalDeducir = "-1345.23";
            // [46]
            taxReportDetail.resultadoRegimenGeneral = "-1200.44";
            //! fin prueba

            const stringTXT = renderizarTXT(configuracionObj, camposFormulario, taxReportDetail);
            // ! funciona, comentado para no generar muchos.
            // log.debug("generarTXT303 stringTXT", stringTXT);
            // const fileId= generarArchivo(configuracionObj, camposFormulario, stringTXT);
            // imprimirMensajeArchivoGenerado(form,fileId);
            // * debugging borrar despues
            const myInlineHtml = form.addField({
                id: "custpage_field_texto",
                label: "Mensaje",
                type: serverWidget.FieldType.INLINEHTML
            });
            myInlineHtml.defaultValue = `<html><body><pre style="font-size: 2em;"> ${stringTXT.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")} </pre></body></html>`;
        }


        return {
            onRequest: onRequest
        };
    });