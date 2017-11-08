let stockNumlist = [
	'300715', '000002', '600001', '600004'
];

const request = function(list){
	return new Promise((resolve,reject) => {
		setTimeout( () => {
			resolve(list);
		},3000);
	});
}

module.exports = function(){
	return	request(stockNumlist).then( v =>{
			if(v && v.length > 0){
				console.log(v);
				return v;

			}
			//console.log('content =>=> ',chalk.green(v));
		}, e => {
			console.error(chalk.red(e));
	});
}
