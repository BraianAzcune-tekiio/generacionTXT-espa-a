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
<#-- * Comienza pagina 1 DP30301 -->
<#-- * Comienza pagina 1 DP30301 HEADER-->
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
<#--  ! No hecho, rellenado con el padding correspondiente  -->
<#--  Liquidación (3) - Regimen General - IVA Devengado - Régimen general - Base imponible [150]  -->
${""?left_pad(17,"0")}<#rt>
<#--  Liquidación (3) - Regimen General - IVA Devengado - Régimen general - Tipo % [151]  -->
${""?left_pad(5,"0")}<#rt>
<#--  Liquidación (3) - Regimen General - IVA Devengado - Régimen general - Cuota [152]  -->
${""?left_pad(17,"0")}<#rt>
<#--  ! FIN No hecho, rellenado con el padding correspondiente  -->
<#--  * Comienza IVA DEVENGADO  -->
<PRUEBA[01][02][03]>
<#if taxReportDetail.baseEImpuesto4.existeTasa == "true">

<PRUEBALiquidación (3) - Regimen General - IVA Devengado - Régimen general - Base imponible [01]>

<#--  * por codigo se garantiza que existe el "." para separar y que se tiene dos decimales  -->
${taxReportDetail.baseEImpuesto4.base4?split(".")[0]?replace("-","")?left_pad(15,"0")}<#rt>
${taxReportDetail.baseEImpuesto4.base4?split(".")[1]}<#rt>

</PRUEBALiquidación (3) - Regimen General - IVA Devengado - Régimen general - Base imponible [01]>

<PRUEBALiquidación (3) - Regimen General - IVA Devengado - Régimen general - Tipo % [02]>

<#--  * por codigo se garantiza que existe el "." para separar y que se tiene dos decimales  -->
${taxReportDetail.baseEImpuesto4.tasa4?split(".")[0]?left_pad(3, "0")}<#rt>
${taxReportDetail.baseEImpuesto4.tasa4?split(".")[1]}<#rt>

</PRUEBALiquidación (3) - Regimen General - IVA Devengado - Régimen general - Tipo % [02]>

<PRUEBALiquidación (3) - Regimen General - IVA Devengado - Régimen general - Cuota [03]>

${taxReportDetail.baseEImpuesto4.impuesto4?split(".")[0]?replace("-","")?left_pad(15,"0")}<#rt>
${taxReportDetail.baseEImpuesto4.impuesto4?split(".")[1]}<#rt>

</PRUEBALiquidación (3) - Regimen General - IVA Devengado - Régimen general - Cuota [03]>

<#else>
<#--  [01]  -->
${""?left_pad(17,"0")}<#rt>
<#--  [02]  -->
${""?left_pad(5,"0")}<#rt>
<#--  [03]  -->
${""?left_pad(17,"0")}<#rt>
</#if>
</PRUEBA[01][02][03]>

<#--  ! No hecho, rellenado con el padding correspondiente  -->
<#--  Liquidación (3) - Regimen General - IVA Devengado - Régimen general - Base imponible [153]  -->
${""?left_pad(17,"0")}<#rt>
<#--  Liquidación (3) - Regimen General - IVA Devengado - Régimen general - Tipo % [154]  -->
${""?left_pad(5,"0")}<#rt>
<#--  Liquidación (3) - Regimen General - IVA Devengado - Régimen general - Cuota [155]  -->
${""?left_pad(17,"0")}<#rt>
<#--  ! FIN No hecho, rellenado con el padding correspondiente  -->

<PRUEBA[04][05][06]>
<#if taxReportDetail.baseEImpuesto10.existeTasa == "true">
<PRUEBALiquidación (3) - Regimen General - IVA Devengado - Régimen general - Base imponible [04]>

${taxReportDetail.baseEImpuesto10.base10?split(".")[0]?replace("-","")?left_pad(15,"0")}<#rt>
${taxReportDetail.baseEImpuesto10.base10?split(".")[1]}<#rt>

</PRUEBALiquidación (3) - Regimen General - IVA Devengado - Régimen general - Base imponible [04]>

<PRUEBALiquidación (3) - Regimen General - IVA Devengado - Régimen general - Tipo % [05]>

${taxReportDetail.baseEImpuesto10.tasa10?split(".")[0]?left_pad(3, "0")}<#rt>
${taxReportDetail.baseEImpuesto10.tasa10?split(".")[1]}<#rt>

</PRUEBALiquidación (3) - Regimen General - IVA Devengado - Régimen general - Tipo % [05]>

<PRUEBALiquidación (3) - Regimen General - IVA Devengado - Régimen general - Cuota [06]>

${taxReportDetail.baseEImpuesto10.impuesto10?split(".")[0]?replace("-","")?left_pad(15,"0")}<#rt>
${taxReportDetail.baseEImpuesto10.impuesto10?split(".")[1]}<#rt>

