function fun1(){
	return new Promise( (resolve,reject) => {
		const a = 1;
		setTimeout( function(){
			resolve({a});
		},500);
	} )
}

function fun2(obj){
	return new Promise( (resolve,reject) => {
		const b = 2;
		setTimeout( function(){
			console.log('inputParam1',obj);
			resolve({...obj,b});
		},500);
	});
}

function fun3(obj){
	return new Promise( (resolve,reject) => {
		const c = 3;
		setTimeout( function(){
			console.log('inputParam2',obj);
			resolve({...obj,c});
		},500);
	});
}


fun1().then( a => {
	return fun2(a);
} ).then( b => {
	return fun3(b);
}).then( c => {
	console.log("c",c);
});