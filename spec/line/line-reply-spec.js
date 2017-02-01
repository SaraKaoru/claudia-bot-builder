/*global describe, it, expect, require, jasmine, beforeEach */
var reply = require('../../lib/line/reply'),
  https = require('https');
describe('Line', () => {
  'use strict';
  beforeEach(() =>{
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
  });
  it('includes the token in the path request', done => {
    https.request.pipe(callOptions => {
      expect(callOptions).toEqual(jasmine.objectContaining({
        protocol: 'https:',
        hostname: 'api.line.me',
        method: 'POST', 
        headers: jasmine.objectContaining({Authorization:'Bearer Hello World'})
      }));
      done();
    });
    reply({receiverType:'replyToken',to:'replyToken123'}, 'Hi Line', 'SGVsbG8gV29ybGQ=');
  });
  it('reply string messages as a text object', done => {
    https.request.pipe(callOptions => {
      expect(JSON.parse(callOptions.body)).toEqual(jasmine.objectContaining({
        replyToken:'replyToken123',
        messages:jasmine.objectContaining([{type:'text',text:'Hi Line'}])
      }));
      done();
    });
    reply({receiverType:'replyToken',to:'replyToken123'}, 'Hi Line', 'SGVsbG8gV29ybGQ=');
  });
  it('sends large text messages split into several', done => {
    var fiveHundred = new Array(400).join('blok ');

    https.request.pipe(function () {
      this.respond('200', 'OK', 'Hi Line');
    });

    reply({receiverType:'replyToken',to:'replyToken123'}, fiveHundred, 'SGVsbG8gV29ybGQ=').then(() => {
      expect(https.request.calls.length).toEqual(1);
      expect(JSON.parse(https.request.calls[0].args[0].body)).toEqual({
        messages: [{type:'text',text: new Array(360).join('blok ')+ 'blok'},{type:'text',text: new Array(39).join('blok ')+ 'blok'}],
        replyToken:'replyToken123'
      });
    }).then(done);
  });
  it('sends requests in sequence', done => {
    var fiveHundred = new Array(400).join('blok ');

    https.request.pipe(() => {
      Promise.resolve().then(() => {
        expect(https.request.calls.length).toEqual(1);
      }).then(done);
    });

    reply({receiverType:'replyToken',to:'replyToken123'}, fiveHundred, 'SGVsbG8gV29ybGQ=');
  });
  describe('when an array is passed', () => {
    it('does not send the second request until the first one completes', done => {
      let answers = ['foo', 'bar'];
      https.request.pipe(() => {
        Promise.resolve().then(() => {
          expect(https.request.calls.length).toEqual(1);
        }).then(done);
      });
      reply({receiverType:'replyToken',to:'replyToken123'}, answers, 'SGVsbG8gV29ybGQ=');
    });

  });
  it('post string messages as a text object', done => {
    https.request.pipe(callOptions => {
      expect(JSON.parse(callOptions.body)).toEqual(jasmine.objectContaining({
        to:'user123',
        messages:jasmine.objectContaining([{type:'text',text:'Hi Line'}])
      }));
      expect(callOptions).toEqual(jasmine.objectContaining({
        path: '/v2/bot/message/post'
      }));
      done();
    });
    reply({receiverType:'post',to:'user123'}, 'Hi Line', 'SGVsbG8gV29ybGQ=');
  });
  it('post string messages to multiple user', done => {
    https.request.pipe(callOptions => {
      expect(JSON.parse(callOptions.body)).toEqual(jasmine.objectContaining({
        to:['user123','user456'],
        messages:jasmine.objectContaining([{type:'text',text:'Hi Line'}])
      }));
      expect(callOptions).toEqual(jasmine.objectContaining({
        path: '/v2/bot/message/multicast'
      }));
      done();
    });
    reply({receiverType:'post',to:['user123','user456']}, 'Hi Line', 'SGVsbG8gV29ybGQ=');
  });
  it('does not send a message if message is not provided', () => {
    reply({receiverType:'replyToken',to:'replyToken123'}, null, 'SGVsbG8gV29ybGQ=')
      .then(() => {
        expect(https.request.calls.length).toBe(0);
      });

    reply({receiverType:'replyToken',to:'replyToken123'}, false, 'SGVsbG8gV29ybGQ=')
      .then(() => {
        expect(https.request.calls.length).toBe(0);
      });

    reply({receiverType:'replyToken',to:'replyToken123'}, undefined, 'SGVsbG8gV29ybGQ=')
      .then(() => {
        expect(https.request.calls.length).toBe(0);
      });
  });
  it('does not resolve before the https endpoint responds', done => {
    https.request.pipe(done);
    reply({receiverType:'replyToken',to:'replyToken123'}, 'foo', 'SGVsbG8gV29ybGQ=').then(done.fail, done.fail);
  });
  it('resolves when the https endpoint responds with 200', done => {
    https.request.pipe(function () {
      this.respond('200', 'OK', 'Hi there');
    });
    reply({receiverType:'replyToken',to:'replyToken123'}, 'foo', 'SGVsbG8gV29ybGQ=').then(done, done.fail);
  });
});
