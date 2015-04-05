(function(){
	/**
	 *<code>Indentity projection</code> defines a linear projection bound on [-1,1,-1,1]
	 */
	JenScript.IdentityProjection = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.IdentityProjection, JenScript.LinearProjection);
	JenScript.Model.addMethods(JenScript.IdentityProjection,{
		
		__init : function(config){
			config = config || {};
			JenScript.LinearProjection.call(this, config);
			this.bound(-1,1,-1,1);
		},
	});
})();