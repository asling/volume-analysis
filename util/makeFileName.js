function padding(data,option = null){
	const num = (data != undefined) && (typeof data !== 'boolean') && (Number(data) >= 0) ? Number(data) : 0;
	const paddingStr = option ? option : 0;
	return num <= 9 ? `${paddingStr}${num}` : num;
}
module.exports = function(){
	const date = new Date();
	const year = date.getFullYear();
	const month = padding(date.getMonth()+1);
	const day = padding(date.getDate());
	const hour = padding(date.getHours());
	const minute = padding(date.getMinutes());
	const second = padding(date.getSeconds());
	const millisecond = padding(date.getMilliseconds(),'00');
	const random = Math.ceil(Math.random()*1000);
	return `${year}${month}${day}${hour}${minute}${second}${millisecond}${random}`;
}