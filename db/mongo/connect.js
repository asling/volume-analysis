const MongoClient = require("mongodb").MongoClient;



module.exports = function(database){
	const dbUrl = `mongodb://localhost:27017/${database}`;
	return new Promise( (resolve,reject) => {
		MongoClient.connect(dbUrl, (err,db) => {
			if(err){
				reject(err);
			}
			console.log("Connected successfully to server");
			resolve({db});
		});
	});
}