const { SentimentAnalyzer } = require('natural');

const sentiment = (tokens = [], sentimentOpts = {}) => {
  const { vocabulary = 'afinn', language = 'English' } = sentimentOpts;
  return new SentimentAnalyzer(language, null, vocabulary).getSentiment(tokens);
};

exports.handler = async (event, context) => {
  const { tokens, vocabulary } = JSON.parse(event.body);
  return {
    body: sentiment(tokens, { vocabulary }).toString(),
    headers: {
      'Content-Type': 'application/json',
    },
    statusCode: 200,
  };
};
