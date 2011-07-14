var http = require('http')
io = require('socket.io')
ejs = require('ejs')
fs = require('fs')
url_module = require('url')

clients = [] ;

remove = function(array,e) 
{
	if (array)
	{
		for (var i = 0; i < array.length; i++) 
		{
			if (e == array[i]) { return array.splice(i, 1); }
		}
	}
};

server = http.createServer(function(req, res){ 
 // your normal server code 
//	for (property in req.headers) console.log(property + " > " +req.headers[property])
//	broadcast();
	host = req.headers['host'];
	data={'host':host}
	if (req.url=='/control')
	{
		tmpl = fs.readFileSync('views/client.ejs','utf8')
	}
	else
	{
		tmpl = fs.readFileSync('views/bare_client.ejs','utf8')
	}
	var html = ejs.render(tmpl,data)
	res.end(html)
})

server.listen(8000);

broadcast = function(msg)
{
	if (clients) 
	{
		console.log("broadcast:"+clients.length)
	}
	else
	{
		clients = Array.new
	}
	for (client in clients)
	{
		if (!clients[client]) continue
		try
		{
			clients[client].send(msg)
		}
		catch(err)
		{
			console.log ("!!!"+err);
		}
	}
}


// socket.io 
console.log('setting up listener ...') ;
var socket = io.listen(server);

redirect=0
load_html=function(_url,cb,redirect)
{
	if (redirect) redirect+=1
	else redirect=0
	if (redirect>4) cb('too many redirects: '+_url)
	url = url_module.parse(_url)
	path = url.pathname
	port = 80
	if (url.port) port=url.port
	if (url.search) path+= url.search
	console.log("parsed url: http://"+url.hostname+":"+port+path)
	var options = {
		host: url.hostname,
		port: '80',
		path: path,
		encoding: 'utf8',
		method: 'GET'
	};
	console.log('loading '+_url)
	var req = http.request(options,function(res){
		console.log('got reponse: '+res.statusCode)
	  	res.setEncoding('utf8');
		if (res.statusCode=='302') // redirect
		{
			url = res.headers['location']
			console.log("redirecting to "+url)
			load_html(url,cb,true)
			return
		}
		res.on('data',function(chunk) {
			console.log("got chunk of size "+chunk.length)
			cb(chunk)
		});
	})
	req.end();
}

socket.on('connection', function(client){ 
	console.log('connect from client') 
	// new client is here! 
	if (clients)
	{
		console.log("pushing client onto array:"+client)
		clients.push(client)
		broadcast("a client connected");
	}
	else
	{
		console.log("clients is null")
	}
	client.on('message', function(s){ console.log('message:' + s);
		broadcast(s) ;
/*		if (s.substring(0,4)=='http')
		{
			html = load_html(s,function(html) {
			console.log('got html of size '+html.length)
			broadcast(html)
			})
			
		}*/
	}) 
	client.on('disconnect', function(){ 
		console.log('disconnect'); 
		//clients = remove(clients,client) 
	}) 
});