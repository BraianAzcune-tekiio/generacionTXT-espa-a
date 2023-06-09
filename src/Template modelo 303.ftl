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

<PRUEBA[150][151][152]>
<#if taxReportDetail.baseEImpuesto150.existeTasa == "true">
<PRUEBALiquidación (3) - Regimen General - IVA Devengado - Régimen general - Base imponible [150]>
${taxReportDetail.baseEImpuesto150.base150?split(".")[0]?replace("-","")?left_pad(15,"0")}<#rt>
${taxReportDetail.baseEImpuesto150.base150?split(".")[1]}<#rt>

</PRUEBALiquidación (3) - Regimen General - IVA Devengado - Régimen general - Base imponible [150]>

<PRUEBALiquidación (3) - Regimen General - IVA Devengado - Régimen general - Tipo % [151]>
${"00000"?left_pad(5,"0")}<#rt>

</PRUEBALiquidación (3) - Regimen General - IVA Devengado - Régimen general - Tipo % [151]>

<PRUEBALiquidación (3) - Regimen General - IVA Devengado - Régimen general - Cuota [152]>
${taxReportDetail.baseEImpuesto150.impuesto152?split(".")[0]?replace("-","")?left_pad(15,"0")}<#rt>
${taxReportDetail.baseEImpuesto150.impuesto152?split(".")[1]}<#rt>

</PRUEBALiquidación (3) - Regimen General - IVA Devengado - Régimen general - Cuota [152]>

<#else>
<#--  [150]  -->
${""?left_pad(17,"0")}<#rt>
<#--  [151]  -->
${"00000"?left_pad(5,"0")}<#rt>
<#--  [152]  -->
${""?left_pad(17,"0")}<#rt>
</#if>
</PRUEBA[150][151][152]>

<#--  * Comienza IVA DEVENGADO  -->
<PRUEBA[01][02][03]>
<#if taxReportDetail.baseEImpuesto4.existeTasa == "true">

<PRUEBALiquidación (3) - Regimen General - IVA Devengado - Régimen general - Base imponible [01]>

<#--  * por codigo se garantiza que existe el "." para separar y que se tiene dos decimales  -->
${taxReportDetail.baseEImpuesto4.base4?split(".")[0]?replace("-","")?left_pad(15,"0")}<#rt>
${taxReportDetail.baseEImpuesto4.base4?split(".")[1]}<#rt>

</PRUEBALiquidación (3) - Regimen General - IVA Devengado - Régimen general - Base imponible [01]>

<PRUEBALiquidación (3) - Regimen General - IVA Devengado - Régimen general - Tipo % [02]>
${"00400"?left_pad(5, "0")}<#rt>

</PRUEBALiquidación (3) - Regimen General - IVA Devengado - Régimen general - Tipo % [02]>

<PRUEBALiquidación (3) - Regimen General - IVA Devengado - Régimen general - Cuota [03]>

${taxReportDetail.baseEImpuesto4.impuesto4?split(".")[0]?replace("-","")?left_pad(15,"0")}<#rt>
${taxReportDetail.baseEImpuesto4.impuesto4?split(".")[1]}<#rt>

</PRUEBALiquidación (3) - Regimen General - IVA Devengado - Régimen general - Cuota [03]>

<#else>
<#--  [01]  -->
${""?left_pad(17,"0")}<#rt>
<#--  [02]  -->
${"00400"?left_pad(5,"0")}<#rt>
<#--  [03]  -->
${""?left_pad(17,"0")}<#rt>
</#if>
</PRUEBA[01][02][03]>


<PRUEBA[153][154][155]>
<#if taxReportDetail.baseEImpuesto153.existeTasa == "true">

<PRUEBALiquidación (3) - Regimen General - IVA Devengado - Régimen general - Base imponible [153]>
${taxReportDetail.baseEImpuesto153.base153?split(".")[0]?replace("-","")?left_pad(15,"0")}<#rt>
${taxReportDetail.baseEImpuesto153.base153?split(".")[1]}<#rt>

</PRUEBALiquidación (3) - Regimen General - IVA Devengado - Régimen general - Base imponible [153]>

