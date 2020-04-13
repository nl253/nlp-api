const tokenize = (txt = '', opts = {}) => {
  const {
    tokenizer = 'WordTokenizer',
    regex = '[a-z0-9]+([-@][a-z0-9])*(\'[a-z]+)?|[:\\&\'"@.,;!?]+',
    flags = 'i',
  } = opts;
  let tokenizerObj;
  if (tokenizer === 'OrthographyTokenizer') {
    const { OrthographyTokenizer } = require('natural');
    tokenizerObj = new OrthographyTokenizer();
  } else if (tokenizer === 'WordTokenizer') {
    const { WordTokenizer } = require('natural');
    tokenizerObj = new WordTokenizer();
  } else if (tokenizer === 'WordPunctTokenizer') {
    const { WordPunctTokenizer } = require('natural');
    tokenizerObj = new WordPunctTokenizer();
  } else if (tokenizer === 'TreebankWordTokenizer') {
    const { TreebankWordTokenizer } = require('natural');
    tokenizerObj = new TreebankWordTokenizer();
  } else if (tokenizer === 'RegexpTokenizer') {
    const { RegexpTokenizer } = require('natural');
    const tOpts = { gaps: false, pattern: new RegExp(regex, `${flags || ''}g`) };
    tokenizerObj = new RegexpTokenizer(tOpts);
  } else {
    throw new Error(`unrecognised tokenizer "${tokenizer}"`);
  }
  return tokenizerObj.tokenize(txt);
};

exports.handler = async (event, context) => {
  const {
    text,
    regex,
    flags,
    tokenizer,
  } = JSON.parse(event.body);
  return {
    body: JSON.stringify(tokenize(text, { flags, regex, tokenizer })),
    headers: {
      'Content-Type': 'application/json',
    },
    statusCode: 200,
  };
};
