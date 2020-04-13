const nlp = require('compromise');

exports.handler = async (event, context) => ({
  statusCode: 200,
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(nlp(event.body).places().out('array')),
});
