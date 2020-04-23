const AWS = require('aws-sdk');
AWS.config.region = 'eu-west-2';
const dynamoDB = new AWS.DynamoDB();

/**
 * @param {string} s1
 * @param {string} s2
 * @return {number}
 */
const cmp = (s1, s2) => {
  const short = s1.length >= s2.length ? s2 : s1;
  const long = s1.length >= s2.length ? s1 : s2;
  let count = 0;
  for (let i = 0; i < short.length; i++) {
    if (short[i] === long[i]) {
      count++;
    }
  }
  return count / long.length;
};

const argMax = (xs, f) => {
  let best = xs[0];
  let bestScore = f(best);
  for (let i = 1; i < xs.length; i++) {
    const newBest = xs[i];
    const newScore = f(newBest);
    if (newScore > bestScore) {
      bestScore = newScore;
      best = newBest;
    }
  }
  return best;
};

const tryDefine = async (word = '') => {
  console.log(`defining ${word}`);
  const capitalised = word.substr(0, 1).toUpperCase() +
    word.substr(1).toLowerCase();

  let words = [
    word,
    capitalised,
    capitalised.replace(/s$/, ''),
    capitalised.replace(/es$/, ''),
    capitalised.replace(/ing$/, ''),
    capitalised.replace(/ing$/, 'e'),
    capitalised.replace(/ed$/, ''),
    capitalised.replace(/ed$/, 'e'),
    capitalised.replace(/ly$/, ''),
  ];

  words = words.concat(words.map(w => w.toLowerCase()));

  if (word.length <= 4) {
    words = words.concat(words.map(w => w.toUpperCase()));
  }

  words = Array.from(new Set([...words]));

  const res = await dynamoDB.batchGetItem(
    {RequestItems: {Definitions: {Keys: words.map(w => ({word: {S: w}}))}}}).
    promise();
  if (res.Responses.Definitions.length > 0) {
    const definition = argMax(res.Responses.Definitions,
      d => cmp(word, d.word.S)).definition.S;
    console.log(`found definition ${definition}`);
    return definition;
  }
  throw new Error(`failed to find a definition for "${word}"`);
};

exports.handler = async (event, context) => {
  const headers = {
    'Content-Type': 'text/plain',
  };
  try {
    return ({
      statusCode: 200,
      headers,
      body: await tryDefine(event.pathParameters.word),
    });
  } catch (e) {
    console.error(JSON.stringify(e));
    return ({
      statusCode: 404,
      headers,
      body: e.message,
    });
  }
};
