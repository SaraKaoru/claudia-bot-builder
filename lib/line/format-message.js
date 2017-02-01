'use strict';

const isUrl = require('../is-url');

function IsNumeric(number) {
  return !isNaN(parseFloat(number)) && isFinite(number);
}

class LineTemplate {
  constructor() {
    this.template = {};
  }
  get() {
    return this.template;
  }
}

class Text extends LineTemplate {
  constructor(text) {
    super();

    if (!text)
      throw new Error('Text is required for text template');

    this.template = {
      type:'text',
      text: text
    };
  }
}

class Image extends LineTemplate {
  constructor(url) {
    super();

    if (!url || !isUrl(url))
      throw new Error('Image template requires a valid URL');

    this.template = {
      type: 'image',
      originalContentUrl: url,
      previewImageUrl:url
    };
  }
}

class Audio extends LineTemplate {
  constructor(url,duration) {
    super();

    if (!url || !isUrl(url))
      throw new Error('Audio template requires a valid URL');
    if (!duration || !IsNumeric(duration))
      throw new Error('Audio template requires duration');
    this.template = {
      type: 'audio',
      originalContentUrl: url,
      duration:duration
    };
  }
}

class Video extends LineTemplate {
  constructor(url,previewImageUrl) {
    super();

    if (!url || !isUrl(url))
      throw new Error('Video template requires a valid URL');
    if (!previewImageUrl || !isUrl(previewImageUrl))
      throw new Error('Video template requires previewImageUrl');
    this.template = {
      type: 'video',
      originalContentUrl: url,
      previewImageUrl:previewImageUrl
    };
  }
}
class Location extends LineTemplate {
  constructor(title,address,latitude,longitude) {
    super();

    if (!address)
      throw new Error('Location requires an address');
    if (!latitude||!IsNumeric(latitude)||!longitude||!IsNumeric(longitude))
      throw new Error('Location requires Decimal type latitude and longitude');
    if(!title)
      title=address;
    this.template = {
      type: 'location',
      title: title,
      address:address,
      latitude:latitude,
      longitude:longitude
    };
  }
}
class Sticker extends LineTemplate {
  constructor(packageId,stickerId) {
    super();

    if (!packageId||!Number.isInteger(packageId)||!stickerId||!Number.isInteger(stickerId))
      throw new Error('Sticker requires integer type packageId and stickerId');
    this.template = {
      type: 'sticker',
      packageId: packageId,
      stickerId:stickerId
    };
  }
}
class Imagemap extends LineTemplate {
  constructor(baseUrl,altText,height,width) {
    super();

    if (!baseUrl|| !isUrl(baseUrl))
      throw new Error('Imagemap requires a valid url');
    if (!altText)
      throw new Error('Imagemap requires an altText');
    if (!height||!Number.isInteger(height)||!width||!Number.isInteger(width))
      throw new Error('Imagemap requires integer type height and width');
    this.template = {
      type: 'imagemap',
      baseUrl: baseUrl,
      altText:altText,
      baseSize: {
        height: height,
        width: width
      },
      actions: []
    };
    return this;
  }
  addURIAction(linkUri,x,y,width,height){
    if (!linkUri||!isUrl(linkUri))
      throw new Error('URL action required linkUri');
    if (!IsNumeric(x))
      throw new Error('URL action requires numeric type x');
    if (!IsNumeric(y))
      throw new Error('URL action requires numeric type y');
    if (!width||!IsNumeric(width))
      throw new Error('URL action requires numeric type width');
    if (!height||!IsNumeric(height))
      throw new Error('URL action requires numeric type height');

    const action={
      type: 'uri',
      linkUri: linkUri,
      area: {
        x: x,
        y: y,
        width: width,
        height: height
      }
    };
    this.template.actions.push(action);
    return this;
  }
  addMessageAction(text,x,y,width,height){
    if (!text)
      throw new Error('Message action required text');
    if (!IsNumeric(x))
      throw new Error('Message action requires numeric type x');
    if (!IsNumeric(y))
      throw new Error('Message action requires numeric type y');
    if (!IsNumeric(width))
      throw new Error('Message action requires numeric type width');
    if (!IsNumeric(height))
      throw new Error('Message action requires numeric type height');

    const action={
      type: 'message',
      text: text,
      area: {
        x: x,
        y: y,
        width: width,
        height: height
      }
    };
    this.template.actions.push(action);
    return this;
  }
}