<PRUEBALiquidación (3) - Regimen General - IVA Devengado - Régimen general - Tipo % [154]>
${"00500"?left_pad(5,"0")}<#rt>

</PRUEBALiquidación (3) - Regimen General - IVA Devengado - Régimen general - Tipo % [154]>

<PRUEBALiquidación (3) - Regimen General - IVA Devengado - Régimen general - Cuota [155]>
${taxReportDetail.baseEImpuesto153.impuesto155?split(".")[0]?replace("-","")?left_pad(15,"0")}<#rt>
${taxReportDetail.baseEImpuesto153.impuesto155?split(".")[1]}<#rt>

</PRUEBALiquidación (3) - Regimen General - IVA Devengado - Régimen general - Cuota [155]>

<#else>
<#--  [153]  -->
${""?left_pad(17,"0")}<#rt>
<#--  [154]  -->
${"00500"?left_pad(5,"0")}<#rt>
<#--  [155]  -->
${""?left_pad(17,"0")}<#rt>
</#if>

</PRUEBA[153][154][155]>


<PRUEBA[04][05][06]>
<#if taxReportDetail.baseEImpuesto10.existeTasa == "true">
<PRUEBALiquidación (3) - Regimen General - IVA Devengado - Régimen general - Base imponible [04]>

${taxReportDetail.baseEImpuesto10.base10?split(".")[0]?replace("-","")?left_pad(15,"0")}<#rt>
${taxReportDetail.baseEImpuesto10.base10?split(".")[1]}<#rt>

</PRUEBALiquidación (3) - Regimen General - IVA Devengado - Régimen general - Base imponible [04]>

<PRUEBALiquidación (3) - Regimen General - IVA Devengado - Régimen general - Tipo % [05]>

${"01000"?left_pad(5, "0")}<#rt>

</PRUEBALiquidación (3) - Regimen General - IVA Devengado - Régimen general - Tipo % [05]>

<PRUEBALiquidación (3) - Regimen General - IVA Devengado - Régimen general - Cuota [06]>

${taxReportDetail.baseEImpuesto10.impuesto10?split(".")[0]?replace("-","")?left_pad(15,"0")}<#rt>
${taxReportDetail.baseEImpuesto10.impuesto10?split(".")[1]}<#rt>

</PRUEBALiquidación (3) - Regimen General - IVA Devengado - Régimen general - Cuota [06]>

<#else>
<#--  [04]  -->
${""?left_pad(17,"0")}<#rt>
<#--  [05]  -->
${"01000"?left_pad(5,"0")}<#rt>
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

${"02100"?left_pad(5, "0")}<#rt>

</PRUEBALiquidación (3) - Regimen General - IVA Devengado - Régimen general - Tipo % [08]>

<PRUEBALiquidación (3) - Regimen General - IVA Devengado - Régimen general - Cuota [09]>

${taxReportDetail.baseEImpuesto21.impuesto21?split(".")[0]?replace("-","")?left_pad(15,"0")}<#rt>
${taxReportDetail.baseEImpuesto21.impuesto21?split(".")[1]}<#rt>

</PRUEBALiquidación (3) - Regimen General - IVA Devengado - Régimen general - Cuota [09]>
<#else>
<#--  [07]  -->
${""?left_pad(17,"0")}<#rt>
<#--  [08]  -->
${"02100"?left_pad(5,"0")}<#rt>
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


<PRUEBA[156][157][158]>
<#if taxReportDetail.baseEImpuesto156.existeTasa == "true">
<PRUEBALiquidación (3) - Regimen General - IVA Devengado - Recargo equivalencia - Base imponible [156]>
${taxReportDetail.baseEImpuesto156.base156?split(".")[0]?replace("-","")?left_pad(15,"0")}<#rt>
${taxReportDetail.baseEImpuesto156.base156?split(".")[1]}<#rt>

</PRUEBALiquidación (3) - Regimen General - IVA Devengado - Recargo equivalencia - Base imponible [156]>

<PRUEBALiquidación (3) - Regimen General - IVA Devengado - Recargo equivalencia - Tipo % [157]>
${"00175"?left_pad(5,"0")}<#rt>

</PRUEBALiquidación (3) - Regimen General - IVA Devengado - Recargo equivalencia - Tipo % [157]>

