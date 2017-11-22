const getROC = require("./getROC.v2");
getROC("600118",{range:10,date:'11/13/2017'}).then( v => {
	console.log("v",v);
});
