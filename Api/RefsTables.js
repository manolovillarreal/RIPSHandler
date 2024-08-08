export async function getCUPSRipsTable() {
  const resp = await fetch("../data/CUPSRIPS.json");
  if (resp) {
    const json = await resp.json();
    return json;
  } else {
    console.log(resp);
  }
}

export async function getSOAT_CUPS() {
  const resp = await fetch("../data/SOAT_CUPS.json");
  if (resp) {
    const json = await resp.json();
    return json;
  } else {
    console.log(resp);
  }
}

export async function getCodigoEAPByNit() {
  const resp = await fetch("../data/CodigoEAPByNit.json");
  if (resp) {
    const json = await resp.json();
    return json;
  } else {
    console.log(resp);
  }
}
