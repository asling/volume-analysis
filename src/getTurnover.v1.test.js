const getTurnover = require("./getTurnover.v1");

getTurnover("600728",{daysGap:3,diffGap:10}).then( v => {
	console.log(v);
})