(function(){
	JenScript.RayPainter = function(config) {
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.RayPainter,{
		init : function(config){
			config=config||{};
		},
		paintRay : function(g2d,ray,viewPart) {}
	});
})();