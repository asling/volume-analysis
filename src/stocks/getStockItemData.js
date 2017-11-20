const getStockType = require("../../util/getStockType");
const request = require('../../util/request');
const year = 2017;
let config = {
	hostname: 'img1.money.126.net',
	path: '',
};
module.exports = function(stockNum){
	const prePath = `/data/hs/kline/day/history/${year}`;
	const stockType = getStockType(stockNum);
	if(stockType === -1) return false;

	config['path'] = stockNum ? `${prePath}/${stockType}${stockNum}.json` : prePath+'/1000001.json';
	// console.log(config);

	return request(config).then( v => {
		return v;
	} , (e) =>{
		// console.error(chalk.red(e));
	});
}