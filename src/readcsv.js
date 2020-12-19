let csvToJson = require('convert-csv-to-json');
 
let fileInputName = 'Building & Door Positions.csv'; 
let fileOutputName = 'routers.json';
 
csvToJson.generateJsonFileFromCsv(fileInputName,fileOutputName);

fileInputName = 'Agent Positions.csv'; 
fileOutputName = 'agents.json';

csvToJson.generateJsonFileFromCsv(fileInputName,fileOutputName);