const inputFileRIPS = document.getElementById("inputFileRIPS");
const fileListDOM = document.getElementById("fileList");
let ripsFiles = [];
let ripsData = {};
let errors = {};
inputFileRIPS.onchange = function () {
  ripsFiles = [];
  ripsData = {};
  for (const file of this.files) {
    ripsFiles.push({ ...characterizeFile(file.name), file });
  }
  ripsFiles = ripsFiles.sort((a, b) =>
    a.name > b.name ? 1 : b.name > a.name ? -1 : 0
  );
  printFileList();
};
function printFileList() {
  fileListDOM.innerHTML = "";
  for (const { name, code, desc } of ripsFiles) {
    fileListDOM.innerHTML += `
                     <div id="${code}" class="fileRow">                    
                         ${code} - ${desc} 
                         <div class="btn-div"> 
                             <ion-icon name="close-circle-outline"  size="large"></ion-icon>
                         </div>  
                         <div class="btn-div"> 
                             <ion-icon name="reload-circle-outline" size="large"></ion-icon>  
                         </div>  
                     </div>`;
  }
}

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

function loadFiles(params) {
  ripsData = {};
  errors = {};
  for (const rips of ripsFiles) {
    const { name, file } = rips;

    Papa.parse(file, {
      encoding: "ISO-8859-1",
      complete: function (results) {
        ripsData[name] = extractFields(rips, results.data);

        checkForErrors(rips);
        printOutput(rips.name);
      },
    });
  }
}
function checkForErrors({ name, code }) {
  const _errors = ripsData[name].filter((i) => i.error);

  if (_errors.length > 0) {
    document.getElementById(code).style.color = "red";
    for (const error of _errors) {
      console.log(error);
    }
  }
}
function extractFields({ name, fields }, data) {
  const headers = RipsHeaders(name);
  const fieldsList = [];
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    if (item.length != fields) {
      let msg = `Error de parseo: se esperaban ${fields} campos y se encontraron  ${
        item.length
      } - LINEA ${i + 1}`;
      fieldsList.push({ error: true, msg: msg, line: i + 1 });
      console.log(msg);
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

function printOutput(name) {
  const rips = ripsData[name];
  const output = document.getElementById("output");
  output.innerHTML = "";
  let outputLine = "";
  for (let i = 0; i < rips.length; i++) {
    ripLine = rips[i];
    let str = i + ")";
    for (const field in ripLine) {
      str += ripLine[field] + ",";
    }
    outputLine += "<div> " + str + "</div>";
  }
  output.innerHTML += outputLine;
}

const removeAccents = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

function validarRips() {
  for (const {fileName,fixes} of pisisSuit) {
    console.log(fileName + ": ");
    for (const fix of fixes) {
      console.log(fix.name);
      fix.run(fileName);
    }
    printOutput(fileName);
  }
}

const ReemplazarTildes = {
  name: "Reemplaza Tildes",
  run(file) {
    const data = ripsData[file];

    for (const line of data) {
      for (const field in line) {
        line[field] = removeAccents(line[field]);
      }
    }
  },
};

const ElimiarEspacios = {
  name: "Eliminar Espacios",
  run(file) {
    const data = ripsData[file];

    for (const line of data) {
      for (const field in line) {
        line[field] = line[field].trim();
      }
    }
  },
};

const NormalizarCUMS = {
    name: "Normalizar CUMS",
    run(file) {
      const data = ripsData[file];  
      for (const line of data) {
        let CUM = line['Codigo'].split('-');
        if(CUM.length===2){
            CUM[0] = Number(CUM[0]);
            CUM[1] = Number(CUM[1]);

            line['Codigo'] = CUM[0]+'-'+CUM[1];
        }
      }
    }
  }

const CamposMedicamentos ={
    name: 'Verificar Campos CUM,Medida,Concentracion',
    params:['Codigo','UnidadMedida','Concentracion'],
    run(fileName){
        return VerificarCampos(fileName,params);
    }
} 
const VerificarCampos = (file,fields) => {
    const data = ripsData[file];
    const errors = [];  
    for (let i = 0; i < data.length; i++) {
        const line = data[i];
          for (const field of fields) {
              (!line[field] || line[field]=="")
                errors.push({line:i, msg:`El campo ${field} es requerido`,field});
          }
        }
    return errors;      
}


const pisisSuit = [
  {
    fileName: "AM",
    fixes: [ReemplazarTildes,ElimiarEspacios,NormalizarCUMS],
    tests:[ ]
  },
];
