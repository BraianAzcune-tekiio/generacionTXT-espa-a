/**
 *@NApiVersion 2.1
 *@NScriptType Suitelet
 *@NModuleScope Public
 */

define(["N/record", "N/search", "N/runtime", "N/log", "N/ui/serverWidget", "N/task", "N/url"],
    function (record, search, runtime, log, serverWidget, task, urlModule) {
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
                title: "Panel de generación de TXT del Modelo 303"
            });
            form.clientScriptModulePath = "./L34 - Generacion TXT 303 (cliente).js";
            try {
                if(context.request.method === "GET"){
                    construirFormulario303(form);
                }else if(context.request.method === "POST"){
                    context.request.parameters[idCamposFormulario.subsidiaria];
                    log.debug("ejemplo subsidiaria", JSON.stringify(context.request.parameters[idCamposFormulario.subsidiaria]));
                    log.debug("ejemplo periodo", JSON.stringify(context.request.parameters[idCamposFormulario.periodo]));
                    //! trae el ID, hay que hacer un record.load, para recien poder obtener el codigo_txt
                    log.debug("ejemplo tributaExclusivamenteRegimenSimplificado", JSON.stringify(context.request.parameters[idCamposFormulario.tributaExclusivamenteRegimenSimplificado]));
                    // ! el checkbox lo devuelve como "T"
                    log.debug("ejemplo inscriptoDevolucionMensual", JSON.stringify(context.request.parameters[idCamposFormulario.inscriptoDevolucionMensual]));

                }else{
                    log.error(proceso, "context.request.method invalido= "+context.request.method);
                    throw {
                        mostrarUsuario: true,
                        mensaje: "Error en como se envia la solicitud, contactar con el administrador"
                    };
                }
            } catch (error) {
                log.error(proceso, "ocurrio un error= "+JSON.stringify(error));
                if(error.mostrarUsuario){
                    const myInlineHtml = form.addField({
                        id: idCamposFormulario.erro_texto,
                        label: "Mensaje error",
                        type: serverWidget.FieldType.INLINEHTML
                    });
                    myInlineHtml.defaultValue = `<html><body><h2 style="color: red; margin: 10px;"> ${error.mensaje} </h2></body></html>`;
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
                    
                    const searchResults = search.load({
                        id: "customsearch_l34_periodo_fiscal",
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
                    form.addField({
                        id: idCamposFormulario.autoDeclaracionConcursoDictadoEnPeriodo,
                        label: "Auto de declaración de concurso dictado en el período",
                        type: "select",
                        source: "customrecord_l34_auto_declaracion_concur",
                        container: idTab
                    });
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
                    form.addField({
                        id: idCamposFormulario.existeVolumenOperaciones,
                        label: "Existe volumen de operaciones (art. 121 LIVA)",
                        type: "select",
                        source: "customrecord_l34_existe_volumen_operacio",
                        container: idTab
                    });
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

        return {
            onRequest: onRequest
        };
    });