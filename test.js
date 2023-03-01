import {read, readFile, utils, writeFile} from "./xlsx.mjs";

(async() => {
  const url = "HistoSearch DataSet To db.xlsx";
  const data = await (await fetch(url)).arrayBuffer();
  /* data is an ArrayBuffer */
  const workbook = read(data);

  console.log(workbook);


  console.log(workbook.Sheets["Data"]);
  
  let worksheet = workbook.Sheets["Data"];

  let specimenTypes = utils.sheet_to_json(worksheet);

  console.log(specimenTypes);
})();

