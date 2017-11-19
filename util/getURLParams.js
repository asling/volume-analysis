module.exports = function(url){
	if(typeof url !== 'string') throw new Error('error url, this must be string');
	const queryObj = {};
	const queryString = url.split("?") && url.split("?")[1] ? url.split("?")[1] : '';
	const queryPairsArr = queryString.split("&").length > 0 && queryString.split("&");
	for( let pair of queryPairsArr){
		const pairArr = pair.split("=");
		if(pairArr[1]){
			queryObj[pairArr[0]] = pairArr[1];
		}
	}
	return queryObj;
}