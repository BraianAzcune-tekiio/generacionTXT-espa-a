<#assign codigoServ="1" />
<#assign frecuencia="1" />
<#assign literal="01/01" />
<#assign filler=""?left_pad(38) />
<#list lote.detalles as detalle>
${configDA.codigoId?left_pad(10,"0")}${detalle.tarjetaCbu?left_pad(15,"0")}${codigoServ?left_pad(5,"0")}${detalle.idCliente?left_pad(10,"0")}${frecuencia?left_pad(2,"0")}${accPeriodDate.yyyy?remove_beginning("20")}${accPeriodDate.mm?left_pad(2,"0")}${detalle.impSaldar?replace(",","")?replace(".","")?left_pad(11,"0")}${literal}${filler}
</#list>