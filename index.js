const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const Aluno = require('./Aluno');


// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly',"https://www.googleapis.com/auth/drive.file", "https://www.googleapis.com/auth/drive"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';


function auth(funcao) {
  // Load client secrets from a local file.
  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Sheets API.
    authorize(JSON.parse(content), funcao);
  });
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    client = oAuth2Client;
    callback(oAuth2Client);  
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
     callback(oAuth2Client);
    });
  });
}

const t1 = function listas(auth) {
  let alunos = [];
  const sheets = google.sheets({version: 'v4', auth});
  sheets.spreadsheets.values.get({
    spreadsheetId: '1ZwsOXkRmmOiRyHNeKQJf4yfrkuBVkkvt41k2SPI8vD0',
    range: 'A4:H27',
  },(err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const rows = res.data.values;
    rows.forEach((elem) => alunos.push(new Aluno(elem[0], elem[1], elem[2], [elem[3], elem[4], elem[5]])));
    updateListas(auth, alunos);
  });
}
function updateListas(auth, alunos) {
  let values = [];
  alunos.forEach(aluno => values.push([aluno.situacao, aluno.notaAprovacao]));
  const sheets = google.sheets({version: 'v4', auth});
  sheets.spreadsheets.values.update({
    spreadsheetId: '1ZwsOXkRmmOiRyHNeKQJf4yfrkuBVkkvt41k2SPI8vD0',
    range: 'G4:H27',
    valueInputOption: 'RAW',
    resource: {values}
  })
  console.log("ATUALIZADO COM SUCESSO !!");
}

auth(t1);
    