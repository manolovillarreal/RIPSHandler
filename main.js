import {
  printFileList,
  renderDataContainer,
  renderOutputData,
  showValidationOptions,
  setErrorAlert,
} from "./UIManager.js";
import { RIPS } from "./ripsManager.js";
import { onFileInputChange, onDropFiles, loadRipsData } from "./fileHandler.js";
import {
  getCUPSRipsTable,
  getSOAT_CUPS,
  getCodigoEAPByNit,
} from "./Api/RefsTables.js";
//#region  Get DOM Elements

const inputFileRIPS = document.getElementById("inputFileRIPS");
const fileListDOM = document.getElementById("fileList");
const dropZone = document.getElementById("drop_zone");
const toggleButtons = document.getElementsByClassName("btnToggleView");
console.log(toggleButtons);

//#endregion

let ripsFiles = [];
let ripsData = {};
let errors = [];
initDOMEvents();

function initDOMEvents() {
  inputFileRIPS.onchange = fileInputChangeHandler;

  dropZone.ondrop = dropHandler;
  dropZone.ondragover = dragOverHandler;

  for (const btn of toggleButtons) {
    btn.onclick = toggleClickHanlder;
  }
  document.querySelector("#btnloadFiles").onclick = loadFilesHandler;
  document.querySelector("#validate_Btn").onclick = validarRips;
  document.querySelector("#generateFileBtn").onclick = generarArchivoPlano;
}

function fileInputChangeHandler() {
  const files = onFileInputChange(this);
  setRipsFiles(files);
}
function dropHandler(ev) {
  ev.preventDefault();
  const files = onDropFiles(ev);
  setRipsFiles(files);
  setShowBtnLoadFiles(true);
  onRemoveDragData(ev);
}

function dragOverHandler(ev) {
  console.log("File(s) in drop zone");
  ev.preventDefault();
}
function loadFilesHandler() {
  ripsData = {};
  for (const rips of ripsFiles) {
    loadRipsData(rips, (err, data) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log("callback");

      ripsData[rips.name] = RIPS.extractFields(rips, data);
      console.log(ripsData);
      if (Object.keys(ripsData).length == ripsFiles.length) {
        renderDataContainer(ripsData);
        setShowBtnLoadFiles(false);
        showValidationOptions();
      }
    });
  }
}

function setShowBtnLoadFiles(show) {
  const btn = document.querySelector("#btnloadFiles");
  if (show) {
    if (btn.classList.contains("hidden")) {
      btn.classList.remove("hidden");
    }
  } else {
    if (!btn.classList.contains("hidden")) {
      btn.classList.add("hidden");
    }
  }
}

function toggleClickHanlder() {
  for (const btn of toggleButtons) {
    if (btn.classList.contains("hidden")) btn.classList.remove("hidden");
    else btn.classList.add("hidden");
  }
}
function onRemoveDragData(ev) {
  if (ev.dataTransfer.items) {
    // Use DataTransferItemList interface to remove the drag data
    ev.dataTransfer.items.clear();
  } else {
    // Use DataTransfer interface to remove the drag data
    ev.dataTransfer.clearData();
  }
}

function setRipsFiles(files) {
  ripsData = {};
  ripsFiles = [];
  for (const file of files) {
    ripsFiles.push({ ...RIPS.characterizeFile(file.name), file });
  }
  ripsFiles = ripsFiles.sort((a, b) =>
    a.name > b.name ? 1 : b.name > a.name ? -1 : 0
  );
  printFileList(fileListDOM, ripsFiles);
}

const removeAccents = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

async function validarRips() {
  const results = {};
  for (const { fileName, fixes } of pisisSuit.validations) {
    console.log(fileName + ": ");
    if (!ripsData[fileName]) {
      errors.push("No se cargo el archivo " + fileName);
      continue;
    }
    results[fileName] = [];
    for (const fix of fixes) {
      console.log(fix.name);
      const result = await fix.run(fileName);
      results[fileName].push(result);
    }
  }
  renderDataContainer(ripsData);
  renderOutputData(results);
  setErrorAlert(errors);
}

