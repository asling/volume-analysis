const stockService = require("./stock-service");

stockService('000002',10).then(v =>{
	console.log('v',v);
});