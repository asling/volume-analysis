const http = require("http");
const iconv = require('iconv-lite'); 
const BufferHelper = require('bufferhelper');



module.exports = function(config) {

	function checkStatus(response) {
		// console.log('statusCode',response.statusCode);
		if (response.statusCode >= 200 && response.statusCode < 300) {
		    return true;
		}else{
		  	return false;
		}
	}

	return new Promise( (resolve,reject) => {
		const req = http.request(config, (res) => {
		 	var bufferhelper = new BufferHelper();
		 	if(checkStatus(res)){
		 		res.on('data', function (chunk) { 
			 		// console.log('BODY: ' + chunk); 
			 		bufferhelper.concat(chunk);
				});
				res.on("end", function(){
					resolve(iconv.decode(bufferhelper.toBuffer(),'GBK'))
				});
		 	}else{
		 		// console.log(1111);
		 		reject(res.statusMessage);
		 	}
		 	
		});

		req.setTimeout(20000, () =>{
			reject('timeout!!!');
		} )

		req.on('error', function(e) {
			reject(e.message);
		}); 

		req.end();  

		
	});
}