const NormalizarCaracteres = {
  name: "Normalizar Caracteres",
  run: async (file) => {
    const data = ripsData[file];

    for (const line of data) {
      for (const field in line) {
        line[field] = removeAccents(line[field]);
      }
    }

    return { ok: true, msg: "Se normalizaron los caracteres" };
  },
};

const EliminarEspacios = {
  name: "Eliminar Espacios",
  run: async (file) => {
    const data = ripsData[file];

    for (const line of data) {
      for (const field in line) {
        line[field] = line[field].trim();
      }
    }
    return { ok: true, msg: "Se Eliminaron los espacios" };
  },
};

const NormalizarCUMS = {
  name: "Normalizar CUMS",
  run: async (file) => {
    const data = ripsData[file];
    const resp = { details: [], errors: [] };
    let cont = 0;

    for (let i = 0; i < data.length; i++) {
      const line = data[i];
      let rawCUM = line["Codigo"];

      if (!rawCUM) {
        resp.errors.push({
          error: true,
          msg: `El campo CUM está vacío en la línea ${i + 1}`,
          line: i + 1,
        });
        continue;
      }

      let CUM = rawCUM.split("-");
      if (CUM.length === 2) {
        CUM[0] = Number(CUM[0]);
        CUM[1] = Number(CUM[1]);

        line["Codigo"] = CUM[0] + "-" + CUM[1];

        if (line["Codigo"] !== rawCUM) {
          cont++;
          resp.details.push({
            msg: `Se normalizó el CUM de ${rawCUM} a ${
              line["Codigo"]
            } en la línea ${i + 1}`,
          });
        }
      }
    }

    resp.ok = resp.errors.length === 0;
    resp.msg =
      resp.errors.length > 0
        ? `Se encontraron ${resp.errors.length} errores`
        : `Se normalizaron ${cont} CUM`;
    return resp;
  },
};

// const ValidarCampos = {
//   name: "Verificar Campos",
//   params: [...RIPS.RequiredFields],
//   run(fileName) {
//     return VerificarCampos(fileName, params);
//   },
// };
// const VerificarCampos = (file, fields) => {
//   const data = ripsData[file];
//   const errors = [];
//   for (let i = 0; i < data.length; i++) {
//     const line = data[i];
//     for (const field of fields) {
//       !line[field] || line[field] == "";
//       errors.push({ line: i, msg: `El campo ${field} es requerido`, field });
//     }
//   }
//   return errors;
// };
const CruzarCUPS = {
  name: "CUPS RIPS",
  field: "codido",
  run: async (file) => {
    const CUPSRips = await getCUPSRipsTable();
    const SOAT_CUPS = await getSOAT_CUPS();
    const data = ripsData[file];
    const resp = { details: [], errors: [] };
    let cont = 0;
    for (let i = 0; i < data.length; i++) {
      const ripsLine = data[i];
      const codigo = ripsLine.Codigo;
      if (!CUPSRips.some((cup) => cup.Codigo == codigo)) {
        const reemplazo = SOAT_CUPS.find((proc) => proc.SOAT == codigo);
        if (reemplazo) {
          ripsLine.Codigo = reemplazo.CUP;
          resp.details.push({
            msg: `se reemplazo el codigo ${codigo} por ${reemplazo}`,
          });
        } else {
          resp.errors.push({
            error: true,
            msg: `No se encontro el ${codigo} en la tabla de referencia`,
            line: i + 1,
          });
        }
      }
    }

    resp.ok = true;
    resp.msg = `Se reemplazaron ${resp.details.length} Codigos`;
    return resp;
  },
};

