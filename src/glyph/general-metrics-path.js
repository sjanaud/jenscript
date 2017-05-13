(function(){

	
	JenScript.GeneralMetricsPath = function(config){
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.GeneralMetricsPath,{
		init : function(config){
			//console.log('create general metrics path');
			config = config || {};
			this.Id = 'generalmetricspath'+JenScript.sequenceId++;
			/** default nature is the user space */
			this.nature = (config.nature !== undefined)? config.nature : 'User';
			
			/** the window 2D */
			this.projection;
			/** the geometry path */
			this.geometryPath;
			
			/** the minimum value in the user space */
			this.min = config.min;
			/** the maximum value in the user space */
			this.max = config.max;
			
			/** length of path in the device space */
			this.lengthPathDevice;
			/** user length of path */
			this.userWidth;
			/** base unit between user and device */
			//this.unitUserToDevice;
			
			/** input metrics registered for this path */
			this.metrics = [];
			
			this.segments = [];
			
			this.graphicsContext;
		},
		
		/**
		 * get the nature of path metrics
		 * 
		 * @return nature
		 */
		getProjectionNature : function() {
			return this.nature;
		},

		/**
		 * set the nature of the path metrics
		 * 
		 * @param nature
		 */
		setProjectionNature : function(nature) {
			this.nature = nature;
		},
		/**
		 * get the window2D
		 */
		getProjection : function() {
			return projection;
		},

		/**
		 * set the window2D
		 * 
		 * @param window2d
		 */
		setProjection : function(projection) {
			this.projection = projection;
		},
		
		/**
		 * set the ranges values of the path *
		 * 
		 * @param min
		 *            the minimum user metrics value for this path to set
		 * @param max
		 *            the maximum user metrics value for this path to set
		 * 
		 */
		setRange : function(min,max) {
			this.min = min;
			this.max = max;
		},

		/**
		 * get the minimum value of the path
		 * 
		 * @return minimum user metrics for this path
		 */
		getMin : function() {
			return this.min;
		},

		/**
		 * set the minimum user value of the path *
		 * 
		 * @param min
		 *            the minimum user metrics for this path to set
		 */
		setMin : function(min) {
			this.min = min;
		},

		/**
		 * get the maximum value of the path
		 * 
		 * @return maximum user metrics value for this path
		 */
		getMax : function() {
			return this.max;
		},

		/**
		 * set the maximum user value of the path
		 * 
		 * @param max
		 *            the maximum user metrics value for this path to set
		 */
		setMax : function( max) {
			this.max = max;
		},

		
		
		/**
		 * scale the manager between two space and assign delegate super geometry
		 * path for all method that have to use geometry.
		 */
		createPath : function() {
			if(this.extPath !== undefined)
				this.svgPathElement = this.extPath.attr('id',this.Id+'_path').attr('stroke','none').attr('fill','none').toSVG();
			else
				this.svgPathElement = new JenScript.SVGElement().attr('id',this.Id+'_path').name('path').attr('stroke','none').attr('fill','none').attr('d',this.buildPath()).buildHTML();
			
			this.geometryPath = new JenScript.GeometryPath(this.svgPathElement);
			this.lengthPathDevice = this.geometryPath.lengthOfPath();
			//this.userWidth = this.max - this.min;
			//this.unitUserToDevice = this.lengthPathDevice / this.userWidth;
			if(this.graphicsContext !== undefined){
				this.graphicsContext.deleteGraphicsElement(this.Id);
				this.graphicsContext.definesSVG(this.svgPathElement);
			}
		},

		/**
		 * add pre initialized metric {@link GlyphMetric} to this general path.
		 * @param metric
		 */
		addMetric : function(metric) {
//			if (volatileMetrics.contains(metric)) {
//				return;
//			}
			this.metrics[this.metrics.length]= metric;
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
			console.log('general metrics path get Metrics');
			this.createPath();
			
			if(this.svgPathElement === undefined)
				return;
			
			//console.log("geometry length of path : "+this.geometryPath.lengthOfPath());
			if (this.geometryPath.lengthOfPath() === 0) {
				return [];
			}
			for (var i = 0; i < this.metrics.length; i++) {
				var m = this.metrics[i];
				if (m.getValue() < this.getMin() || m.getValue() > this.getMax()) {
					throw new Error("metrics value out of path range :" + m.getValue());
				}
				
				var userVal = m.getValue();
				
				var deviceLength = this.lengthPathDevice * (userVal - this.min)/(this.max - this.min);
				var percent = deviceLength/this.lengthPathDevice*100;
				m.setLengthOnPath(deviceLength);
				m.setPercentOnPath(percent);
				m.setMetricPointRef(this.geometryPath.pointAtLength(deviceLength));
				m.setMetricAngle(this.geometryPath.angleAtLength(deviceLength).deg);
				
				
				
//				m.setMetricGlyphMarker(new Marker(geometry.pointAtLength((float) deviceLength)));
//				m.setFont(vm.getFont());
//				m.setGlyphMetricDraw(vm.getGlyphMetricDraw());
//				m.setGlyphMetricFill(vm.getGlyphMetricFill());
//				m.setGlyphMetricEffect(vm.getGlyphMetricEffect());
//				m.setGlyphMetricMarkerPainter(vm.getGlyphMetricMarkerPainter());
				
				//point base
				var r = m.getMetricPointRef();
				var svgRect = new JenScript.SVGCircle().center(r.x,r.y).radius(3).fill('black');
				this.graphicsContext.insertSVG(svgRect.toSVG());
				
				//radial point
				var r2 = m.getRadialPoint(10,'Right');
				//alert('r2:'+r2);
				var svgRect2 = new JenScript.SVGRect().origin(r2.x,r2.y).size(3,3).fill('red');
				this.graphicsContext.insertSVG(svgRect2.toSVG());
				
				//ortho right point
				var r3 = m.getOrthoRightPoint(0,15);
				var svgRect3 = new JenScript.SVGRect().origin(r3.x,r3.y).size(3,3).fill('green');
				this.graphicsContext.insertSVG(svgRect3.toSVG());
				
				//ortho right point
				var r4 = m.getOrthoRightPoint(0,-10);
				var svgRect4 = new JenScript.SVGRect().origin(r4.x,r4.y).size(3,3).fill('blue');
				this.graphicsContext.insertSVG(svgRect4.toSVG());



				//.attr('transform','rotate(0 '+m.getMetricPointRef().x+' '+m.getMetricPointRef().y+')')
				var svgText = new JenScript.SVGText().textAnchor('middle').attr('id',this.Id+'_metrics'+i).attr('transform','rotate('+m.getRotate()+' ' +m.getMetricPointRef().x+' '+m.getMetricPointRef().y+')').fill(JenScript.RosePalette.HENNA).stroke('white').strokeWidth(0.5).fontSize(20);
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
				
				//this.graphicsContext.insertSVG(svg);
				
//				if (m.getStylePosition() === 'Tangent') {
//					if(this.revertMode === 'RevertIfNeed'){
//						if(s.getStartPositionOfChar(0).x > s.getEndPositionOfChar(s.getNumberOfChars()-1).x){
//							//console.log("need revert");
//							document.getElementById(this.Id+'_metrics'+i).setAttribute('transform','rotate(180 ' +m.getMetricPointRef().x+' '+m.getMetricPointRef().y+')');
//						}
//					}
//					else if(this.revertMode === 'Revert'){
//						document.getElementById(this.Id+'_metrics'+i).setAttribute('transform','rotate(180 ' +m.getMetricPointRef().x+' '+m.getMetricPointRef().y+')');
//					}
//				}else{
//					if(s.getStartPositionOfChar(0).x > s.getEndPositionOfChar(s.getNumberOfChars()-1).x){
//						//console.log("need revert");
//						document.getElementById(this.Id+'_metrics'+i).setAttribute('transform','rotate('+(-m.getMetricAngle())+' ' +m.getMetricPointRef().x+' '+m.getMetricPointRef().y+')');
//					}else{
//						//console.log("not need revert");
//					}
//				}
				//console.log('draw text : '+m.getMetricsLabel());
				//console.log('computed length : '+s.getComputedTextLength());
				//console.log('number of char : '+s.getNumberOfChars());
				
				for (var j = 0; j < s.getNumberOfChars(); j++) {
					//console.log('char extends :'+s.getExtentOfChar(j));
					//var vv = s.getExtentOfChar(j);
					//var extendsChar = new JenScript.SVGRect().origin(vv.x,vv.y).size(vv.width,vv.height).stroke('red').fillNone();
					//g2d.insertSVG(extendsChar.toSVG());
					//g2d.insertSVG(s.getExtentOfChar(j));
					//console.log('char position start :'+s.getStartPositionOfChar(j).x+','+s.getStartPositionOfChar(j).y);
					//console.log('char position end   :'+s.getEndPositionOfChar(j).x+','+s.getEndPositionOfChar(j).y);
					//var marker = new JenScript.SVGCircle().center(s.getStartPositionOfChar(j).x,s.getStartPositionOfChar(j).y).radius(2).fill('black');
					//g2d.insertSVG(marker.toSVG());
				}
				//console.log(s.getNumberOfChars());
				//console.log(s.getCharNumAtPosition(s.getStartPositionOfChar('2')));
				
//				if (m.getStylePosition() == StylePosition.Tangent) {
//
//					AffineTransform af = new AffineTransform();
//					float gvWidth = GlyphUtil.getGlyphWidth(glyphVector);
//
//					float startLength = (float) deviceLength - gvWidth / 2;
//					float endLength = (float) deviceLength + gvWidth / 2;
//
//					Point2D pointStart = geometry.pointAtLength(startLength);
//					Point2D pointEnd = geometry.pointAtLength(endLength);
//					m.setPointStart(pointStart);
//					m.setPointEnd(pointEnd);
//
//					if (pointStart == null || pointEnd == null) {
//						continue;
//					}
//
//					boolean needRevert = m.isLockReverse();
//					if (isAutoReverseGlyph()) {
//						if (pointStart.getX() > pointEnd.getX()) {
//							needRevert = true;
//						}
//					}
//
//					for (int j = 0; j < glyphVector.getNumGlyphs(); j++) {
//
//						Point2D p = glyphVector.getGlyphPosition(j);
//						float px = (float) p.getX();
//						float py = (float) p.getY();
//						Point2D pointGlyph;
//
//						if (!needRevert) {
//							pointGlyph = geometry.pointAtLength(startLength + GlyphUtil.getGlyphWidthAtToken(glyphVector, j));
//						} else {
//							pointGlyph = geometry.pointAtLength(endLength - GlyphUtil.getGlyphWidthAtToken(glyphVector, j));
//						}
//
//						if (pointGlyph == null) {
//							continue;
//						}
//
//						m.addGlyphPoint(pointGlyph);
//
//						af.setToTranslation(pointGlyph.getX(), pointGlyph.getY());
//
//						float angle = 0;
//
//						if (!needRevert) {
//							angle = geometry.angleAtLength(startLength + GlyphUtil.getGlyphWidthAtToken(glyphVector, j));
//						} else {
//							angle = geometry.angleAtLength(endLength - GlyphUtil.getGlyphWidthAtToken(glyphVector, j));
//						}
//
//						if (!needRevert) {
//							af.rotate(angle);
//						} else {
//							af.rotate(angle + Math.PI);
//						}
//
//						af.translate(-px, -py + glyphVector.getVisualBounds().getHeight() / 2 - m.getDivergence());
//
//						Shape glyph = glyphVector.getGlyphOutline(j);
//						Shape glyphTransformed = af.createTransformedShape(glyph);
//
//						Point2D srcNorth = new Point2D.Double(glyph.getBounds2D().getCenterX(), glyph.getBounds2D().getY());
//						Point2D dstNorth = new Point2D.Double();
//
//						Point2D srcSouth = new Point2D.Double(glyph.getBounds2D().getCenterX(), glyph.getBounds2D().getY() + glyph.getBounds2D().getHeight());
//						Point2D dstSouth = new Point2D.Double();
//
//						Point2D srcEast = new Point2D.Double(glyph.getBounds2D().getX() + glyph.getBounds2D().getWidth(), glyph.getBounds2D().getCenterY());
//						Point2D dstEast = new Point2D.Double();
//
//						Point2D srcWest = new Point2D.Double(glyph.getBounds2D().getX(), glyph.getBounds2D().getCenterY());
//						Point2D dstWest = new Point2D.Double();
//
//						af.transform(srcNorth, dstNorth);
//						af.transform(srcSouth, dstSouth);
//						af.transform(srcEast, dstEast);
//						af.transform(srcWest, dstWest);
//
//						GlyphGeometry metricGlyphGeometry = new GlyphGeometry(glyphTransformed, dstNorth, dstSouth, dstWest, dstEast);
//
//						m.addMetricsGlyphGeometry(metricGlyphGeometry);
//
//					}
//				}
				
				
//				if (m.getStylePosition() == StylePosition.Radial) {
//
//					float gvWidth = GlyphUtil.getGlyphWidth(glyphVector);
//					Point2D pStart = m.getRadialPoint(m.getDivergence());
//					Point2D pEnd = m.getRadialPoint((int) (m.getDivergence() + gvWidth + 10));
//
//					if (pStart == null || pEnd == null) {
//						continue;
//					}
//
//					Line2D radialFragment;
//					if (pStart.getX() > pEnd.getX()) {
//						radialFragment = new Line2D.Double(pEnd.getX(), pEnd.getY(), pStart.getX(), pStart.getY());
//					} else {
//						radialFragment = new Line2D.Double(pStart.getX(), pStart.getY(), pEnd.getX(), pEnd.getY());
//					}
//
//					AffineTransform af = new AffineTransform();
//					GeometryPath geometryRadialpath = new GeometryPath(radialFragment);
//
//					for (int j = 0; j < glyphVector.getNumGlyphs(); j++) {
//
//						Point2D p = glyphVector.getGlyphPosition(j);
//						float px = (float) p.getX();
//						float py = (float) p.getY();
//
//						Point2D pointGlyph = geometryRadialpath.pointAtLength(GlyphUtil.getGlyphWidthAtToken(glyphVector, j));
//
//						if (pointGlyph == null) {
//							continue;
//						}
//
//						m.addGlyphPoint(pointGlyph);
//						Shape glyph = glyphVector.getGlyphOutline(j);
//
//						float angle = geometryRadialpath.angleAtLength(GlyphUtil.getGlyphWidthAtToken(glyphVector, j));
//						af.setToTranslation(pointGlyph.getX(), pointGlyph.getY());
//						af.rotate(angle);
//						af.translate(-px, -py + glyphVector.getVisualBounds().getHeight() / 2);
//
//						Shape glyphTransformed = af.createTransformedShape(glyph);
//
//						// new with glyphgeometry
//						Point2D srcNorth = new Point2D.Double(glyph.getBounds2D().getCenterX(), glyph.getBounds2D().getY());
//						Point2D dstNorth = new Point2D.Double();
//
//						Point2D srcSouth = new Point2D.Double(glyph.getBounds2D().getCenterX(), glyph.getBounds2D().getY() + glyph.getBounds2D().getHeight());
//						Point2D dstSouth = new Point2D.Double();
//
//						Point2D srcEast = new Point2D.Double(glyph.getBounds2D().getX() + glyph.getBounds2D().getWidth(), glyph.getBounds2D().getCenterY());
//						Point2D dstEast = new Point2D.Double();
//
//						Point2D srcWest = new Point2D.Double(glyph.getBounds2D().getX(), glyph.getBounds2D().getCenterY());
//						Point2D dstWest = new Point2D.Double();
//
//						af.transform(srcNorth, dstNorth);
//						af.transform(srcSouth, dstSouth);
//						af.transform(srcEast, dstEast);
//						af.transform(srcWest, dstWest);
//
//						GlyphGeometry metricGlyphGeometry = new GlyphGeometry(glyphTransformed, dstNorth, dstSouth, dstWest, dstEast);
//
//						m.addMetricsGlyphGeometry(metricGlyphGeometry);
//
//						// m.addGlyphShape(glyphTransformed);
//
//					}
//
//				}

//				if (m.getStylePosition() == StylePosition.Default) {
//
//					float gvWidth = GlyphUtil.getGlyphWidth(glyphVector);
//					Point2D pRadial = m.getRadialPoint(-m.getDivergence());
//
//					Point2D pStart = new Point2D.Double(pRadial.getX() - gvWidth / 2, pRadial.getY());
//					Point2D pEnd = new Point2D.Double(pRadial.getX() + gvWidth / 2, pRadial.getY());
//
//					Line2D l = new Line2D.Double(pStart.getX(), pStart.getY(), pEnd.getX(), pEnd.getY());
//
//					AffineTransform af = new AffineTransform();
//					GeometryPath geometryRadialpath = new GeometryPath(l);
//
//					for (int j = 0; j < glyphVector.getNumGlyphs(); j++) {
//
//						Point2D p = glyphVector.getGlyphPosition(j);
//						float px = (float) p.getX();
//						float py = (float) p.getY();
//
//						Point2D pointGlyph = geometryRadialpath.pointAtLength(GlyphUtil.getGlyphWidthAtToken(glyphVector, j));
//
//						if (pointGlyph == null) {
//							continue;
//						}
//
//						Shape glyph = glyphVector.getGlyphOutline(j);
//
//						float angle = geometryRadialpath.angleAtLength(GlyphUtil.getGlyphWidthAtToken(glyphVector, j));
//						af.setToTranslation(pointGlyph.getX(), pointGlyph.getY());
//						af.rotate(angle);
//						af.translate(-px, -py + glyphVector.getVisualBounds().getHeight() / 2);
//
//						Shape glyphTransformed = af.createTransformedShape(glyph);
//						// Shape glyphTransformed =
//						// af.createTransformedShape(glyphBound2D);
//
//						Point2D srcNorth = new Point2D.Double(glyph.getBounds2D().getCenterX(), glyph.getBounds2D().getY());
//						Point2D dstNorth = new Point2D.Double();
//
//						Point2D srcSouth = new Point2D.Double(glyph.getBounds2D().getCenterX(), glyph.getBounds2D().getY() + glyph.getBounds2D().getHeight());
//						Point2D dstSouth = new Point2D.Double();
//
//						Point2D srcEast = new Point2D.Double(glyph.getBounds2D().getX() + glyph.getBounds2D().getWidth(), glyph.getBounds2D().getCenterY());
//						Point2D dstEast = new Point2D.Double();
//
//						Point2D srcWest = new Point2D.Double(glyph.getBounds2D().getX(), glyph.getBounds2D().getCenterY());
//						Point2D dstWest = new Point2D.Double();
//
//						af.transform(srcNorth, dstNorth);
//						af.transform(srcSouth, dstSouth);
//						af.transform(srcEast, dstEast);
//						af.transform(srcWest, dstWest);
//
//						GlyphGeometry metricGlyphGeometry = new GlyphGeometry(glyphTransformed, dstNorth, dstSouth, dstWest, dstEast);
//
//						m.addMetricsGlyphGeometry(metricGlyphGeometry);
//
//					}
//				}

			}

			return this.metrics;
		},

		/**
		 * get the device metrics point for the given metrics value
		 * 
		 * @param metricsValue
		 *            metrics value
		 * @return metrics device point {@link Point2D}
		 * @throws IllegalArgumentException
		 * @throws if
		 *             metrics value is out of dimension minimum and maximum bound
		 *             segment
		 */
		getMetricsPoint : function(metricsValue) {
			if (metricsValue < this.getMin() || metricsValue > this.getMax()) {
				throw new Error('metrics value out of path range.');
			}
			if (metricsValue === this.getMax()) {
				return geometryPath.pointAtLength(geometry.lengthOfPath());
			}
			//var deviceLength = this.unitUserToDevice * metricsValue;
			var deviceLength = this.lengthPathDevice * (metricsValue - this.min)/(this.max - this.min);
			return this.geometryPath.pointAtLength(deviceLength);
		},

		getSegments : function(){
			return this.segments;
		},
		
		buildPath : function(){
			var path='';
			var segments = this.segments;
			
			var nature = this.nature;
			var proj = this.projection;
			var toX = function(x){
				if(nature === 'User'){
					return proj.userToPixelX(x);
				}else if(nature === 'Device'){
					return x;
				}
			};
			var toY = function(y){
				if(nature === 'User'){
					return proj.userToPixelY(y);
				}else if(nature === 'Device'){
					return y;
				}
			};
			
			for (var i = 0; i < segments.length; i++) {
				if(segments[i].type === 'M')
					path = path  + segments[i].type+toX(segments[i].x)+','+toY(segments[i].y)+' ';
				if(segments[i].type === 'L')
					path = path  + segments[i].type+toX(segments[i].x)+','+toY(segments[i].y)+' ';
				if(segments[i].type === 'Q')
					path = path  + segments[i].type+toX(segments[i].x1)+','+toY(segments[i].y1)+' '+toX(segments[i].x)+','+toY(segments[i].y)+' ';
				if(segments[i].type === 'C')
					path = path  + segments[i].type+toX(segments[i].x1)+','+toY(segments[i].y1)+' '+toX(segments[i].x2)+','+toY(segments[i].y2)+' '+toX(segments[i].x)+','+toY(segments[i].y)+' ';
				if(segments[i].type === 'A')
					path = path  + segments[i].type+segments[i].rx+','+segments[i].ry+' '+segments[i].xAxisRotation+' '+segments[i].largeArcFlag+','+segments[i].sweepFlag+' '+toX(segments[i].x)+','+toY(segments[i].y)+' ';
				if(segments[i].type === 'Z')
					path = path  + segments[i].type+' ';
			}
			this.pathdata = path;
			return path;
		},
		

		
		registerSegment : function(fragment){
			this.segments[this.segments.length] = fragment;
			//if(this.buildAuto)
			//	this.attr('d',this.buildPath());
			return this;
		},
		
		
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