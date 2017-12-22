const { 
  connect, 
  findDocByQuery, 
  insertDocuments, 
  removeDocument, 
  updateDocument
} = require("../../db/mongo");
const getStockItemData = require("./getStockItemData");

const { STOCK_TYPE_TODAY, STOCK_TYPE_LAST } = require("../../constance"); 

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
const minutesCollection = 'stockMinutes';
const feedbackCollection = 'stockFeedback';

function reverseDate(dateStr){
	const year = dateStr.slice(0,4);
	const month = dateStr.slice(4,6);
	const day = dateStr.slice(6);
	// console.log(`${month}/${day}/${year}`);
	return {
		year,
		month: parseInt(month)-1,
		day,
	};
}

function splitData(rawData){
  if(!rawData)  return false;
  const detailData = [],date = rawData.date;
  let volumes = 0,hightest = 0,lowest = 0;
  // console.log(rawData.data && rawData.data.length);
  if(rawData.data && rawData.data.length > 0){
    const rawDetail = rawData.data;
    lowest = rawDetail[0][1];
    for(let item of rawDetail){
      // console.log("item",item);
      volumes += item[3];
      if(hightest < parseFloat(item[1]).toFixed(2)) hightest = item[1];
      if(lowest > parseFloat(item[1]).toFixed(2))   lowest = item[1];
      const dateObj = reverseDate(date);
      // console.log("new Date("+dateObj.year+", "+dateObj.month+", "+dateObj.day+", "+parseInt(item[0].slice(0,2))+","+parseInt(item[0].slice(2,4))+"))");
      // console.log("item[1]",item[1]);
      detailData.push({
      	dateStr: date+":"+item[0],
      	date: new Date(dateObj.year, dateObj.month, dateObj.day, parseInt(item[0].slice(0,2)),parseInt(item[0].slice(2,4))).getTime(),
      	price: item[1],
      	symbol: rawData.symbol,
      	avg: item[2],
      	volumes: item[3],
      });
      
    }
  }
  return {
  	general: {
  		date,
  		name: rawData.name,
  		symbol: rawData.symbol,
  		open: rawData.data &&  rawData.data[0][1],
  		close: rawData.data && rawData.data[rawData.data.length-1][1],
  		hightest,
  		lowest,
  		volumes,
  	},
  	detail : detailData,
  };

}

function* gen(){
  const stocks = yield getStocks();
  const dbObj = yield connect("stocksProject");
  if(stocks instanceof Array && stocks.length > 0){
    for(let item of stocks){
      console.log("item",'000002');
      let rawDataStr = yield getStockItemData('000002', STOCK_TYPE_TODAY);
      let rawData = null,stockData = null;
      if(rawDataStr){
        rawData = JSON.parse(rawDataStr);
        stockData = splitData(rawData);
      }
      // console.log("rawDataStr",rawDataStr);
      console.log("stockData",stockData);
      process.exit(0);
      
      if(rawData && stockData && stockData.length > 0){
        let feedbackInDb = yield findDocByQuery(dbObj,feedbackCollection,{symbol: rawData.symbol});
        let dateTime = new Date().getTime();
        console.log("dateTime",dateTime);
        let feedbackStatus,updateStatus = false;
        if(!feedbackInDb.findByQueryDocs || feedbackInDb.findByQueryDocs.length <= 0){
          feedbackStatus = true;
        }else{
          // if(feedbackInDb.findByQueryDocs[0] && parseInt(dateTime) > parseInt(feedbackInDb.findByQueryDocs[0]['date_added'])){
          //   feedbackStatus = true;
          //   updateStatus = true;
          // }else{
            feedbackStatus = false;
          // }
        }
        console.log("updateStatus",updateStatus);
        if(feedbackStatus){
          for(let detailItem of stockData){
            let dataInDb = yield findDocByQuery(dbObj,collectionName,{date: detailItem.date, symbol: detailItem.symbol});
            // console.log("dataInDb",dataInDb);
            if(!dataInDb.findByQueryDocs || dataInDb.findByQueryDocs.length <= 0){
              detailItem.status = 'added';
              detailItem.statusCode = '1';
              let insertResult = yield insertDocuments(dataInDb,collectionName,detailItem);
              console.log("added");
              // console.log("insertResult",insertResult);
            }else{
              console.log("skip");
            }
          }
          if(updateStatus){
            const feedbackItem = {
                "symbol": rawData.symbol,
                "date_added": dateTime,
                "msg": 'updated',
            };
            let feedbackResult = yield updateDocument(dbObj,feedbackCollection,{symbol: rawData.symbol},feedbackItem);
            console.log(chalk.blue(`updated complete ${rawData.symbol}`));
          }else{
            const feedbackItem = {
                "symbol": rawData.symbol,
                "date_added": new Date().getTime(),
                "msg": 'added',
            };
            let feedbackResult = yield insertDocuments(dbObj,feedbackCollection,feedbackItem);
            console.log(chalk.blue(`added complete ${rawData.symbol}`));
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
