let i = 1;
while(true){
	console.log(i++);
}

process.on('SIGINT', () => {
  console.log('Received SIGINT.  Press Control-D to exit.');
});
process.on('exit', (code) => {
  // 
  console.log('这里就是监听程序退出的回调函数');
});