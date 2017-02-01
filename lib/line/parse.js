'use strict';
module.exports = function(messageObject, contextId) {
  if (messageObject && typeof messageObject.message !== 'undefined')
    console.log(messageObject);
  return {
    sender: messageObject.replyToken,
    text:messageObject.message.text,
    replyToken:messageObject.replyToken,
    receivers:messageObject.messageObject,
    message: messageObject.message,
    originalRequest: messageObject,
    contextId: contextId,
    type: 'line'
  };
};
