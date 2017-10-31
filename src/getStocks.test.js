const getStocks = require('./getStocks');

var gen = function* (){
	let result;
	getStocks().then( v => {
			result = v;
			console.log(v);
			console.log("------------------");
	});
	yield 
}

// var g = gen();

// const result = g.next();


// console.log(result);
// console.log("------------------");