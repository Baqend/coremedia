var xml = `<Struct xmlns="http://www.coremedia.com/2008/struct"
xmlns:xlink="http://www.w3.org/1999/xlink">\n<StructProperty
Name="focusArea">\n<Struct>\n<StringProperty
Name="x1">0</StringProperty>\n<StringProperty
Name="y1">0</StringProperty>\n<StringProperty
Name="x2">1</StringProperty>\n<StringProperty
Name="y2">1</StringProperty>\n</Struct>\n</StructProperty>\n<StructProperty
Name="transforms">\n<Struct>\n<StringProperty
Name="portrait_ratio20x31">b;a=0;c=1/crop;x=221;y=374;width=1745;height=2703</StringProperty>\n<StringProperty
Name="portrait_ratio3x4">b;a=0;c=1/crop;x=113;y=497;width=1935;height=2580</StringProperty>\n<StringProperty
Name="portrait_ratio1x1">b;a=0;c=1/crop;x=226;y=338;width=1822;height=1821</StringProperty>\n<StringProperty
Name="landscape_ratio4x3">b;a=0;c=1/crop;x=0;y=436;width=1750;height=1313</StringProperty>\n<StringProperty
Name="landscape_ratio16x9">b;a=0;c=1/crop;x=0;y=513;width=2048;height=1149</StringProperty>\n<StringProperty
Name="landscape_ratio2x1">b;a=0;c=1/crop;x=0;y=610;width=2048;height=1026</StringProperty>\n<StringProperty
Name="landscape_ratio5x2">b;a=0;c=1/crop;x=0;y=851;width=2048;height=821</StringProperty>\n<StringProperty
Name="landscape_ratio8x3">b;a=0;c=1/crop;x=0;y=862;width=2048;height=769</StringProperty>\n<StringProperty
Name="landscape_ratio4x1">b;a=0;c=1/crop;x=0;y=867;width=2048;height=513</StringProperty>\n</Struct>\n</StructProperty>\n<StructProperty
Name="relative">\n<Struct>\n<StringProperty
Name="portrait_ratio20x31">position;x1=0.10776942355889724;y1=0.12166666666666667;x2=0.9598997493734336;y2=1</StringProperty>\n<StringProperty
Name="portrait_ratio3x4">position;x1=0.05513784461152882;y1=0.16166666666666665;x2=1;y2=1</StringProperty>\n<StringProperty
Name="portrait_ratio1x1">position;x1=0.11027568922305764;y1=0.11;x2=1;y2=0.7016666666666667</StringProperty>\n<StringProperty
Name="landscape_ratio4x3">position;x1=0;y1=0.14166666666666666;x2=0.8546365914786967;y2=0.5683333333333334</StringProperty>\n<StringProperty
Name="landscape_ratio16x9">position;x1=0;y1=0.16666666666666666;x2=1;y2=0.54</StringProperty>\n<StringProperty
Name="landscape_ratio2x1">position;x1=0;y1=0.19833333333333333;x2=1;y2=0.5316666666666666</StringProperty>\n<StringProperty
Name="landscape_ratio5x2">position;x1=0;y1=0.27666666666666667;x2=1;y2=0.5433333333333333</StringProperty>\n<StringProperty
Name="landscape_ratio8x3">position;x1=0;y1=0.28;x2=1;y2=0.53</StringProperty>\n<StringProperty
Name="landscape_ratio4x1">position;x1=0;y1=0.2816666666666667;x2=1;y2=0.4483333333333333</StringProperty>\n</Struct>\n</StructProperty>\n<StructProperty
Name="isDefault">\n<Struct>\n<StringProperty
Name="portrait_ratio20x31">false</StringProperty>\n<StringProperty
Name="portrait_ratio3x4">false</StringProperty>\n<StringProperty
Name="portrait_ratio1x1">false</StringProperty>\n<StringProperty
Name="landscape_ratio4x3">false</StringProperty>\n<StringProperty
Name="landscape_ratio16x9">false</StringProperty>\n<StringProperty
Name="landscape_ratio2x1">false</StringProperty>\n<StringProperty
Name="landscape_ratio5x2">false</StringProperty>\n<StringProperty
Name="landscape_ratio8x3">false</StringProperty>\n<StringProperty
Name="landscape_ratio4x1">false</StringProperty>\n</Struct>\n</StructProperty>\n<StructProperty
Name="reflection">\n<Struct>\n<StringProperty
Name="h">false</StringProperty>\n<StringProperty
Name="v">false</StringProperty>\n</Struct>\n</StructProperty>\n<StructProperty
Name="rotation">\n<Struct>\n<StringProperty
Name="crude">0</StringProperty>\n<StringProperty
Name="fine">0</StringProperty>\n</Struct>\n</StructProperty>\n<StructProperty
Name="coloring">\n<Struct>\n<StringProperty
Name="brightness">0</StringProperty>\n<StringProperty
Name="contrast">1</StringProperty>\n</Struct>\n</StructProperty>\n<StructProperty
Name="commerce">\n<Struct>\n<StringListProperty
Name="references">\n<String>ibm:///catalog/product/PC_FLORAL_TOP</String>\n</StringListProperty>\n</Struct>\n</StructProperty>\n</Struct>`;

var xml2js = require('xml2js');

exports.call = function(db, data, req) {
  return parseXML(xml);
};

function parseXML(xml) {
  return new Promise((success, error) => {
    xml2js.parseString(xml, (err, result) => {
      err? error(err): success(result);
    });
  })
}
