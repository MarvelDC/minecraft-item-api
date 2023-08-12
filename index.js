const express = require('express');
const fs = require('fs');
const sharp = require('sharp');
const FuzzySearch = require('fuzzy-search');

const app = express();
const defaultVersion = '1.20';

app.get('/item/:itemName', (request, response) => {
  const itemName = request.params.itemName;
  if (!itemName) return response.sendStatus(404);

  const widthString = request.query.width;
  const heightString = request.query.height;
  const versionString = request.query.version;
  const fuzzySearchString = request.query.fuzzySearch;

  let width = 16;
  if (widthString) width = parseInt(widthString);

  let height = 16;
  if (heightString) height = parseInt(heightString);

  let version = null;
  switch (versionString) {
    case '1.8':
    case '1.8.7':
    case '1.8.8':
    case '1.8.9':
      version = '1.8';
      break;
    case '1.12':
    case '1.12.1':
    case '1.12.2':
      version = '1.12';
      break;
    case '1.16':
    case '1.16.1':
    case '1.16.2':
    case '1.16.5':
      version = '1.16';
      break;
    case '1.17':
    case '1.17.1':
      version = '1.17';
      break;
    case '1.18':
    case '1.18.1':
    case '1.18.2':
      version = '1.18';
      break;
    case '1.19':
    case '1.19.1':
    case '1.19.2':
    case '1.19.3':
    case '1.19.4':
      version = '1.19';
      break;
    case '1.20':
    case '1.20.1':
      version = '1.20';
    default:
      version = defaultVersion;
      break;
  }

  const jsonPath = `textures/${version}/rendered.json`;
  if (!fs.existsSync(jsonPath)) return response.sendStatus(500);

  const renderedJson = require(`./${jsonPath}`);
  const standardItemName = itemName.toUpperCase().replace(' ', '_').trim();
  let icon = (renderedJson.items.find(item => item.name === standardItemName) || {}).icon;

  if (!icon && (fuzzySearchString !== 'false' && fuzzySearchString !== '0')) {
    // fuzzy search if no exact match was found
    const fuzzySearcher = new FuzzySearch(renderedJson.items, ['name'], { sort: true });
    const result = fuzzySearcher.search(standardItemName);
    if (result && result.length) icon = result[result.length - 1]?.icon;
  }

  if (!icon) {
    // default to latest version json (defaultVersion) if not already
    const json = require(`./textures/${defaultVersion}/rendered.json`);
    icon = version !== defaultVersion ? (json.items.find(item => item.name === standardItemName) || {}).icon : null;

    if (!icon) icon = (json.items.find(item => item.name === 'STONE') || {}).icon
  }

  console.log(`[Processing: ${request.headers['x-forwarded-for'] || request.socket.remoteAddress}] version: '${version}', standardItemName: '${standardItemName}', width: '${width}', height: '${height}'`);

  const base64 = icon.split(';base64,').pop();
  const iconBuffer = Buffer.from(base64, 'base64');
  
  response.type('image/png');
  
  sharp(iconBuffer)
    .resize(width, height, { kernel: 'nearest' })
    .toFormat('png')
    .pipe(response);
});

app.listen(50001, () => {
    console.log('Listening for requests on port 50001!');
});