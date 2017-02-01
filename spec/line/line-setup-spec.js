/*global require, describe, it, expect, beforeEach, jasmine*/
'use strict';

const underTest = require('../../lib/line/setup');

describe('Line setup', () => {
  var api, bot, logError, parser, responder, botPromise, botResolve, botReject;

  beforeEach(() => {
    api = jasmine.createSpyObj('api', ['get', 'post', 'addPostDeployStep']);
    botPromise = new Promise((resolve, reject) => {
      botResolve = resolve;
      botReject = reject;
    });
    bot = jasmine.createSpy().and.returnValue(botPromise);
    parser = jasmine.createSpy();
    logError = jasmine.createSpy();
    responder = jasmine.createSpy();
    underTest(api, bot, logError, parser, responder);
  });
  const textTemplate={
    events: [
      {
        message: {
          text:'Hello, world1',
          type: 'text'
        },
        replyToken: 'RANDAM_REPLY_TOKEN',
        source: {
          type: 'user',
          userId: '12345678'
        },
        timestamp: 1485380526481,
        type: 'message'
      }
    ]
  };
  describe('message processor', () => {
    it('wires the POST request for message actions to the message processor', () => {
      expect(api.post.calls.count()).toEqual(1);
      expect(api.post).toHaveBeenCalledWith('/line', jasmine.any(Function));
    });
  });
  describe('processing a single message', () => {
    var handler;
    beforeEach(() => {
      handler = api.post.calls.argsFor(0)[1];
    });
    it('breaks down the message and puts it into the parser', () => {
      handler({body: textTemplate, env: {lineAccessToken: 'RANDAM_ACCESS_TOKEN'}});
      botResolve('OK');
      expect(parser).toHaveBeenCalledWith(textTemplate.events[0]);
    });
    it('logs error when the bot rejects without responding', (done) => {
      handler({body: textTemplate, env: {lineAccessToken: 'RANDAM_ACCESS_TOKEN'}}).then(() => {
        expect(responder).not.toHaveBeenCalled();
        expect(logError).toHaveBeenCalledWith('cannot parse message');
      }).then(done, done.fail);
      botReject('cannot parse message');
    });
    it('should pass the parsed value to the bot if a message can be parsed', (done) => {
      parser.and.returnValue('MSG1');
      handler({body: textTemplate, env: {lineAccessToken: 'RANDAM_ACCESS_TOKEN'}});
      Promise.resolve().then(() => {
        expect(bot).toHaveBeenCalledWith('MSG1', { body: textTemplate , env: {lineAccessToken: 'RANDAM_ACCESS_TOKEN'}});
      }).then(done, done.fail);
    });
    it('should not invoke the bot if the message cannot be parsed', (done) => {
      parser.and.returnValue(false);
      handler({body: textTemplate}).then((message) => {
        expect(message).toBe(undefined);
        expect(logError).toHaveBeenCalledWith('cannot parse message');
        expect(bot).not.toHaveBeenCalled();
      }).then(done, done.fail);
    });
    it('should respond when the bot resolves', (done) => {
      parser.and.returnValue(textTemplate.events[0]);
      handler({ body: textTemplate , env: {lineAccessToken: 'RANDAM_ACCESS_TOKEN'}}).then((message) => {
        expect(message).toBe('ok');
        expect(responder).toHaveBeenCalledWith({ receiverType: 'replyToken', to: 'RANDAM_REPLY_TOKEN' }, 
          'Yes Yes', 'RANDAM_ACCESS_TOKEN');
      }).then(done, done.fail);

      botResolve('Yes Yes');
    });
    it('should work with bot responses as strings', (done) => {
      bot.and.returnValue('Yes!');
      parser.and.returnValue(textTemplate.events[0]);
      handler({body: textTemplate, env: {lineAccessToken: 'RANDAM_ACCESS_TOKEN'}}).then(() => {
        expect(responder).toHaveBeenCalledWith({ receiverType: 'replyToken', to: 'RANDAM_REPLY_TOKEN' }, 'Yes!', 'RANDAM_ACCESS_TOKEN');
      }).then(done, done.fail);

    });
    it('should log an error when the bot rejects without responding', (done) => {
      parser.and.returnValue('MSG1');
      handler({body: textTemplate, env: {}}).then(() => {
        expect(responder).not.toHaveBeenCalled();
        expect(logError).toHaveBeenCalledWith('No No');
      }).then(done, done.fail);

      botReject('No No');
    });
    it('should log an error when the responder throws an error', (done) => {
      parser.and.returnValue('MSG1');
      responder.and.throwError('XXX');
      botResolve('Yes');
      handler({body: textTemplate, env: {lineAccessToken: 'RANDAM_ACCESS_TOKEN'}}).then(() => {
        expect(logError).toHaveBeenCalledWith(jasmine.any(Error));
      }).then(done, done.fail);
    });
    describe('should work with promises in responders', () => {
      var responderResolve, responderReject, responderPromise, hasResolved;
      beforeEach(() => {
        responderPromise = new Promise((resolve, reject) => {
          responderResolve = resolve;
          responderReject = reject;
        });
        responder.and.returnValue(responderPromise);

        parser.and.returnValue('MSG1');
      });
      it('should wait for the responders to resolve before completing the request', (done) => {
        handler({body: textTemplate, env: {lineAccessToken: 'RANDAM_ACCESS_TOKEN'}}).then(() => {
          hasResolved = true;
        });

        botPromise.then(() => {
          expect(hasResolved).toBeFalsy();
        }).then(done, done.fail);

        botResolve('YES');
      });
      it('should resolve when the responder resolves', (done) => {
        handler({body: textTemplate, env: {lineAccessToken: 'RANDAM_ACCESS_TOKEN'}}).then((message) => {
          expect(message).toEqual('ok');
        }).then(done, done.fail);

        botPromise.then(() => {
          responderResolve('ok');
        });
        botResolve('YES');
      });
      it('should log error when the responder rejects', (done) => {
        handler({body: textTemplate, env: {lineAccessToken: 'RANDAM_ACCESS_TOKEN'}}).then(() => {
          expect(logError).toHaveBeenCalledWith('Bomb!');
        }).then(done, done.fail);

        botPromise.then(() => {
          responderReject('Bomb!');
        });
        botResolve('YES');
      });
    });
  });
});