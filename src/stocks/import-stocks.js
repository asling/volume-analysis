const { 
  connect, 
  findDocByQuery, 
  insertDocuments, 
  removeDocument, 
  updateDocument
} = require("../../db/mongo");
const getStockItemData = require("./getStockItemData");
const getStocks = require("../getStocks");
const chalk = require("chalk");
//运行函数
function run(gen){
  var g = gen();

  function next(data){
    var result = g.next(data);
    if (result.done){
      console.log("end");
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
const collectionName = 'stocks';
const feedbackCollection = 'stockFeedback';

function splitData(rawDataStr){
  if(!rawDataStr) return false;
  const rawData = JSON.parse(rawDataStr);
  if(!rawData)  return false;
  const data = [];
  // console.log(rawData.data && rawData.data.length);
  if(rawData.data && rawData.data.length > 0){
    const rawDetail = rawData.data;
    for(let item of rawDetail){
      // console.log("item",item);
      data.push({
        date: item[0],
        name: rawData.name,
        symbol: rawData.symbol,
        open: item[1],
        close: item[2],
        lowest: item[4],
        hightest: item[3],
        volumes: item[5],
      });
    }
  }
  return data;
}

function* gen(){
  const stocks = yield getStocks();
  const dbObj = yield connect("stocksProject");
  if(stocks instanceof Array && stocks.length > 0){
    for(let item of stocks){
      // console.log("item",item);
      let rawDataStr = yield getStockItemData(item);
      // console.log("rawDataStr",rawDataStr);
      let stockData = splitData(rawDataStr);
      // console.log("stockData",stockData);
      if(stockData && stockData.length > 0){
        for(let detailItem of stockData){
          let dataInDb = yield findDocByQuery(dbObj,collectionName,{date: detailItem.date, symbol: detailItem.symbol});
          // console.log("dataInDb",dataInDb);
          if(!dataInDb.findByQueryDocs || dataInDb.findByQueryDocs.length <= 0){
            console.log("added");
            detailItem.status = 'added';
            detailItem.statusCode = '1';
            let insertResult = yield insertDocuments(dataInDb,collectionName,detailItem);
            if(result && result.ops && result.ops.length > 0){
              const feedbackItem = {
                "symbol": detailItem.symbol,
                "date": new Date().getTime(),
                "msg": 'added',
              };
              let feedbackResult = yield insertDocuments(dataInDb,feedbackCollection,feedbackItem);
            }
            console.log("insertResult",insertResult);
          }else{
            console.log("skip");
          }
        }
      }
    }
  }
  dbObj.db.close();
}

var result  = run(gen);

console.log(chalk.green("start"));
console.log(result);
// console.log(step.value);
// console.log();
console.log(chalk.green("end"));
