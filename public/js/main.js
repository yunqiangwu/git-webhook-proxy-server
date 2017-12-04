


const consoleEle = document.querySelector('.console')
const socket = new WebSocket((location.protocol === 'https:' ? 'wss://' : 'ws://')+location.host.replace(/:.*$/,'')+(location.port?(':'+location.port):''));

// Connection opened
socket.addEventListener('open', function (event) {
    showMsg('连接服务器成功') 
});

// Listen for messages
socket.addEventListener('message', function (event) {
    console.log('Message from server ', event.data);
    showMsg(event.data)
});

function showMsg(msg) {
	const pre = document.createElement('pre');
	pre.innerText = msg+'\n\n';
	consoleEle.appendChild(pre);
}