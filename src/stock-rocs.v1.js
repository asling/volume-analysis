const getROC = require("./getROC.v2");
const startTime = new Date('10/1/2017').getTime();
function dateFormat(time){
	const year = time.getFullYear();
	const month = time.getMonth()+1;
	const day = time.getDate();
	// console.log(`${month}/${day}/${year}`);
	return `${month}/${day}/${year}`
}
const endTime = new Date(dateFormat(new Date())).getTime();
module.exports = function*(stock_num,range){
	let date = startTime;
	const diff = 24*3600000;
	const result = [];
	while(date <= endTime){
		const item = yield getROC(stock_num,{range,date});
		result.push(item);
		date = date + diff;
	}
	return result;
}