class BasicTemplate extends LineTemplate {
  constructor(altText,text) {
    super();
    if (!altText)
      throw new Error('Template required altText');
    if (!text)
      throw new Error('Template required description text');
    this.template = {
      type: 'template',
      altText: altText,
      template:{
        text:text,
        actions:[]
      }
    };
  }//this.template.template.text=text;
  addMessageAction(label,data){
    let action=MessageAction(label,data);
    this.template.template.actions.push(action);
    return this;
  }
  addPostbackAction(label,data,text){
    let action=PostbackAction(label,data,text);
    this.template.template.actions.push(action);
    return this;
  }
  addURIAction(label,uri){
    let action=URIAction(label,uri);
    this.template.template.actions.push(action);
    return this;
  }
}
class ButtonsTemplate extends BasicTemplate {
  constructor(altText,title,thumbnailImageUrl,text) {
    super(altText,text);
    this.template.template.type='buttons';
    this.template.template.thumbnailImageUrl=thumbnailImageUrl;
    this.template.template.title=title;
  }
}
class ConfirmTemplate extends BasicTemplate {
  constructor(altText,title) {
    super(altText,title);
    this.template.template.type='confirm';
  }
}

class CarouselTemplate extends LineTemplate {
  constructor(altText) {
    super();
    this.template = {
      type:'template',
      altText:altText,
      template:{
        type: 'carousel',
        columns:[]
      }
    };
  }
  addColumn(thumbnailImageUrl,title,text){
    if(!text)
      throw new Error('Carousel column requires text for description');
    const column={
      thumbnailImageUrl: thumbnailImageUrl,
      title: title,
      text: text,
      actions:[]
    };
    this.template.template.columns.push(column);
    return this;
  }
  addPostbackActionToColumn(index,label,data,text){
    let column=this.getcolumn(index);
    let action=PostbackAction(label,data,text);
    column.actions.push(action);
    return this;
  }
  addURIActionToColumn(index,label,uri){
    let column=this.getcolumn(index);
    let action=URIAction(label,uri);
    column.actions.push(action);
    return this;
  }
  getcolumn(index){
    console.log('this.template.template.columns:'+this.template.template.columns.length);
    if (!this.template.template.columns || !this.template.template.columns.length)
      throw new Error('Add at least one column first!');
    if(this.template.template.columns.length<index)
      throw new Error('Cannot find column, please check your index parameter');
    return this.template.template.columns[index];
  }
}
var MessageAction=function(label,data){
  if (!label)
    throw new Error('PostbackAction requires a label');
  if (!label.length>20)
    throw new Error('label maxlength is 20');
  if (!data)
    throw new Error('PostbackAction requires a data');
  if (!data.length>300)
    throw new Error('data maxlength is 300');
  const action={
    type: 'message',
    label: label,
    data: data
  };
  return action;
};
var PostbackAction=function(label,data,text){
  if (!label)
    throw new Error('PostbackAction requires a label');
  if (!label.length>20)
    throw new Error('label maxlength is 20');
  if (!data)
    throw new Error('PostbackAction requires a data');
  if (!data.length>300)
    throw new Error('data maxlength is 300');
  if (!text.length>300)
    throw new Error('text maxlength is 300');
  const action=text?{
    type: 'postback',
    label: label,
    data: data,
    text:text
  }:{
    type: 'postback',
    label: label,
    data: data
  };
  return action;
};
var URIAction=function(label,uri){
  if(!uri||!isUrl(uri))
    throw new Error('URL action required linkUri');
  if (!label)
    throw new Error('URL action requires a label');
  if (!label.length>20)
    throw new Error('label maxlength is 20');
  const action={
    type: 'uri',
    label: label,
    uri: uri
  };
  return action;
};
module.exports = {
  Text: Text,
  Image: Image,
  Audio: Audio,
  Video: Video,
  Location: Location,
  Sticker: Sticker,
  Imagemap: Imagemap,
  ButtonsTemplate: ButtonsTemplate,
  ConfirmTemplate:ConfirmTemplate,
  CarouselTemplate:CarouselTemplate
};
