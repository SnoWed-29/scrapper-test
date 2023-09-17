const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');

const url = 'https://www.mediamarkt.es/es/category/_port%C3%A1tiles-de-hasta-14-701421.html';

const titleClass = "sc-hLBbgP";

async function fetchHtml(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching HTML: ${error.message}`);
  }
}

function parseHtml(html, className) {
  const $ = cheerio.load(html);
  const elementsWithClass = $(`.${className}`).toArray();
  const data = elementsWithClass.map((element) => $(element).text().trim());
  return data;
}

function saveDataToJson(data, outputFileName) {
  const jsonData = JSON.stringify(data, null, 2);
  fs.writeFileSync(outputFileName, jsonData);
}

async function main() {
  try {
    const html = await fetchHtml(url);
    // console.log("HTML:", html); // Log the HTML content to see what you're working with
    const extractedData = parseHtml(html, titleClass)
    saveDataToJson(extractedData, 'output.json');
    console.log('Data extracted and saved into output.json');
  } catch (error) {
    console.error(error.message);
  }
}
main();
