/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 *@NModuleScope Public
 */

define(["N/log", "N/search", "N/ui/dialog"],
    function (log, search, dialog) {
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


        function fieldChanged(scriptContext){
            // * poner campos en su valor por defecto
            if(scriptContext.fieldId == idCamposFormulario.subsidiaria || scriptContext.fieldId == idCamposFormulario.tipo_txt){
                establecerValoresPorDefecto(scriptContext);
            }else{
                const valorEscrito = scriptContext.currentRecord.getValue({fieldId:scriptContext.fieldId});
                if(typeof valorEscrito != "string") return;
                if(checkLetrasNumerosYespaciosUnicamente(valorEscrito) == false){
                    dialog.alert({
                        title: "Campo mal formado",
                        message: "El campo solo puede tener letras sin tildes, numeros, y espacios. Por favor corriga el campo"
                    });
                }
            }            
        }


        function checkLetrasNumerosYespaciosUnicamente(valorEscrito){
            const re = /^[a-z0-9 ]+$/gmi;
            console.log(typeof valorEscrito);
            if(!isEmpty(valorEscrito)){
                const aceptable = re.test(valorEscrito);
                return aceptable;
            }
            // si esta vacio, pasa bien.
            return true;
        }

        function establecerValoresPorDefecto(scriptContext){

            const objRecord = scriptContext.currentRecord;
            const subsidiaria = objRecord.getValue({fieldId: idCamposFormulario.subsidiaria});
            const tipoTXT = objRecord.getValue({fieldId: idCamposFormulario.tipo_txt});

            if(isEmpty(subsidiaria) || isEmpty(tipoTXT)) return;

            const configuracionObj = getConfiguracionTXT(subsidiaria, tipoTXT);
            if(isEmpty(configuracionObj)) return;

            log.debug("configuracionObj ",JSON.stringify(configuracionObj));
            // custrecord_l34_conf_gen_txt_subsidiaria;
            
            objRecord.setValue({
                fieldId: idCamposFormulario.tipoDeclaracion,
                value: configuracionObj.custrecord_l34_conf_gen_tipo_declaracion
            });
            objRecord.setValue({
                fieldId: idCamposFormulario.tributaExclusivamenteRegimenSimplificado,
                value: configuracionObj.custrecord_l34_tributa_exc_regimen_simpl
            });
            objRecord.setValue({
                fieldId: idCamposFormulario.autoDeclaracionConcursoDictadoEnPeriodo,
                value: configuracionObj.custrecord_l34_auto_dec_con_dic_periodo
            });
            objRecord.setValue({
                fieldId: idCamposFormulario.existeVolumenOperaciones,
                value: configuracionObj.custrecord_l34_existe_volumen_operacion
            });
            objRecord.setValue({
                fieldId: idCamposFormulario.razonSocial,
                value: configuracionObj.custrecord_l34_razon_social_declarante
            });
            objRecord.setValue({
                fieldId: idCamposFormulario.nifDeclarante,
                value: configuracionObj.custrecord_l34_nif_declarante
            });
        }

        function getConfiguracionTXT(subsidiaria, tipoTXT){
            const configuracion = {
                custrecord_l34_conf_gen_tipo_declaracion: "",
                custrecord_l34_tributa_exc_regimen_simpl: "",
                custrecord_l34_auto_dec_con_dic_periodo: "",
                custrecord_l34_existe_volumen_operacion: "",
                custrecord_l34_razon_social_declarante: "",
                custrecord_l34_nif_declarante: ""
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
            }).run().getRange({start:0,end:1});

            if(!resultSet || resultSet.length <= 0) return null;
                
            
            const result = resultSet[0];
            columnas = Object.keys(configuracion);
            columnas.forEach(columna=>{
                configuracion[columna] = result.getValue(columna);
            });


            return configuracion;
        }
        

        function isEmpty(value) {
            if (value === "" || value === null || value === undefined)  return true;
            return false;
        }
        function generarTXTModelo303(scriptContext){
            const custPage = Object.values(idCamposFormulario);
            const objRecord = scriptContext.currentRecord;
            const listaNombreCamposMal = [];
            for(const id of custPage){
                const valorCampo = objRecord.getValue({fieldId:id});
                if(typeof valorCampo != "string") continue;
                if(checkLetrasNumerosYespaciosUnicamente(valorCampo) == false){
                    listaNombreCamposMal.push(objRecord.getField({
                        fieldId: id
                    }).label);
                }
            }
            if(listaNombreCamposMal.length > 0){
                dialog.alert({
                    title: "Error campos mal formados",
                    message: "Los siguientes campos estan mal: "+JSON.stringify(listaNombreCamposMal)
                });
                return false;
            }
            return true;
        }
        return {
            fieldChanged: fieldChanged,
            saveRecord: generarTXTModelo303,
        };
    });