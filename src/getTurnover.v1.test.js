/*
1.一段范围内交易量低（可以从换手看出<=0.3%），没有跌幅太大的情况（震动在+-3%），
2.这几天有稍微放量上涨的趋势（换手>=0.5%    幅度>=1.66& <=5）
3. output data [
	stock_num,
	open,
	max,
	min,
	close,
	diff,
	diff_p,
	volume(*100),
	sum(*100000000),
	turnover_p,
]
*/
const request = require("./request");
const chalk = require('chalk');
const year = 2017;
// const daysGap = 3;
// const diffGap = 5;
const match = String.prototype.match;
let config = {
	hostname: 'cq.ssajax.cn',
	path: '/interact/getTradedata.ashx?',
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
	const trueMonth = date.getMonth()+1
	const trueDate = date.getDate()
	return `${trueYear}-${trueMonth}-${trueDate}`;
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

function calDiffAvgVolume(data,lastDate){
	return function(daysGap,diffGap){
		// console.log(2222);
		let sum = 0, avg, sumToPrice = 0;
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
				// console.log("kk",k);
				// process.exit(1);
				k++;
				if(k >= 365) break;
			}
			// console.log("timeStr2",timeStr);
			curItem = data[timeStr];
			// console.log("curItem",curItem);
			// console.log("------");
			if(curItem && curItem[9]){
				sum = sum + parseFloat(curItem[9].split("%")[0])/100;
			}
			
			i++;

		}

		function getDateMargin(){
			let curDay = 0;
			let i = 0;
			let curDate = date;
			let timeoutNum = 360;
			while(!checkDateValidate(data,dateFormat(new Date(curDate))) && i <= timeoutNum){
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
		return {
			turnover:(sum / diffGap*100).toFixed(2),
		};

	}
	
}

function calLastAvgVolume(data, lastDate){
	
	return function(daysGap,diffGap){
		let sum = 0, avg, sumToPrice = 0;
		const date = new Date(lastDate).getTime();
		const onedayTime = 24*3600*1000;
		let i = k = 0,tmpTimeStr,timeStr,curItem,percent; 
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
				// console.log("k",k);
				k++;
				if(k >= 365) break;
			}
			curItem = data[timeStr];
			//@ [代码 开盘价 收盘价 最高价 最低价 成交量 涨跌幅度 ]
			// console.log("timeStr2",timeStr);
			// console.log("curItem",curItem);
			// console.log("------");
			if(curItem && curItem[9]){
				sum = sum + parseFloat(curItem[9].split("%")[0])/100;
			}
			i++;
			// console.log('i',i);

		}
		// console.log('(sum / daysGap).toFixed(2)',(sum / daysGap).toFixed(2));
		// console.log("daysGap",daysGap);
		return {
			turnover:(sum / daysGap*100).toFixed(2),
		};
	}
}

function getStockType(stockNum){
	if(match.call(stockNum,/^3[0|9]/) || match.call(stockNum,/^00/)){
		return 2;
	}else if(match.call(stockNum,/^60/) || match.call(stockNum,/^90/)){
		return 1;
	}else{
		return -1;
	}
}



module.exports = function getVolume(stockNum = "",inputObj){
	const prePath = '/interact/getTradedata.ashx';
	const dataType = '6';
	const daysGap = inputObj.daysGap;
	const diffGap = inputObj.diffGap;
	const stockType = getStockType(stockNum);
	const varName = `tradeData_qlpic_${stockNum}_${stockType}_${dataType}`;
	if(stockType === -1) return false;

	config['path'] = stockNum ? `${prePath}?pic=qlpic_${stockNum}_${stockType}_${dataType}` : prePath+'?pic=qlpic_600048_1_6';
	console.log(config);

	return request(config).then( v => {
		if(v){
			const vFormat = v.replace(varName,'response={}; response.'+varName);
			console.log(vFormat);
			eval(vFormat);
			const json = response[varName];
			const stockData = json.datas;
			const stockMapper = prepareStocksMapper(stockData);
			const lastDate = getLastDate();
			const lastAvgVolumeFun = calLastAvgVolume(stockMapper,lastDate);
			const diffAvgVolumeFun = calDiffAvgVolume(stockMapper, lastDate);

			const lastAvgVolume = lastAvgVolumeFun(daysGap,diffGap);
			// console.log(11111);
			const diffAvgVolume = diffAvgVolumeFun(daysGap,diffGap); 
			console.log(chalk.cyan(`lastAvgVolume: ${JSON.stringify(lastAvgVolume)}`));
			console.log(chalk.green(`diffAvgVolume: ${JSON.stringify(diffAvgVolume)}`));
			return diff(lastAvgVolume,diffAvgVolume);
		}else{
			return false;
		}
		

		function diff(last, diff){
			const result = diff.turnover > 0 && last.turnover > 0 ? last.turnover / diff.turnover : 0 ;
			const diff_max = 0.3;
			const last_min = 0.5;
			// console.log({
			// 	status: (result <= threshold && result > 0),
			// 	stock: {
			// 		name: stockName,
			// 		num: stockNum,
			// 	}
			// });
			return {
				status: (result <= 5 && result >= 1.66 && diff.turnover <=diff_max && last.turnover >= last_min),
				stock: {
					num: stockNum,
					lastAvuTurnover: last.turnover,
					diffAvgTurnover: diff.turnover,
					percent: result,
				}
			}
		}

		// console.log(chalk.cyan(`path: ${config.hostname}${config.path}.`));
	}, (e) =>{
		// console.error(chalk.red(e));
	});
}