'use strict';

const koa = require('koa');
const Readable = require('stream').Readable;
const co = require('co')

const app = koa();

const sleep = ms => new Promise(r => setTimeout(r, ms));

app.use(function* () {
	const view = new Readable();
	view._read = () => {};
	this.body = view;
 	this.type = 'html';
	this.status = 200;
	view.push(`
		<html>
			<head>
				<title>BigPipe Test</title>
				<style>
					#loader {
						width: 100px;
						height: 100px;
						border: 1px solid #ccc;
						text-align: center;
						vertical-align: middle;
					}
				</style>
			</head>
			<body>
				<div id="loader">
					<div id="content">Loading</div>
				</div>
	`);
	co(function* () {
		yield sleep(2000);
		view.push(`
			<script>
				document.getElementById('content').innerHTML = 'Hello World';
			</script>
		`);
		view.push('</body></html>');
		view.push(null);
	}).catch(e => {});
});

app.listen(5000);