const ValidarFinalidadConsulta = {
  name: "Validar Finalidad de Consulta",
  run: async (file) => {
    const data = ripsData[file];
    const resp = { details: [], errors: [] };
    let cont = 0;

    for (let i = 0; i < data.length; i++) {
      const ripsLine = data[i];
      const Finalidad = ripsLine.Finalidad;
      const cie10 = ripsLine.DxPrincipal;
      if (Finalidad === "10") {
        if (cie10.startsWith("Z")) {
          ripsLine.Finalidad = "07";
          resp.details.push({
            msg: `Finalidad de consulta en la línea ${
              i + 1
            } cambiada de 10 a 07 debido a que CIE10 comienza con Z`,
          });
        }
      } else {
        if (!cie10.startsWith("Z")) {
          ripsLine.Finalidad = "10";
          resp.details.push({
            msg: `Finalidad de consulta en la línea ${
              i + 1
            } cambiada a 10 debido a que CIE10 no comienza con Z`,
          });
        }
      }
    }

    resp.ok = true;
    resp.msg = `Se realizaron ${resp.details.length} cambios en la Finalidad de Consulta`;
    return resp;
  },
};

const EliminarUsuariosRepetidos = {
  name: "Eliminar Usuarios Repetidos",
  run: async (file) => {
    const data = ripsData[file];
    const seenUsers = new Set();
    const resp = { details: [], errors: [] };
    const newData = [];

    for (let i = 0; i < data.length; i++) {
      const ripsLine = data[i];
      const numId = ripsLine.NumId;

      if (seenUsers.has(numId)) {
        resp.details.push({
          msg: `Usuario con NumId ${numId} en la línea ${
            i + 1
          } eliminado por estar repetido`,
        });
      } else {
        seenUsers.add(numId);
        newData.push(ripsLine);
      }
    }

    // Actualizar ripsData con el nuevo array
    ripsData[file] = newData;

    resp.ok = true;
    resp.msg = `Se eliminaron ${resp.details.length} usuarios repetidos`;
    return resp;
  },
};

const VerificarCodAdmin = {
  name: "Verificar CodAdmin",
  run: async (file) => {
    const CodigoEAPByNit = await getCodigoEAPByNit(); // Función que obtiene los datos del JSON
    let data = ripsData[file];
    const resp = { details: [], errors: [] };
    let field = "";
    let keyField = "";

    if (file === "AF") {
      field = "CodAdmin";
      keyField = "Factura";
    } else if (file === "US") {
      field = "NumId";
    }

    let newData = [];
    for (let i = 0; i < data.length; i++) {
      const ripsLine = data[i];
      const codAdmin = ripsLine.CodAdmin;

      if (!CodigoEAPByNit.some((eap) => eap.Codigo === codAdmin)) {
        resp.errors.push({
          error: true,
          msg: `El CodAdmin ${codAdmin} para ${ripsLine[field]} en la línea ${
            i + 1
          } no se encuentra en la tabla de referencia`,
          line: i + 1,
        });

        if (file === "AF") {
          const factura = ripsLine[keyField];

          // Eliminar registros en otros archivos que coincidan con el mismo campo Factura
          for (const otherFile in ripsData) {
            if (otherFile !== "US" && otherFile !== "CT" && otherFile !== "AF") {
              ripsData[otherFile] = ripsData[otherFile].filter(
                (line) => line[keyField] !== factura
              );
            }
          }
        } 
      } else {
        // Agregar el registro válido a newData
        newData.push(ripsLine);
      }
    }

    // Actualizar ripsData con los registros válidos
    ripsData[file] = newData;

    resp.ok = true;
    resp.msg = `Se verificaron ${data.length} registros. Se encontraron y se corrigeron ${resp.errors.length} errores de codigo de administradora.`;
    return resp;
  },
};


