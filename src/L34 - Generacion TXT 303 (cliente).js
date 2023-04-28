/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 *@NModuleScope Public
 */

define(["N/currentRecord", "N/search", "N/format", "N/record"],
    function (currentRecord, search, format, record) {
        /* global define */
        /***
         * Esto es compartido por el script de cliente, se define un objeto que contiene los id, para hacer facil copy paste y no fallar.
         */
        const idCamposFormulario = {
            erro_texto: "custpage_field_error_mensaje"
        };

        function generarTXTModelo303(){
            // const objRecord = currentRecord.get();

            // alert("mensaje error= "+objRecord.getValue({
            //     fieldId: idCamposFormulario.erro_texto
            // }));
            // //! prueba
            // const fechaDesde = objRecord.getValue({
            //     fieldId: "custpage_field_fdesde"
            // });
            // alert("fecha= "+fechaDesde);
            return true;
        }

        return {
            saveRecord: generarTXTModelo303,
        };
    });