function contacts(opts){
	var contactsBiz = require('biz/crm/contactsBiz')();
	return contactsBiz;
}
module.exports = contacts;
