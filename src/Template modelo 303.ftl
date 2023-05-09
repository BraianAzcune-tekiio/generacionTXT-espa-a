<#assign ejercicio=camposFormulario.periodoObj.periodoFecha.yyyy />
<#assign mes=camposFormulario.periodoObj.periodoFecha.MM />
<#assign  ultimoMes= mes=="12"/>
<#assign  ultimoTrimestre= camposFormulario.periodoObj.esTrimestre=="true" && camposFormulario.periodoObj.trimestre=="4">
<#assign ultimoMesOTrimestre= ultimoMes || ultimoTrimestre>
<#assign periodo= mes?left_pad(2,"0")>
<#if camposFormulario.periodoObj.esTrimestre=="true">
    <#assign periodo= camposFormulario.periodoObj.trimestre + "T">
</#if>
<#--  el comando rt, elimina cualquier espacio y salto de linea hacia la derecha, si se quiere agregar espacios que no borre usar left_pad o rigth_pad  -->
<T${camposFormulario.tipo_txt}0${ejercicio}${periodo}0000><#rt>
<AUX><#rt>
${""?left_pad(70," ")}${configuracionObj.custrecord_l34_conf_gen_txt_software_ver?left_pad(4,"0")}${""?left_pad(4," ")}${configuracionObj.custrecord_l34_conf_gen_txt_nif_ed_sw}${""?left_pad(213," ")}<#rt>
</AUX><#rt>
<#--  Comienza pagina 1 DP30301 -->
<#--  Comienza pagina 1 DP30301 HEADER-->
<T${camposFormulario.tipo_txt}01000>${""?left_pad(1," ")}<#rt>
${camposFormulario.tipoDeclaracion}<#rt>
${camposFormulario.nifDeclarante?right_pad(9, " ")}<#rt>
${camposFormulario.razonSocial?right_pad(80, " ")}<#rt>
${ejercicio}<#rt>
${periodo}<#rt>
${camposFormulario.tributacionExclusivamenteForal}<#rt>
${camposFormulario.inscriptoDevolucionMensual}<#rt>
${camposFormulario.tributaExclusivamenteRegimenSimplificado}<#rt>
${camposFormulario.autoLiquidacionConjunta}<#rt>
${camposFormulario.sujetoPasivoAcogidoCriterioCaja}<#rt>
${camposFormulario.destinatarioOperacionCriterioCaja}<#rt>
${camposFormulario.opcionAplicacionProrrataEspecial}<#rt>
${camposFormulario.revocacionOpcionPorAplicacionProrrataEspecial}<#rt>
${camposFormulario.declaradoConcursoAcreedoresPresentePeriodo}<#rt>
<#if camposFormulario.fechaDeclaracion.dd != "">
${camposFormulario.fechaDeclaracion.dd?left_pad(2,"0")}${camposFormulario.fechaDeclaracion.MM?left_pad(2,"0")}${camposFormulario.fechaDeclaracion.yyyy}<#rt>
<#else>
${""?left_pad(8," ")}<#rt>
</#if>
${camposFormulario.autoDeclaracionConcursoDictadoEnPeriodo?left_pad(1," ")}<#rt>
camposFormulario.sujetoPasivoAcogidoSII=${camposFormulario.sujetoPasivoAcogidoSII}<#rt>
<#if ultimoMesOTrimestre>
${camposFormulario.exoneradoResumenAnualIVA390}<#rt>
<#else>
0<#rt>
</#if>
<#if camposFormulario.existeVolumenOperaciones == "0" >
0<#rt>
<#else>
<#if ultimoMesOTrimestre>0<#else>${camposFormulario.existeVolumenOperaciones}</#if><#rt>
</#if>
<#--  ! ACA TOCA ITERAR, TODAVIA NO PORQUE PRUEBAS...  -->
<#--  ! No hecho, rellenado con el padding correspondiente  -->
<#--  Liquidación (3) - Regimen General - IVA Devengado - Régimen general - Base imponible [150]  -->
${""?left_pad(17," ")}<#rt>
<#--  Liquidación (3) - Regimen General - IVA Devengado - Régimen general - Tipo % [151]  -->
${""?left_pad(5," ")}<#rt>
<#--  Liquidación (3) - Regimen General - IVA Devengado - Régimen general - Cuota [152]  -->
${""?left_pad(17," ")}<#rt>
<#--  ! No hecho, rellenado con el padding correspondiente  FIN-->
<Prueba>
<Prueba>
<#--  Liquidación (3) - Regimen General - IVA Devengado - Régimen general - Base imponible [01]  -->
<#--  <#assign base01 = camposFormulario.prueba?number?c?split(".")>
<#assign base01_0 = base01[0]?left_pad(15, "0")>
<#assign base01_1 = base01[1]?default("")?right_pad(2, "0")>
baso01 0=${base01_0}
baso01 1=${base01_1}  -->
<#--  !hardcodeado, operaNo deberia venir de la SS pero no viene actualmente.  -->
<#assign operaNo= "null">
<#list ssTaxReportDetail.getTaxReportDetail as transaccion>
<#if transaccion.taxrate == "4.0%" && (transaccion.type == "CustInvc" || transaccion.type == "CashSale")  && operaNo == "null">
transaccion.amount=${transaccion.amount}
</#if>

</#list>

<#--  ${}<#rt>  -->
<#--  FIN pagina 1 DP30301 HEADER-->
<#--  FIN pagina 1 DP30301  -->
</T${camposFormulario.tipo_txt}0${ejercicio}${periodo}0000><#rt>



<DEBUGGER>
ejercicio=${ejercicio}
mes=${mes}
esTrimestre=${camposFormulario.periodoObj.esTrimestre}
ultimoMes=${ultimoMes}
ultimoTrimestre=${ultimoTrimestre}
ultimoMesOTrimestre=${ultimoMesOTrimestre}
trimestre=${camposFormulario.periodoObj.trimestre}
periodo=${periodo}

<#if ultimoMes>
    estamos en el ultimo mes
</#if>
<#if ultimoTrimestre>
    Estamos en el ultimo trimestre, septiembre 9,

</#if>
<#if ultimoMesOTrimestre>
    estamos en el ultimo mes o en el ultimo trimestre
</#if>
</DEBUGGER>