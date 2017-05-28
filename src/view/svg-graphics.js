(function() {
	
	SVGElement.prototype.getTransformToElement = SVGElement.prototype.getTransformToElement || function(elem) {
	    return elem.getScreenCTM().inverse().multiply(this.getScreenCTM());
	};
	
	/**
     * @constructor
     * @memberof JenScript
     */
	JenScript.Graphics = function(config) {
		this.init(config);
		this.definitions = config.definitions;
		this.graphics = config.graphics;
	},
	JenScript.Model.addMethods(JenScript.Graphics, {
		init : function(config){
			config=config || {};
		},
		
		/**
		 * clear the graphics content of the given element Id.
		 * clear all graphics if not specified
		 * @param {String} graphicsId
		 */
		clearGraphics : function(graphicsId){
			if(graphicsId === undefined){
				while (this.definitions.firstChild) {
					this.definitions.removeChild(this.definitions.firstChild);
				}
				while (this.graphics.firstChild) {
					this.graphics.removeChild(this.graphics.firstChild);
				}
				
			}
			else{
				var gfxNode = document.getElementById(graphicsId);
				if(gfxNode !== null){
					while (gfxNode.firstChild) {
						gfxNode.removeChild(gfxNode.firstChild);
					}
				}
				
			}
		},
		
		/**
		 * get the given graphics element specified by Id
		 * @param {String} graphicsId
		 * @returns graphics element
		 */
		getGraphicsElement : function(graphicsId){
			return document.getElementById(graphicsId);
		},
		
		/**
		 * delete the given graphics element specified by Id
		 * @param {String} graphicsId
		 * @returns graphics element
		 */
		deleteGraphicsElement : function(graphicsId){
			var element = document.getElementById(graphicsId);
			if(element !== undefined && element!== null && element.parentNode!==undefined && element.parentNode!==null){
				var removed = element.parentNode.removeChild(element);
				return removed;
			}
		},
		
		/**
		 * defines a texture in this graphics context
		 * @param {String} textureId
		 * @param {Object} texture
		 */
		definesTexture : function(texture){
			var texturePattern = texture.pattern;
			var textureDefinitions = texture.definitions;
			
			if(textureDefinitions !== undefined){
				for (var i = 0; i < textureDefinitions.length; i++) {
					var def = textureDefinitions[i];
					this.definitions.appendChild(def.toSVG());
				}
			}
			if(texturePattern !== undefined){
				this.definitions.appendChild(texturePattern.Id(texture.getId()).toSVG());
			}
		},
		
		
		/**
		 * defines a svg element
		 */
		definesSVG : function(def) {
			this.definitions.appendChild(def);
		},
		
		/**
		 * append the given svg element to the root of this graphics context
		 */
		insertSVG : function(svg,parent) {
			if(parent === undefined){
				this.graphics.appendChild(svg);
			}else{
				parent.appendChild(svg);
			}
		},
		
		
	});
		
	
	JenScript.SVGElement  = function(){
		 var builder = function(){
			this.attributes={};
			this.childs=[];
			
			this.name = function(name){
				this.n=name;
				return this;
			},
			
	   		this.textContent = function(text){
				this.t=text;
	   			return this;
	   		},
	   		
	   		this.attr = function(name,value){
	   			if(name !== undefined && value !== undefined){
	   				this.attributes[name] = {'name':name,'value':value};
	   				return this;
	   			}
	   			else if(name !== undefined && value === undefined){
	   				return this.attributes[name];
	   			}
	   		},
	   		
	   		this.attrNS = function(ns, name,value){
	   			if(name !== undefined && value !== undefined){
	   				this.attributes[name] = {ns : ns ,'name':name,'value':value};
	   				return this;
	   			}
	   			else if(name !== undefined && value === undefined){
	   				return this.attributes[name];
	   			}
	   		},
	   		
	   		this.removeAttr = function(name){
	   			if(name !== undefined ){
	   				delete this.attributes[name];
	   				return this;
	   			}
	   		},
	   		
	   		this.child = function(children){
	   			if(children !== undefined)
	   				this.childs[this.childs.length] = children;
	   			return this;
	   		},
	   		
	   		this.buildHTML = function(){
	   			var e = document.createElementNS(JenScript.SVG_NS,this.n);
	   			for(var propt in this.attributes){
	   				if(this.attributes[propt].ns === undefined)
	   					e.setAttribute(this.attributes[propt].name,this.attributes[propt].value);
	   				else
	   					e.setAttributeNS(this.attributes[propt].ns,this.attributes[propt].name,this.attributes[propt].value);
	   			}
	   			for(var i = 0;i<this.childs.length;i++){
	   				e.appendChild(this.childs[i]);	
	   			}
	   			if(this.t !== undefined){
	   				var tn = document.createTextNode(this.t);
	       			e.appendChild(tn);	
	   			}
	       		return e;
	   		};
		};
		var e = new builder();
		return e;
	};
	
	JenScript.SVGGeometry  = function(config){
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.SVGGeometry,{
		init : function(config){
			this.rootBuilder = new JenScript.SVGElement();	
		},
		builder : function(){
			return this.rootBuilder;
		},
		toSVG : function(){
			return this.rootBuilder.buildHTML();
		},
		attr : function(name,value){
			if(name !== undefined && value !== undefined){
				this.rootBuilder.attr(name,value);
				return this;
			}
			else if(name !== undefined && value === undefined){
				return this.rootBuilder.attr(name);
			}
		},
		attrNS : function(ns,name,value){
			if(name !== undefined && value !== undefined){
				this.rootBuilder.attrNS(ns,name,value);
				return this;
			}
			else if(name !== undefined && value === undefined){
				return this.rootBuilder.attr(name);
			}
		},
		name : function(name){
			this.rootBuilder.attr('name',name);
			return this;
		},
		child : function(child){
			this.rootBuilder.child(child);
			return this;
		},
		textContent : function(text){
			this.rootBuilder.textContent(text);
			return this;
		},
		Id : function(Id){
			this.rootBuilder.attr('id',Id);
			return this;
		},
		clazz : function(clazzes){
			this.rootBuilder.attr('class',clazzes);
			return this;
		},
		style : function(style){
			this.rootBuilder.attr('style',style);
			return this;
		},
		stroke : function(color){
			this.rootBuilder.attr('stroke',color);
			return this;
		},
		strokeNone : function(){
			this.rootBuilder.attr('stroke','none');
			return this;
		},
		strokeWidth : function(width){
			this.rootBuilder.attr('stroke-width',width);
			return this;
		},
		strokeLineJoin : function(join){//mitter,round,bevel
			this.rootBuilder.attr('stroke-linejoin',join);
			return this;
		},
		strokeLineCap : function(cap){//cap : round,butt,square
			this.rootBuilder.attr('stroke-linecap',cap);
			return this;
		},
		strokeOpacity : function(opacity){
			this.rootBuilder.attr('stroke-opacity',opacity);
			return this;
		},
		fill : function(color){
			this.rootBuilder.attr('fill',color);
			return this;
		},
		fillURL : function(url){
			this.rootBuilder.attr('fill','url(#'+url+')');
			return this;
		},
		fillNone : function(){
			this.rootBuilder.attr('fill','none');
			return this;
		},
		fillOpacity : function(opacity){
			this.rootBuilder.attr('fill-opacity',opacity);
			return this;
		},
		opacity : function(opacity){
			this.rootBuilder.attr('opacity',opacity);
			return this;
		},
		clip : function(clipId){
			this.rootBuilder.attr('clip-path','url(#'+clipId+')');
			return this;
		},
		mask : function(maskId){
			this.rootBuilder.attr('mask','url(#'+maskId+')');
			return this;
		},
		fontSize : function(fontSize){
			this.rootBuilder.attr('font-size',fontSize);
			return this;
		},
		fontFamily : function(fontFamily){
			this.rootBuilder.attr('font-family',fontFamily);
			return this;
		},
		pointerEvents : function(type){
			this.rootBuilder.attr('pointer-events',type);
			return this;
		},
		
	});
	
	
	JenScript.SVGViewBox = function() {
		this._init();
	};
	JenScript.Model.inheritPrototype(JenScript.SVGViewBox, JenScript.SVGGeometry);
	JenScript.Model.addMethods(JenScript.SVGViewBox,{
		_init: function(){
			JenScript.SVGGeometry.call(this,{});
			this.builder().name('svg').attr('xmlns',JenScript.SVG_NS).attr('xmlns:xlink',JenScript.XLINK_NS).attr('version',JenScript.SVG_VERSION);
		},		
		viewBox : function(box){
			this.attr('viewBox',box);
			return this;
		},
		width : function(width){
			this.attr('width',width);
			return this;
		},
		height : function(height){
			this.attr('height',height);
			return this;
		},
		
	});
	
	JenScript.SVGRect = function() {
		this._init();
	};
	JenScript.Model.inheritPrototype(JenScript.SVGRect, JenScript.SVGGeometry);
	JenScript.Model.addMethods(JenScript.SVGRect,{
		_init: function(){
			JenScript.SVGGeometry.call(this,{});
			this.builder().name('rect');
		},
		
		getBound2D : function(){
			return new JenScript.Bound2D(this.attr('x').value,this.attr('y').value,this.attr('width').value,this.attr('height').value);
		},
		
		origin : function(x,y){
			this.attr('x',x);
			this.attr('y',y);
			return this;
		},
		size : function(width,height){
			this.attr('width',width);
			this.attr('height',height);
			return this;
		},
		radius : function(rx,ry){
			this.attr('rx',rx);
			this.attr('ry',ry);
			return this;
		},
	});
	
	JenScript.SVGPolygon = function() {
		this._init();
	};
	JenScript.Model.inheritPrototype(JenScript.SVGPolygon, JenScript.SVGGeometry);
	JenScript.Model.addMethods(JenScript.SVGPolygon,{
		_init: function(){
			JenScript.SVGGeometry.call(this,{});
			this.builder().name('polygon');
			this.points = [];
		},
		
//		getBound2D : function(){
//			return new JenScript.Bound2D(this.attr('x').value,this.attr('y').value,this.attr('width').value,this.attr('height').value);
//		},
		
		buildPolygon : function(){
			var pathData ='';
			for (var i = 0; i < this.points.length; i++) {
				pathData= pathData+this.points[i].getX() +','+this.points[i].getY()+' ';
			}
			return pathData;
		},
		
		point : function(x,y){
			this.points[this.points.length] = new JenScript.Point2D(x,y);
			this.attr('points',this.buildPolygon());
			return this;
		},
	});
	
	JenScript.SVGClipPath = function() {
		this._init();
	};
	JenScript.Model.inheritPrototype(JenScript.SVGClipPath, JenScript.SVGGeometry);
	JenScript.Model.addMethods(JenScript.SVGClipPath,{
		_init: function(){
			JenScript.SVGGeometry.call(this,{});
			this.builder().name('clipPath').attr('clipPathUnits','userSpaceOnUse');
		},
		
		appendPath : function(path){
			this.child(path.toSVG());
			return this;
		}
	});
	
	JenScript.SVGLine = function() {
		this._init();
	};
	JenScript.Model.inheritPrototype(JenScript.SVGLine, JenScript.SVGGeometry);
	JenScript.Model.addMethods(JenScript.SVGLine,{
		_init: function(){
			JenScript.SVGGeometry.call(this,{});
			this.builder().name('line');
		},
		from : function(x1,y1){
			this.attr('x1',x1);
			this.attr('y1',y1);
			return this;
		},
		to : function(x2,y2){
			this.attr('x2',x2);
			this.attr('y2',y2);
			return this;
		},
	});
	
	JenScript.SVGLinearGradient = function() {
		this._init();
	};
	JenScript.Model.inheritPrototype(JenScript.SVGLinearGradient, JenScript.SVGGeometry);
	JenScript.Model.addMethods(JenScript.SVGLinearGradient,{
		_init: function(){
			JenScript.SVGGeometry.call(this,{});
			this.builder().name('linearGradient').attr('gradientUnits','userSpaceOnUse');
		},
		from : function(x1,y1){
			this.attr('x1',x1);
			this.attr('y1',y1);
			return this;
		},
		to : function(x2,y2){
			this.attr('x2',x2);
			this.attr('y2',y2);
			return this;
		},
		shade : function(percents,colors,opacity){
			var len = percents.length;
			for (var i = 0; i < len; i++) {
				var op = 1;
				if(opacity !== undefined)
					op = opacity[i];
				var gs = new JenScript.SVGElement().name('stop')
										.attr('offset',percents[i])
										.attr('stop-color',colors[i])
										.attr('stop-opacity',op)
										.buildHTML();
				this.child(gs);
			}
			return this;
		}
		
	});
	
	JenScript.SVGRadialGradient = function() {
		this._init();
	};
	JenScript.Model.inheritPrototype(JenScript.SVGRadialGradient, JenScript.SVGGeometry);
	JenScript.Model.addMethods(JenScript.SVGRadialGradient,{
		_init: function(){
			JenScript.SVGGeometry.call(this,{});
			this.builder().name('radialGradient').attr('gradientUnits','userSpaceOnUse');
		},
		center : function(x,y){
			this.attr('cx',x);
			this.attr('cy',y);
			return this;
		},
		focus : function(x,y){
			this.attr('fx',x);
			this.attr('fy',y);
			return this;
		},
		radius : function(r){
			this.attr('r',r);
			return this;
		},
		spread : function(spread){
			this.attr('spreadMethod',spread);
			return this;
		},
		transform : function(transform){
			this.attr('gradientTransform',transform);
			return this;
		},
		shade : function(percents,colors){
			var len = percents.length;
			for (var i = 0; i < len; i++) {
				var gs = new JenScript.SVGElement().name('stop')
										.attr('offset',percents[i])
										.attr('style','stop-color:'+colors[i])
										.buildHTML();
				this.child(gs);
			}
			return this;
		}
		
	});
	
	
	
	JenScript.SVGFilter = function() {
		this._init();
	};
	JenScript.Model.inheritPrototype(JenScript.SVGFilter, JenScript.SVGGeometry);
	JenScript.Model.addMethods(JenScript.SVGFilter,{
		_init: function(){
			JenScript.SVGGeometry.call(this,{});
			this.builder().name('filter').attr('filterUnits','userSpaceOnUse');
		},
		from : function(x,y){
			this.attr('x',x);
			this.attr('y',y);
			return this;
		},
		size : function(width,height){
			this.attr('width',width);
			this.attr('height',height);
			return this;
		},
		
	});
	
	JenScript.SVGMask = function() {
		this._init();
	};
	JenScript.Model.inheritPrototype(JenScript.SVGMask, JenScript.SVGGeometry);
	JenScript.Model.addMethods(JenScript.SVGMask,{
		_init: function(){
			JenScript.SVGGeometry.call(this,null);
			this.builder().name('mask').attr('maskUnits','userSpaceOnUse');
		},
		from : function(x,y){
			this.attr('x',x);
			this.attr('y',y);
			return this;
		},
		size : function(width,height){
			this.attr('width',width);
			this.attr('height',height);
			return this;
		},
		
	});
	
	JenScript.SVGPattern = function() {
		this._init();
	};
	JenScript.Model.inheritPrototype(JenScript.SVGPattern, JenScript.SVGGeometry);
	JenScript.Model.addMethods(JenScript.SVGPattern,{
		_init: function(){
			JenScript.SVGGeometry.call(this,null);
			this.builder().name('pattern').attr('patternUnits','userSpaceOnUse');
		},
		origin : function(x,y){
			this.attr('x',x);
			this.attr('y',y);
			return this;
		},
		size : function(width,height){
			this.attr('width',width);
			this.attr('height',height);
			return this;
		},
	});
	
	JenScript.SVGScript = function() {
		this._init();
	};
	JenScript.Model.inheritPrototype(JenScript.SVGScript, JenScript.SVGGeometry);
	JenScript.Model.addMethods(JenScript.SVGScript,{
		_init: function(){
			JenScript.SVGGeometry.call(this,null);
			this.builder().name('script').attr('type','application/ecmascript');
		},
		script : function(script){
			//this.textContent('\n'+'//<![CDATA['+'\n'+script+'\n'+'//]]\>');
			//this.textContent('\n'+'//<![CDATA['+'\n'+script+'\n'+']]\>');
			//this.textContent('//<![CDATA['+script+']]\>');
			this.textContent('<![CDATA['+script+']]>');
			return this;
		}
	});
	
	
	
	JenScript.SVGGroup = function() {
		this._init();
	};
	JenScript.Model.inheritPrototype(JenScript.SVGGroup, JenScript.SVGGeometry);
	JenScript.Model.addMethods(JenScript.SVGGroup,{
		_init: function(){
			JenScript.SVGGeometry.call(this,null);
			this.builder().name('g');
		},
	});
	
	JenScript.SVGDefinitions = function() {
		this._init();
	};
	JenScript.Model.inheritPrototype(JenScript.SVGDefinitions, JenScript.SVGGeometry);
	JenScript.Model.addMethods(JenScript.SVGDefinitions,{
		_init: function(){
			JenScript.SVGGeometry.call(this,null);
			this.builder().name('defs');
		},
	});
	
	JenScript.SVGCircle = function() {
		this._init();
	};
	JenScript.Model.inheritPrototype(JenScript.SVGCircle, JenScript.SVGGeometry);
	JenScript.Model.addMethods(JenScript.SVGCircle,{
		_init: function(){
			JenScript.SVGGeometry.call(this,null);
			this.builder().name('circle');
		},
		center : function(x,y){
			this.attr('cx',x);
			this.attr('cy',y);
			return this;
		},
		radius : function(r){
			this.attr('r',r);
			return this;
		},
		
	});
	
	JenScript.SVGText = function() {
		this._init();
	};
	JenScript.Model.inheritPrototype(JenScript.SVGText, JenScript.SVGGeometry);
	JenScript.Model.addMethods(JenScript.SVGText,{
		_init: function(){
			JenScript.SVGGeometry.call(this,null);
			this.builder().name('text');
		},
		
		location : function(x,y){
			this.attr('x',x);
			this.attr('y',y);
			return this;
		},
		
		textAnchor : function(anchor){
			this.attr('text-anchor',anchor);
			return this;
		},
		
	});
	
	JenScript.SVGImage = function() {
		this._init();
	};
	JenScript.Model.inheritPrototype(JenScript.SVGImage, JenScript.SVGGeometry);
	JenScript.Model.addMethods(JenScript.SVGImage,{
		_init: function(){
			JenScript.SVGGeometry.call(this,null);
			this.builder().name('image');
		},
		
		xlinkHref : function(imageURL){
			this.attrNS(JenScript.XLINK_NS,'href',imageURL);
			return this;
		},
		
		origin : function(x,y){
			this.attr('x',x);
			this.attr('y',y);
			return this;
		},
		size : function(w,h){
			this.attr('width',w);
			this.attr('height',h);
			return this;
		}
		
	});
	
	JenScript.SVGUse = function() {
		this._init();
	};
	JenScript.Model.inheritPrototype(JenScript.SVGUse, JenScript.SVGGeometry);
	JenScript.Model.addMethods(JenScript.SVGUse,{
		_init: function(){
			JenScript.SVGGeometry.call(this,null);
			this.builder().name('use');
		},
		
		getBound2D : function(){
			return new JenScript.Bound2D(this.attr('x').value,this.attr('y').value,this.attr('width').value,this.attr('height').value);
		},
		
		xlinkHref : function(use){
			this.attrNS(JenScript.XLINK_NS,'xlink:href',use);
			return this;
		},
	});
	
	JenScript.SVGTextPath = function() {
		this._init();
	};
	JenScript.Model.inheritPrototype(JenScript.SVGTextPath, JenScript.SVGGeometry);
	JenScript.Model.addMethods(JenScript.SVGTextPath,{
		_init: function(){
			JenScript.SVGGeometry.call(this,null);
			this.builder().name('textPath');
		},
		
		xlinkHref : function(pathRef){
			this.attrNS(JenScript.XLINK_NS,'href',pathRef);
			return this;
		},
		
		startOffset : function(startOffset){
			this.attr('startOffset',startOffset);
			return this;
		},
		method : function(method){
			this.attr('method',method);
			return this;
		},
		methodAlign : function(){
			this.attr('method','align');
			return this;
		},
		methodStretch : function(){
			this.attr('method','stretch');
			return this;
		},
		spacing : function(spacing){
			this.attr('spacing',spacing);
			return this;
		},
		spacingAuto : function(){
			this.attr('spacing','auto');
			return this;
		},
		spacingExact : function(){
			this.attr('spacing','exact');
			return this;
		}
		
	});
	
	JenScript.SVGTSpan = function() {
		this._init();
	};
	JenScript.Model.inheritPrototype(JenScript.SVGTSpan, JenScript.SVGGeometry);
	JenScript.Model.addMethods(JenScript.SVGTSpan,{
		_init: function(){
			JenScript.SVGGeometry.call(this,null);
			this.builder().name('tspan');
		},
		
		dx : function(dx){
			this.attr('dx',dx);
			return this;
		},
		dy : function(dy){
			this.attr('dy',dy);
			return this;
		},
	});
	
	JenScript.SVGPath = function() {
		this._init();
	};
	JenScript.Model.inheritPrototype(JenScript.SVGPath, JenScript.SVGGeometry);
	JenScript.Model.addMethods(JenScript.SVGPath,{
		_init: function(){
			JenScript.SVGGeometry.call(this,null);
			this.builder().name('path');
			this.segments = [];
			this.buildAuto = true;
		},
		
		getSegments : function(){
			return this.segments;
		},
		
		pointAtLength : function(length){
			return this.geometryPath.pointAtLength(length);
		},
	
		angleAtLength : function(length){
			return this.geometryPath.angleAtLength(length);
		},
		
		buildPath : function(){
			var path='';
			var segments = this.segments;
			for (var i = 0; i < segments.length; i++) {
				if(segments[i].type === 'M')
					path = path  + segments[i].type+segments[i].x+','+segments[i].y+' ';
				if(segments[i].type === 'L')
					path = path  + segments[i].type+segments[i].x+','+segments[i].y+' ';
				if(segments[i].type === 'Q')
					path = path  + segments[i].type+segments[i].x1+','+segments[i].y1+' '+segments[i].x+','+segments[i].y+' ';
				if(segments[i].type === 'C')
					path = path  + segments[i].type+segments[i].x1+','+segments[i].y1+' '+segments[i].x2+','+segments[i].y2+' '+segments[i].x+','+segments[i].y+' ';
				if(segments[i].type === 'A')
					path = path  + segments[i].type+segments[i].rx+','+segments[i].ry+' '+segments[i].xAxisRotation+' '+segments[i].largeArcFlag+','+segments[i].sweepFlag+' '+segments[i].x+','+segments[i].y+' ';
				if(segments[i].type === 'Z')
					path = path  + segments[i].type+' ';
			}
			this.pathdata = path;
			//this.geometryPath = new JenScript.GeometryPath(this.toSVG());
			return path;
		},
		
		finalyze : function(){
			this.attr('d',this.buildPath());
		},
		
		registerSegment : function(fragment){
			this.segments[this.segments.length] = fragment;
			if(this.buildAuto)
				this.attr('d',this.buildPath());
			return this;
		},
		
//		append : function(svgPath){
//			var segments = svgPath.getSegments();
//			for(var i=0;i<segments.length;i++){
//				this.registerSegment(segments[i]);
//			}
//		},
		
		moveTo : function(x,y){
			this.registerSegment({type : 'M',x:x,y:y});
			return this;
		},
		lineTo : function(x,y){
			this.registerSegment({type : 'L',x:x,y:y});
			return this;
		},
		curveTo : function(x1,y1,x2,y2,x,y){
			this.registerSegment({type : 'C',x1:x1,y1:y1,x2:x2,y2:y2,x:x,y:y});
			return this;
		},
		smoothCurveTo : function(x2,y2,x,y){
			this.registerSegment({type : 'S',x2:x2,y2:y2,x:x,y:y});
			return this;
		},
		quadTo : function(x1,y1,x,y){
			this.registerSegment({type : 'Q',x1:x1,y1:y1,x:x,y:y});
			return this;
		},
		smoothQuadTo : function(x,y){
			this.registerSegment({type : 'T',x:x,y:y});
			return this;
		},
		arcTo : function(rx,ry,xAxisRotation,largeArcFlag,sweepFlag,x,y){
			this.registerSegment({type : 'A',rx:rx,ry:ry,xAxisRotation:xAxisRotation,largeArcFlag:largeArcFlag,sweepFlag:sweepFlag,x:x,y:y});
			return this;
		},
		close : function(){
			this.registerSegment({type : 'Z'});
			return this;
		}
	});
	
})();