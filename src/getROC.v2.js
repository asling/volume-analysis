/*
	@param 
	stock_num,
	inputObj = {
	days,
	range,
	}

	@result
	{
		prices: [Array],
		status: [Boolean],
		rocs: [Array],
	} 
*/
// const request = require("./request");
const { 
  connect, 
  findDocByQuery, 
  insertDocuments, 
  removeDocument, 
  updateDocument
} = require("../db/mongo");
const dbName = 'stocksProject';
const stockCollectionName = 'stocks';
const getNewDateStr = require('../util/getNewDateStr');
const chalk = require('chalk');
const year = 2017;
// const daysGap = 3;
// const diffGap = 5;
const match = String.prototype.match;
let config = {
	hostname: 'img1.money.126.net',
	path: '',
};

function prepareStocksMapper(data){
	const result = {};
	data instanceof Array && data.map( v => {
		return result[v['date']] = v;
	});
	return result;
}

function dateFormat(dateObj){
	const date = new Date(dateObj);
	const trueYear = date.getFullYear();
	const trueMonth = date.getMonth()+1 <= 9 ? '0'+(date.getMonth()+1) : date.getMonth()+1;
	const trueDate = date.getDate() <= 9 ? '0'+date.getDate() : date.getDate();
	return `${trueYear}${trueMonth}${trueDate}`;
}

function reverseDate(dateStr){
	const year = dateStr.slice(0,4);
	const month = dateStr.slice(4,6);
	const day = dateStr.slice(6);
	// console.log(`${month}/${day}/${year}`);
	return new Date(`${month}/${day}/${year}`);
}

function getLastDate(dateStr, force = false){
	const date = new Date(dateStr);
	// const trueYear = date.getFullYear();
	// const trueMonth = date.getMonth()+1 <= 9 ? '0'+(date.getMonth()+1) : date.getMonth()+1;
	// const trueDate = date.getDate() <= 9 ? '0'+date.getDate() : date.getDate();
	// const todayStr = `${trueMonth}/${trueDate}/${date.getFullYear()}`;
	// const todayTime = new Date(todayStr).getTime();
	const todayTime = date.getTime();
	const todayLeaveTime = todayTime + 54000000;
	let outputTime;
	if(todayTime > todayLeaveTime || force){
		// apiTimeStr = `${trueYear}${trueMonth}${trueDate}`;
		// outputTime = `${trueMonth}/${trueDate}/${trueYear}`;
		apiTimeStr = dateFormat(new Date(todayTime));
		outputTime = getNewDateStr(todayTime);
	}else{
		let tmpTime = todayTime - 86400000;
		// apiTimeStr = `${trueYear}${trueMonth}${trueDate-1}`;
		// outputTime = `${trueMonth}/${trueDate-1}/${trueYear}`;
		apiTimeStr = dateFormat(new Date(tmpTime));
		outputTime = getNewDateStr(tmpTime);

	}
	return outputTime;
}

function checkDateValidate(data,datestr){
	//判断当天有没有开市
	if(data[datestr]){
		return true;
	}else{
		return false;
	}
}


function getStockType(stockNum){
	if(match.call(stockNum,/^3[0|9]/) || match.call(stockNum,/^00/)){
		return 1;
	}else if(match.call(stockNum,/^60/) || match.call(stockNum,/^90/)){
		return 0;
	}else{
		return -1;
	}
}

function calculate(data,range,date){
	let i = 0,j = 1;
	let curDate = dateFormat(date);
	let nowData = data[curDate];
	let lastDate,lastData,nowPrice,lastPrice,result = {rocs:null};
	while(!nowData){
		if(i++ >= 365) break;
		curDate = dateFormat(new Date(reverseDate(curDate)).getTime() - 86400000);
		nowData = data[curDate];
	}
	nowPrice = nowData ? parseFloat(nowData['close']).toFixed(2) : 0;
	lastDate = curDate;
	while(j <= range){
		i = 0;
		lastDate = dateFormat(new Date(reverseDate(lastDate)).getTime() - 86400000);
		lastData = data[lastDate];
		while(!lastData){
			if(i++ >= 365) break;
			lastDate = dateFormat(new Date(reverseDate(lastDate)).getTime() - 86400000);
			lastData = data[lastDate];
			// console.log("lastDate",lastDate);
				// console.log("lastData",lastData);
		}
		j++;
	}
	console.log("nowData",chalk.green(JSON.stringify(nowData)));
	lastPrice = lastData ? parseFloat(lastData['close']).toFixed(2) : nowData ? parseFloat(nowData['open']).toFixed(2) : 0;
	result.rocs = ((nowPrice*1000-lastPrice*1000)/1000).toFixed(2);
	result.close = nowPrice;
	result.open = nowData ? parseFloat(nowData['open']).toFixed(2) : 0;
	result.highest = nowData ? parseFloat(nowData['hightest']).toFixed(2) : 0;
	result.lowest = nowData ? parseFloat(nowData['lowest']).toFixed(2) : 0;
	result.date = nowData ? nowData['date'] : null;
	return result;
}

module.exports = function getROC(stockNum = "",inputObj){
	const range = inputObj.range;
	const date = inputObj.date;
	const dateForce = inputObj.dateForce;


	return connect(dbName).then( dbData => {
		// console.log("dbData",dbData);
		return findDocByQuery(dbData,stockCollectionName,{symbol:stockNum});
	}).then( res => {
		console.log("res",res);
		if(res && res.findByQueryDocs.length > 0){
			let result = {
				data:[],
				name: '',
				symbol: '',
			}
			const docsArr = res.findByQueryDocs;
			result.name = docsArr[0].name;
			result.symbol = stockNum;
			const stockMapper = prepareStocksMapper(docsArr);
			// const lastDate = getLastDate(date,dateForce);
			// console.log('lastDate',lastDate);
			for(let stockItem of docsArr){
				const resultItem = calculate(stockMapper,range,reverseDate(stockItem['date']));
				result.data.push(diff(resultItem));
			}
			return result;
		}else{
			return false;
		}
		
		

		function diff(result){
			// console.log("nowData",chalk.red(JSON.stringify({
			// 		open: result.open,
			// 		close: result.close,
			// 		lowest: result.lowest,
			// 		highest: result.highest,
			// 		rocs: result.rocs,
			// 		date: result.date,
			// 	})));
			return {
					open: result.open,
					close: result.close,
					lowest: result.lowest,
					highest: result.highest,
					rocs: result.rocs,
					date: result.date,
				}
		}
		res.db.close();
	}).catch(e => {
		console.log('e',e);
	});
}






