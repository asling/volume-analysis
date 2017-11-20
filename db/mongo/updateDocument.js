module.exports = function updateDocument(inputObj,collectionName,updateObj,toObj){
	return new Promise( (resolve,reject) => {
		if(!inputObj.db) throw new Error('insertDocuments must be used after connect mongodb');
		const db = inputObj.db;
		var collection = db.collection(collectionName);
		if(typeof updateObj !== 'object') throw new Error('param "updateObj" must be object');
		if(typeof toObj !== 'object') throw new Error('param "toObj" must be object');
		collection.updateOne(updateObj,{$set: toObj}, (err,result) => {
			if(err) throw new Error(err);
			resolve({
				...inputObj,
				updateDocumentResult: result,
			});
		});
	});
}