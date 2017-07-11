const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const API_URL_CHAINS = 'https://query2.finance.yahoo.com/v7/finance/options/';
const API_URL_SYMBOL = 'https://autoc.finance.yahoo.com/autoc?query=';
const API_SYMBOL_SUFFIX = '&region=US&lang=en';

const CORS_WHITELIST = [
  'https://option-quote.herokuapp.com',
  'https://option-quote.herokuapp.com',
  'https://options-54580.firebaseapp.com',
  'http://localhost'
];
const corsOptions = {
  origin(origin, callback) {
    console.log('Cors for origin', origin);
    !origin || CORS_WHITELIST.indexOf(origin) !== -1
      ? callback(null, true)
      : callback(new Error('Not allowed by CORS'))
  }
};

const app = express();
app.set('port', (process.env.PORT || 5000));
app.use(cors(corsOptions));
app.use(express.static(__dirname + '/public'));

app.get('/', (request, response) => response.send('Works!'));
app.get('/chains', (request, response) => {
  const { symbol, date } = request.query;
  const url = `${API_URL_CHAINS}${symbol}${date ? '?date=' + date : ''}`;

  console.log('Request /chains', url);

  fetch(url)
    .then(res => res.json())
    .then(data => response.json(data.optionChain.result[0]))
    .catch(err => console.error(err));
});

app.get('/symbol', (request, response) => {
  const { query } = request.query;
  const url = `${API_URL_SYMBOL}${query}${API_SYMBOL_SUFFIX}`;

  console.log('Request /symbol', url);

  fetch(url)
    .then(res => res.json())
    .then(data => response.json(data.ResultSet))
    .catch(err => console.error(err));
});

app.listen(app.get('port'), () =>
  console.log('Node app is running on port', app.get('port')));
