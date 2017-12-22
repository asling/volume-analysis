const getStockType = require("../../util/getStockType");
const request = require('../../util/request');
const year = 2017;
let config = {
	hostname: 'img1.money.126.net',
	path: '',
};

const { STOCK_TYPE_TODAY, STOCK_TYPE_LAST } = require("../../constance");

/*
	type : 1,today 2.past
*/

module.exports = function(stockNum,type){
	const stockType = getStockType(stockNum);
	let prePath;
	if(stockType === -1) return false;
	console.log(STOCK_TYPE_TODAY === type);
	if(STOCK_TYPE_TODAY === type){
		prePath = `/data/hs/time/today/`;
	}else{
		prePath = `/data/hs/kline/day/history/${year}`;		
	}
	config['path'] = stockNum ? `${prePath}/${stockType}${stockNum}.json` : prePath+'/1000001.json';
	return request(config).then( v => {
			return v;
	}).catch((e) =>{
			console.error(chalk.red(e));
	});

	
}