module.exports = function(dateParam){
	let date = null;
	if(dateParam instanceof Date) date = dateParam;
	if(typeof dateParam === 'number' || typeof dateParam === 'string' ) date = new Date(dateParam);
	if(new Date(dateParam) === 'Invalid Date') throw new Error('Invalid Date');
	const trueMonth = date.getMonth()+1 <= 9 ? '0'+(date.getMonth()+1) : date.getMonth()+1;
	const trueDate = date.getDate() <= 9 ? '0'+date.getDate() : date.getDate();
	return `${trueMonth}/${trueDate}/${date.getFullYear()}`;
}