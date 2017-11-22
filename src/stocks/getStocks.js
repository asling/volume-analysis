const { 
  connect, 
  findDocByQuery, 
  insertDocuments,
  findDocuments, 
  removeDocument, 
  updateDocument
} = require("../../db/mongo");
const dbName = 'stocksProject';
const stockCollectionName = 'stockFeedback';

module.exports = function(){
	return connect(dbName).then( dbData => {
		return findDocuments(dbData,stockCollectionName);
	}).then( res => {
		if(res && res.documents.length > 0){
			console.log("res",res);
			return res.documents;
			res.db.close();
		}

	}).catch( e => {
		console.log(e);
	});
}