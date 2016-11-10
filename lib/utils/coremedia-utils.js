function fixRichtext(richtext) {
  const cssClasses = {
    'p--heading-1': 'h1',
    'p--heading-2': 'h2',
    'p--heading-3': 'h3',
  };
  if (!richtext)
    return ''
  var s = richtext.replace(/^<div[^>]*>/, '').replace(/<\/div>$/, '')
  Object.keys(cssClasses).forEach(function (key) {
    var re = RegExp("class=\"" + key + "\"", "g");
    s = s.replace(re, "class=\"" + cssClasses[key] + "\"")
  });
  return s;
}

exports['default'] = fixRichtext;
module.exports = exports['default'];
