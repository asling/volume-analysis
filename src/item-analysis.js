const getVolume = require("./getVolume");
const inquirer = require("inquirer");
const xlsx = require("node-xlsx").default;
const fs = require("fs-extra");
const path = require("path");
const root = process.cwd();
const filePath = path.resolve(root,"stocks.xlsx");
var createNewFile = (filePath,data) =>{
	const xlsxData = [
		['时间','股票名','股票代码','last','diff'],
		[new Date(),stock.name, stock.num, stock.lastAvgVolume, stock.diffAvgVolume],
	];
	var buffer = xlsx.build([{name: "filte-by-volumes", data: xlsxData}]);
	fs.writeFileSync(filePath, buffer, 'binary');
}

var loadFile = (filePath) => {
	var fileData = xlsx.parse(filePath);
	return loadFile;
}

var xlsxBuilder = (data) => {
	if(fs.ensureDirSync(filePath)){
		var fileData = loadFile(filePath);
		const dataFormat = data.map( v =>{
			const stock = v.stock;
			return [];
		});
		const xlsxData = [
			...fileData,
			[new Date(),stock.name, stock.num, stock.lastAvgVolume, stock.diffAvgVolume],
		];
		var buffer = xlsx.build([{name: "filte-by-volumes", data: xlsxData}]);
		fs.writeFileSync(filePath, buffer, 'binary');
	}else{
		createNewFile(filePath,data);
	}
}

inquirer.prompt({
	type: 'input',
	name: 'stock_number',
	message: 'Please type the stock symbol[number]',
}).then( a => {
	console.log(a);
	if(a.stock_number){
		getVolume(a.stock_number).then( v => {
			if(v.status){
				xlsxBuilder(v.stock);
			}else{
				console.log("no...");
			}
		})
	}
})