<PRUEBALiquidación (3) - Regimen General - IVA Devengado - Recargo equivalencia - Cuota [158]>
${taxReportDetail.baseEImpuesto156.impuesto158?split(".")[0]?replace("-","")?left_pad(15,"0")}<#rt>
${taxReportDetail.baseEImpuesto156.impuesto158?split(".")[1]}<#rt>

</PRUEBALiquidación (3) - Regimen General - IVA Devengado - Recargo equivalencia - Cuota [158]>
<#else>
<#--  [156]  -->
${""?left_pad(17,"0")}<#rt>
<#--  [157]  -->
${"00175"?left_pad(5,"0")}<#rt>
<#--  [158]  -->
${""?left_pad(17,"0")}<#rt>
</#if>
</PRUEBA[156][157][158]>


<PRUEBA[16][17][18]>
<#if taxReportDetail.baseEImpuestoRE.existeTasa == "true">

<PRUEBALiquidación (3) - Regimen General - IVA Devengado - Recargo equivalencia - Base imponible [16]>

${taxReportDetail.baseEImpuestoRE.baseRE?split(".")[0]?replace("-","")?left_pad(15,"0")}<#rt>
${taxReportDetail.baseEImpuestoRE.baseRE?split(".")[1]}<#rt>

</PRUEBALiquidación (3) - Regimen General - IVA Devengado - Recargo equivalencia - Base imponible [16]>

<PRUEBALiquidación (3) - Regimen General - IVA Devengado - Recargo equivalencia - Tipo % [17]>

${"00050"?left_pad(5,"0")}<#rt>

</PRUEBALiquidación (3) - Regimen General - IVA Devengado - Recargo equivalencia - Tipo % [17]>

<PRUEBALiquidación (3) - Regimen General - IVA Devengado - Recargo equivalencia - Cuota [18]>

${taxReportDetail.baseEImpuestoRE.impuestoRE5_2?split(".")[0]?replace("-","")?left_pad(15,"0")}<#rt>
${taxReportDetail.baseEImpuestoRE.impuestoRE5_2?split(".")[1]}<#rt>

</PRUEBALiquidación (3) - Regimen General - IVA Devengado - Recargo equivalencia - Cuota [18]>
<#else>
<#--  [16]  -->
${""?left_pad(17,"0")}<#rt>

<#--  [17]  -->
${"00050"?left_pad(5,"0")}<#rt>
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
${"00520"?left_pad(5,"0")}
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

<PRUEBA[32][33]>
<#--  camposFormulario.ivaDiferido 1 es true 2 false  -->
<#if  taxReportDetail.baseEImpuestoBienes.existeTasa == "true" && camposFormulario.ivaDiferido == "2">
<PRUEBALiquidación (3) - Regimen General - IVA Deducible - Por cuotas soportadas en las importaciones de bienes corrientes - Base [32]>
${taxReportDetail.baseEImpuestoBienes.baseBienes?split(".")[0]?replace("-","")?left_pad(15,"0")}<#rt>
${taxReportDetail.baseEImpuestoBienes.baseBienes?split(".")[1]}<#rt>

</PRUEBALiquidación (3) - Regimen General - IVA Deducible - Por cuotas soportadas en las importaciones de bienes corrientes - Base [32]>
<PRUEBALiquidación (3) - Regimen General - IVA Deducible - Por cuotas soportadas en las importaciones de bienes corrientes - Cuota [33]>
${taxReportDetail.baseEImpuestoBienes.impuestoBienes?split(".")[0]?replace("-","")?left_pad(15,"0")}<#rt>
${taxReportDetail.baseEImpuestoBienes.impuestoBienes?split(".")[1]}<#rt>

</PRUEBALiquidación (3) - Regimen General - IVA Deducible - Por cuotas soportadas en las importaciones de bienes corrientes - Cuota [33]>
<#else>
<#--  [32]  -->
${""?left_pad(17,"0")}<#rt>
<#--  [33]  -->
${""?left_pad(17,"0")}<#rt>
</#if>

</PRUEBA[32][33]>

