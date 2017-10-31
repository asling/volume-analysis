const request = require("./request");
const chalk = require("chalk");
const cheerio = require("cheerio");
const config = {
	'hostname':'quote.eastmoney.com',
	'path': '/stocklist.html',
};
let stockNumlist = [];
module.exports = function(){
	return request(config).then( v =>{
		if(v){
			const $ = cheerio.load(v);
			const stockElements = $("#quotesearch ul a");
			const stocksText = stockElements.text();
			const stocklist = stocksText.split("\)");
			if(stocklist && stocklist.length >0){
				stockNumlist = stocklist.map( item => {
					const tmpArr = item.split("\(");
					return tmpArr[1];
				});
			}
			// console.log(stockNumlist);
			return stockNumlist;
		}
		//console.log('content =>=> ',chalk.green(v));
	}, e => {
		console.error(chalk.red(e));
	});
}