const ModificarCodigoArchivo = {
  name: "Modificar CodigoArchivo",
  run: async (file) => {
    const data = ripsData[file];
    const resp = { details: [], errors: [] };
    let cont = 0;

    // Obtener el mes anterior al actual y el año
    const currentDate = new Date();
    let month = currentDate.getMonth(); // getMonth() devuelve el mes de 0 a 11
    const year = currentDate.getFullYear();

    // Si es enero, ajustar el mes y el año
    if (month === 0) {
      month = 12;
      year -= 1;
    }

    const formattedMonth = month < 10 ? `0${month}` : `${month}`;
    const newDatePart = `${formattedMonth}${year}`;

    for (let i = 0; i < data.length; i++) {
      const ripsLine = data[i];
      const original = ripsLine.CodigoArchivo;

      // Reemplazar el código de archivo con el nuevo formato
      const match = original.match(/^([A-Z]{2})\d{6}$/);
      if (match) {
        const newCodigoArchivo = `${match[1]}${newDatePart}`;
        if (original !== newCodigoArchivo) {
          ripsLine.CodigoArchivo = newCodigoArchivo;
          cont++;
          resp.details.push({
            msg: `Se reemplazó ${original} por ${newCodigoArchivo} en la línea ${
              i + 1
            }`,
          });
        }
      } else {
        resp.errors.push({
          error: true,
          msg: `El formato del CodigoArchivo ${original} en la línea ${
            i + 1
          } no es válido`,
          line: i + 1,
        });
      }
    }

    resp.ok = true;
    resp.msg = `Se modificaron ${cont} CodigosArchivo`;

    console.log(ripsData);
    return resp;
  },
};
const CorregirEdades = {
  name: "Corregir Edades",
  run: async (file) => {
    const data = ripsData[file];
    const resp = { details: [], errors: [] };
    let cont = 0;

    for (let i = 0; i < data.length; i++) {
      const ripsLine = data[i];
      const medidaEdad = ripsLine.MedidaEdad;
      const edad = ripsLine.Edad;

      if (medidaEdad === "2" && edad === "12") {
        ripsLine.MedidaEdad = "1";
        ripsLine.Edad = "1";
        cont++;
        resp.details.push({
          msg: `Se corrigió la edad en la línea ${
            i + 1
          }: MedidaEdad cambiada a 1 y Edad cambiada a 1`,
        });
      } else if (edad === "0") {
        ripsLine.Edad = "1";
        cont++;
        resp.details.push({
          msg: `Se corrigió la edad en la línea ${i + 1}: Edad cambiada a 1`,
        });
      }
    }

    resp.ok = true;
    resp.msg = `Se corrigieron ${cont} edades de usuarios`;
    return resp;
  },
};

