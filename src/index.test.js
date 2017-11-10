const getVolume = require("./getVolume");
const getStocks = require('./getStocks.mock');
const chalk = require("chalk");
const fs = require('fs');
const xlsx = require('node-xlsx').default;



var xlsxBuilder = (data) => {
	const dataFormat = data.map( v =>{
		const stock = v.stock;
		return [stock.name, stock.num, stock.lastAvgVolume, stock.diffAvgVolume];
	})
	const xlsxData = [
		['股票名','股票代码','成交量1','成交量2'],
		...dataFormat,
	]
	var buffer = xlsx.build([{name: "filte-by-volumes", data: xlsxData}]);
	fs.writeFileSync("stocks.xlsx", buffer, 'binary');
}

//流程函数
var gen = function* (){
	const stocks = yield getStocks();
	// console.log(stocks);
	// console.log(chalk.red('------------'));
	const resultSelected = [];
	if(stocks instanceof Array && stocks.length > 0){
		for(let item of stocks){
			console.log(item);
			// console.log(chalk.red('-------'));
			const tmpItem = yield getVolume(item);
			console.log(tmpItem);
			console.log(chalk.red('--------'));
			if(tmpItem && tmpItem['status'] === true){
				resultSelected.push(tmpItem);
				console.log(resultSelected);
			}
		}
	}
	return resultSelected;
}

//运行函数
function run(gen){
  var g = gen();

  function next(data){
    var result = g.next(data);
    if (result.done){
    	console.log(result.value);
    	console.log(chalk.red("end"));
    	xlsxBuilder(result.value);
    	return result.value;
    } 
    if(result.value){
    	result.value.then(function(data){
	      next(data);
	    });
    }else{
    	next(null);
    }
    
  }

  next();
}

var result  = run(gen);

console.log(chalk.green("start"));
console.log(result);
// console.log(step.value);
// console.log();
console.log(chalk.green("end"));



