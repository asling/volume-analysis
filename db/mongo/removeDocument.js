module.exports = function removeDocument(inputObj,collectionName,deleteObj){
	return new Promise( (resolve,reject) => {
		if(!inputObj.db) throw new Error('insertDocuments must be used after connect mongodb');
		const db = inputObj.db;
		var collection = db.collection(collectionName);
		if(typeof deleteObj !== 'object') throw new Error('param "deleteObj" must be object');
		collection.deleteOne(deleteObj,(err,result) => {
			if(err) throw new Error(err);
			resolve({
				...inputObj,
				removeDocumentResult: result,
			});
		});
	});
}