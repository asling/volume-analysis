const gen = require('./stock-rocs.v1');
//运行函数
function run(gen){
  var g = gen('000002',10);

  function next(data){
    var result = g.next(data);
    if (result.done){
      console.log(result.value);
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
run(gen);