const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const API_URL = 'https://query2.finance.yahoo.com/v7/finance/options/';

const CORS_WHITELIST = [
  'https://option-quote.herokuapp.com/',
  'https://options-54580.firebaseapp.com',
  'http://localhost'
];
const corsOptions = {
  origin(origin, callback) {
    CORS_WHITELIST.indexOf(origin) !== -1
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
  fetch(`${API_URL}${symbol}${date ? '?date=' + date : ''}`)
    .then(res => response.send(res.json()));
});

app.listen(app.get('port'), () =>
  console.log('Node app is running on port', app.get('port')));
