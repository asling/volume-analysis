const getStockItemData = require("./getStockItemData");

getStockItemData("000002").then( v => {
	console.log(v);
})