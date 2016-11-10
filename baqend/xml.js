var xml = `<Struct xmlns="http://www.coremedia.com/2008/struct" xmlns:xlink="http://www.w3.org/1999/xlink"><BooleanProperty Name="callToActionDisabled">false</BooleanProperty><StructProperty Name="productProperties"><Struct><StringProperty Name="height">1090</StringProperty><StringProperty Name="width">600</StringProperty><StringProperty Name="depth">913</StringProperty><StringProperty Name="hobConfig">star</StringProperty><StringProperty Name="weight">240,00</StringProperty><StringProperty Name="ovenLhCapacity">65</StringProperty><StringProperty Name="ovenRhCapacity">78</StringProperty><StringListProperty Name="fuel"><String>gas</String></StringListProperty><IntProperty Name="burners">5</IntProperty></Struct></StructProperty><StringProperty Name="callToActionCustomText">Mehr Produktinformation</StringProperty></Struct>`;

var xml2js = require('xml2js');

exports.call = function (db, data, req) {
  return parse(xml)
};

exports.parse = parse;

function parse(xml) {
  return parseXML(xml).then((json) => {
    return propParser.StructProperty(json)[1];
  });
}

function parseXML(xml) {
  return new Promise((success, error) => {
    xml2js.parseString(xml, (err, result) => {
      err ? error(err) : success(result);
    });
  })
}

var propParser = {
  StringProperty: (prop) => {
    return [prop.$.Name, prop._];
  },
  StringListProperty: (prop) => {
    return [prop.$.Name, prop.String];
  },
  IntProperty: (prop) => {
    return [prop.$.Name, parseInt(prop._)];
  },
  BooleanProperty: (prop) => {
    return [prop.$.Name, prop._ === 'true'];
  },
  StructProperty: (prop) => {
    var struct = Array.isArray(prop.Struct)? prop.Struct[0]: prop.Struct;
    var properties = {};

    Object.keys(struct).forEach((propertyType) => {
      var parser = propParser[propertyType];
      if (parser) {
        var props = struct[propertyType];
        props.map(parser).forEach((entry) => {
          properties[entry[0]] = entry[1];
        });
      }
    });

    return [prop.$ ? prop.$.Name : '', properties];
  }
};
