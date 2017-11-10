const inquirer = require("inquirer");
module.exports = function(){
	return inquirer.prompt([{
		type: 'input',
		name: 'daysGap',
		message: 'input your daysGap'
	},{
		type: 'input',
		name: 'diffGap',
		message: 'input your diffGap(please greater than daysGap)'
	}]).then( v =>{
		return {
			daysGap: v.daysGap || 3,
			diffGap: v.diffGap || 5,
		}
	});
}