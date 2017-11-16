const getROC = require("./getROC.v1");
const getStocks = require('./getStocks');
const chalk = require("chalk");
const fs = require('fs-extra');
const xlsx = require('node-xlsx').default;
const rocVar = require("./rocVar");
const makeFileName = require("../util/makeFileName");

var xlsxBuilder = (data) => {
	const dataFormat = data.map( v =>{
		const stock = v.stock;
		const yesorno = v.status ? 1 : 0;
		return [stock.name, stock.num, stock.prices.join(","), stock.rocs.join(","), yesorno];
	});

	let fileName = `roc${makeFileName()}.xlsx`;
	while(fs.ensureFileSync(fileName)){
		fileName = `roc${makeFileName()}.xlsx`;
	}
	const xlsxData = [
		['股票名','股票代码','收盘价','变动率','是否满足'],
		...dataFormat,
	]
	var buffer = xlsx.build([{name: "filte-by-rocs", data: xlsxData}]);
	fs.writeFileSync(fileName, buffer, 'binary');
}

//流程函数
var gen = function* (){
	const inputObj = yield rocVar();
	const stocks = yield getStocks();
	// console.log(chalk.red('------------'));
	const resultSelected = [];
	if(stocks instanceof Array && stocks.length > 0){
		for(let item of stocks){
			// console.log(item);
			// console.log(chalk.red('-------'));
			const tmpItem = yield getROC(item,inputObj);
			console.log(tmpItem);
			console.log(chalk.red('--------'));
			if(tmpItem){
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




