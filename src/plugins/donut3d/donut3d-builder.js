(function(){
	
	//R. Module pattern
	
	JenScript.Donut3DBuilder = function(view,projection,config) {
		view.registerProjection(projection);
		var dp = new JenScript.Donut3DPlugin();
		projection.registerPlugin(dp);
		
		var donut = new JenScript.Donut3D(config);
		dp.addDonut(donut);
		
		var labels = [];
		var slices = [];
		var lastSlice;
		
		//improve with index 
		var slice = function(config){
			var s = new JenScript.Donut3DSlice(config);
			lastSlice = s;
			donut.addSlice(s);
			slices.push(s);
			return this;
		}
		var label = function(type,config){
			var l;
			if('radial' === type)
				l = new JenScript.Donut3DRadialLabel(config);
			if('border' === type)
				l = new JenScript.Donut3DBorderLabel(config);
			lastSlice.addSliceLabel(l);
			labels.push(l);
			return this;
		}
		
		
		//Pie Builder Interface
		return {
			slice : slice,
			label : label,
			
			view : function(){return view;},
			projection : function(){return projection;},
			donut : function(){return donut;},
			labels : function(){return labels;},
			slices : function(){return slice;},
		};
	};
})();

