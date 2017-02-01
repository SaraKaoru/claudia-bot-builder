'use strict';
const rp = require('minimal-request-promise'),
  breakText = require('../breaktext');

module.exports = function lineReply(receiver, message, lineaccessToken) {
  var sendReply = function sendReply (messages) {
      var postURL='https://api.line.me/v2/bot/message/';
      var messageBody={};
      messageBody.messages=messages;
      if (receiver.receiverType=='replyToken') {
        messageBody.replyToken=receiver.to;
        postURL=postURL.concat('reply');
      }else{
        postURL=Object.prototype.toString.call(receiver.to) === '[object Array]'?
          postURL=postURL.concat('multicast'):postURL.concat('post');
        messageBody.to=receiver.to;
      }
      var contentLen = Buffer.byteLength(JSON.stringify(messageBody), 'utf8');
      console.log('contentLen:'+contentLen);
      var accessToken=new Buffer(lineaccessToken, 'base64').toString('ascii');
      console.log(JSON.stringify(messageBody));
      const options = {
        headers: {
          'Content-Type': 'application/json',
          'Content-Length':contentLen+'',
          'Authorization': 'Bearer ' +accessToken
        },
        body: JSON.stringify(messageBody)
      };
      return rp.post(postURL, options);
    },
    messages = [];

  function breakTextAndReturnFormatted(message) {
    return breakText(message, 1800).map(m => ({ type:'text',text: m }));
  }
  if (!receiver.receiverType) {return Promise.resolve();}
  if (typeof message === 'string') {
    messages = breakTextAndReturnFormatted(message);
  } else if (Array.isArray(message)) {
    message.forEach(msg => {
      if (typeof msg === 'string') {
        messages = messages.concat(breakTextAndReturnFormatted(msg));
      } else {
        messages.push(msg);
      }
    });
  } else if (!message) {
    return Promise.resolve();
  } else {
    messages = [{ type:'text',text: message }];
  }
  return sendReply(messages);
};
