const getROC = require("./getROC.v2");
// const startTime = new Date('1/1/2017').getTime();
const pageSize = 15;
function dateFormat(time){
	const year = time.getFullYear();
	const month = time.getMonth()+1;
	const day = time.getDate();
	// console.log(`${month}/${day}/${year}`);
	return `${month}/${day}/${year}`
}
const endTime = new Date(dateFormat(new Date())).getTime();
module.exports = function*(stock_num,range,page){
	let result = {},dict = {};
	const item = yield getROC(stock_num,{range});

	const dataNumbers = item && item.data && item.data.length > 0 ? item.data.length : 0;
	result.totalNum = dataNumbers;
	result.page = page;
	result.pageSize = pageSize;
	result.name = item.name;
	result.symbol = item.symbol;
	result.data = item.data.slice((parseInt(page)-1)*pageSize,parseInt(page)*pageSize);	
	console.log((parseInt(page)-1)*pageSize);
	return result;
}

