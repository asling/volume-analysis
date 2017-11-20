const match = String.prototype.match;
module.exports = function getStockType(stockNum){
	if(match.call(stockNum,/^3[0|9]/) || match.call(stockNum,/^00/)){
		return 1;
	}else if(match.call(stockNum,/^60/) || match.call(stockNum,/^90/)){
		return 0;
	}else{
		return -1;
	}
}