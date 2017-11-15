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
const request = require("./request");
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

function reverseDate(dateStr){

	const year = dateStr.slice(0,4);
	const month = dateStr.slice(4,6);
	const day = dateStr.slice(6);
	console.log(`${month}/${day}/${year}`);
	return new Date(`${month}/${day}/${year}`);
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
		apiTimeStr = `${trueYear}${trueMonth}${trueDate}`;
		outputTime = `${trueMonth}/${trueDate}/${trueYear}`;
	}else{
		apiTimeStr = `${trueYear}${trueMonth}${trueDate-1}`;
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


function getStockType(stockNum){
	if(match.call(stockNum,/^3[0|9]/) || match.call(stockNum,/^00/)){
		return 1;
	}else if(match.call(stockNum,/^60/) || match.call(stockNum,/^90/)){
		return 0;
	}else{
		return -1;
	}
}

function calculate(data,days,range,curDate){
	let i = 0,k = 0,j = 1;
	let nowData = data[curDate];
	console.log("curDate",curDate);
	let tmp,lastDate,lastData,nowPrice,lastPrice,result = {prices:[],rocs:[]};
	while(k < days){
		while(!nowData){
			if(i++ >= 365) break;
			curDate = dateFormat(new Date(curDate).getTime() - 86400000);
			nowData = data[curDate];
		}
		console.log("curDate",curDate);
		nowPrice = nowData ? parseFloat(nowData[1]).toFixed(2) : 0;
		i = 0;
		while(j <= range){
			lastDate = dateFormat(new Date(reverseDate(curDate)).getTime() - 86400000);
			lastData = data[lastDate];
			console.log("lastDate",lastDate);
			console.log("lastData",lastData);
			while(!lastData){
				if(i++ >= 365) break;
				tmp = reverseDate(lastDate).getTime() - 86400000;
				lastData = data[dateFormat(tmp)];
			}
			j++;
		}
		lastPrice = lastData ? parseFloat(lastData[1]).toFixed(2) : 0;
		result.rocs.push(nowPrice-lastPrice);
		result.prices.push(nowPrice);
		k++;
	}
	return result;
}

module.exports = function getVolume(stockNum = "",inputObj){
	const prePath = `/data/hs/kline/day/history/${year}`;
	const days = inputObj.days;
	const range = inputObj.range;
	const stockType = getStockType(stockNum);
	if(stockType === -1) return false;

	config['path'] = stockNum ? `${prePath}/${stockType}${stockNum}.json` : prePath+'/1000001.json';
	console.log(config);

	return request(config).then( v => {

		const json = JSON.parse(v);
		const stockName = json.name;
		const stockNum = json.symbol;
		const stockData = json.data;
		const stockMapper = prepareStocksMapper(stockData);
		const lastDate = getLastDate();
		const result = calculate(stockMapper,days,range,lastDate);
		return diff(result);

		function diff(result){
			let flag1 = false,flag2 = false;
			console.log(result);
			result.prices.slice(1).reduce( (s,v) => {
				flag1 = flag1 || (s > v);
				return v;
			},result.prices[0]);
			result.rocs.slice(1).reduce( (s,v) => {
				flag2 = flag2 || (s < v);
				return v;
			},result.rocs[0]);
			console.log({
				status: flag1 && flag2,
				stock: {
					name: stockName,
					num: stockNum,
					prices: result.prices,
					rocs: result.rocs,
				}
			});
			return {
				status: flag1 && flag2,
				stock: {
					name: stockName,
					num: stockNum,
					prices: result.prices,
					rocs: result.rocs,
				}
			}
		}

	}, (e) =>{

	});
}