const connect = require("./connect");
const findDocs = require("./findDocuments");
connect("stocksProject").then( o2 => {
	return findDocs(o2,"stocks");
}).then( o2 => {
	console.log('o2',o2.documents.length);
	console.log('o2',o2.documents[20000]);
	o2.db.close();
});