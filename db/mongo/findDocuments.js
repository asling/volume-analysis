module.exports = function findDocuments(inputObj,collectionName){
	return new Promise( (resolve,reject) => {
		if(!inputObj.db) throw new Error('insertDocuments must be used after connect mongodb');
		const db = inputObj.db;
		var collection = db.collection(collectionName);
		collection.find({}).toArray( (err,docs) => {
			if(err) throw new Error(err);
			console.log("Found the following records");
			resolve({
				...inputObj,
				documents: docs,
			});
		});
	});
}