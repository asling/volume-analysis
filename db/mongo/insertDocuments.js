module.exports = function insertDocuments(inputObj,collectionName,documents){
	return new Promise( ( resolve,reject ) => {
		if(!inputObj.db) throw new Error('insertDocuments must be used after connect mongodb');
		const db = inputObj.db;
		var collection = db.collection(collectionName);
		if(documents instanceof Array){
			collection.insertMany(documents,(err,result) => {
				if(err) throw new Error('there is an error');
				console.log(`Inserted ${result.ops.length} documents into the collection`);
				resolve({
					...inputObj,
					insertDocumentsResult: result,
				});
			});
		}else if(typeof documents === 'object'){
			collection.insertMany([documents],(err,result) => {
				if(err) throw new Error('there is an error');
				console.log(`Inserted ${result.ops.length} documents into the collection`);
				resolve({
					...inputObj,
					insertDocumentsResult: result,
				});
			});
		}else{
			//暂无
		} 
		
	});
}