const ValidarTipoDocumentoSegunEdad = {
  name: "Validar Tipo de Documento Según Edad",
  run: async (file) => {
    const data = ripsData[file];
    const resp = { details: [], errors: [] };
    let cont = 0;

    const documentoValido = (tipoDocumento, edad, medidaEdad) => {
      const edadNum = parseInt(edad, 10);
      if (medidaEdad === "3") {
        // Días
        if (["PA", "NV", "MS", "RC"].includes(tipoDocumento)) {
          return tipoDocumento;
        }
        return tipoDocumento.includes("-") ? "MS" : "RC";
      } else if (medidaEdad === "2") {
        // Meses
        if (["PA", "RC", "MS"].includes(tipoDocumento)) {
          return tipoDocumento;
        }
        return tipoDocumento.includes("-") ? "MS" : "RC";
      } else if (edadNum < 7) {
        // Menor de 7 años
        if (["PA", "RC"].includes(tipoDocumento)) {
          return tipoDocumento;
        }
        return "RC";
      } else if (edadNum === 7) {
        // Igual a 7 años
        if (["PA", "TI", "RC"].includes(tipoDocumento)) {
          return tipoDocumento;
        }
        return "RC";
      } else if (edadNum > 7 && edadNum < 18) {
        // Mayor a 7 años y menor a 18 años
        if (["PA", "TI"].includes(tipoDocumento)) {
          return tipoDocumento;
        }
        return "TI";
      } else if (edadNum === 18) {
        // Igual a 18 años
        if (["PA", "TI", "CC"].includes(tipoDocumento)) {
          return tipoDocumento;
        }
        return "CC";
      } else if (edadNum > 18) {
        // Mayor a 18 años
        if (["PA", "CE", "CC"].includes(tipoDocumento)) {
          return tipoDocumento;
        }
        return "CC";
      }
      return tipoDocumento; // Retorna el tipo de documento original si no se cumple ninguna condición
    };

    // Validar y corregir en el archivo US
    for (let i = 0; i < data.length; i++) {
      const ripsLine = data[i];
      const numId = ripsLine.NumId;
      const tipoDocumento = ripsLine.TipoId;
      const edad = ripsLine.Edad;
      const medidaEdad = ripsLine.MedidaEdad;

      const tipoDocumentoCorregido = documentoValido(
        tipoDocumento,
        edad,
        medidaEdad
      );
      if (tipoDocumento !== tipoDocumentoCorregido) {
        ripsLine.TipoId = tipoDocumentoCorregido;
        cont++;
        resp.details.push({
          msg: `Se corrigió el TipoDocumento de ${tipoDocumento} a ${tipoDocumentoCorregido} para NumId ${numId} en la línea ${
            i + 1
          }`,
        });

        // Corregir en los demás archivos
        for (const archivo in ripsData) {
          if (archivo !== "CT" && archivo !== "US") {
            const archivoData = ripsData[archivo];
            for (let j = 0; j < archivoData.length; j++) {
              if (archivoData[j].NumId === numId) {
                archivoData[j].TipoId = tipoDocumentoCorregido;
              }
            }
          }
        }
      }
    }

    resp.ok = true;
    resp.msg = `Se corrigieron ${cont} TipoDocumento en el archivo US y en los demás archivos correspondientes.`;
    console.log(resp);
    return resp;
  },
};
const ValidarUnidadMedidaYConcentracion = {
  name: "Validar UnidadMedida y Concentracion",
  run: async (file) => {
    const data = ripsData[file];
    const resp = { details: [], errors: [] };
    let cont = 0;

    for (let i = 0; i < data.length; i++) {
      const ripsLine = data[i];
      const unidadMedida = ripsLine.UnidadMedida;
      const concentracion = ripsLine.Concentracion;

      if (!unidadMedida || !concentracion) {
        if (!unidadMedida) {
          resp.errors.push({
            error: true,
            msg: `UnidadMedida está vacía  para el CUM ${
              ripsLine.Codigo
            }, en la línea ${i + 1}`,
            line: i + 1,
          });
        }

        if (!concentracion) {
          resp.errors.push({
            error: true,
            msg: `Concentracion está vacía en la línea ${i + 1}`,
            line: i + 1,
          });
        }

        cont++;
      }
    }

    resp.ok = cont === 0;
    resp.msg =
      cont === 0
        ? "Todos los registros tienen UnidadMedida y Concentracion completas"
        : `Se encontraron ${cont} registros con UnidadMedida o Concentracion vacías`;
    return resp;
  },
};
const ValidarCausaExterna = {
  name: "Validar CausaExterna",
  run: async (file) => {
    const data = ripsData[file];
    const resp = { details: [], errors: [] };
    let cont = 0;

    for (let i = 0; i < data.length; i++) {
      const ripsLine = data[i];
      const causaExterna = parseInt(ripsLine.CausaExterna, 10);

      if (isNaN(causaExterna) || causaExterna > 15) {
        ripsLine.CausaExterna = "13";
        cont++;
        resp.details.push({
          msg: `Se corrigió CausaExterna en la línea ${i + 1}: CausaExterna cambiada a 13`,
        });
      }
    }

    resp.ok = true;
    resp.msg = `Se corrigieron ${cont} registros con CausaExterna mayor a 15 en el archivo ${file}`;
    return resp;
  },
};


