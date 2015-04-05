(function(){
	
	
	JenScript.LabelPlugin = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.LabelPlugin, JenScript.Plugin);
	JenScript.Model.addMethods(JenScript.LabelPlugin,{
		
		_init : function(config){
			config=config||{};
			this.text;
			this.textAnchor = 'start';
			this.textColor=(config.textColor !== undefined)? config.textColor:'black';
			this.outlineColor=config.outlineColor;
			this.outlineWidth=(config.outlineWidth !== undefined)? config.outlineWidth:1;
			this.shader = config.shader;
			this.fillColor = config.fillColor;
			this.nature = (config.nature !== undefined)? config.nature :'Device';
			this.fontSize = (config.fontSize !== undefined)? config.fontSize :12;
			JenScript.Plugin.call(this, {name : "LabelPlugin"});
		},
		setText : function(text){
			this.text=text;
		},
		setTextColor : function(text){
			this.textColor=textColor;
		},
		setTextAnchor : function(textAnchor){
			this.textAnchor=textAnchor;
		},
		setX : function(x){
			this.x=x;
		},
		getX : function(){
			return this.x;
		},
		setY : function(y){
			this.y=y;
		},
		getY : function(){
			return this.y;
		},
		
		paintPlugin : function(g2d, part) {
			if (part !== JenScript.ViewPart.Device) {
				return;
			}
			if(this.x === undefined || this.y === undefined || this.text === undefined)
				return;
			
			var x = this.x;
			var y = this.y;
			if(this.nature === 'User'){
				x = this.getProjection().userToPixelX(x);
				y = this.getProjection().userToPixelY(y);
			}
			
			var label = new JenScript.AbstractLabel();
			label.setTextAnchor(this.textAnchor);
			label.setText(this.text);
			label.setLocation(new JenScript.Point2D(x,y));
			label.setFontSize(this.fontSize);
	        label.setTextColor(this.textColor);
			label.setOutlineColor(this.outlineColor);
			label.setOutlineWidth(this.outlineWidth);
			label.setShader(this.shader);
			label.setFillColor(this.fillColor);
			label.paintLabel(g2d);
		}
		
	});
	
	
})();