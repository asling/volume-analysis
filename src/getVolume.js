const request = require("./request");
const chalk = require('chalk');
const year = 2017;
const daysGap = 3;
const diffGap = 5;
const threshold = 0.66;
const match = String.prototype.match;
let config = {
	hostname: 'img1.money.126.net',
	path: '',
};

function prepareStocksMapper(data){
	const result = {};
	data instanceof Array && data.map( v => {
		return result[v[0]] = v;
	});
	return result;
}

function dateFormat(dateObj){
	// console.log("dateObj",dateObj);
	const date = new Date(dateObj);
	const trueYear = date.getFullYear();
	const trueMonth = date.getMonth()+1 <= 9 ? '0'+(date.getMonth()+1) : date.getMonth()+1;
	const trueDate = date.getDate() <= 9 ? '0'+date.getDate() : date.getDate();
	return `${trueYear}${trueMonth}${trueDate}`;
}

function getLastDate(){
	const date = new Date();
	const trueYear = date.getFullYear();
	const trueMonth = date.getMonth()+1 <= 9 ? '0'+(date.getMonth()+1) : date.getMonth()+1;
	const trueDate = date.getDate() <= 9 ? '0'+date.getDate() : date.getDate();
	const todayStr = `${trueMonth}/${trueDate}/${date.getFullYear()}`;
	const todayTime = new Date(todayStr).getTime();
	const todayLeaveTime = todayTime + 54000000;
	let outputTime;
	if(date.getTime() > todayLeaveTime){
		// apiTimeStr = `${trueYear}${trueMonth}${trueDate}`;
		outputTime = `${trueMonth}/${trueDate}/${trueYear}`;
	}else{
		// apiTimeStr = `${trueYear}${trueMonth}${trueDate-1}`;
		outputTime = `${trueMonth}/${trueDate-1}/${trueYear}`;
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

function calDiffAvgVolume(data,lastDate){
	let sum = 0, avg;
	const date = new Date(lastDate).getTime();
	const onedayTime = 24*3600*1000;
	// const dateMargin = date - daysGap* onedayTime;
	const dateMargin = getDateMargin();
	// console.log("lastDate",lastDate);
	// console.log("dateMargin",new Date(dateMargin));
	let i = k = 1,tmpTimeStr,timeStr,curItem;
	// let dateMargin = date;
	// for(var i = 0; i< diffGap; i++){
	// 	let tmpTimeStr = dateMargin- i* onedayTime;
	// 	let timeStr = dateFormat(new Date(tmpTimeStr));
	// 	console.log("i",i);
	// 	while(!checkDateValidate(data,timeStr)){
	// 		tmpTimeStr = tmpTimeStr- onedayTime;
	// 		timeStr = dateFormat(new Date(tmpTimeStr));
	// 		console.log("tmpTimeStr",tmpTimeStr);
	// 	}
		
	// 	let curItem = data[timeStr];
	// 	if(curItem){
	// 		sum = sum + parseFloat(curItem[5]);
	// 	}
	// }

	while(i <= diffGap){
		tmpTimeStr = dateMargin- k* onedayTime;
		k++;
		// console.log("k2",k);
		// console.log("i2",i);
		timeStr = dateFormat(new Date(tmpTimeStr));
		while(!checkDateValidate(data,timeStr)){
			tmpTimeStr = dateMargin- k* onedayTime;
			timeStr = dateFormat(new Date(tmpTimeStr));
			// console.log("new Date(tmpTimeStr)",new Date(tmpTimeStr));
			// console.log("timeStr1",timeStr);
			// process.exit(1);
			k++;
			if(k >= 365) break;
		}
		// console.log("timeStr2",timeStr);
		curItem = data[timeStr];
		// console.log("curItem",curItem);
		// console.log("------");
		if(curItem){
			sum = sum + parseFloat(curItem[5]);
		}
		
		i++;

	}

	function getDateMargin(){
		let curDay = 0;
		let i = 0;
		let curDate = date;
		let timeoutNum = 360;
		while(!checkDateValidate(data,dateFormat(new Date(curDate)))){
			i++;
			curDate = date - i * onedayTime;
			if(i > timeoutNum) curDate = date;

			// console.log('curDate',curDate);
		}
		i = 0;
		while(curDay < daysGap && i <= timeoutNum){
			curDate = date - i * onedayTime;
			i++;
			if(checkDateValidate(data,dateFormat(new Date(curDate)))){
				curDay++;
			}
			// console.log('i',i);
			// console.log("curDay",curDay);
		}
		return curDate;
	}
	// console.log('(sum / diffGap).toFixed(2)',(sum / diffGap).toFixed(2));
	return (sum / diffGap).toFixed(2);
}

function calLastAvgVolume(data, lastDate){
	let sum = 0, avg;
	const date = new Date(lastDate).getTime();
	const onedayTime = 24*3600*1000;
	let i = k = 0,tmpTimeStr,timeStr,curItem; 
	while(i < daysGap){
		tmpTimeStr = date- k* onedayTime;
		k++;
		// console.log("k1",k);
		// console.log("i1",i);
		timeStr = dateFormat(new Date(tmpTimeStr));
		while(!checkDateValidate(data,timeStr)){
			tmpTimeStr = tmpTimeStr- onedayTime;
			timeStr = dateFormat(new Date(tmpTimeStr));
			// console.log("new Date(tmpTimeStr)",new Date(tmpTimeStr));
			// console.log("timeStr1",timeStr);
			k++;
			if(k >= 365) break;
		}
		curItem = data[timeStr];
		// console.log("timeStr2",timeStr);
		// console.log("curItem",curItem);
		// console.log("------");
		if(curItem){
			sum = sum + parseFloat(curItem[5]);
			console.log("curItem[5]",curItem[5]);
			console.log("sum",sum);
		}
		i++;

	}
	// console.log('sum',sum);
	// console.log("daysGap",daysGap);
	return (sum / daysGap).toFixed(2);
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

module.exports = function getVolume(stockNum = ""){
	const prePath = `/data/hs/kline/day/history/${year}`;
	const stockType = getStockType(stockNum);
	if(stockType === -1) return false;

	config['path'] = stockNum ? `${prePath}/${stockType}${stockNum}.json` : prePath+'/1000001.json';
	console.log(config);

	return request(config).then( v => {
		// console.log(v);
		
		const json = JSON.parse(v);
		const stockName = json.name;
		const stockNum = json.symbol;
		const stockData = json.data;
		const stockMapper = prepareStocksMapper(stockData);
		const lastDate = getLastDate();
		const lastAvgVolume = calLastAvgVolume(stockMapper,lastDate);
		const diffAvgVolume = calDiffAvgVolume(stockMapper, lastDate);
		// console.log(chalk.cyan(`lastAvgVolume: ${lastAvgVolume}`));
		// console.log(chalk.green(`diffAvgVolume: ${diffAvgVolume}`));
		return diff(lastAvgVolume,diffAvgVolume);

		function diff(last, diff){
			const result = diff / last;
			// console.log({
			// 	status: (result <= threshold && result > 0),
			// 	stock: {
			// 		name: stockName,
			// 		num: stockNum,
			// 	}
			// });
			return {
				status: (result <= threshold && result > 0),
				stock: {
					name: stockName,
					num: stockNum,
					lastAvgVolume,
					diffAvgVolume,

				}
			}
		}

		// console.log(chalk.cyan(`path: ${config.hostname}${config.path}.`));
	}, (e) =>{
		// console.error(chalk.red(e));
	});
}