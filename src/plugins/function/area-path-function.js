(function(){
	
	/**
	 * Object Area()
	 * Defines area function
	 * @param {Object} config
	 */
	JenScript.Area = function(config) {
		//JenScript.Area
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.Area, JenScript.AbstractPathFunction);
	JenScript.Model.addMethods(JenScript.Area, {
		/**
		 * Initialize Area Function
		 * Defines a area function
		 * @param {Object} config
		 * @param {Number} config.areaBase
		 * @param {Object} config.shader
		 */
		_init : function(config){
			config = config || {};
			config.name = 'AreaPathFunction';
			this.areaBase = config.areaBase;
			this.shader = config.shader;
		    JenScript.AbstractPathFunction.call(this,config);
		},
		
		
		createAreaPath : function (){
			var pathData = this.buildPath();
			var p = this.getProjection();
			if (this.source.getNature().isXFunction()) {
				if(this.areaBase === undefined)
				this.areaBase = this.minFunction().y; //assume XFunction
				this.base = p.userToPixelY(this.areaBase);
				var areaMax = this.maxFunction().y; //assume XFunction
				this.max = p.userToPixelY(areaMax);
				var userPointsFunction = this.source.getCurrentFunction();			
				var first = userPointsFunction[0];
				var last  = userPointsFunction[userPointsFunction.length-1];
				pathData = pathData+'L'+p.userToPixelX(last.x)+','+this.base+'L'+p.userToPixelX(first.x)+','+this.base+'Z';
				
			}else if(this.source.getNature().isYFunction()){
				if(this.areaBase === undefined)
				this.areaBase = this.minFunction().x; //assume YFunction
				var base = p.userToPixelX(this.areaBase);
				var areaMax = this.maxFunction().x; //assume YFunction
				this.max = p.userToPixelX(areaMax);
				var userPointsFunction = this.source.getCurrentFunction();			
				var first = userPointsFunction[0];
				var last  = userPointsFunction[userPointsFunction.length-1];
				pathData = pathData+'L'+this.base+','+p.userToPixelY(last.y)+'L'+this.base+','+p.userToPixelY(first.y)+'Z';
			}
			return pathData;
		},
		
		/**
		 * paint area function
		 * @param g2d the graphics context
		 */
		paintFunction : function(g2d){
			var pd = this.createAreaPath();
			var gradientId = this.Id+'_areagradient';
			g2d.deleteGraphicsElement(gradientId);
			 /** default shader fractions */
			if(this.shader === undefined)
				this.shader = {percents : [ '0%', '100%' ],opacity:[1,0.2], colors : [this.themeColor,this.themeColor]};
		    var gradient   = new JenScript.SVGLinearGradient().Id(gradientId).from(0,this.max).to(0, this.base).shade(this.shader.percents,this.shader.colors,this.shader.opacity);
		    if(this.source.getNature().isXFunction()){
		    	 gradient.from(0,this.max).to(0, this.base);
		    }
			else if(this.source.getNature().isYFunction()){
				gradient.from(this.max,0).to(this.base, 0);
			}
			g2d.definesSVG(gradient.toSVG());
			var path = new JenScript.SVGElement().attr('id',this.Id).name('path').attr('stroke',this.strokeWidth).attr('fill','url(#'+gradientId+')').attr('d',pd).buildHTML();
			g2d.insertSVG(path);
		}
	});
})();