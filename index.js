const parse = require('./lib/index.js');

module.exports = function (opts = {}) {
  const extendTypes = Object.assign({
    json: [],
    form: [],
    text: [],
    multipart: [],
    xml: []
  }, opts.extendTypes);

  // default json types
  const jsonTypes = [
    'application/json',
    ...extendTypes.json,
  ];

  // default form types
  const formTypes = [
    'application/x-www-form-urlencoded',
    ...extendTypes.form,
  ];

  // default text types
  const textTypes = [
    'text/plain',
    ...extendTypes.text,
  ];

  // default multipart-form types
  const multipartTypes = [
    'multipart/form-data',
    ...extendTypes.multipart
  ];

  // default xml types
  const xmlTypes = [
    'text/xml',
    ...extendTypes.xml
  ];

  return function (ctx, next) {
    if (ctx.request.body !== undefined) return next();

    return parseBody(ctx).then(body => {
      ctx.request.body = body;
    }).then(() => {
      return next();
    }).catch(err => {
      throw err;
    });
  }

  function parseBody(ctx) {
    if (ctx.method === 'GET' || ctx.method === 'HEAD' || ctx.method === 'OPTIONS' || ctx.method === 'TRACE') {
      return Promise.resolve({});
    }
    
    if (ctx.request.is(jsonTypes)) {
      return parse.json(ctx);
    }
    if (ctx.request.is(formTypes)) {
      return parse.form(ctx);
    }
    if (ctx.request.is(textTypes)) {
      return parse.text(ctx);
    }
    if (ctx.request.is(multipartTypes)) {
      return parse.multipart(ctx);
    }
    if (ctx.request.is(xmlTypes)) {
      return parse.xml(ctx);
    }

    return Promise.resolve({});
  }
};