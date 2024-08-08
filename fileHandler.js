export function onFileInputChange(fileInput) {
  let ripsFiles = [];
  for (const file of fileInput.files) {
    ripsFiles.push(file);
  }

  return ripsFiles;
}

export function onDropFiles(ev) {
  console.log("Fichero(s) arrastrados");
  const files = [];
  if (ev.dataTransfer.items) {
    // Usar la interfaz DataTransferItemList para acceder a el/los archivos)
    for (let i = 0; i < ev.dataTransfer.items.length; i++) {
      // Si los elementos arrastrados no son ficheros, rechazarlos
      if (ev.dataTransfer.items[i].kind === "file") {
        const file = ev.dataTransfer.items[i].getAsFile();
        files.push(file);
      }
    }
  } else {
    // Usar la interfaz DataTransfer para acceder a el/los archivos
    for (let i = 0; i < ev.dataTransfer.files.length; i++) {
      const file = ev.dataTransfer.files[i];
      files.push(file);
    }
  }

  return files;
}

export function loadRipsData(rips, callback) {
  const { file } = rips;

  Papa.parse(file, {
    encoding: "ISO-8859-1",
    complete: function (results) {
      const processedData = processRipsData(results.data);

      callback(null, processedData);
    },
  });
}

function processRipsData(data) {
  return data.map((record) => {
    const processedRecord = [];
    for (const key in record) {
      processedRecord[key] = convertSpecialChars(record[key]);
    }
    return processedRecord;
  });
}
function convertSpecialChars(str) {
  return str
    .replace(/Ã‘/g, "Ñ")
    .replace(/Ã³/g, "ó")
    .replace(/Ã¡/g, "á")
    .replace(/Ã©/g, "é")
    .replace(/Ã­/g, "í")
    .replace(/Ãº/g, "ú")
    .replace(/Ã±/g, "ñ");
}
