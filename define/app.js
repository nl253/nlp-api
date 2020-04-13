const {promises: fs} = require('fs');
const {join} = require('path');

const definitions = require('./dict.json');

const tryDefine = async (word = '') => {
  console.log(`defining ${word}`);
  const normalized = word.substr(0, 1).toUpperCase() +
    word.substr(1).toLowerCase();
  const wordNotPlural = normalized.replace(/s$/, '');
  const wordNotPlural2 = normalized.replace(/es$/, '');
  const wordNotGerund = normalized.replace(/ing$/, '');
  const wordNotGerund2 = normalized.replace(/ing$/, 'e');
  const wordNotPastTense = normalized.replace(/ed$/, '');
  const wordNotPastTense2 = normalized.replace(/ed$/, 'e');
  const wordNotAdjective = normalized.replace(/ly$/, '');

  console.log('checking regular dict');

  for (const w of [
    word,
    normalized,
    wordNotPlural,
    wordNotPlural2,
    wordNotGerund,
    wordNotGerund2,
    wordNotPastTense,
    wordNotPastTense2,
    wordNotAdjective]) {
    const definition = definitions[w];
    if (definition) {
      console.log(`found definition ${JSON.stringify(definition)}`);
      return definition;
    }
  }

  console.log('checking technical dict');

  const dictTechnical = await fs.readFile(join(__dirname, 'dict-technical.txt'),
    {encoding: 'utf-8'});
  for (const w of [
    word,
    normalized,
    wordNotPlural,
    wordNotPlural2,
    wordNotGerund,
    wordNotGerund2,
    wordNotPastTense,
    wordNotPastTense2,
    wordNotAdjective]) {
    const m = dictTechnical.match(
      new RegExp(`^${w}\\n\\n\\t(.*?)\\n\\n^(?=\\S)`, 'ms'));
    if (m) {
      const definition = m[1];
      console.log(`found definition ${definition}`);
      return definition;
    }
  }

  throw new Error('failed to find a definition', 404);
};

exports.handler = async (event, context) => ({
  statusCode: 200,
  headers: {
    'Content-Type': 'text/plain',
  },
  body: await tryDefine(event.pathParameters.word),
});
