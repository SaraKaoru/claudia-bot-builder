/*global describe, it, expect, require, jasmine, beforeEach */
'use strict';
const formatMessage = require('../../lib/line/format-message');
describe('Line format message=>', () => {
  'use strict';
  beforeEach(() =>{
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
  });
  it('should export an object', () => {
    expect(typeof formatMessage).toBe('object');
  });
  describe('Text ', () => {
    it('should be a class', () => {
      const message = new formatMessage.Text('text');
      expect(typeof formatMessage.Text).toBe('function');
      expect(message instanceof formatMessage.Text).toBeTruthy();
    });

    it('should throw an error if text is not provided', () => {
      expect(() => new formatMessage.Text()).toThrowError('Text is required for text template');
    });

    it('should add a text', () => {
      const message = new formatMessage.Text('Some text').get();
      expect(message.text).toBe('Some text');
    });
  });
  describe('Image ', () => {
    it('should be a class', () => {
      const message = new formatMessage.Image('https://devdocs.line.me/images/buttons.png');
      expect(typeof formatMessage.Image).toBe('function');
      expect(message instanceof formatMessage.Image).toBeTruthy();
    });

    it('should throw an error if Image url is not provided', () => {
      expect(() => new formatMessage.Image()).toThrowError('Image template requires a valid URL');
    });

    it('should add a Image URL', () => {
      const message = new formatMessage.Image('https://devdocs.line.me/images/buttons.png');
      expect(message.get()).toEqual(jasmine.objectContaining({
        type:'image',
        originalContentUrl:'https://devdocs.line.me/images/buttons.png',
        previewImageUrl:'https://devdocs.line.me/images/buttons.png'
      }));
    });
  });
  describe('Audio', () => {
    it('should be a class', () => {
      const message = new formatMessage.Audio('https://example.com/original.m4a',240000);
      expect(typeof formatMessage.Audio).toBe('function');
      expect(message instanceof formatMessage.Audio).toBeTruthy();
    });

    it('should throw an error if Audio url is not provided', () => {
      expect(() => new formatMessage.Audio(240000)).toThrowError('Audio template requires a valid URL');
    });
    it('should throw an error if duration is not provided', () => {
      expect(() => new formatMessage.Audio('https://example.com/original.m4a')).toThrowError('Audio template requires duration');
    });
    it('should add a Audio URL', () => {
      const message = new formatMessage.Audio('https://example.com/original.m4a',240000);
      expect(message.get()).toEqual(jasmine.objectContaining({
        type:'audio',
        originalContentUrl:'https://example.com/original.m4a',
        duration:240000
      }));
    });
  });
  describe('Video', () => {
    it('should be a class', () => {
      const message = new formatMessage.Video('https://example.com/original.mp4','https://example.com/preview.jpg');
      expect(typeof formatMessage.Video).toBe('function');
      expect(message instanceof formatMessage.Video).toBeTruthy();
    });

    it('should throw an error if Video url is not provided', () => {
      expect(() => new formatMessage.Video(240000)).toThrowError('Video template requires a valid URL');
    });
    it('should throw an error if duration is not provided', () => {
      expect(() => new formatMessage.Video('https://example.com/original.mp4')).toThrowError('Video template requires previewImageUrl');
    });
    it('should add a Video URL', () => {
      const message = new formatMessage.Video('https://example.com/original.mp4','https://example.com/preview.jpg');
      expect(message.get()).toEqual(jasmine.objectContaining({
        type:'video',
        originalContentUrl:'https://example.com/original.mp4',
        previewImageUrl:'https://example.com/preview.jpg'
      }));
    });
  });
  describe('Location', () => {
    it('should be a class', () => {
      const message = new formatMessage.Location('my location','〒150-0002 東京都渋谷区渋谷２丁目２１−１',35.65910807942215,139.70372892916203);
      expect(typeof formatMessage.Location).toBe('function');
      expect(message instanceof formatMessage.Location).toBeTruthy();
    });

    it('should throw an error if address is not provided', () => {
      expect(() => new formatMessage.Location(240000)).toThrowError('Location requires an address');
    });
    it('should throw an error if latitude/longitude is not provided', () => {
      expect(() => new formatMessage.Location('my location','〒150-0002 東京都渋谷区渋谷２丁目２１−１',35.65910807942215))
      .toThrowError('Location requires Decimal type latitude and longitude');
    });
    it('should throw an error if latitude/longitude is not numberic', () => {
      expect(() => new formatMessage.Location('my location','〒150-0002 東京都渋谷区渋谷２丁目２１−１','avccc',139.70372892916203))
      .toThrowError('Location requires Decimal type latitude and longitude');
    });
    it('should add a Location', () => {
      const message = new formatMessage.Location('my location','〒150-0002 東京都渋谷区渋谷２丁目２１−１',35.65910807942215,139.70372892916203);
      expect(message.get()).toEqual(jasmine.objectContaining({
        type:'location',
        title: 'my location',
        address: '〒150-0002 東京都渋谷区渋谷２丁目２１−１',
        latitude: 35.65910807942215,
        longitude: 139.70372892916203
      }));
    });
  });
  describe('Imagemap', () => {
    it('should be a class', () => {
      const message = new formatMessage.Imagemap('https://example.com/bot/images/rm001','this is an imagemap',1040,1040);
      expect(typeof formatMessage.Imagemap).toBe('function');
      expect(message instanceof formatMessage.Imagemap).toBeTruthy();
    });

    it('should throw an error if baseUrl is not provided', () => {
      expect(() => new formatMessage.Imagemap('this is an imagemap',1040,1040)).toThrowError('Imagemap requires a valid url');
    });
    it('should throw an error if baseUrl is not valid', () => {
      expect(() => new formatMessage.Imagemap('this is an imagemap','this is an imagemap',1040,1040)).toThrowError('Imagemap requires a valid url');
    });
    it('should throw an error if baseSize.width or height is not provided', () => {
      expect(() => new formatMessage.Imagemap('https://example.com/bot/images/rm001','this is an imagemap',1040))
      .toThrowError('Imagemap requires integer type height and width');
    });
    it('should throw an error if baseSize.width or height is not numberic', () => {
      expect(() => new formatMessage.Imagemap('https://example.com/bot/images/rm001','this is an imagemap',1040,'sdfg'))
      .toThrowError('Imagemap requires integer type height and width');
    });
    it('should throw an error if baseSize.width or height is not numberic', () => {
      expect(() => new formatMessage.Imagemap('https://example.com/bot/images/rm001','this is an imagemap','ssss',1040))
      .toThrowError('Imagemap requires integer type height and width');
    });
    it('should throw an error if baseSize.width or height is not numberic', () => {
      expect(() => new formatMessage.Imagemap('https://example.com/bot/images/rm001','this is an imagemap','ssss','sdfg'))
      .toThrowError('Imagemap requires integer type height and width');
    });
    it('should add a base Imagemap', () => {
      const message = new formatMessage.Imagemap('https://example.com/bot/images/rm001','this is an imagemap',1040,1040);
      expect(message.get()).toEqual(jasmine.objectContaining({
        type:'imagemap',
        baseUrl: 'https://example.com/bot/images/rm001',
        altText: 'this is an imagemap',
        baseSize: jasmine.objectContaining({
          height: 1040,
          width: 1040
        }),
        actions: []
      }));
    });
    describe('Add URL Action',() =>{
      it('should throw an error if url is not valid when add Uri action', () => {
        const message = new formatMessage.Imagemap('https://example.com/bot/images/rm001','this is an imagemap',1040,1040);
        expect(() => message.addURIAction('1234',0,0,520,1040))
        .toThrowError('URL action required linkUri');
      });
      it('should throw an error if url is not valid when add Uri action', () => {
        const message = new formatMessage.Imagemap('https://example.com/bot/images/rm001','this is an imagemap',1040,1040);
        expect(() => message.addURIAction(0,0,520,1040))
        .toThrowError('URL action required linkUri');
      });
      it('should throw an error if width or height is not provided when add Uri action', () => {
        const message = new formatMessage.Imagemap('https://example.com/bot/images/rm001','this is an imagemap',1040,1040);
        expect(() => message.addURIAction('https://example.com/',0,0,520))
        .toThrowError('URL action requires numeric type height');
      });
      it('should throw an error if width or height is not provided when add Uri action', () => {
        const message = new formatMessage.Imagemap('https://example.com/bot/images/rm001','this is an imagemap',1040,1040);
        expect(() => message.addURIAction('https://example.com/',0,0,520,''))
        .toThrowError('URL action requires numeric type height');
      });
      it('should throw an error if width or height is not provided when add Uri action', () => {
        const message = new formatMessage.Imagemap('https://example.com/bot/images/rm001','this is an imagemap',1040,1040);
        expect(() => message.addURIAction('https://example.com/',0,0,'xx',1040))
        .toThrowError('URL action requires numeric type width');
      });
      it('should throw an error if width or height is not provided when add Uri action', () => {
        const message = new formatMessage.Imagemap('https://example.com/bot/images/rm001','this is an imagemap',1040,1040);
        expect(() => message.addURIAction('https://example.com/','xx',0,520,1040))
        .toThrowError('URL action requires numeric type x');
      });
      it('should throw an error if width or height is not provided when add Uri action', () => {
        const message = new formatMessage.Imagemap('https://example.com/bot/images/rm001','this is an imagemap',1040,1040);
        expect(() => message.addURIAction('https://example.com/',0,'xx',520,1040))
        .toThrowError('URL action requires numeric type y');
      });
      it('should add an URL action', () => {
        const message = new formatMessage.Imagemap('https://example.com/bot/images/rm001','this is an imagemap',1040,1040);
        message.addURIAction('https://example.com/',0,0,520,1040);
        expect(message.get()).toEqual(jasmine.objectContaining({
          type:'imagemap',
          baseUrl: 'https://example.com/bot/images/rm001',
          altText: 'this is an imagemap',
          baseSize: jasmine.objectContaining({
            height: 1040,
            width: 1040
          }),
          actions: [
            {
              type: 'uri',
              linkUri: 'https://example.com/',
              area: {
                x: 0,
                y: 0,
                width: 520,
                height: 1040
              }
            }
          ]
        }));
      });
    });
    describe('Add Message Action',() =>{
      it('should throw an error if message is not provided when add Message action', () => {
        const message = new formatMessage.Imagemap('https://example.com/bot/images/rm001','this is an imagemap',1040,1040);
        expect(() => message.addMessageAction(0,0,520))
        .toThrowError('Message action required text');
      });
      it('should throw an error if width or height is not provided when add Message action', () => {
        const message = new formatMessage.Imagemap('https://example.com/bot/images/rm001','this is an imagemap',1040,1040);
        expect(() => message.addMessageAction('hello',0,0,520))
        .toThrowError('Message action requires numeric type height');
      });
      it('should throw an error if width or height is not provided when add Uri action', () => {
        const message = new formatMessage.Imagemap('https://example.com/bot/images/rm001','this is an imagemap',1040,1040);
        expect(() => message.addMessageAction('hello',0,0,520,''))
        .toThrowError('Message action requires numeric type height');
      });
      it('should throw an error if width or height is not provided when add Uri action', () => {
        const message = new formatMessage.Imagemap('https://example.com/bot/images/rm001','this is an imagemap',1040,1040);
        expect(() => message.addMessageAction('hello',0,0,'xx',1040))
        .toThrowError('Message action requires numeric type width');
      });
      it('should throw an error if width or height is not provided when add Uri action', () => {
        const message = new formatMessage.Imagemap('https://example.com/bot/images/rm001','this is an imagemap',1040,1040);
        expect(() => message.addMessageAction('hello','xx',0,520,1040))
        .toThrowError('Message action requires numeric type x');
      });
      it('should throw an error if width or height is not provided when add Uri action', () => {
        const message = new formatMessage.Imagemap('https://example.com/bot/images/rm001','this is an imagemap',1040,1040);
        expect(() => message.addMessageAction('hello',0,'xx',520,1040))
        .toThrowError('Message action requires numeric type y');
      });
      it('should add an Message action', () => {
        const message = new formatMessage.Imagemap('https://example.com/bot/images/rm001','this is an imagemap',1040,1040);
        message.addMessageAction('hello',0,0,520,1040);
        expect(message.get()).toEqual(jasmine.objectContaining({
          type:'imagemap',
          baseUrl: 'https://example.com/bot/images/rm001',
          altText: 'this is an imagemap',
          baseSize: jasmine.objectContaining({
            height: 1040,
            width: 1040
          }),
          actions: [
            {
              type: 'message',
              text: 'hello',
              area: {
                x: 0,
                y: 0,
                width: 520,
                height: 1040
              }
            }
          ]
        }));
      });
    });
  });
  describe('ButtonsTemplate ', () => {
    it('should be a class', () => {
      const message = new formatMessage.ButtonsTemplate('this is a buttons template','Menu','https://example.com/bot/images/image.jpg','Please select');
      expect(typeof formatMessage.ButtonsTemplate).toBe('function');
      expect(message instanceof formatMessage.ButtonsTemplate).toBeTruthy();
    });
    it('should add a basic ButtonsTemplate', () => {
      const message = new formatMessage.ButtonsTemplate('this is a buttons template','Menu','https://example.com/bot/images/image.jpg','Please select');
      expect(message.get()).toEqual(jasmine.objectContaining({
        type:'template',
        altText: 'this is a buttons template',
        template: {
          type: 'buttons',
          thumbnailImageUrl: 'https://example.com/bot/images/image.jpg',
          title: 'Menu',
          text: 'Please select',
          actions: []
        }
      }));
    });
    it('should add a postback action', () => {
      const message = new formatMessage.ButtonsTemplate('this is a buttons template','Menu','https://example.com/bot/images/image.jpg','Please select');
      message.addPostbackAction('Buy','action=buy&itemid=123','');
      expect(message.get()).toEqual(jasmine.objectContaining({
        type:'template',
        altText: 'this is a buttons template',
        template: {
          type: 'buttons',
          thumbnailImageUrl: 'https://example.com/bot/images/image.jpg',
          title: 'Menu',
          text: 'Please select',
          actions: [{
            type: 'postback',
            label: 'Buy',
            data: 'action=buy&itemid=123'
          }]
        }
      }));
    });
    it('should add a message action', () => {
      const message = new formatMessage.ButtonsTemplate('this is a buttons template','Menu','https://example.com/bot/images/image.jpg','Please select');
      message.addPostbackAction('Buy','action=buy&itemid=123','');
      message.addMessageAction('Yes','Yes');
      expect(message.get()).toEqual(jasmine.objectContaining({
        type:'template',
        altText: 'this is a buttons template',
        template: {
          type: 'buttons',
          thumbnailImageUrl: 'https://example.com/bot/images/image.jpg',
          title: 'Menu',
          text: 'Please select',
          actions: [{
            type: 'postback',
            label: 'Buy',
            data: 'action=buy&itemid=123'
          },{
            type: 'message',
            label: 'Yes',
            data: 'Yes'
          }]
        }
      }));
    });
    it('should add a URI action', () => {
      const message = new formatMessage.ButtonsTemplate('this is a buttons template','Menu','https://example.com/bot/images/image.jpg','Please select');
      message.addPostbackAction('Buy','action=buy&itemid=123','');
      message.addMessageAction('Yes','Yes');
      message.addURIAction('View detail','http://example.com/page/222');
      expect(message.get()).toEqual(jasmine.objectContaining({
        type:'template',
        altText: 'this is a buttons template',
        template: {
          type: 'buttons',
          thumbnailImageUrl: 'https://example.com/bot/images/image.jpg',
          title: 'Menu',
          text: 'Please select',
          actions: [{
            type: 'postback',
            label: 'Buy',
            data: 'action=buy&itemid=123'
          },{
            type: 'message',
            label: 'Yes',
            data: 'Yes'
          },{
            type: 'uri',
            label: 'View detail',
            uri: 'http://example.com/page/222'
          }]
        }
      }));
    });
  });
  describe('ConfirmTemplate ', () => {
    it('should be a class', () => {
      const message = new formatMessage.ConfirmTemplate('this is a confirm template','Are you sure?');
      expect(typeof formatMessage.ConfirmTemplate).toBe('function');
      expect(message instanceof formatMessage.ConfirmTemplate).toBeTruthy();
    });
    it('should add a basic ConfirmTemplate', () => {
      const message = new formatMessage.ConfirmTemplate('this is a confirm template','Are you sure?');
      expect(message.get()).toEqual(jasmine.objectContaining({
        type:'template',
        altText: 'this is a confirm template',
        template: {
          type: 'confirm',
          text: 'Are you sure?',
          actions: []
        }
      }));
    });
    it('should add a postback action', () => {
      const message = new formatMessage.ConfirmTemplate('this is a confirm template','Are you sure?');
      message.addPostbackAction('Buy','action=buy&itemid=123','');
      expect(message.get()).toEqual(jasmine.objectContaining({
        type:'template',
        altText: 'this is a confirm template',
        template: {
          type: 'confirm',
          text: 'Are you sure?',
          actions: [{
            type: 'postback',
            label: 'Buy',
            data: 'action=buy&itemid=123'
          }]
        }
      }));
    });
    it('should add a message action', () => {
      const message = new formatMessage.ConfirmTemplate('this is a confirm template','Are you sure?');
      message.addPostbackAction('Buy','action=buy&itemid=123','');
      message.addMessageAction('Yes','Yes');
      expect(message.get()).toEqual(jasmine.objectContaining({
        type:'template',
        altText: 'this is a confirm template',
        template: {
          type: 'confirm',
          text: 'Are you sure?',
          actions: [{
            type: 'postback',
            label: 'Buy',
            data: 'action=buy&itemid=123'
          },{
            type: 'message',
            label: 'Yes',
            data: 'Yes'
          }]
        }
      }));
    });
    it('should add a URI action', () => {
      const message = new formatMessage.ConfirmTemplate('this is a confirm template','Are you sure?');
      message.addPostbackAction('Buy','action=buy&itemid=123','');
      message.addMessageAction('Yes','Yes');
      message.addURIAction('View detail','http://example.com/page/222');
      expect(message.get()).toEqual(jasmine.objectContaining({
        type:'template',
        altText: 'this is a confirm template',
        template: {
          type: 'confirm',
          text: 'Are you sure?',
          actions: [{
            type: 'postback',
            label: 'Buy',
            data: 'action=buy&itemid=123'
          },{
            type: 'message',
            label: 'Yes',
            data: 'Yes'
          },{
            type: 'uri',
            label: 'View detail',
            uri: 'http://example.com/page/222'
          }]
        }
      }));
    });
  });
  describe('CarouselTemplate ', () => {
    it('should be a class', () => {
      const message = new formatMessage.CarouselTemplate('this is a carousel template');
      expect(typeof formatMessage.CarouselTemplate).toBe('function');
      expect(message instanceof formatMessage.CarouselTemplate).toBeTruthy();
    });
    it('should add a basic CarouselTemplate', () => {
      const message = new formatMessage.CarouselTemplate('this is a carousel template');
      expect(message.get()).toEqual(jasmine.objectContaining({
        type:'template',
        altText: 'this is a carousel template',
        template: {
          type: 'carousel',
          columns: []
        }
      }));
    });
    it('should add a column', () => {
      const message = new formatMessage.CarouselTemplate('this is a carousel template');
      message.addColumn('https://example.com/bot/images/item1.jpg','this is menu','description');
      expect(message.get()).toEqual(jasmine.objectContaining({
        type:'template',
        altText: 'this is a carousel template',
        template: {
          type: 'carousel',
          columns: [{
            thumbnailImageUrl: 'https://example.com/bot/images/item1.jpg',
            title: 'this is menu',
            text: 'description',
            actions: []
          }]
        }
      }));
    });
    it('should add a postback action', () => {
      const message = new formatMessage.CarouselTemplate('this is a carousel template');
      message.addColumn('https://example.com/bot/images/item1.jpg','this is menu','description');
      message.addPostbackActionToColumn(0,'Buy','action=buy&itemid=123','');
      expect(message.get()).toEqual(jasmine.objectContaining({
        type:'template',
        altText: 'this is a carousel template',
        template: {
          type: 'carousel',
          columns: [{
            thumbnailImageUrl: 'https://example.com/bot/images/item1.jpg',
            title: 'this is menu',
            text: 'description',
            actions: [{
              type: 'postback',
              label: 'Buy',
              data: 'action=buy&itemid=123'
            }]
          }]
        }
      }));
    });
    it('should add a URI action', () => {
      const message = new formatMessage.CarouselTemplate('this is a carousel template');
      message.addColumn('https://example.com/bot/images/item1.jpg','this is menu','description');
      message.addPostbackActionToColumn(0,'Buy','action=buy&itemid=123','');
      message.addURIActionToColumn(0,'View detail','http://example.com/page/222');
      expect(message.get()).toEqual(jasmine.objectContaining({
        type:'template',
        altText: 'this is a carousel template',
        template: {
          type: 'carousel',
          columns: [{
            thumbnailImageUrl: 'https://example.com/bot/images/item1.jpg',
            title: 'this is menu',
            text: 'description',
            actions: [{
              type: 'postback',
              label: 'Buy',
              data: 'action=buy&itemid=123'
            },{
              type: 'uri',
              label: 'View detail',
              uri: 'http://example.com/page/222'
            }]
          }]
        }
      }));
    });
  });
});