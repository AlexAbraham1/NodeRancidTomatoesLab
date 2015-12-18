module.exports = function() {
	String.prototype.startsWith = function(suffix) {
	    return this.indexOf(suffix, 0) === 0;
	};
}
