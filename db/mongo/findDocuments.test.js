const connect = require("./connect");
const findDocs = require("./findDocuments");
connect("stocksProject").then( o2 => {
	return findDocs(o2,"stocks");
}).then( o2 => {
	console.log('o2',o2.documents.length);
	console.log('o2',o2.documents[o2.documents.length-1]);
	return findDocs(o2,"stockFeedback");
}).then( o3 => {
	console.log('o3',o3.documents.length);
	o3.db.close();
});