<PRUEBA[34][35]>
<#if  taxReportDetail.baseEImpuestoImportacionesBI.existeTasa == "true">
<PRUEBALiquidación (3) - Regimen General - IVA Deducible - Por cuotas soportadas en las importaciones de bienes de inversión - Base [34]>
${taxReportDetail.baseEImpuestoImportacionesBI.importacionesBIBase?split(".")[0]?replace("-","")?left_pad(15,"0")}<#rt>
${taxReportDetail.baseEImpuestoImportacionesBI.importacionesBIBase?split(".")[1]}<#rt>

</PRUEBALiquidación (3) - Regimen General - IVA Deducible - Por cuotas soportadas en las importaciones de bienes de inversión - Base [34]>
<PRUEBALiquidación (3) - Regimen General - IVA Deducible - Por cuotas soportadas en las importaciones de bienes de inversión - Cuota [35]>
${taxReportDetail.baseEImpuestoImportacionesBI.importacionesBIImp?split(".")[0]?replace("-","")?left_pad(15,"0")}<#rt>
${taxReportDetail.baseEImpuestoImportacionesBI.importacionesBIImp?split(".")[1]}<#rt>

</PRUEBALiquidación (3) - Regimen General - IVA Deducible - Por cuotas soportadas en las importaciones de bienes de inversión - Cuota [35]>
<#else>
<#--  [34]  -->
${""?left_pad(17,"0")}<#rt>
<#--  [35]  -->
${""?left_pad(17,"0")}<#rt>
</#if>
</PRUEBA[34][35]>

<PRUEBA[36][37]>
<#--  ! se esta reutilizando de [10][11] todos sus valores, esto hace v1  -->
<#if  taxReportDetail.baseEImpuestoAdq.existeTasa == "true">
<PRUEBALiquidación (3) - Regimen General - IVA Deducible - En adquisiciones intracomunitarias de bienes y servicios corrientes - Base [36]>
${taxReportDetail.baseEImpuestoAdq.baseAdq?split(".")[0]?replace("-","")?left_pad(15,"0")}<#rt>
${taxReportDetail.baseEImpuestoAdq.baseAdq?split(".")[1]}<#rt>

</PRUEBALiquidación (3) - Regimen General - IVA Deducible - En adquisiciones intracomunitarias de bienes y servicios corrientes - Base [36]>
<PRUEBALiquidación (3) - Regimen General - IVA Deducible - En adquisiciones intracomunitarias de bienes y servicios corrientes - Cuota [37]>
${taxReportDetail.baseEImpuestoAdq.impuestoAdq?split(".")[0]?replace("-","")?left_pad(15,"0")}<#rt>
${taxReportDetail.baseEImpuestoAdq.impuestoAdq?split(".")[1]}<#rt>

</PRUEBALiquidación (3) - Regimen General - IVA Deducible - En adquisiciones intracomunitarias de bienes y servicios corrientes - Cuota [37]>
<#else>
<#--  [36]  -->
${""?left_pad(17,"0")}<#rt>
<#--  [37]  -->
${""?left_pad(17,"0")}<#rt>
</#if>
</PRUEBA[36][37]>

<PRUEBA[38][39]>
<#if  taxReportDetail.baseEImpuestoIntracomunitariasBI.existeTasa == "true" >
<PRUEBALiquidación (3) - Regimen General - IVA Deducible - En adquisiciones intracomunitarias de bienes de inversión - Base [38]>
${taxReportDetail.baseEImpuestoIntracomunitariasBI.intracomunitariasBIBase?split(".")[0]?replace("-","")?left_pad(15,"0")}<#rt>
${taxReportDetail.baseEImpuestoIntracomunitariasBI.intracomunitariasBIBase?split(".")[1]}<#rt>

</PRUEBALiquidación (3) - Regimen General - IVA Deducible - En adquisiciones intracomunitarias de bienes de inversión - Base [38]>
<PRUEBALiquidación (3) - Regimen General - IVA Deducible - En adquisiciones intracomunitarias de bienes de inversión - Cuota [39]>
${taxReportDetail.baseEImpuestoIntracomunitariasBI.intracomunitariasBIImp?split(".")[0]?replace("-","")?left_pad(15,"0")}<#rt>
${taxReportDetail.baseEImpuestoIntracomunitariasBI.intracomunitariasBIImp?split(".")[1]}<#rt>

