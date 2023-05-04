/**
 *@NApiVersion 2.1
 *@NScriptType Suitelet
 *@NAmdConfig /SuiteScripts/configuration.json
 */
define(['N/record', 'N/http', 'N/search', 'N/format', 'N/runtime', 'N/error', '3K/utilities', 'N/file', '3K/FuncionalidadesDebitos', '3K/utilities21', 'N/render'],
  function (record, http, search, format, runtime, error, utilities, file, funcionesDebitos, utils21, render) {

    /**
     * Definition of the Suitelet script trigger point.
     *
     * @param {Object} context
     * @param {ServerRequest} context.request - Encapsulation of the incoming request
     * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
     * @Since 2015.2
     */
    function onRequest(context) {

      var script = runtime.getCurrentScript();
      var proceso = 'Funcionalidades Botones Débito Automático - Suitelet';

      log.audit("START Governance Monitoring", "Remaining Usage = " + script.getRemainingUsage() + ' --- time: ' + new Date());

      if (context.request.method == 'GET' || context.request.method == 'POST') {
        var objetoRespuesta = {};
        objetoRespuesta.error = false;
        objetoRespuesta.message = '';

        var requestParams = context.request.parameters;
        log.audit(proceso, 'parametros: ' + JSON.stringify(requestParams) + ' - body:' + JSON.stringify(context.request.body));

        var params = JSON.parse(context.request.body);

        params.lote = record.load({
          type: 'customrecord_3k_lote_debitos',
          id: params.recId,
          isDynamic: true
        });

        /**
         * El Objeto params contiene:
         * params.recId  ID del registro de lote donde se presionó el botón
         * params.date   Fecha en la que se presionó el botón
         * params.action Botón que se presionó
         * params.estado String alusiva al estado al que se debe derivar el cliente (sólo si aplica).
         * params.lote   Array con los resultados de la SS de lotes.
         */
        if (!utilities.isEmpty(params.recId) && !utilities.isEmpty(params.estado) && !utilities.isEmpty(params.action) && !utilities.isEmpty(params.lote)) {
          /**
           * La Acción enviada del script de cliente debe ser
           * 'confirmar': para cambiar el estado a "Confirmado" y bloquear el lote.
           */
          log.debug(proceso, 'params.action: ' + params.action);
          switch (params.action) {

            case 'confirmar':
              objetoRespuesta = confirmarLote(params)
              break;

            case 'cancelar':
              objetoRespuesta = cancelarLote(params)
              break;

            case 'generar':
              objetoRespuesta = generarArchivo(params)
              break;

            case 'procesar':
              objetoRespuesta = procesarRespuesta(params)
              break;

            case 'cerrar':
              objetoRespuesta = cerrarLote(params)
              break;


            default:
              objetoRespuesta.error = true;
              objetoRespuesta.message = 'LA ACCIÓN ' + params.action + ' NO ESTÁ DEFINIDA';
              var campoFecha = "";
              break;
          }
        }
      }

      log.audit("END Governance Monitoring", "Remaining Usage = " + script.getRemainingUsage() + ' --- time: ' + new Date());

      var responseSuitelet = context.response;
      log.debug(proceso, 'objetoRespuestaJSON: ' + JSON.stringify(objetoRespuesta));
      responseSuitelet.write({
        output: JSON.stringify(objetoRespuesta)
      });
    }


    function confirmarLote(params) {
      //-Botón "Confirmar Lote": Debe figurar únicamente sobre lotes en estado "Procesado" y 
      //presionarlo debe cambiar el estado a "Confirmado", bloquear el lote y disponibilizar el botón "Generar Archivo de Débitos".
      const proceso = 'Confirmar Lote';
      const script = runtime.getCurrentScript();
      const estadoConfirmado = script.getParameter('custscript_3k_func_botones_da_sl_est_con');

      var rspObj = {};
      rspObj.error = false;
      rspObj.message = '';

      try {

        var lote = params.lote;

        if (!utilities.isEmpty(lote)) {
          lote.setValue({
            fieldId: 'custrecord_3k_lote_debitos_estado',
            value: estadoConfirmado
          });
          rspObj.message = 'Datos actualizados correctamente'
        }
      } catch (e) {
        log.error(proceso, 'ERROR: ' + e);
        rspObj.error = true;
        rspObj.message = 'Error al Confirmar Lote - Error: ' + e.message;
      }

      lote.save();
      return rspObj;
    }

    function cancelarLote(params) {
      /*-Botón "Cancelar Lote": Debe figurar únicamente sobre lotes en estado "Procesado" y 
        presionarlo debe cambiar el estado a "Cancelado" y blanquear la sublista de "Detalle de Transacciones en Débito".*/
      const proceso = 'Cancelar Lote';
      const script = runtime.getCurrentScript();
      const estadoCancelado = script.getParameter('custscript_3k_func_botones_da_sl_est_can');

      var rspObj = {};
      rspObj.error = false;
      rspObj.message = '';

      try {

        var lote = params.lote;

        if (!utilities.isEmpty(lote)) {
          //Cambia el estado a "Cancelado"
          lote.setValue({
            fieldId: 'custrecord_3k_lote_debitos_estado',
            value: estadoCancelado
          });

          //Blanquea la sublista de "Detalle de Transacciones en Débito"
          var numLineasDet = lote.getLineCount({
            sublistId: 'recmachcustrecord_3k_det_trans_da_id_lote'
          });
          log.debug(proceso, 'numLineasDet: ' + numLineasDet);
          if (numLineasDet > 0) {
            for (let i = 0; i < numLineasDet; i++) {
              lote.removeLine({
                sublistId: 'recmachcustrecord_3k_det_trans_da_id_lote',
                line: 0,
                ignoreRecalc: true
              });
            }
          }

          rspObj.message = 'Datos actualizados correctamente'
        }
      } catch (e) {
        log.error(proceso, 'ERROR: ' + e);
        rspObj.error = true;
        rspObj.message = 'Error al Cancelar Lote - Error: ' + e.message;
      }

      lote.save();
      return rspObj;
    }

    function cerrarLote(params) {
      /*-Botón "Cancelar Lote": Debe figurar únicamente sobre lotes en estado "Procesado" y 
        presionarlo debe cambiar el estado a "Cancelado" y blanquear la sublista de "Detalle de Transacciones en Débito".*/
      const proceso = 'Cancelar Lote';
      const script = runtime.getCurrentScript();
      const estadoRecibido = script.getParameter('custscript_3k_func_botones_da_sl_est_rec');

      var rspObj = {};
      rspObj.error = false;
      rspObj.message = '';

      try {

        var lote = params.lote;

        if (!utilities.isEmpty(lote)) {
          //Cambia el estado a "Recibido"
          lote.setValue({
            fieldId: 'custrecord_3k_lote_debitos_estado',
            value: estadoRecibido
          });
          lote.setValue({
            fieldId: 'custrecord_3k_lote_debitos_cierre_m',
            value: true
          });

          //Blanquea la sublista de "Detalle de Transacciones en Débito"
          var numLineasDet = lote.getLineCount({
            sublistId: 'recmachcustrecord_3k_det_trans_da_id_lote'
          });
          var numLineasReg = lote.getLineCount({
            sublistId: 'recmachcustrecord_3k_det_reg_id_lote'
          });
          log.debug(proceso, 'numLineasDet: ' + numLineasDet);
          if (numLineasDet > 0 && numLineasReg > 0) {
            for (let i = 0; i < numLineasReg; i++) {
              lote.selectLine({
                sublistId: 'recmachcustrecord_3k_det_reg_id_lote',
                line: i
              });
              let esRechazado = utilities.isEmpty(lote.getCurrentSublistValue({
                sublistId: 'recmachcustrecord_3k_det_reg_id_lote',
                fieldId: 'custrecord_3k_det_reg_trans_pago'
              }));
              if (esRechazado) {
                let transaccion = lote.getCurrentSublistValue({
                  sublistId: 'recmachcustrecord_3k_det_reg_id_lote',
                  fieldId: 'custrecord_3k_det_reg_transaccion'
                });
                let lineaDetalle = lote.findSublistLineWithValue({
                  sublistId: 'recmachcustrecord_3k_det_trans_da_id_lote',
                  fieldId: 'custrecord_3k_trans_det_trans_da',
                  value: transaccion
                });
                if (lineaDetalle >= 0) {
                  lote.removeLine({
                    sublistId: 'recmachcustrecord_3k_det_trans_da_id_lote',
                    line: lineaDetalle
                  });
                }
              }
            }
          }

          rspObj.message = 'Datos actualizados correctamente'
        }
      } catch (e) {
        log.error(proceso, 'ERROR: ' + e);
        rspObj.error = true;
        rspObj.message = 'Error al Cancelar Lote - Error: ' + e.message;
      }

      lote.save();
      return rspObj;
    }
    //! braian aca es donde se genera el archivo
    function generarArchivo(params) {
      /*-Botón "Generar Archivo de Débitos": Debe figurar únicamente sobre lotes en estado "Confirmado", 
        al presionarlo debe levantar los datos del lote de débitos, la información de detalle, 
        obtener la configuración correspondiente a la subsidiaria y forma de pago del lote y pasarlas al renderer, 
        que generará un string con el contenido para el archivo que el script debe tomar, guardar, 
        colocar en el campo "Archivo Generado" y cambiar el estado a "Enviado". 
        Se recomienda añadir los datos al renderer en forma de objetos custom.*/
      const proceso = 'Generar Archivo de Débitos';
      const script = runtime.getCurrentScript();
      const estadoEnviado = script.getParameter('custscript_3k_func_botones_da_sl_est_env');

      var rspObj = {};
      rspObj.error = false;
      rspObj.message = '';

      try {

        var lote = params.lote;

        if (!utils21.isEmpty(lote)) {

          var fechaActual = new Date();
          var objFecha = funcionesDebitos.formatearFecha(fechaActual);
          if (!utilities.isEmpty(objFecha) && objFecha.error == false && !utilities.isEmpty(objFecha.fechaParseada)) {
            lote.setValue({ fieldId: "custrecord_3k_lote_debitos_fecha_gen", value: objFecha.fechaParseada });
          }

          var subsidiaria = lote.getValue('custrecord_3k_lote_debitos_subsidiaria');
          log.debug(proceso, 'subsidiaria: ' + subsidiaria);
          if (utils21.isEmpty(subsidiaria)) {
            throw error.create({ name: 'ERR_NO_SUBS', message: 'No se puede generar el archivo sin subsidiaria, por favor verifique y complete el campo correspondiente.' });
          }

          var formaPago = lote.getValue('custrecord_3k_lote_debitos_forma_pago');
          log.debug(proceso, 'formaPago: ' + formaPago);
          if (utils21.isEmpty(formaPago)) {
            throw error.create({ name: 'ERR_NO_FP', message: 'No se puede generar el archivo sin forma de pago, por favor verifique y complete el campo correspondiente.' });
          }
          // ! braian esta SS es la que obtiene la configuracion, filtrando por subsidiaria y forma de pago, en mi caso seria por subsidiaria y tipo txt
          var ssConfigDA = search.load('customsearch_3k_configuracion_da_render');

          ssConfigDA.filters.push(search.createFilter({
            name: 'custrecord_3k_config_da_subsidiaria',
            operator: search.Operator.ANYOF,
            values: subsidiaria
          }));
          ssConfigDA.filters.push(search.createFilter({
            name: 'custrecord_3k_config_da_forma_pago',
            operator: search.Operator.ANYOF,
            values: formaPago
          }));

          var configDA = utils21.runSearch({ ss: ssConfigDA })[0];

          var ssEquivMonFp = search.load('customsearch_3k_monedas_fp_da');

          ssEquivMonFp.filters.push(search.createFilter({
            name: 'custrecord_3k_equiv_for_pago_da',
            operator: search.Operator.ANYOF,
            values: formaPago
          }));

          var equivMonFp = utils21.runSearch({ ss: ssEquivMonFp });

          configDA.monedas = equivMonFp;

          log.debug('onRequest', 'INICIO - Record Lote : ' + JSON.stringify(lote));

          if (utils21.isEmpty(configDA)) {
            throw error.create({
              name: 'MISSING_CONFIG',
              message: 'No se encontró una configuración de Débitos Automáticos para la combinación de Forma de Pago y Subsidiaria de este Lote.'
            });
          }
          if (utils21.isEmpty(configDA.template)) {
            throw error.create({
              name: 'MISSING_TEMPLATE',
              message: 'No se encontró un template de impresión configurado para la combinación de Forma de Pago y Subsidiaria de este Lote.'
            });
          }

          var renderer = render.create();
          var fileHtml = file.load({
            id: configDA.template
          });

          var template = fileHtml.getContents(); //get the contents
          log.debug(proceso, 'fileCargado: ' + template);

          //AGREGAR INFORMACIÓN AL MODELO DE DATOS DEL TEMPLATE
          renderer.templateContent = template;

          log.debug(proceso, 'Agregando contenido al template: Configuracion');
          renderer.addCustomDataSource({
            alias: 'configDA',
            format: render.DataSource.OBJECT,
            data: configDA
          });
          log.debug(proceso, 'Contenido Agregado al template: Configuracion');

          log.debug(proceso, 'Agregando contenido al template: InfoPeríodo');
          var accPeriod = record.load({
            type: 'accountingperiod',
            id: lote.getValue('custrecord_3k_lote_debitos_periodo')
          });
          var accPeriodDateParse = new Date(format.parse({
            type: format.Type.DATE,
            value: accPeriod.getValue('enddate')
          }));
          var accPeriodDate = {
            dd: accPeriodDateParse.getDate(),
            mm: accPeriodDateParse.getMonth() + 1,
            yyyy: accPeriodDateParse.getFullYear()
          };
          renderer.addCustomDataSource({
            alias: 'accPeriodDate',
            format: render.DataSource.OBJECT,
            data: accPeriodDate
          });
          log.debug(proceso, 'Contenido Agregado al template: InfoPeríodo');

          log.debug(proceso, 'Agregando contenido al template: Cabecera de Lote');
          renderer.addRecord({
            templateName: "cabeceraLote",
            record: lote
          });
          log.debug(proceso, 'Contenido Agregado al template: Cabecera de Lote');

          log.debug(proceso, 'recordAgregado - lote: ' + lote);

          log.debug(proceso, 'Agregando contenido al template: Detalle de Lote');
          var ssDetalleDA = search.load('customsearch_3k_detalle_reg_lote_da');

          ssDetalleDA.filters.push(search.createFilter({
            name: 'custrecord_3k_det_reg_id_lote',
            operator: search.Operator.ANYOF,
            values: lote.id
          }));

          var detalleDA = utils21.runSearch({ ss: ssDetalleDA });
          if (detalleDA.length === 0) {
            throw error.create({ name: 'ERR_NO_DET', message: 'El proceso no encontró detalles de registros asociados a este lote, no se puede generar el archivo.' });
          } else {
            detalleDA = validarIdsEnviados({ detalles: detalleDA, subsidiaria, formaPago });
            renderer.addCustomDataSource({
              alias: 'lote',
              format: render.DataSource.OBJECT,
              data: { detalles: detalleDA }
            });
            log.debug(proceso, 'Contenido Agregado al template: Detalle de Lote');
          }

          var stringTXT = renderer.renderAsString();
          log.debug(proceso, 'String Renderizado: ' + stringTXT);
          configDA.nomArch = configDA.nomArch.replace('{internalid}', lote.id);
          configDA.nomArch = configDA.nomArch.replace('{name}', lote.getValue('name'));
          configDA.nomArch = configDA.nomArch.replace('{YYMM}', fechaActual.getFullYear().toString().substring(2, 4) + (fechaActual.getMonth() + 1).toString().padStart(2, "0"));
          var fileObj = file.create({
            name: configDA.nomArch,
            fileType: file.Type.PLAINTEXT,
            contents: stringTXT,
            folder: configDA.idCarpeta
          });
          var fileId = fileObj.save();

          lote.setValue({
            fieldId: 'custrecord_3k_lote_debitos_archivo_gen',
            value: fileId
          });

          lote.setValue({
            fieldId: 'custrecord_3k_lote_debitos_estado',
            value: estadoEnviado
          });
          rspObj.message = 'Datos actualizados correctamente'
        }
      } catch (e) {
        log.error(proceso, 'ERROR: ' + e);
        rspObj.error = true;
        rspObj.message = 'Error al Generar Archivo de Débitos - Error: ' + e.message + ' - Traza de Error: ' + e.stack;
      }

      lote.save();
      return rspObj;
    }

    function validarIdsEnviados({ detalles, subsidiaria, formaPago }) {
      var ssIdsEnviados = search.load('customsearch_3k_id_cliente_enviado');
      var filtroIdCliente = [];
      var filtroTarjeta = [];
      //Filtro por forma de pago
      ssIdsEnviados.filters.push(search.createFilter({
        name: "custrecord_3k_lote_debitos_forma_pago",
        join: "custrecord_3k_det_reg_id_lote",
        operator: search.Operator.ANYOF,
        values: formaPago
      }));
      //Filtro por subsidiaria
      ssIdsEnviados.filters.push(search.createFilter({
        name: "custrecord_3k_lote_debitos_subsidiaria",
        join: "custrecord_3k_det_reg_id_lote",
        operator: search.Operator.ANYOF,
        values: subsidiaria
      }));
      //Formo filtro por idCliente
      detalles.forEach((detalle, i) => {
        filtroIdCliente.push(["custrecord_3k_det_reg_id_reg_cliente", "is", detalle.idCliente]);
        filtroTarjeta.push(["custrecord_3k_det_reg_nro_tar_cbu", "is", detalle.tarjetaCbu]);
        if (i > 0 && i < detalles.length) {
          filtroIdCliente.push('OR');
          filtroTarjeta.push('OR');
        };
      });

      ssIdsEnviados.filterExpression.push(filtroIdCliente);
      ssIdsEnviados.filterExpression.push('AND');
      ssIdsEnviados.filterExpression.push(filtroTarjeta);

      var clientesEnviados = utils21.runSearch({ ss: ssIdsEnviados });

      var detallesEnviados = detalles.map(detalle => {
        detalle.enviado = clientesEnviados.some(obj => obj.idCliente == detalle.idCliente);
        return detalle;
      });

      log.debug('detallesEnviados', detallesEnviados);
      return detallesEnviados;
    }


    function procesarRespuesta(params) {
      /*-Botón "Procesar Respuesta": Debe figurar únicamente sobre lotes en estado "Enviado",
      al presionarlo debe leer de la lista de Archivos Adjuntos del lote si existe algún adjunto en forma de texto plano,
      en caso de que exista debe pegar ese archivo en el campo "Archivo Recibido",
      verificar que no se encuentre en ejecución otro proceso de lectura de respuestas
      (a través de la tabla de "Log de Ejecución de Procesos de DA") y en caso de no haberlo,
      disparar el Map/Reduce o programado de lectura de respuestas,
      grabar un "Log de Ejecución de Procesos de DA" y entregar al usuario el Número de Seguimiento.*/
      const proceso = 'Procesar Respuesta';
      const script = runtime.getCurrentScript();
      const estadoRecibido = script.getParameter('custscript_3k_func_botones_da_sl_est_rec');

      var rspObj = {};
      rspObj.error = false;
      rspObj.message = '';

      try {

        var lote = params.lote;

        if (!utilities.isEmpty(lote)) {

          var filtros = [];
          var filtroLote = {};
          filtroLote.name = 'internalid';
          filtroLote.operator = 'ANYOF';
          filtroLote.values = params.recId;
          filtros.push(filtroLote);

          var objResultSet = utilities.searchSavedPro('customsearch_3k_archivos_lote_debitos', filtros);
          if (objResultSet.error) {
            respuesta.error = true;
            respuesta.mensaje = 'Error Busqueda guardada de Archivos de Lote de Débitos - Error : ' + objResultSet.descripcion;
            log.error(proceso, respuesta.mensaje);
          } else {
            var resultSet = objResultSet.objRsponseFunction.result;
            var resultSearch = objResultSet.objRsponseFunction.search;
            log.debug(proceso, 'resultSet: ' + JSON.stringify(resultSet));
            var archivoId;
            if (!utilities.isEmpty(resultSet) && resultSet.length > 0) {
              var encontroTxt = false;
              for (var i = 0; !utilities.isEmpty(resultSet) && i < resultSet.length && !encontroTxt; i++) {
                var archivoId = resultSet[i].getValue({ name: resultSearch.columns[1] });
                log.debug(proceso, 'archivoId: ' + archivoId);
                if (utils21.isEmpty(archivoId)) {
                  throw error.create({ message: 'No hay archivos adjuntos para procesar.', name: 'ERR_NO_FILE' });
                }
                var archivo = file.load({
                  id: archivoId
                });
                log.debug(proceso, 'archivo: ' + archivo);
                var tipoArchivo = archivo.name.split('.').pop();
                tipoArchivo = tipoArchivo.toLowerCase();
                log.debug(proceso, 'tipoArchivo: ' + tipoArchivo);
                if (tipoArchivo == 'txt' || tipoArchivo == 'rec' || !utilities.isEmpty(tipoArchivo.match(/dvr/g))) {
                  encontroTxt = true;
                  lote.setValue({
                    fieldId: 'custrecord_3k_lote_debitos_archivo_resp',
                    value: archivoId
                  });
                }
              }

              var formaPago = lote.getValue('custrecord_3k_lote_debitos_forma_pago');
              var respuestaEjecucion = iniciarLecturaRespuestas(params, archivoId, formaPago);

              if (utilities.isEmpty(respuestaEjecucion) || respuestaEjecucion.error == true
                || utilities.isEmpty(respuestaEjecucion.nroSeg) || utilities.isEmpty(respuestaEjecucion.estado)) {
                throw error.create({ message: 'Error ejecutar el Map/Reduce', name: 'ERR_NO_PARAMS' });
              }

            }
          }

          lote.setValue({
            fieldId: 'custrecord_3k_lote_debitos_estado',
            value: estadoRecibido
          });

          rspObj.message = 'Datos actualizados correctamente'
        }
      } catch (e) {
        log.error(proceso, 'ERROR: ' + e);
        rspObj.error = true;
        rspObj.message = 'Error al Procesar Respuesta - Error: ' + e.message;
      }

      lote.save();
      return rspObj;
    }

    function iniciarLecturaRespuestas(params, archivoId, formaPago) {
      const proceso = 'Iniciar Lectura Respuestas';
      const script = runtime.getCurrentScript();
      var objResp = {
        error: false,
        message: '',
        idLog: ''
      };
      try {
        /****************************** GENERAR LOG DE EJECUCION - INICIO **********************************/
        var idEstadoPendiente = script.getParameter('custscript_3k_func_botones_da_sl_est_pen');
        var parametrosEjecucion = {};
        parametrosEjecucion.idRegistroLog = script.getParameter('custscript_3k_func_botones_da_sl_reg_log');
        parametrosEjecucion.idProceso = script.getParameter('custscript_3k_func_botones_da_sl_tip_pro');
        //var idUsuario = runtime.getCurrentUser().id;
        var objRespuestaLog = funcionesDebitos.generarLog(runtime.getCurrentScript(), parametrosEjecucion, formaPago, idEstadoPendiente);
        /****************************** GENERAR LOG DE EJECUCION - FIN **********************************/
        log.debug(proceso, 'objRespuestaLog: ' + JSON.stringify(objRespuestaLog));
        if (utilities.isEmpty(objRespuestaLog) || objRespuestaLog.error == true || utilities.isEmpty(objRespuestaLog.idLog)) {
          throw error.create({ message: 'Error al generar log de estado pendiente', name: 'ERR_LOG_PEN' });
        }

        objResp.idLog = objRespuestaLog.idLog;

        var parametrosValidar = {};
        parametrosValidar.idProceso = parametrosEjecucion.idProceso;
        parametrosValidar.ssEstadoProcesos = script.getParameter('custscript_3k_func_btns_da_sl_ss_est_pro');;
        parametrosValidar.ssConfigScripts = script.getParameter('custscript_3k_func_btns_da_sl_ss_con_scr');;
        var respuestaEjecuciones = funcionesDebitos.validarEjecucionProcesos(parametrosValidar, formaPago, objRespuestaLog.idLog);

        if (utilities.isEmpty(respuestaEjecuciones) || respuestaEjecuciones.error == true) {
          throw error.create({ message: 'Error al validar ejecucion de procesos', name: 'ERR_EJE_PRO' });
        } else if (respuestaEjecuciones.ejecucionesDisponibles == false || utilities.isEmpty(respuestaEjecuciones.idImplementacion)
          || utilities.isEmpty(respuestaEjecuciones.idScript)) {
          throw error.create({ message: 'Ya existe otro proceso de Lectura de Respuestas en el Log de Ejecución de Procesos', name: 'ERR_LOG_DUPL' });
        }

        /****************************** EJECUTAR PROCESO PROGRAMADO - INICIO **********************************/

        var parametros = {};
        parametros.custscript_3k_proc_resp_mr_lot = params.recId;
        parametros.custscript_3k_proc_resp_mr_arch_resp = archivoId;
        parametros.custscript_3k_proc_res_id_log = objResp.idLog;

        var respuestaEjecucion = funcionesDebitos.createAndSubmitMapReduceJob('customscript_3k_procesar_respuesta_mr', 'customdeploy_3k_procesar_respuesta_mr', parametros);

        if (utilities.isEmpty(respuestaEjecucion) || respuestaEjecucion.error == true
          || utilities.isEmpty(respuestaEjecucion.nroSeg) || utilities.isEmpty(respuestaEjecucion.estado)) {
          throw error.create({ message: 'Error ejecutar el Map/Reduce', name: 'ERR_MR' });
        }

        objResp.nroSeg = respuestaEjecucion.nroSeg;
        objResp.estado = respuestaEjecucion.estado;

        /****************************** GENERAR LOG DE EJECUCION - INICIO **********************************/
        var idEstadoEncolado = script.getParameter('custscript_3k_func_botones_da_sl_est_enc');
        var mensajeEncolado = 'Map/Reduce Encolado';
        var objRespuestaUpdateLog = actualizarLog(idEstadoEncolado, mensajeEncolado, objResp.idLog, objResp.nroSeg);
        /****************************** GENERAR LOG DE EJECUCION - FIN **********************************/

        if (utilities.isEmpty(objRespuestaUpdateLog) || objRespuestaUpdateLog.error == true) {
          throw error.create({ message: 'Error al generar log de estado encolado', name: 'ERR_LOG_ENC' });
        }
      } catch (err) {
        log.error(proceso, 'ERROR: ' + err.message + ' - ' + err.stack);
        objResp.error = true;
        objResp.message = 'Error al Procesar Respuesta - Error: ' + err.message;
      }
      return objResp;
    }

    function actualizarLog(idEstado, mensaje, idLog, taskID) {
      const script = runtime.getCurrentScript();
      var objResp = {
        error: false,
        message: ''
      };
      try {
        var informacionEjecucion = {};
        informacionEjecucion.idRegistroLog = script.getParameter('custscript_3k_func_botones_da_sl_reg_log');
        informacionEjecucion.idProceso = script.getParameter('custscript_3k_func_botones_da_sl_tip_pro');
        var objActualizarLog = new Object();
        objActualizarLog.idLog = idLog;
        objActualizarLog.idEstado = idEstado;
        objActualizarLog.taskID = taskID;
        objActualizarLog.mensajeLog = mensaje;
        objResp = funcionesDebitos.actualizarLog(script, informacionEjecucion, objActualizarLog);

      } catch (err) {
        log.error('actualizarLog - ERROR', err.message + ' - ' + err.stack);
        objResp.error = true;
        objResp.message = 'Error actualizando log: ' + err.message + ' - ' + err.stack
      }
      return objResp;
    }

    return {
      onRequest: onRequest
    };
  });