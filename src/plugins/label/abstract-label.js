(function(){
	/**
	 * Object AbstractLabel()
	 * Defines Abstract Label
	 * @param {Object} config
	 * @param {String} [config.name] the label type name
	 * @param {String} [config.text] the label text
	 * @param {String} [config.textColor] the label text color
	 * @param {Number} [config.fontSize] the label text font size
	 * @param {String} [config.textAnchor] the label text anchor
	 * @param {Object} [config.shader] the label fill shader
	 * @param {Object} [config.shader.percents] the label fill shader percents
	 * @param {Object} [config.shader.colors] the label fill shader colors
	 * @param {String} [config.paintType] the label paint type should be , Both, Stroke, Fill, None
	 * @param {String} [config.outlineColor] the label outline color
	 * @param {String} [config.cornerRadius] the label outline corner radius
	 * @param {String} [config.fillColor] the label fill color
	 */
	JenScript.AbstractLabel = function(config) {
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.AbstractLabel,{
		
		/**
		 * Initialize Abstract  Label
		 * @param {Object} config
		 * @param {String} [config.name] the label type name
		 * @param {String} [config.text] the label text
		 * @param {String} [config.textColor] the label text color
		 * @param {String} [location] the label location
		 * @param {Number} [config.fontSize] the label text font size
		 * @param {String} [config.textAnchor] the label text anchor
		 * @param {Object} [config.shader] the label fill shader
		 * @param {Object} [config.shader.percents] the label fill shader percents array
		 * @param {Object} [config.shader.colors] the label fill shader colors array
		 * @param {Object} [config.shader.opacity] the label fill shader opacity array
		 * @param {String} [config.paintType] the label paint type should be , Both, Stroke, Fill, None
		 * @param {String} [config.outlineColor] the label outline color
		 * @param {String} [config.cornerRadius] the label outline corner radius
		 * @param {String} [config.fillColor] the label fill color
		 */
		init : function(config){
			config = config || {};
			this.Id = (config.Id !== undefined)?config.Id:'label'+JenScript.sequenceId++;
			this.opacity =  (config.opacity !== undefined)? config.opacity : 1;
			this.name = (config.name !== undefined)? config.name:'Unamed Label';
			this.location = (config.location !== undefined)? config.location:new JenScript.Point2D(0,0);
			
			this.text = (config.text !== undefined)? config.text:'Label';
			this.textColor = config.textColor;
			this.fontSize = (config.fontSize !== undefined)? config.fontSize : 12;
			this.textAnchor = (config.textAnchor !== undefined)? config.textAnchor : 'start';
			
			this.paintType = (config.paintType !== undefined)? config.paintType : 'Both';//Stroke //Fill //None
			this.cornerRadius = (config.cornerRadius !== undefined)? config.cornerRadius : 0;
			this.outlineWidth = (config.outlineWidth !== undefined)? config.outlineWidth : 1;
			
			this.shader = config.shader ;
			this.outlineColor = config.outlineColor;
			this.fillColor = config.fillColor;
			this.fillOpacity =  (config.fillOpacity !== undefined)? config.fillOpacity : 1;
			
			this.proj;
			this.nature = (config.nature !== undefined)? config.nature : 'Device';
			/**svg elements*/
		    this.svg={};
		},
		
		equals : function(o){
			if(o === undefined) return false;
			if(o.Id === undefined) return false;
			return (o.Id === this.Id);
		},
		
		setProjection : function(proj) {
			this.proj = proj;
		},

		getProjection : function() {
			return this.proj;
		},
		
		setNature : function(nature) {
			this.nature = nature;
		},

		getNature : function() {
			return this.nature;
		},
		
		setText : function(text) {
			this.text = text;
		},

		getText : function() {
			return this.text;
		},
		
		setX : function(x) {
			this.location.x = x;
		},
		
		setY : function(y) {
			this.location.y = y;
		},
		
		getX : function() {
			return this.location.x;
		},
		
		getY : function() {
			return this.location.y;
		},
		
		setLocation : function(location) {
			this.location = location;
		},
		
		setLocation : function(location) {
			this.location = location;
		},

		getLocation : function() {
			return this.location;
		},

		setTextColor : function(textColor) {
			this.textColor = textColor;
		},

		getTextColor : function() {
			return this.textColor;
		},
		
		setFontSize : function(fontSize) {
			this.fontSize = fontSize;
		},

		getFontSize : function() {
			return this.fontSize;
		},
		
		setTextAnchor : function(textAnchor) {
			this.textAnchor = textAnchor;
		},

		getTextAnchor : function() {
			return this.textAnchor;
		},
		
		setShader : function(shader){
			this.shader = shader;
		},
		
		getShader : function(){
			return this.shader;
		},
		
		setOutlineColor : function(outlineColor){
			this.outlineColor = outlineColor;
		},
		
		getOutlineColor : function(){
			return this.outlineColor;
		},
		
		setOutlineWidth : function(outlineWidth){
			this.outlineWidth = outlineWidth;
		},
		
		getOutlineWidth : function(){
			return this.outlineWidth;
		},
		
		setFillColor : function(fillColor){
			this.fillColor = fillColor;
		},
		
		getFillColor : function(){
			return this.fillColor;
		},
		
		setOpacity : function(opacity){
			this.opacity = opacity;
		},
		
		getOpacity : function(){
			return this.opacity;
		},
		
		
		/**
		 * paint text and envelope if all parameter are set.
		 * helper method that can be call in inherits objects.
		 * @param {Object} graphics context
		 */
		paintLabel : function(g2d){
			var label = new JenScript.SVGGroup().Id(this.Id).opacity(this.opacity);
			var lx,ly;
			if(this.proj !== undefined && this.nature === 'User'){
				lx = this.proj.userToPixelX(this.getLocation().x);
				ly = this.proj.userToPixelY(this.getLocation().y);
				
			}else{
				lx = this.getLocation().x;
				ly = this.getLocation().y;
			}
			var c = (this.getTextColor() !== undefined)?this.getTextColor():'black';
			var sl = new JenScript.SVGElement().name('text')
												.attr('x',lx)
												.attr('y',ly)
												.attr('font-size',this.getFontSize())
												.attr('fill',c)
												.attr('text-anchor',this.getTextAnchor())
												.textContent(this.getText())
												.buildHTML();
			label.child(sl);
			g2d.deleteGraphicsElement(this.Id);
			var svgLabel = label.toSVG();
			this.svg.label = svgLabel;
			g2d.insertSVG(svgLabel);
			if(this.paintType !== 'None'){
				var svgRect = sl.getBBox();
						
				var tr = new JenScript.SVGRect().origin((svgRect.x-10),(svgRect.y-2))
								.size((svgRect.width+20),(svgRect.height+4))
								.radius(this.cornerRadius,this.cornerRadius)
								.strokeNone()
								.fillNone();
						
					
					if(this.paintType === 'Fill' || this.paintType === 'Both'){
							if(this.fillColor !== undefined){
								tr.fill(this.fillColor).fillOpacity(this.fillOpacity);
							}else{
								if(this.shader !== undefined && this.shader.percents !== undefined && this.shader.colors !== undefined){
									var gradient= new JenScript.SVGLinearGradient().Id(this.Id+'gradient').from(svgRect.x,(svgRect.y-2)).to(svgRect.x, (svgRect.y+4+svgRect.height)).shade(this.getShader().percents,this.getShader().colors,this.getShader().opacity).fillOpacity(this.fillOpacity).toSVG();
									g2d.deleteGraphicsElement(this.Id+'gradient');
									g2d.definesSVG(gradient);
									tr.fillURL(this.Id+'gradient');
								}
							}
						
					}
					if(this.paintType === 'Stroke' || this.paintType === 'Both' ){
						
						if(this.getOutlineColor() !== undefined){
							tr.stroke(this.getOutlineColor()).strokeWidth(this.outlineWidth);
						}
					}
					sl.parentNode.insertBefore(tr.toSVG(),sl);
				}			
		},
	});
	
})();