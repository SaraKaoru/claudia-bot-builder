'use strict';
const prompt = require('souffleur');
const lineReply = require('./reply');
const lineParse = require('./parse');
const color = require('../console-colors');
module.exports = function lineSetup(api, bot, logError, optionalParser, optionalResponder) {
  let parser = optionalParser || lineParse;
  let responder = optionalResponder || lineReply;
  api.post('/line', request => {
    /*let message = request.body;

    let parsedMessage = parser(message);
    if (!parsedMessage){
      return Promise.resolve('ok');
    }
    return Promise.resolve(parsedMessage).then(parsedMessage => bot(parsedMessage, request))
      .then(botResponse => responder(parsedMessage, botResponse, request.env.lineAccessToken))
      .catch(logError);*/

    let arr = [].concat.apply([], request.body.events.map(e=>e));
    let lineHandle = parsedMessage => {
      if (parsedMessage){
        var receiver={};
        if (parsedMessage.replyToken) {
          receiver.receiverType='replyToken';
          receiver.to=parsedMessage.replyToken;
        }else{
          receiver.receiverType='post';
          receiver.to=parsedMessage.receivers;
        }
        return Promise.resolve(parsedMessage).then(parsedMessage => bot(parsedMessage, request))
          .then(botResponse => responder(receiver, botResponse, request.env.lineAccessToken))
          .catch(logError);
      }
      else{
        return Promise.reject('cannot parse message');
      }
    };

    return Promise.all(arr.map(message => lineHandle(parser(message))))
      .then(() => 'ok').catch(logError);

  });

  api.addPostDeployStep('line', (options, lambdaDetails, utils) => {
    return Promise.resolve()
      .then(() => {
        if (options['configure-line-bot']) {
          console.log(`\n\n${color.green}Line Message API setup${color.reset}\n`);
          console.log(`\nFollowing info is required for the setup, for more info check the documentation.\n`);
          console.log(`\nYour Line bot Request URL (POST only) is ${color.cyan}${lambdaDetails.apiUrl}/line${color.reset}\n`);
          return prompt(['Line Access Token'])
            .then(results => {
              var base64Token=new Buffer(results['Line Access Token']).toString('base64');
              const deployment = {
                restApiId: lambdaDetails.apiId,
                stageName: lambdaDetails.alias,
                variables: {
                  lineAccessToken: base64Token
                }
              };

              return utils.apiGatewayPromise.createDeploymentPromise(deployment)
                .then(() => {
                  const deployment = {
                    restApiId: lambdaDetails.apiId,
                    stageName: lambdaDetails.alias,
                    variables: {
                      lineAccessToken: base64Token
                    }
                  };

                  return utils.apiGatewayPromise.createDeploymentPromise(deployment);
                });
            });
        }
      })
      .then(() => `${lambdaDetails.apiUrl}/line`);
  });
};