const pisisSuit = {
  output: {
    type: "file",
    name: "RIP185RIPS@NI000892400736",
  },
  validations: [
    {
      fileName: "CT",
      fixes: [ModificarCodigoArchivo],
      tests: [],
    },
    {
      fileName: "AC",
      fixes: [CruzarCUPS, ValidarFinalidadConsulta,ValidarCausaExterna],
      tests: [],
    },
    {
      fileName: "AF",
      fixes: [EliminarEspacios, VerificarCodAdmin],
      tests: [],
    },
    {
      fileName: "AM",
      fixes: [
        NormalizarCaracteres,
        EliminarEspacios,
        NormalizarCUMS,
        ValidarUnidadMedidaYConcentracion,
      ],
      tests: [],
    },
    {
      fileName: "AP",
      fixes: [CruzarCUPS],
      tests: [],
    },
    {
      fileName: "AT",
      fixes: [NormalizarCaracteres, EliminarEspacios],
      tests: [],
    },
    {
      fileName: "US",
      fixes: [
        NormalizarCaracteres,
        EliminarEspacios,
        EliminarUsuariosRepetidos,
        CorregirEdades,
        VerificarCodAdmin,
        ValidarTipoDocumentoSegunEdad,
      ],
      tests: [],
    },
  ],
};

async function generarArchivoPlano() {
  let lines = [];

  // Obtener el último día del mes anterior al actual y el año
  const currentDate = new Date();
  console.log(currentDate);
  let month = currentDate.getMonth(); // getMonth() devuelve el mes de 0 a 11
  const year = currentDate.getFullYear();

  // Si es enero, ajustar el mes y el año
  if (month === 0) {
    month = 12;
    year -= 1;
  }

  // Obtener el último día del mes anterior
  const lastDayOfMonth = new Date(year, month, 0).getDate();
  const formattedMonth = month < 10 ? `0${month}` : `${month}`;
  const formattedDate = `${year}${formattedMonth}${lastDayOfMonth}`;
  const formattedDateWithHyphens = `${year}-${formattedMonth}-${lastDayOfMonth}`;

  // Obtener TipoId y NumId del primer registro del archivo AF
  const afData = ripsData["AF"];
  const { TipoId, NumId } = afData[0];
  const totalRegistros = Object.values(ripsData).reduce((sum, fileData) => {
    if (fileData.length && !["CT"].includes(fileData)) {
      sum += fileData.length;
    }
    return sum;
  }, 0);

  // Agregar el registro de control
  lines.push(
    `1,${TipoId},${NumId},${formattedDateWithHyphens},${totalRegistros}`
  );

  // Orden correcto de los archivos
  const orderedFiles = ["US", "AC", "AP", "AH", "AM", "AT", "AF"];
  const prefixes = { US: 2, AC: 3, AP: 4, AH: 6, AM: 8, AT: 9, AF: 10 };

  // Crear los registros de los demás archivos
  let consecutivo = 1;
  for (const fileName of orderedFiles) {
    if (fileName in ripsData) {
      const fileData = ripsData[fileName];
      const prefix = prefixes[fileName];

      for (let i = 0; i < fileData.length; i++) {
        const record = fileData[i];
        const line = `${prefix},${consecutivo},${Object.values(record).join(
          ","
        )}`;
        lines.push(line);
        consecutivo++;
      }
    }
  }

  // Convertir las líneas a un archivo plano y descargarlo
  const blob = new Blob([lines.join("\r\n")], {
    type: "text/plain;charset=utf-8",
  });
  const fileName = `RIP185RIPS${formattedDate}${TipoId}${NumId.padStart(
    12,
    "0"
  )}.txt`;
  saveAs(blob, fileName);
}

function getFilePrefix(fileName) {
  switch (fileName) {
    case "US":
      return 2;
    case "AC":
      return 3;
    case "AP":
      return 4;
    case "AH":
      return 6;
    case "AM":
      return 8;
    case "AT":
      return 9;
    case "AF":
      return 10;
    default:
      return 0;
  }
}
