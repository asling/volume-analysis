const express = require("express");
const app = express();
const port = 8989;
const stockService = require("../src/stock-service");
const path = require("path");
const options = {
	dotfiles: 'ignore',
  	etag: false,
  	extensions: ['htm', 'html','json'],
  	redirect: false,
  	setHeaders: function (res, path, stat) {
    	res.set('x-timestamp', Date.now())
  	}
}
// console.log(__dirname);
app.use(express.static(path.resolve(__dirname,'./'), options));
app.get('/stock/:number/range/:range', (req,res) => {
	const stock_num = req.params && req.params.number ? req.params.number : '000002';
	const range = req.params && req.params.range ? req.params.range : 10;
	stockService(stock_num,range).then( data => {
		res.send(data);
	});
	console.log("req",req.params);
});

app.listen(port, () => {
	console.log(`you are listening the port of ${port}`);
} );