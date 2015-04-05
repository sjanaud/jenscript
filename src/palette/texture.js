(function(){
	
	/**
	 * Texture is defined by the pattern itself and related pattern definitions like gradients
	 * @param {Object} pattern
	 * @param {Object} definitions
	 */
	JenScript.Texture =  function(pattern,definitions){
		this.Id = 'texture'+JenScript.sequenceId++;
		this.pattern = pattern;
		this.definitions = definitions;
	};
	
	JenScript.Texture.prototype = {
		getId : function(){
			return this.Id;
		},
		getPattern : function(){
			return this.pattern;
		},
		getDefinitions : function(){
			return this.definitions;
		}
	};
	
	
	/**
	 * create a carbon texture with triangle pattern
	 */
	JenScript.Texture.getTriangleCarbonFiber = function(size){
		var width = (size !== undefined)?size :10;
		var height = (size !== undefined)?size :10;
		var pattern  = new JenScript.SVGPattern();
		var r0  = new JenScript.SVGRect().origin(0,0).size(width,height).strokeNone().fill('darkgray');
		var p1  = new JenScript.SVGPolygon().point(width/2,0).point(width/2,height).point(0,height/2).strokeNone().fill('black');
		var p2  = new JenScript.SVGPolygon().point(width/2,0).point(width,0).point(width,height/2).strokeNone().fill('black');
		var p3  = new JenScript.SVGPolygon().point(width,height/2).point(width,height).point(width/2,height).strokeNone().fill('black');
		pattern.size(width,height).child(r0.toSVG()).child(p1.toSVG()).child(p2.toSVG()).child(p3.toSVG());
		return new JenScript.Texture(pattern);
	},
	
	/**
	 * create a carbon texture with square pattern
	 */
	JenScript.Texture.getSquareCarbonFiber = function(){
		var width = 20;
		var height = 20;
		var pattern  = new JenScript.SVGPattern().size(width,height);
		var r0  = new JenScript.SVGRect().origin(0,0).size(width,height).strokeNone().fill('rgb(60,60,60)');
		pattern.child(r0.toSVG());
		var definitions =[];
		var w = 10;
		var h = 10;
		var x = 0;
		var y;
		for (var i = -10; i < 12; i = i + 2 * h) {
			y = i;
			x = -w / 2;
			for (var j = 0; j < 5; j++) {
				var gradient1Id = "texture_gradient"+JenScript.sequenceId++;
				var percents1 = ['0%','100%'];
				var colors1 =['black','darkgray'];
				var gradient1= new JenScript.SVGLinearGradient().Id(gradient1Id).from(x + w / 2, y).to(x + w / 2, y + h).shade(percents1,colors1);
				definitions[definitions.length] = gradient1;
				var r1  = new JenScript.SVGRect().origin(x,y).size(w,h).strokeNone().fill('url(#'+gradient1Id+')');
				pattern.child(r1.toSVG());

				var gradient2Id = "texture_gradient"+JenScript.sequenceId++;
				var percents2 = ['0%','100%'];
				var colors2 =['black','darkgray'];
				var gradient2= new JenScript.SVGLinearGradient().Id(gradient2Id).from(x, y / 4).to(x + w, y / 4).shade(percents2,colors2);
				definitions[definitions.length] = gradient2;
				var r2  = new JenScript.SVGRect().origin(x,y).size(w,h/2).strokeNone().fill('url(#'+gradient1Id+')');
				pattern.child(r2.toSVG());
				x = x + w / 2;
				y = y + h / 2;
			}
		}
		return new JenScript.Texture(pattern, definitions);
	};
})();