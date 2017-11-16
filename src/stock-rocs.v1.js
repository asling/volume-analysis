const getROC = require("./getROC.v2");
const endTime = new Date('11/1/2017').getTime();
module.exports = function*(stock_num,range){
	let date = new Date().getTime();
	const diff = 24*3600000;
	const result = [];
	while(date >= endTime){
		const item = yield getROC(stock_num,{range,date});
		result.push(item);
		date = date - diff;
	}
	return result;
}

