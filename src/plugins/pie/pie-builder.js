(function(){
	
	//R. Module pattern
	
	JenScript.PieBuilder = function(view,projection,config) {
		view.registerProjection(projection);
		var pp = new JenScript.PiePlugin();
		projection.registerPlugin(pp);
		var pie = new JenScript.Pie(config);
		pp.addPie(pie);
		var fill = new JenScript.PieDefaultFill();
		pie.setFill(fill);
		var lastSlice;
		var slice = function(config){
			var s = new JenScript.PieSlice(config);
			lastSlice = s;
			pie.addSlice(s);
			return this;
		}
		var label = function(type,config){
			var l;
			if('radial' === type)
				l = new JenScript.PieRadialLabel(config);
			if('border' === type)
				l = new JenScript.PieBorderLabel(config);
			lastSlice.setSliceLabel(l);
			return this;
		}
		var effect = function(type, config){
			var fx;
			if('linear' === type)
				fx = new JenScript.PieLinearEffect(config);
			if('reflection' === type)
				fx = new JenScript.PieReflectionEffect(config);
			pie.addEffect(fx);
			return this;
		}
		var linearFx = function(config){
			effect('linear',config);
			return this;
		}
		var reflectFx = function(config){
			effect('reflection',config);
			return this;
		}
		return {
			slice : slice,
			label : label,
			effect : effect,
			linearFx : linearFx,
			reflectFx : reflectFx,
			view : function(){return view;},
			projection : function(){return projection;},
		};
	};
})();

