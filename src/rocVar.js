const inquirer = require("inquirer");
module.exports = function(){
	return inquirer.prompt([{
		type: 'input',
		name: 'days',
		message: 'input your days'
	},{
		type: 'input',
		name: 'range',
		message: 'input your range'
	}]).then( v =>{
		return {
			days: v.days || 3,
			range: v.range || 10,
		}
	});
}