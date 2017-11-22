const stockgen = require('./stock-rocs.v1');

module.exports = function(stock_num,range,page){
  return new Promise((resolve,reject) => {
    function run(gen,stock_num,range,page){
      var g = gen(stock_num,range,page);
      function next(data){
        var result = g.next(data);
        if (result.done){
          resolve(result.value);
          return result.value;
        } 
        if(result.value){
          result.value.then(function(data){
             next(data);
          });
        }else{
          next(null);
        }
        
      }
       next();
    }
    run(stockgen,stock_num,range,page);
  });

}