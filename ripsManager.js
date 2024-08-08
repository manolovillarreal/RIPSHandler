function characterizeFile(fileName) {
  const code = fileName.split(".")[0];
  const name = fileName.slice(0, 2);
  const desc = RipsDescription(name);
  const headers = RipsHeaders(name);
  const fields = headers.length;

  return {
    name,
    code,
    desc,
    headers,
    fields,
  };
}
function RipsDescription(name) {
  switch (name) {
    case "AC":
      return "Consultas";
    case "AF":
      return "Facturas";
    case "AH":
      return "Hospitalizacion";
    case "AM":
      return "Medicamentos";
    case "AP":
      return "Procedimientos";
    case "AT":
      return "Otros Servicios";
    case "US":
      return "Usuarios";
    case "CT":
      return "Control";
    default:
      return "Sin definir";
  }
}
function RipsHeaders(name) {
  switch (name) {
    case "AC":
      return [
        "Factura",
        "CodPrestador",
        "TipoId",
        "NumId",
        "Fecha",
        "NumAutorizacion",
        "Codigo",
        "Finalidad",
        "CausaExterna",
        "DxPrincipal",
        "DxRelacionado",
        "CodDxRel2",
        "CodDxRel3",
        "TipoDx",
        "Valor",
        "Copago",
        "ValorNeto",
      ];
    case "AF":
      return [
        "CodPrestador",
        "RazonSocial",
        "TipoId",
        "NumId",
        "Factura",
        "Fecha",
        "FechaInicio",
        "FechaFinal",
        "CodAdmin",
        "NombreAdmin",
        "Contrato",
        "Plan",
        "NumPoliza",
        "Copago",
        "Comision",
        "Descuentos",
        "ValorNeto",
      ];
    case "AH":
      return [
        "Factura",
        "CodPrestador",
        "TipoId",
        "NumId",
        "viaIngreso",
        "Fecha",
        "Hora",
        "NumAutorizacion",
        "CausaExterna",
        "DxPrincipal",
        "DxEgreso",
        "DxRelacionado",
        "CodDxRel2",
        "CodDxRel3",
        "DxComplicacion",
        "EstadoSalida",
        "DxMuerta",
        "FechaEgreso",
        "HoraEgreso",
      ];
    case "AM":
      return [
        "Factura",
        "CodPrestador",
        "TipoId",
        "NumId",
        "NumAutorizacion",
        "Codigo",
        "TipoMedicamento",
        "Nombre",
        "FormaFarmaceutica",
        "Concentracion",
        "UnidadMedida",
        "Unidades",
        "ValorUnitario",
        "ValorTotal",
      ];
    case "AP":
      return [
        "Factura",
        "CodPrestador",
        "TipoId",
        "NumId",
        "Fecha",
        "NumAutorizacion",
        "Codigo",
        "Ambito",
        "Finalidad",
        "Personal",
        "DxPrincipal",
        "DxRelacionado",
        "Complicacion",
        "ActoQx",
        "ValorNeto",
      ];
    case "AT":
      return [
        "Factura",
        "CodPrestador",
        "TipoId",
        "NumId",
        "NumAutorizacion",
        "TipoServicio",
        "Codigo",
        "Nombre",
        "Cantidad",
        "ValorUnitario",
        "ValorTotal",
      ];
    case "US":
      return [
        "TipoId",
        "NumId",
        "CodAdmin",
        "TipoUsuario",
        "PrimerApellido",
        "SegundoApellido",
        "PrimerNombre",
        "SegundoNombre",
        "Edad",
        "MedidaEdad",
        "Sexo",
        "CodDepto",
        "CodMunicipio",
        "ZonaResidencia",
      ];
    case "CT":
      return ["CodPrestador", "Fecha", "CodigoArchivo", "TotalRegistros"];
    default:
      return ["Sin definir"];
  }
}

function RequiredFields(name) {
  switch (name) {
    case "AC":
      return [
        "Factura",
        "CodPrestador",
        "TipoId",
        "NumId",
        "Fecha",
        "",
        "Codigo",
        "Finalidad",
        "CausaExterna",
        "DxPrincipal",
        "",
        "",
        "",
        "TipoDx",
        "Valor",
        "Copago",
        "ValorNeto",
      ];
    case "AF":
      return [
        "CodPrestador",
        "RazonSocial",
        "TipoId",
        "NumId",
        "Factura",
        "Fecha",
        "FechaInicio",
        "FechaFinal",
        "CodAdmin",
        "NombreAdmin",
        "Contrato",
        "Plan",
        "Copago",
        "Comision",
        "Descuentos",
        "ValorNeto",
      ];
    case "AH":
      return [
        "Factura",
        "CodPrestador",
        "TipoId",
        "NumId",
        "viaIngreso",
        "Fecha",
        "Hora",
        "NumAutorizacion",
        "CausaExterna",
        "DxPrincipal",
        "DxEgreso",
        "DxComplicacion",
        "EstadoSalida",
        "FechaEgreso",
        "HoraEgreso",
      ];
    case "AM":
      return [
        "Factura",
        "CodPrestador",
        "TipoId",
        "NumId",
        "Codigo",
        "TipoMedicamento",
        "Nombre",
        "FormaFarmaceutica",
        "Concentracion",
        "UnidadMedida",
        "Unidades",
        "ValorUnitario",
        "ValorTotal",
      ];
    case "AP":
      return [
        "Factura",
        "CodPrestador",
        "TipoId",
        "NumId",
        "Fecha",
        "Codigo",
        "Ambito",
        "Finalidad",
        "Personal",
        "DxPrincipal",
        "ValorNeto",
      ];
    case "AT":
      return [
        "Factura",
        "CodPrestador",
        "TipoId",
        "NumId",
        "TipoServicio",
        "Codigo",
        "Nombre",
        "Cantidad",
        "ValorUnitario",
        "ValorTotal",
      ];
    case "US":
      return [
        "TipoId",
        "NumId",
        "CodAdmin",
        "TipoUsuario",
        "PrimerApellido",
        "PrimerNombre",
        "Edad",
        "MedidaEdad",
        "Sexo",
        "CodDepto",
        "CodMunicipio",
        "ZonaResidencia",
      ];
    case "CT":
      return ["CodPrestador", "Fecha", "CodigoArchivo", "TotalRegistros"];
    default:
      return [];
  }
}

function extractFields({ name, fields }, data) {
  const headers = RipsHeaders(name);
  console.log(headers);
  console.log(name);
  console.log(fields);

  const fieldsList = [];
  for (let i = 0; i < data.length; i++) {
    const item = data[i];

    // console.log(item);
    if (item.length != fields) {
      let msg = `Error de parseo: se esperaban ${fields} campos y se encontraron  ${
        item.length
      } - LINEA ${i + 1}`;
      fieldsList.push({ error: true, msg: msg, line: i + 1 });
      // console.log(msg);
      continue;
    }

    let obj = {};

    for (let j = 0; j < item.length; j++) {
      const field = item[j];

      obj[headers[j]] = field;
    }
    fieldsList.push(obj);
  }

  return fieldsList;
}

export const RIPS = {
  characterizeFile,
  RipsDescription,
  RipsHeaders,
  extractFields,
  RequiredFields,
};