</PRUEBALiquidación (3) - Regimen General - IVA Devengado - Régimen general - Cuota [06]>

<#else>
<#--  [04]  -->
${""?left_pad(17,"0")}<#rt>
<#--  [05]  -->
${""?left_pad(5,"0")}<#rt>
<#--  [06]  -->
${""?left_pad(17,"0")}<#rt>
</#if>
</PRUEBA[04][05][06]>


<PRUEBA[07][08][09]
<#if taxReportDetail.baseEImpuesto21.existeTasa == "true">

<PRUEBALiquidación (3) - Regimen General - IVA Devengado - Régimen general - Base imponible [07]>

${taxReportDetail.baseEImpuesto21.base21?split(".")[0]?replace("-","")?left_pad(15,"0")}<#rt>
${taxReportDetail.baseEImpuesto21.base21?split(".")[1]}<#rt>

</PRUEBALiquidación (3) - Regimen General - IVA Devengado - Régimen general - Base imponible [07]>

<PRUEBALiquidación (3) - Regimen General - IVA Devengado - Régimen general - Tipo % [08]>

${taxReportDetail.baseEImpuesto21.tasa21?split(".")[0]?left_pad(3, "0")}<#rt>
${taxReportDetail.baseEImpuesto21.tasa21?split(".")[1]}<#rt>

</PRUEBALiquidación (3) - Regimen General - IVA Devengado - Régimen general - Tipo % [08]>

<PRUEBALiquidación (3) - Regimen General - IVA Devengado - Régimen general - Cuota [09]>

${taxReportDetail.baseEImpuesto21.impuesto21?split(".")[0]?replace("-","")?left_pad(15,"0")}<#rt>
${taxReportDetail.baseEImpuesto21.impuesto21?split(".")[1]}<#rt>

</PRUEBALiquidación (3) - Regimen General - IVA Devengado - Régimen general - Cuota [09]>
<#else>
<#--  [07]  -->
${""?left_pad(17,"0")}<#rt>
<#--  [08]  -->
${""?left_pad(5,"0")}<#rt>
<#--  [09]  -->
${""?left_pad(17,"0")}<#rt>
</#if>
</PRUEBA[07][08][09]

<PRUEBA[10][11]>
<#if taxReportDetail.baseEImpuestoAdq.existeTasa == "true">
<PRUEBALiquidación (3) - Regimen General - IVA Devengado - Adquisiciones intracomunitarias de bienes y servicios - Base imponible  [10]>

${taxReportDetail.baseEImpuestoAdq.baseAdq?split(".")[0]?replace("-","")?left_pad(15,"0")}<#rt>
${taxReportDetail.baseEImpuestoAdq.baseAdq?split(".")[1]}<#rt>

</PRUEBALiquidación (3) - Regimen General - IVA Devengado - Adquisiciones intracomunitarias de bienes y servicios - Base imponible  [10]>

<Liquidación (3) - Regimen General - IVA Devengado - Adquisiciones intracomunitarias de bienes y servicios - Cuota [11]>

${taxReportDetail.baseEImpuestoAdq.impuestoAdq?split(".")[0]?replace("-","")?left_pad(15,"0")}<#rt>
${taxReportDetail.baseEImpuestoAdq.impuestoAdq?split(".")[1]}<#rt>

</Liquidación (3) - Regimen General - IVA Devengado - Adquisiciones intracomunitarias de bienes y servicios - Cuota [11]>

<#else>
<#--  [10]  -->
${""?left_pad(17,"0")}<#rt>
<#--  [11]  -->
${""?left_pad(17,"0")}<#rt>
</#if>
</PRUEBA[10][11]>

<PRUEBA[12][13]>
<#if taxReportDetail.baseEImpuesto12.existeTasa == "true">
<PRUEBALiquidación (3) - Regimen General - IVA Devengado - Otras operaciones con inversión del sujeto pasivo (excepto. adq. intracom) - Base imponible  [12]>

${taxReportDetail.baseEImpuesto12.base12?split(".")[0]?replace("-","")?left_pad(15,"0")}<#rt>
${taxReportDetail.baseEImpuesto12.base12?split(".")[1]}<#rt>

</PRUEBALiquidación (3) - Regimen General - IVA Devengado - Otras operaciones con inversión del sujeto pasivo (excepto. adq. intracom) - Base imponible  [12]>

<PRUEBALiquidación (3) - Regimen General - IVA Devengado - Otras operaciones con inversión del sujeto pasivo (excepto. adq. intracom) - Cuota [13]>

${taxReportDetail.baseEImpuesto12.impuesto13?split(".")[0]?replace("-","")?left_pad(15,"0")}<#rt>
${taxReportDetail.baseEImpuesto12.impuesto13?split(".")[1]}<#rt>

