/* Generacion TXT REtenciones y Percepciones */
/* 3ksys - Argentina */
/* auxiliar functions - txt process */
/* **************************** */

/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NAmdConfig /SuiteScripts/configuration.json
 *@NModuleScope Public
 */

define(["N/currentRecord", "N/search", "N/format", "N/record"],
  function (currentRecord, search, format, record) {
    /*global define */
    // Migrado desde l54_Generar_TXT_Retenciones_cliente.js

    //Listo
    // FUNCTION: isEmpty
    function isEmpty(value) {
      if (value === "" || value === null || value === undefined) {
        return true;
      }
      return false;
      //Alternativo:
      //return value === '' || value === null || value === undefined? true : false;
    }
    //Lista (sólo js)
    function pad(number, length) {

      let str = "" + number;
      while (str.length < length) {
        str = "0" + str;
      }
      return str;
    }

    function generarTXT() {
      const objRecord = currentRecord.get();
      const fechaDesde = objRecord.getValue({
        fieldId: "custpage_field_fdesde"
      });
      const fechaHasta = objRecord.getValue({
        fieldId: "custpage_field_fhasta"
      });
      //en js: variable.isEmpty()
      if (isEmpty(fechaDesde)) {
        alert("Debe Ingresar la Fecha Desde");
        return false;
      }
      if (isEmpty(fechaHasta)) {
        alert("Debe Ingresar la Fecha Hasta");
        return false;
      }

      const fechaDesdeDate = format.parse({
        value: fechaDesde,
        type: format.Type.DATE
      });

      const fechaHastaDate = format.parse({
        value: fechaHasta,
        type: format.Type.DATE
      });


      if (comparacionFechas(fechaDesdeDate, fechaHastaDate) == 1) {
        alert("La Fecha Hasta debe Ser igual o Superior a la Fecha Desde");
        return false;
      }

      const jurisdiccion = objRecord.getValue("custpage_field_jurisdiccion");

      // obtener el codigo del regimen
      const regimenId = objRecord.getValue("custpage_field_tipo");
      const regimen = record.load({ type: "customrecord_l54_tipos_txt", id: regimenId });
      const codigoRegimen = regimen.getValue("custrecord_l54_tipos_txt_codigo");

      if (regimenAplicaSircar(codigoRegimen, jurisdiccion) == "F") {
        if (!isEmpty(jurisdiccion)) {
          alert("No debe completar jurisdiccion para el Regimen seleccionado");
          return false;
        }
      }
      if (regimenAplicaSircar(codigoRegimen, jurisdiccion) == "T") {
        if (isEmpty(jurisdiccion)) {
          alert("Debe completar Jurisdiccion para el Regimen seleccionado");
          return false;
        }
      }
      return true;
    }

    //Lista: Sólo js
    function comparacionFechas(fechaInicio, fechaFin) {
      const fechaInicioNew = (fechaInicio.getFullYear() + pad(parseInt(fechaInicio.getMonth(), 10) + parseInt(1, 10), 2) + pad(parseInt(fechaInicio.getDate(), 10) + parseInt(1, 10), 2));
      const fechaHastaNew = (fechaFin.getFullYear() + pad(parseInt(fechaFin.getMonth(), 10) + parseInt(1, 10), 2) + pad(parseInt(fechaFin.getDate(), 10) + parseInt(1, 10), 2));
      return ((fechaInicioNew > fechaHastaNew) - (fechaInicioNew < fechaHastaNew));
    }
    //Lista
    function regimenAplicaSircar(regimen, jurisdiccion) {
      let aplicaSircar = "";
      if (regimen == 15 || regimen == 16) {
        return aplicaSircar = jurisdiccionAplicaSircar(jurisdiccion);
      }
      aplicaSircar = "F";
      return aplicaSircar;
    }

    //Lista
    function jurisdiccionAplicaSircar(jurisdiccion) {
      let aplicaSircar = "F";
      const filters = [];
      const columns = [];
      if (!isEmpty(jurisdiccion)) {
        filters[0] = search.createFilter({
          name: "internalid",
          operator: search.Operator.IS,
          values: jurisdiccion
        });
        columns[0] = search.createColumn({
          name: "internalid"
        });
        columns[1] = search.createColumn({
          name: "custrecord_l54_zona_impuestos_sircar"
        });

        const results = search.create({
          type: "customrecord_l54_zona_impuestos",
          filters: filters,
          columns: columns
        }).run().getRange({
          start: 0,
          end: 1000
        });


        if (results != null && results.length > 0) {
          aplicaSircar = results[0].getValue("custrecord_l54_zona_impuestos_sircar");
          aplicaSircar = (isEmpty(aplicaSircar) || aplicaSircar == 'F' || aplicaSircar == false) ? 'F' : 'T';
          return aplicaSircar;
        }
      }
      aplicaSircar = "T";
      return aplicaSircar;
    }
    return {
      saveRecord: generarTXT,
    };
  }); 