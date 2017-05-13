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
		
		var labels = [];
		var slices = [];
		var effects = [];
		var lastSlice;
		
		//improve with index 
		var slice = function(config){
			var s = new JenScript.PieSlice(config);
			lastSlice = s;
			pie.addSlice(s);
			slices.push(s);
			return this;
		}
		var label = function(type,config){
			var l;
			if('radial' === type)
				l = new JenScript.PieRadialLabel(config);
			if('border' === type)
				l = new JenScript.PieBorderLabel(config);
			lastSlice.setSliceLabel(l);
			labels.push(l);
			return this;
		}
		var effect = function(type, config){
			var fx;
			if('linear' === type)
				fx = new JenScript.PieLinearEffect(config);
			if('reflection' === type)
				fx = new JenScript.PieReflectionEffect(config);
			pie.addEffect(fx);
			effects.push(fx);
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
		
		//Pie Builder Interface
		return {
			slice : slice,
			label : label,
			effect : effect,
			linearFx : linearFx,
			reflectFx : reflectFx,
			
			view : function(){return view;},
			projection : function(){return projection;},
			pie : function(){return pie;},
			labels : function(){return labels;},
			slices : function(){return slice;},
			effects : function(){return effects;},
		};
	};
})();

