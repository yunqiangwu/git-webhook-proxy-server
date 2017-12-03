const Koa = require('koa');
const path = require('path');
const serve = require('koa-static');
const route = require('koa-route');
const websockify = require('koa-websocket');
const bodyParser = require('koa-bodyparser');


const PORT = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 3000

const app = websockify(new Koa());


function broadcast(data) {
  app.ws.server.clients.forEach(function each(client) {
    if (client.readyState === 1) {
      if(!client.registerOps){
        console.log('not register');
        return;
      }
      let remoteBranch = data.body.ref.replace('refs/heads/','');
      let localBranch = client.registerOps.branch;
      let remoteRepositoryName = data.body.repository.name;
      let localRepositoryName = client.registerOps.repository;
      let headers = JSON.parse(JSON.stringify(data.request.header).toLowerCase());
      let gitEvent = headers['x-github-event']||headers['x-gitlab-event'];
      gitEvent = gitEvent.replace('hook','').trim();


      if(remoteBranch !== localBranch ||  remoteRepositoryName !== localRepositoryName){
        // console.log('');
        console.log(`remoteBranch: ${remoteBranch} \tlocalBranch: ${localBranch}\nremoteRepositoryName: ${remoteRepositoryName}\tlocalRepositoryName: ${localRepositoryName}`);
        return;
      }
      console.log("Hook Event: " + gitEvent);
      if(gitEvent === 'push'){
        client.send(JSON.stringify(data,null,2));
      }
    }
  });
};

app.use(bodyParser());


app.use(async (ctx, next) => {

  let message = {
  	request: ctx.request,
  	body: ctx.request.body,
  };
  // let messageStr = JSON.stringify(message,null,2);

  if(ctx.request.url.startsWith("/hook")){
  	broadcast(message);
  	ctx.body = "{}"
  	return;
  }

  if(ctx.request.url.startsWith("/health")){
    ctx.body = "{}"
    return;
  }
  // console.log(messageStr);
  await next();
});

app.use(serve(path.join(__dirname,'public')));

const redirect = ctx => {
  ctx.response.redirect('/index.html');
  ctx.response.body = '<a href="/index.html">Index Page</a>';
};

app.use(route.get('/', redirect));

global.app = app;

app.listen(PORT);


app.ws.server.on('connection', function connection(ws) {
  console.log('client 连接成功:');
  ws.on('message', function incoming(data) {
    // Broadcast to everyone else.
    data = JSON.parse(data);
    if(data.action === 'reg');
    {
      ws.registerOps = data.data;
    }
  });

  ws.on('close', function incoming(data) {
    // Broadcast to everyone else.
    console.log('client 连接断开:');
  });

});


  // "devDependencies": {
  //   "babel-plugin-syntax-async-functions": "^6.13.0",
  //   "babel-plugin-transform-async-to-generator": "^6.24.1",
  //   "babel-preset-es2015": "^6.24.1",
  //   "babel-preset-stage-2": "^6.24.1",
  //   "babel-register": "^6.26.0"
  // }

 //  {
 //    "presets": [
 //      "es2015",
 //      "stage-3"
 //    ],
 //    "plugins": ["syntax-async-generators","transform-async-to-generator","syntax-async-functions","transform-koa2-async-to-generator"]
 // }