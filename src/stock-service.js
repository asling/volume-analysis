const stockgen = require('./stock-rocs.v1');
//运行函数
function* run(gen,stock_num,range){
  var g = gen(stock_num,range);
  function next(data){
    var result = g.next(data);
    if (result.done){
      return result.value;
    } 
    if(result.value){
      result.value.then(function(data){
        return next(data);
      });
    }else{
      return next(null);
    }
    
  }

  return next();
}
module.exports = function(stock_num,range){
  const gen = function* (){
    const result = yield run(stockgen,stock_num,range).next();
    console.log("result",result);
  }
  const g = gen();
  g.next();
  g.next();

}