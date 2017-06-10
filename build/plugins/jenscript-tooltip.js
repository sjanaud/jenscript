// JenScript - 1.3.2 2017-06-10
// http://jenscript.io - Copyright 2017 Sébastien Janaud. All Rights reserved

(function(){
	/**
	 * Object Tooltip()
	 * Defines Tooltip
	 * @param {Object} config
	 * @param {String} [config.name] the tooltip type name
	 * @param {String} [config.text] the tooltip text
	 * @param {String} [config.textColor] the text color
	 * @param {String} [location] the tooltip location
	 * @param {Number} [config.fontSize] the tooltip text font size
	 * @param {Object} [config.shader] the tooltip fill shader
	 * @param {Object} [config.shader.percents] the tooltip fill shader percents array
	 * @param {Object} [config.shader.colors] the tooltip fill shader colors array
	 * @param {Object} [config.shader.opacity] the tooltip fill shader opacity array
	 * @param {String} [config.paintType] the tooltip paint type should be , Both, Stroke, Fill, None
	 * @param {String} [config.outlineColor] the tooltip outline color
	 * @param {String} [config.cornerRadius] the tooltip outline corner radius
	 * @param {String} [config.fillColor] the tooltip fill color
	 */
	JenScript.Tooltip = function(config) {
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.Tooltip,{
		
		/**
		 * Initialize Tooltip
		 * @param {Object} config
		 * @param {String} [config.name] the tooltip type name
		 * @param {Boolean} [config.visible] tooltip visible flag
		 * @param {String} [config.text] the tooltip text
		 * @param {String} [config.textColor] the text color
		 * @param {String} [location] the tooltip location
		 * @param {Number} [config.fontSize] the tooltip text font size
		 * @param {Object} [config.shader] the tooltip fill shader
		 * @param {Object} [config.shader.percents] the tooltip fill shader percents array
		 * @param {Object} [config.shader.colors] the tooltip fill shader colors array
		 * @param {Object} [config.shader.opacity] the tooltip fill shader opacity array
		 * @param {String} [config.paintType] the tooltip paint type should be , Both, Stroke, Fill, None
		 * @param {String} [config.outlineColor] the tooltip outline color
		 * @param {String} [config.cornerRadius] the tooltip outline corner radius
		 * @param {String} [config.fillColor] the tooltip fill color
		 */
		init : function(config){
			config = config || {};
			this.Id = (config.Id !== undefined)?config.Id:'Tooltip'+JenScript.sequenceId++;
			this.opacity =  (config.opacity !== undefined)? config.opacity : 1;
			this.name = (config.name !== undefined)? config.name:'Anonymous Tooltip';
			this.visible = (config.visible !== undefined)? config.visible : true;
			this.width = (config.width !== undefined)? config.width:200;
			this.text = (config.text !== undefined)? config.text:'Tooltip';
			this.textColor = config.textColor;
			this.fontSize = (config.fontSize !== undefined)? config.fontSize : 12;
			
			this.paintType = (config.paintType !== undefined)? config.paintType : 'Both';//Stroke //Fill //None
			this.cornerRadius = (config.cornerRadius !== undefined)? config.cornerRadius : 0;
			this.outlineWidth = (config.outlineWidth !== undefined)? config.outlineWidth : 1;
			
			this.shader = config.shader;
			this.outlineColor = config.outlineColor;
			this.fillColor = config.fillColor;
			this.fillOpacity =  (config.fillOpacity !== undefined)? config.fillOpacity : 1;
			
			this.deltaOn = (config.deltaOn !== undefined)? config.deltaOn : 4; 
			this.deltaOut = (config.deltaOut !== undefined)? config.deltaOut : 12;  
			this.padding = 10;
			this.arrowAnchor = config.arrowAnchor;
			
			this.position = config.position;
			this.lengthRatio = (config.lengthRatio !== undefined)? config.lengthRatio : 0.5;
			
		},
		
		equals : function(o){
			if(o === undefined) return false;
			if(o.Id === undefined) return false;
			return (o.Id === this.Id);
		},
		
		setText : function(text) {
			this.text = text;
		},

		getText : function() {
			return this.text;
		},
		
		setArrowAnchor : function(arrowAnchor) {
			this.arrowAnchor = arrowAnchor;
		},

		getArrowAnchor : function() {
			return this.arrowAnchor;
		},
		
		setVisible : function(visible) {
			this.visible = visible;
		},

		isVisible : function() {
			return this.visible;
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
		
		textLayout : function (text,svgTextElement,maxWidth,x,ddy,justified) {
		        var dashArray = new Array();
		        var dashFound = true;
		        var indexPos = 0;
		        var stackY = 0;
		        while (dashFound == true) {
		                var result = text.indexOf("-",indexPos);
		                if (result == -1) {
		                        dashFound = false;
		                }
		                else {
		                        dashArray.push(result);
		                        indexPos = result + 1;
		                }
		        }
		        var words = text.split(/[\s-]/);
		        var line = "";
		        var dy = 0;
		        var curNumChars = 0;
		        var computedTextLength = 0;
		        var textNode;
		        var tspan;
		        var lastLineBreak = 0;
		        
		        for (i=0;i<words.length;i++) {
		                var word = words[i];
		                curNumChars += word.length + 1;
		                if (computedTextLength > maxWidth || i == 0) {
		                        if (computedTextLength > maxWidth) {
		                             var tempText = tspan.firstChild.nodeValue;
		                             tempText = tempText.slice(0,(tempText.length - words[i-1].length - 2)); //the -2 is because we also strip off white space
		                             tspan.firstChild.nodeValue = tempText;
		                             if (justified) {
		                               var nrWords = tempText.split(/\s/).length;
		                               computedTextLength = tspan.getComputedTextLength();
		                               var additionalWordSpacing = (maxWidth - computedTextLength) / (nrWords - 1);
		                               tspan.setAttributeNS(null,"word-spacing",additionalWordSpacing);
		                             }
		                        }
		                        tspan = document.createElementNS(JenScript.SVG_NS,"tspan");
		                        tspan.setAttributeNS(null,"x",x);
		                        tspan.setAttributeNS(null,"dy",dy);
		                        textNode = document.createTextNode(line);
		                        tspan.appendChild(textNode);
		                        svgTextElement.appendChild(tspan);
		                        
		                        if(this.isDash(dashArray,curNumChars-1)) {
		                           line = word + "-";
		                        }
		                        else {
		                           line = word + " ";
		                        }
		                        if (i != 0) {
		                           line = words[i-1] + " " + line;
		                        }
		                        dy = ddy;
		                        stackY += dy;
		                }
		                else {
		                	
		                        if(this.isDash(dashArray,curNumChars-1)) {
		                                line += word + "-";
		                        }
		                        else {
		                                line += word + " ";
		                        }
		                }
		                tspan.firstChild.nodeValue = line;
		                computedTextLength = tspan.getComputedTextLength();
		                if (i == words.length - 1) {
		                  if (computedTextLength > maxWidth) {
			                    var tempText = tspan.firstChild.nodeValue;
			                    tspan.firstChild.nodeValue = tempText.slice(0,(tempText.length - words[i].length - 1));
			                    tspan = document.createElementNS(JenScript.SVG_NS,"tspan");
			                    tspan.setAttributeNS(null,"x",x);
			                    tspan.setAttributeNS(null,"dy",dy);
			                    textNode = document.createTextNode(words[i]);
			                    tspan.appendChild(textNode);
			                    svgTextElement.appendChild(tspan);
		                  }
		                }
		        }
		        return stackY;
		},

		isDash :function (dashArray,pos) {
		        var result = false;
		        for (var i=0;i<dashArray.length;i++) {
		                if (dashArray[i] == pos) {
		                        result = true;
		                }
		        }
		        return result;
		},
		
		paintTooltip : function(g2d){
			 if(!this.isVisible()){
				g2d.deleteGraphicsElement(this.Id);
				return;
			 }
			 if(this.arrowAnchor === undefined){
				throw Error('Arrow Anchor should be supplied.');
			 }
			
			 var tooltip = new JenScript.SVGGroup().Id(this.Id).toSVG();
			 g2d.insertSVG(tooltip);
			
			 var svgText = new JenScript.SVGText().Id(this.Id)
													.location(0,0)
													.fill(this.textColor)
													.fontSize(this.fontSize)
													.textAnchor('start')
													.toSVG();
			 
			 tooltip.appendChild(svgText);
			 var h = this.textLayout(this.text,svgText,this.width,0, this.fontSize, true );
			 var svgRect = svgText.getBBox();
			 var dx;
			 var dy;
			 if(this.position === 'bottom'){
				  dx = this.arrowAnchor.x - ((svgRect.width + 2*this.padding)*this.lengthRatio) +this.padding;
				  dy = this.arrowAnchor.y + this.deltaOut + this.padding +this.fontSize;
				  svgText.setAttribute('transform','translate('+dx+','+dy+')');
			 }
			 else if(this.position === 'top'){
				  dx = this.arrowAnchor.x - ((svgRect.width + 2*this.padding)*this.lengthRatio) + this.padding;
				  dy = this.arrowAnchor.y - this.deltaOut - svgRect.height + this.fontSize - this.padding;
				  svgText.setAttribute('transform','translate('+dx+','+dy+')');
			 }
			 else if(this.position === 'left'){
				  dx = this.arrowAnchor.x - this.deltaOut - ((svgRect.width + 2*this.padding))+this.padding;
				  dy = this.arrowAnchor.y - (svgRect.height + 2*this.padding)*this.lengthRatio + this.fontSize+this.padding;
				  svgText.setAttribute('transform','translate('+dx+','+dy+')');
			 }
			 else if(this.position === 'right'){
				  dx = this.arrowAnchor.x + this.deltaOut +1*this.padding;
				  dy = this.arrowAnchor.y - (svgRect.height + 2*this.padding)*this.lengthRatio + this.fontSize+this.padding;
				  svgText.setAttribute('transform','translate('+dx+','+dy+')');
			 }else{
				 throw Error('Tooltip bad position : '+this.position);
			 }
			
			 if(this.paintType !== 'None'){
					var r = {x : svgRect.x - this.padding + dx, y : svgRect.y - this.padding + dy, width : svgRect.width + 2*this.padding, height : svgRect.height + 2*this.padding};
					var tr = this.getPath(r,g2d);
					tr.attr('stroke-linejoin','round');
					tr.attr('stroke-linecap','round');
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
					var bgTooltip = tr.toSVG();
					svgText.parentNode.insertBefore(bgTooltip,svgText);
				}
		},

		getPath : function(b,g2d){
			 var rr = [{x : b.x, y : b.y}, {x : b.x+b.width, y : b.y}, {x : b.x+b.width, y : b.y+b.height}, {x : b.x, y : b.y+b.height}];
			 var ra ;
			 if(this.position === 'top'){
				 var pt = {x : b.x + b.width*this.lengthRatio, y : b.y+b.height};
				 ra = [{x : pt.x + this.deltaOn, y : pt.y}, {x : pt.x , y : pt.y + this.deltaOut},{x : pt.x - this.deltaOn, y : pt.y} ];
				 rr.splice.apply(rr,[3,0].concat(ra));
			 }
			 if(this.position === 'bottom'){
				 var pt = {x : b.x + b.width*this.lengthRatio, y : b.y};
				 ra = [{x : pt.x - this.deltaOn, y : pt.y}, {x : pt.x , y : pt.y - this.deltaOut},{x : pt.x + this.deltaOn, y : pt.y} ];
				 rr.splice.apply(rr,[1,0].concat(ra));
			 }
			 if(this.position === 'left'){
				 var pt = {x : b.x + b.width, y : b.y + b.height*this.lengthRatio};
				 ra = [{x : pt.x , y : pt.y - this.deltaOn}, {x : pt.x + this.deltaOut, y : pt.y },{x : pt.x , y : pt.y + this.deltaOn} ];
				 rr.splice.apply(rr,[2,0].concat(ra));
			 }
			 if(this.position === 'right'){
				 var pt = {x : b.x , y : b.y + b.height*this.lengthRatio};
				 ra = [{x : pt.x , y : pt.y + this.deltaOn}, {x : pt.x - this.deltaOut, y : pt.y },{x : pt.x , y : pt.y - this.deltaOn} ];
				 rr.splice.apply(rr,[4,0].concat(ra));
			 }
				
			 var path = new JenScript.SVGPath();
			 path.moveTo(rr[0].x,rr[0].y);
			 for (var i = 1; i < rr.length; i++) {
				 path.lineTo(rr[i].x,rr[i].y);
			}
			 path.close();
			 return path;
		},
	});
})();
(function(){
	
	JenScript.TooltipPlugin = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.TooltipPlugin, JenScript.Plugin);
	JenScript.Model.addMethods(JenScript.TooltipPlugin,{
		
		_init : function(config){
			config=config||{};
			config.name ='TooltipPlugin';
			this.tooltip = config.tooltip;
			JenScript.Plugin.call(this, config);
		},
		
		/**
		 * paint tooltip in this plugin graphic context
		 * @param {Object} graphics context 
		 * @param {String} view part name
		 */
		paintPlugin : function(g2d, part) {
			if (part !== JenScript.ViewPart.Device) {
				return;
			}
			this.tooltip.paintTooltip(g2d);
		}
	});
})();