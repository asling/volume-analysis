const getStockItemData = require("./getStockItemData");
const { STOCK_TYPE_TODAY, STOCK_TYPE_LAST } = require("../../constance");
getStockItemData("000002",STOCK_TYPE_TODAY).then( v => {
	console.log(v);
});