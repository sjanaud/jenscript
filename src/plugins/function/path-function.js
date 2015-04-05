(function(){
	

	/***
	 * Abstract Path function
	 */
	JenScript.AbstractPathFunction = function(config){
		//JenScript.AbstractPathFunction
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.AbstractPathFunction,{
		init : function(config){
			config = config || {};
			this.name = (config.name !== undefined)? config.name :'Abstract Path Function';
			this.themeColor=(config.themeColor !== undefined)? config.themeColor:'red';
		    /** source function */
		    this.source=config.source;
		    this.source.hostFunction = this;
			this.hostPlugin;
			this.Id = 'pathfunction'+JenScript.sequenceId++;
			/** the geometry path */
			this.geometryPath;
			/** length of path in the device space */
			this.lengthPathDevice;
			/** input metrics registered for this path */
			this.metrics = [];
			this.segments = [];
			this.pathSegments = [];
			this.graphicsContext;
		},
		
		/**
		 * get the projection
		 * @returns projection
		 */
		getProjection : function() {
			return this.hostPlugin.getProjection();
		},

		
		/**
		 * get the function host plugin
		 * @returns hostPlugin
		 */
		getHostPlugin : function() {
			return this.hostPlugin;
		},

		/**
		 * set the function host plugin
		 * @param hostPlugin
		 */
		setHostPlugin : function(hostPlugin) {
			this.hostPlugin = hostPlugin;
		},
		
	    /**
	     * @return the themeColor
	     */
	    getThemeColor : function() {
	        return this.themeColor;
	    },

	    /**
	     * @param themeColor
	     *            the themeColor to set
	     */
	    setThemeColor : function(themeColor) {
	        this.themeColor = themeColor;
	    },

	    /**
	     * get function name
	     * 
	     * @return the name
	     */
	    getName : function() {
	        return this.name;
	    },

	    /**
	     * set function name
	     * 
	     * @param name
	     *            the name to set
	     */
	    setName : function(name) {
	        this.name = name;
	    },
		
		
		/**
		 * set the source function
		 * 
		 * @param source
		 */
		setSource : function(source) {
			this.source = source;
			this.source.hostFunction = this;
		},
		
		
		/**
		 * return the min peak of the current function
		 * @returns minimum peak
		 */
		minFunction : function() {
			var currentFunction = this.source.getCurrentFunction();
			var minFunction = currentFunction[0];
			if (this.source.getNature().isXFunction()) {
				for (var i = 0; i < currentFunction.length; i++) {
					var p = currentFunction[i];
					if (p.getY() < minFunction.getY()) {
						minFunction = p;
					}
				}
			}
			if (this.source.getNature().isYFunction()) {
				for (var i = 0; i < currentFunction.length; i++) {
					var p = currentFunction[i];
					if (p.getX() < minFunction.getX()) {
						minFunction = p;
					}
				}
			}
			return minFunction;
		},
		
		/**
		 * return the max peak of the current function
		 * @returns minimum peak
		 */
		maxFunction : function() {
			var currentFunction = this.source.getCurrentFunction();
			var maxFunction = currentFunction[0];
			if (this.source.getNature().isXFunction()) {
				for (var i = 0; i < currentFunction.length; i++) {
					var p = currentFunction[i];
					if (p.getY() > maxFunction.getY()) {
						maxFunction = p;
					}
				}
			}
			if (this.source.getNature().isYFunction()) {
				for (var i = 0; i < currentFunction.length; i++) {
					var p = currentFunction[i];
					if (p.getX() > maxFunction.getX()) {
						maxFunction = p;
					}
				}
			}
			return maxFunction;
		},
		
		
		/**
		 * scale the manager between two space and assign delegate super geometry
		 * path for all method that have to use geometry.
		 */
		createPath : function() {
			this.svgPathElement = new JenScript.SVGElement().attr('id',this.Id).name('path').attr('stroke','none').attr('fill','none').attr('d',this.buildPath()).buildHTML();
			this.geometryPath = new JenScript.GeometryPath(this.svgPathElement);
			this.lengthPathDevice = this.geometryPath.lengthOfPath();
			return this.svgPathElement;
		},

		/**
		 * add pre initialized metric {@link GlyphMetric} to this general path.
		 * @param metric
		 */
		addMetric : function(metric) {
			this.metrics[this.metrics.length]= metric;
			if(this.hostPlugin !== undefined)
			this.hostPlugin.repaintPlugin();
		},

		/**
		 * clear metrics
		 */
		clearMetric : function() {
			this.metrics = [];
		},
		
		/**
		 * get metrics on this path
		 */
		getMetrics : function(){
			this.createPath();
			
			var pp = new JenScript.SVGElement().attr('id',(this.Id+'_path')).name('path').attr('stroke','none').attr('fill','none').attr('d',this.buildPath()).buildHTML();
			this.graphicsContext.deleteGraphicsElement((this.Id+'_path'));
			this.graphicsContext.definesSVG(pp);
			if(this.svgPathElement === undefined)
				return;
			
			if (this.geometryPath.lengthOfPath() === 0) {
				return [];
			}
			for (var i = 0; i < this.metrics.length; i++) {
				var m = this.metrics[i];
				var proj = this.getProjection();
				if (this.source.getNature().isXFunction()) {
					if (m.getValue() < proj.getMinX() || m.getValue() > proj.getMaxX()) {
						return;
					}
				}else if (this.source.getNature().isYFunction()) {
					if (m.getValue() < proj.getMinY() || m.getValue() > proj.getMaxY()) {
						return;
					}
				}
				
				
				
				
				var userVal = m.getValue(); //x or y according to function nature
				var pathSegment = this.getPathSegment(userVal);
				if(pathSegment === undefined)
					continue;
				var userPoint = pathSegment.getUserPoint(userVal);
				
				var devicePointX = function(){
					return proj.userToPixelX(userPoint.x);
				};
				var devicePointY = function(){
						return proj.userToPixelY(userPoint.y);
				};
				
				var baseLength = this.getLengthAtSegment(pathSegment);
				var p0 = this.geometryPath.pointAtLength(this.getLengthAtSegment(pathSegment));
				//var recUserPoint0 = new JenScript.SVGRect().origin(p0.x,p0.y).size(3,3).fill('yellow');
				//this.graphicsContext.insertSVG(recUserPoint0.toSVG());
				
				var X = Math.pow((p0.x-devicePointX()),2);
				var Y = Math.pow((p0.y-devicePointY()),2);
				var distDelta= Math.sqrt(X + Y);
				
				//ortho right point
				//var r3 = m.getOrthoRightPoint(0,15);
				var recUserPoint = new JenScript.SVGRect().origin(devicePointX(),devicePointY()).size(3,3).fill('pink');
				this.graphicsContext.insertSVG(recUserPoint.toSVG());
				
				var deviceLength = (baseLength+distDelta);
				var percent = deviceLength/this.lengthPathDevice*100;

				m.setLengthOnPath(deviceLength);
				m.setPercentOnPath(percent);
				m.setMetricPointRef(this.geometryPath.pointAtLength((baseLength+distDelta)));
				m.setMetricAngle(this.geometryPath.angleAtLength((baseLength+distDelta)).deg);
				
				
				
//				//point base
//				var r = m.getMetricPointRef();
//				var svgRect = new JenScript.SVGCircle().center(r.x,r.y).radius(3).fill('black');
//				this.graphicsContext.insertSVG(svgRect.toSVG());
//				
//				//radial point
//				var r2 = m.getRadialPoint(10,'Right');
//				//alert('r2:'+r2);
//				var svgRect2 = new JenScript.SVGRect().origin(r2.x,r2.y).size(3,3).fill('red');
//				this.graphicsContext.insertSVG(svgRect2.toSVG());
//				
//				//ortho right point
//				var r3 = m.getOrthoRightPoint(0,15);
//				var svgRect3 = new JenScript.SVGRect().origin(r3.x,r3.y).size(3,3).fill('green');
//				this.graphicsContext.insertSVG(svgRect3.toSVG());
//				
//				//ortho right point
//				var r4 = m.getOrthoRightPoint(0,-10);
//				var svgRect4 = new JenScript.SVGRect().origin(r4.x,r4.y).size(3,3).fill('blue');
//				this.graphicsContext.insertSVG(svgRect4.toSVG());



				//.attr('transform','rotate(0 '+m.getMetricPointRef().x+' '+m.getMetricPointRef().y+')')
				var svgText = new JenScript.SVGText().textAnchor('middle').attr('id',this.Id+'_metrics'+i).attr('transform','rotate('+m.getRotate()+' ' +m.getMetricPointRef().x+' '+m.getMetricPointRef().y+')').fill(m.getFillColor()).stroke('white').strokeWidth(0.5).fontSize(m.getFontSize());
				var svgTextPath = new JenScript.SVGTextPath().xlinkHref('#'+this.Id+'_path').startOffset(m.getPercentOnPath()+'%');
				var tspan = new JenScript.SVGTSpan().dy(m.getDy()).textContent(m.getMetricsLabel());
				//group.child(tspan.toSVG());
				
				
//				methodAlign
//				methodStretch
//				spacingAuto
//				spacingExact
				svgTextPath.methodStretch();
				svgTextPath.spacingExact();
				svgTextPath.child(tspan.toSVG());
				var s = svgTextPath.toSVG();
				svgText.child(s);
				//alert("::"+svgText.toSVG().outerHTML);
				var svg = svgText.toSVG();
				
				this.graphicsContext.insertSVG(svg);
				
			}

			return this.metrics;
		},

		/**
		 * get the device metrics point for the given metrics value in device coordinate
		 * 
		 * @param {Number} the metric value
		 *            metrics value
		 * @return metrics device pixel point
		 */
		getMetricsPoint : function(metricsValue) {
			if (this.source.getNature().isXFunction()) {
				if (m.getValue() < proj.getMinX() || m.getValue() > proj.getMaxX()) {
					return;
				}
			}else if (this.source.getNature().isYFunction()) {
				if (m.getValue() < proj.getMinY() || m.getValue() > proj.getMaxY()) {
					return;
				}
			}
			var pathSegment = this.getPathSegment(metricsValue);
			var userPoint = pathSegment.getUserPoint(metricsValue);
			var baseLength = this.getLengthAtSegment(pathSegment);
			var p0 = this.geometryPath.pointAtLength(this.getLengthAtSegment(pathSegment));
			var X = Math.pow((p0.x-proj.userToPixelX(userPoint.x)),2);
			var Y = Math.pow((p0.y-proj.userToPixelY(userPoint.y)),2);
			var distDelta= Math.sqrt(X + Y);
			return this.geometryPath.pointAtLength((baseLength+distDelta));
		},

		
		/**
		 * get path segments
		 */
		getSegments : function(){
			return this.segments;
		},
		
		
		/**
		 * get the curve segment that contains the specified x in user projection
		 * system
		 * 
		 * @param value
		 *            the value in user projection
		 * @return the curve segment that contains the specified x in user
		 *         projection system
		 */
		getPathSegment : function(value) {
			for (var p = 0; p < this.pathSegments.length; p++) {
				if (this.pathSegments[p].match(value)) {
					return this.pathSegments[p];
				}
			}
			return undefined;
		},

		/**
		 * get the length in device coordinate at the specified segment, excluding matched segment.
		 * 
		 * @param segment
		 *            the curve segment
		 * @return the length in device coordinate at the specified segment
		 */
		getLengthAtSegment : function(segment) {
			var length = 0;
			for (var p = 0; p < this.pathSegments.length; p++) {
				var cs = this.pathSegments[p];
				if (cs.equals(segment)) {
					return length;
				}
				length = length + cs.deviceLength();
			}
			return 0;
		},
		
		/**
		 * build user segment point from function in user coordinate
		 */
//		buildSegment : function(){
//			this.segments=[];
//			this.pathSegments=[];
//			this.source.clearCurrentFunction();
//			var userPointsFunction = this.source.getCurrentFunction();
//			//console.log("spline points number : "+userPointsFunction.length);
//			for (var i = 0; i < userPointsFunction.length; i++) {
//				var p = userPointsFunction[i];
//				if(i == 0)
//					this.moveTo(p.x,p.y);
//				else
//					this.lineTo(p.x,p.y);
//			}
//		},
		
		
		/**
		 * build the path based on segments
		 */
		buildPath : function(){
			
			this.segments=[];
			this.pathSegments=[];
			this.source.clearCurrentFunction();
			var userPointsFunction = this.source.getCurrentFunction();
			//console.log("spline points number : "+userPointsFunction.length);
			for (var i = 0; i < userPointsFunction.length; i++) {
				var p = userPointsFunction[i];
				if(i == 0)
					this.moveTo(p.x,p.y);
				else
					this.lineTo(p.x,p.y);
			}

			
			
			var path='';
			var segments = this.segments;
			var proj = this.getProjection();
			
			var toX = function(x){
					return proj.userToPixelX(x);
			};
			var toY = function(y){
					return proj.userToPixelY(y);
			};
			for (var i = 0; i < segments.length; i++) {
				
				var x = segments[i].x;
				var y = segments[i].y;
				var dx = toX(x);
				var dy = toY(y);
				
				//path
				if(segments[i].type === 'M')
					path = path  + segments[i].type+dx+','+dy+' ';
				if(segments[i].type === 'L')
					path = path  + segments[i].type+dx+','+dy+' ';
				if(segments[i].type === 'Z')
					path = path  + segments[i].type+' ';
				
				
				//path segment
				if(i<segments.length-1){
					
					//i+1
					//console.log('si:'+segments[i+1]);
					var x2 = segments[i+1].x;
					var y2 = segments[i+1].y;
					var dx2 = toX(x2);
					var dy2 = toY(y2);
					
					var ps = new JenScript.PathSegment({
						userStart : new JenScript.Point2D(x,y),
						userEnd : new JenScript.Point2D(x2,y2),
						deviceStart : new JenScript.Point2D(dx,dy),
						deviceEnd : new JenScript.Point2D(dx2,dy2),
					});
					ps.sourceFunction = this.source;
					this.pathSegments[this.pathSegments.length]=ps;
				}
			}
			this.pathdata = path;
			return path;
		},
		
		/**
		 * paint path function
		 */
		paintPathFunction : function(g2d) {
			this.createPath();
			g2d.deleteGraphicsElement(this.Id);
			var path = new JenScript.SVGElement().attr('id',this.Id).name('path').attr('stroke',this.themeColor).attr('fill','none').attr('d',this.buildPath()).buildHTML();
			g2d.insertSVG(path);
		},
		
		
		/**
		 * provides method for function painting operation
		 * @param g2d the graphics context
		 */
		paintFunction : function(g2d){throw new Error('Paint function should be supplied.');},
		
		
		/**
		 * register path segment like move, line or close path in user coordinate
		 */
		registerSegment : function(fragment){
			this.segments[this.segments.length] = fragment;
			return this;
		},
		
		/**
		 * path move to in user coordinate
		 * @param x
		 * @param y
		 */
		moveTo : function(x,y){
			this.registerSegment({type : 'M',x:x,y:y});
			return this;
		},
		
		/**
		 * path line to in user coordinate
		 * @param x
		 * @param y
		 */
		lineTo : function(x,y){
			this.registerSegment({type : 'L',x:x,y:y});
			return this;
		},
		
		/**
		 * path close
		 */
		close : function(){
			this.registerSegment({type : 'Z'});
			return this;
		}
		
	});
	
})();