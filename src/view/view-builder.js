(function(){
	JenScript.ViewBuilder = function(config){
		var v = new JenScript.View(config);
		return {
			projection : function(type, config){
				var p;
				
				if('linear' === type)
					p = new JenScript.LinearProjection(config);
				if('logx' === type)
					p = new JenScript.LogXProjection(config);
				if('logy' === type)
					p = new JenScript.LogYProjection(config);
				if('logxy' === type)
					p = new JenScript.LogXLogYProjection(config);
				if('timex' === type)
					p = new JenScript.TimeXProjection(config);
				if('timey' === type)
					p = new JenScript.TimeYProjection(config);
				
				//builder interfaces
				return {
					pie : function(config){return new JenScript.PieBuilder(v,p,config);},
					donut3d : function(config){return new JenScript.Donut3DBuilder(v,p,config);},
					donut2d : function(config){return new JenScript.Donut2DBuilder(v,p,config);},
				}
			}
		};
	};
})();