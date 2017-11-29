const Koa = require('koa');
const bodyParser = require('koa-bodyparser');

const app = new Koa();

app.use(bodyParser());
app.use(async ctx => {
  console.log(JSON.stringify({
  	request: ctx.request,
  	body: ctx.request.body,
  },null,2));
  ctx.body = 'Helsalssdfdso sds';
});

app.listen(3000);