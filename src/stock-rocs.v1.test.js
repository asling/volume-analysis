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

// const startTime = new Date('10/1/2017').getTime();
// function dateFormat(time){
//   const year = time.getFullYear();
//   const month = time.getMonth()+1;
//   const day = time.getDate();
//   // console.log(`${month}/${day}/${year}`);
//   return `${month}/${day}/${year}`
// }
// const endTime = new Date(dateFormat(new Date())).getTime();
//   let date = startTime;
//   const diff = 24*3600000;
//   const result = [];
//   while(date <= endTime){
//     console.log(dateFormat(new Date(date)))
//     date = date + diff;

//   }
