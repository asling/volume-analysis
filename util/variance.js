/*
	avg,
	[array],
	arg1,arg2,...
*/

module.exports = function(avg,...values){
	let inputArray;
	if(!values.length || values.length <=0) throw new Error('must be array of number of signle number');
	if(values[0] instanceof Array){
		inputArray = values[0];
	}else{
		inputArray = values;
	}
	const varianceSum = inputArray.reduce( (sum,item) => {
		return sum += Math.pow(parseFloat(Number(item)) - parseFloat(Number(avg)),2);
	},0);
	return (varianceSum / inputArray.length).toFixed(2);
}