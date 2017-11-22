module.exports = function findByQuery(inputObj, collectionName,queryObj){
	return new Promise( (resolve,reject) => {
		if(!inputObj.db) throw new Error('insertDocuments must be used after connect mongodb');
		const db = inputObj.db;
		var collection = db.collection(collectionName);
		// console.log(collection);
		// console.log(queryObj);
		if(typeof queryObj !== 'object') throw new Error('param "queryObj" must be object');
		collection.find(queryObj).toArray(function(err, docs) {
		    console.log("Found the following records");
		    resolve({
		    	...inputObj,
		    	findByQueryDocs: docs,
		    });
		});      
	});
}