</PRUEBALiquidación (3) - Regimen General - IVA Devengado - Otras operaciones con inversión del sujeto pasivo (excepto. adq. intracom) - Cuota [13]>

<#else>
<#--  [12]  -->
${""?left_pad(17,"0")}<#rt>
<#--  [13]  -->
${""?left_pad(17,"0")}<#rt>
</#if>
</PRUEBA[12][13]>

<PRUEBA[14][15]>
<#if taxReportDetail.baseEImpuesto14.existeTasa == "true">

<PRUEBALiquidación (3) - Regimen General - IVA Devengado - Modificación bases y cuotas- Base imponible  [14]>

<#if taxReportDetail.baseEImpuesto14.base14?number < 0>
N${taxReportDetail.baseEImpuesto14.base14?split(".")[0]?replace("-","")?left_pad(14,"0")}<#rt>
<#else>
${taxReportDetail.baseEImpuesto14.base14?split(".")[0]?replace("-","")?left_pad(15,"0")}<#rt>
</#if>
${taxReportDetail.baseEImpuesto14.base14?split(".")[1]}<#rt>

</PRUEBALiquidación (3) - Regimen General - IVA Devengado - Modificación bases y cuotas- Base imponible  [14]>

<PRUEBALiquidación (3) - Regimen General - IVA Devengado - Modificación bases y cuotas - Cuota [15]>

<#if taxReportDetail.baseEImpuesto14.impuesto15?number < 0>
N${taxReportDetail.baseEImpuesto14.impuesto15?split(".")[0]?replace("-","")?left_pad(14,"0")}<#rt>
<#else>
${taxReportDetail.baseEImpuesto14.impuesto15?split(".")[0]?replace("-","")?left_pad(15,"0")}<#rt>
</#if>
${taxReportDetail.baseEImpuesto14.impuesto15?split(".")[1]}<#rt>

</PRUEBALiquidación (3) - Regimen General - IVA Devengado - Modificación bases y cuotas - Cuota [15]>

<#else>
<#--  [14]  -->
${""?left_pad(17,"0")}<#rt>
<#--  [15]  -->
${""?left_pad(17,"0")}<#rt>
</#if>
</PRUEBA[14][15]>

<#--  ! No hecho, rellenado con el padding correspondiente  -->
<#--  Liquidación (3) - Regimen General - IVA Devengado - Recargo equivalencia - Base imponible [156]  -->
${""?left_pad(17,"0")}<#rt>
<#--  Liquidación (3) - Regimen General - IVA Devengado - Recargo equivalencia - Tipo % [157]  -->
${""?left_pad(5,"0")}<#rt>
<#--  Liquidación (3) - Regimen General - IVA Devengado - Recargo equivalencia - Cuota [158]  -->
${""?left_pad(17,"0")}<#rt>
<#--  ! FIN No hecho, rellenado con el padding correspondiente  -->

<PRUEBA[16][17][18]>
<#if taxReportDetail.baseEImpuestoRE.existeTasa == "true">

<PRUEBALiquidación (3) - Regimen General - IVA Devengado - Recargo equivalencia - Base imponible [16]>

${taxReportDetail.baseEImpuestoRE.baseRE?split(".")[0]?replace("-","")?left_pad(15,"0")}<#rt>
${taxReportDetail.baseEImpuestoRE.baseRE?split(".")[1]}<#rt>

</PRUEBALiquidación (3) - Regimen General - IVA Devengado - Recargo equivalencia - Base imponible [16]>

<PRUEBALiquidación (3) - Regimen General - IVA Devengado - Recargo equivalencia - Tipo % [17]>
<#--  ! RARO QUE ESTO ESTE HARDCODEADO, TAMBIEN LA FOMRA EN QUE SE CALCULA... consultar sebastian  -->
${"00520"?left_pad(5,"0")}<#rt>

</PRUEBALiquidación (3) - Regimen General - IVA Devengado - Recargo equivalencia - Tipo % [17]>

<PRUEBALiquidación (3) - Regimen General - IVA Devengado - Recargo equivalencia - Cuota [18]>

${taxReportDetail.baseEImpuestoRE.impuestoRE5_2?split(".")[0]?replace("-","")?left_pad(15,"0")}<#rt>
${taxReportDetail.baseEImpuestoRE.impuestoRE5_2?split(".")[1]}<#rt>

</PRUEBALiquidación (3) - Regimen General - IVA Devengado - Recargo equivalencia - Cuota [18]>
<#else>
<#--  [16]  -->
${""?left_pad(17,"0")}<#rt>
<#--  ! RARO QUE ESTO ESTE HARDCODEADO, TAMBIEN LA FOMRA EN QUE SE CALCULA... consultar sebastian  -->
<#--  [17]  -->
${"00520"?left_pad(5,"0")}<#rt>
<#--  [18]  -->
${""?left_pad(17,"0")}<#rt>
</#if>
</PRUEBA[16][17][18]>