</PRUEBALiquidación (3) - Regimen General - IVA Deducible - En adquisiciones intracomunitarias de bienes de inversión - Cuota [39]>

<#else>
<#--  [38]  -->
${""?left_pad(17,"0")}<#rt>
<#--  [39]  -->
${""?left_pad(17,"0")}<#rt>
</#if>
</PRUEBA[38][39]>

<PRUEBA[40][41]>
<#if  taxReportDetail.baseEImpuestoRecDed.existeTasa == "true" >

<PRUEBALiquidación (3) - Regimen General - IVA Deducible - Rectificación de deducciones - Base [40]>
${taxReportDetail.baseEImpuestoRecDed.baseRecDed?split(".")[0]?replace("-","")?left_pad(15,"0")}<#rt>
${taxReportDetail.baseEImpuestoRecDed.baseRecDed?split(".")[1]}<#rt>

</PRUEBALiquidación (3) - Regimen General - IVA Deducible - Rectificación de deducciones - Base [40]>
<PRUEBALiquidación (3) - Regimen General - IVA Deducible - Rectificación de deducciones - Cuota [41]>
${taxReportDetail.baseEImpuestoRecDed.impRecDed?split(".")[0]?replace("-","")?left_pad(15,"0")}<#rt>
${taxReportDetail.baseEImpuestoRecDed.impRecDed?split(".")[1]}<#rt>

</PRUEBALiquidación (3) - Regimen General - IVA Deducible - Rectificación de deducciones - Cuota [41]>
<#else>
<#--  [40]  -->
${""?left_pad(17,"0")}<#rt>
<#--  [41]  -->
${""?left_pad(17,"0")}<#rt>
</#if>
</PRUEBA[40][41]>

<#--  ! ESTO NO SE CALCULA, ESTA HARDCODEADO  consultar sebastian-->
<PRUEBA[42][43][44]>
ESTO APARECE HARDCODEADO
<#--  [42]  -->
${""?left_pad(17,"0")}
<#--  [43]  -->
${""?left_pad(17,"0")}
<#--  [44]  -->
${""?left_pad(17,"0")}
</PRUEBA[42][43][44]>

<PRUEBA[45]Liquidación (3) - Regimen General - IVA Deducible - Total a deducir ( [29] + [31] + [33] + [35] + [37] + [39] + [41] + [42] + [43] + [44] ) - Cuota [45]>
<#if taxReportDetail.totalDeducir?number < 0>
N${taxReportDetail.totalDeducir?split(".")[0]?replace("-","")?left_pad(14,"0")}<#rt>
<#else>
${taxReportDetail.totalDeducir?split(".")[0]?replace("-","")?left_pad(15,"0")}<#rt>
</#if>
${taxReportDetail.totalDeducir?split(".")[1]}<#rt>

</PRUEBA[45]Liquidación (3) - Regimen General - IVA Deducible - Total a deducir ( [29] + [31] + [33] + [35] + [37] + [39] + [41] + [42] + [43] + [44] ) - Cuota [45]>

<PRUEBA[46]Liquidación (3) - Regimen General - IVA Deducible - Resultado régimen general ( [27] - [45] ) - Cuota [46]>
<#if taxReportDetail.resultadoRegimenGeneral?number < 0>
N${taxReportDetail.resultadoRegimenGeneral?split(".")[0]?replace("-","")?left_pad(14,"0")}<#rt>
<#else>
${taxReportDetail.resultadoRegimenGeneral?split(".")[0]?replace("-","")?left_pad(15,"0")}<#rt>
</#if>
${taxReportDetail.resultadoRegimenGeneral?split(".")[1]}<#rt>

</PRUEBA[46]Liquidación (3) - Regimen General - IVA Deducible - Resultado régimen general ( [27] - [45] ) - Cuota [46]>
<#--  * Termina IVA DEDUCIBLE  -->
<PRUEBA-RESERVADO-AEAT>
${""?left_pad(600," ")}<#rt>
${""?left_pad(13," ")}<#rt>

</PRUEBA-RESERVADO-AEAT>

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