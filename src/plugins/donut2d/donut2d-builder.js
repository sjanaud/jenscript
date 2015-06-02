(function(){
	
	//R. Module pattern
	
	JenScript.Donut2DBuilder = function(view,projection,config) {
		view.registerProjection(projection);
		var dp = new JenScript.Donut2DPlugin();
		projection.registerPlugin(dp);
		
		var donut = new JenScript.Donut2D(config);
		dp.addDonut(donut);
		
		var labels = [];
		var slices = [];
		var effects = [];
		var lastSlice;
		
		//improve with index 
		var slice = function(config){
			var s = new JenScript.Donut2DSlice(config);
			lastSlice = s;
			donut.addSlice(s);
			slices.push(s);
			return this;
		}
		var label = function(type,config){
			var l;
			if('radial' === type)
				l = new JenScript.Donut2DRadialLabel(config);
			if('border' === type)
				l = new JenScript.Donut2DBorderLabel(config);
			lastSlice.addSliceLabel(l);
			labels.push(l);
			return this;
		}
		var effect = function(type, config){
			var fx;
			if('linear' === type)
				fx = new JenScript.Donut2DLinearEffect(config);
			if('reflection' === type)
				fx = new JenScript.Donut2DReflectionEffect(config);
			donut.addEffect(fx);
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
			donut : function(){return donut;},
			labels : function(){return labels;},
			slices : function(){return slice;},
		};
	};
})();