<#--  ! ESTO NO SE CALCULA, ESTA HARDCODEADO  consultar sebastian-->
<PRUEBA[19][20][21][22][23][24][25][26]>
ESTO APARECE HARDCODEADO

<#--  [19]  -->
${""?left_pad(17,"0")}
<#--  [20]  -->
${"00140"?left_pad(5,"0")}
<#--  [21]  -->
${""?left_pad(17,"0")}
<#--  [22]  -->
${""?left_pad(17,"0")}
<#--  [23]  -->
${""?left_pad(5,"0")}
<#--  [24]  -->
${""?left_pad(17,"0")}
<#--  [25]  -->
${""?left_pad(17,"0")}
<#--  [26]  -->
${""?left_pad(17,"0")}

</PRUEBA[19][20][21][22][23][24][25][26]>

<PRUEBA[27]TotalCuota>
<#if taxReportDetail.totalCuota?number < 0>
N${taxReportDetail.totalCuota?split(".")[0]?replace("-","")?left_pad(14,"0")}<#rt>
<#else>
${taxReportDetail.totalCuota?split(".")[0]?replace("-","")?left_pad(15,"0")}<#rt>
</#if>
${taxReportDetail.totalCuota?split(".")[1]}<#rt>

</PRUEBA[27]TotalCuota>
<#--  * Termina IVA DEVENGADO  -->
<#--  * Comienza IVA DEDUCIBLE  -->
<PRUEBA[28][29]>
<#if taxReportDetail.baseEImpuestoDeduccion.existeTasa == "true">
<PRUEBALiquidación (3) - Regimen General - IVA Deducible - Por cuotas soportadas en operaciones interiores corrientes - Base [28]>
${taxReportDetail.baseEImpuestoDeduccion.baseDed?split(".")[0]?replace("-","")?left_pad(15,"0")}<#rt>
${taxReportDetail.baseEImpuestoDeduccion.baseDed?split(".")[1]}<#rt>

</PRUEBALiquidación (3) - Regimen General - IVA Deducible - Por cuotas soportadas en operaciones interiores corrientes - Base [28]>
<PRUEBALiquidación (3) - Regimen General - IVA Deducible - Por cuotas soportadas en operaciones interiores corrientes - Cuota [29]>
${taxReportDetail.baseEImpuestoDeduccion.impuestoDed?split(".")[0]?replace("-","")?left_pad(15,"0")}<#rt>
${taxReportDetail.baseEImpuestoDeduccion.impuestoDed?split(".")[1]}<#rt>

</PRUEBALiquidación (3) - Regimen General - IVA Deducible - Por cuotas soportadas en operaciones interiores corrientes - Cuota [29]>
<#else>
<#--  [28]  -->
${""?left_pad(17,"0")}<#rt>
<#--  [29]  -->
${""?left_pad(17,"0")}<#rt>
</#if>
</PRUEBA[28][29]>

<PRUEBA[30][31]>
<#if taxReportDetail.baseEImpuestoInterioresBI.existeTasa == "true">
<PRUEBALiquidación (3) - Regimen General - IVA Deducible - Por cuotas soportadas en operaciones interiores con bienes de inversión - Base [30]>
${taxReportDetail.baseEImpuestoInterioresBI.interioresBIBase?split(".")[0]?replace("-","")?left_pad(15,"0")}<#rt>
${taxReportDetail.baseEImpuestoInterioresBI.interioresBIBase?split(".")[1]}<#rt>

</PRUEBALiquidación (3) - Regimen General - IVA Deducible - Por cuotas soportadas en operaciones interiores con bienes de inversión - Base [30]>
<PRUEBALiquidación (3) - Regimen General - IVA Deducible - Por cuotas soportadas en operaciones interiores con bienes de inversión - Cuota [31]>
${taxReportDetail.baseEImpuestoInterioresBI.interioresBIImp?split(".")[0]?replace("-","")?left_pad(15,"0")}<#rt>
${taxReportDetail.baseEImpuestoInterioresBI.interioresBIImp?split(".")[1]}<#rt>

</PRUEBALiquidación (3) - Regimen General - IVA Deducible - Por cuotas soportadas en operaciones interiores con bienes de inversión - Cuota [31]>
<#else>
<#--  [30]  -->
${""?left_pad(17,"0")}<#rt>
<#--  [31]  -->
${""?left_pad(17,"0")}<#rt>
</#if>
</PRUEBA[30][31]>

<#--  * Termina IVA DEDUCIBLE  -->
<#--  
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
</DEBUGGER>  -->
</T${camposFormulario.tipo_txt}0${ejercicio}${periodo}0000><#rt>