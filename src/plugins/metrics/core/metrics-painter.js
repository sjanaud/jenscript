(function(){

	/**
	 * Metrics painter takes the responsibility to paint metrics
	 */
	JenScript.MetricsPainter = function(){
		this.axisBaseLine;
	};
	JenScript.Model.addMethods(JenScript.MetricsPainter, {
		
		setMetricsPlugin : function(metricsPlugin){
			this.metricsPlugin=metricsPlugin;
		},
		
		getMetricsPlugin : function(){
			return this.metricsPlugin;
		},
		
		 /**
	     * paint metrics base line
	     * @param {Object} g2d the graphics context
	     * @param {Object} start  the start point of the axis base line
	     * @param {Object}end  the end point of the axis base line
	     * @param {String} axisBaseColor axis base color
	     */
	    doPaintLineMetrics : function(g2d,part,start,end,axisBaseColor,axisBaseLineStrokeWidth){
	    	var axisBaseLine = new JenScript.SVGElement().name('line')
								 .attr('id','metricsaxisline'+JenScript.sequenceId++)
								 .attr('x1',start.x)
								 .attr('y1',start.y)
								 .attr('x2',end.x)
								 .attr('y2',end.y)
								 .attr('style','stroke:'+axisBaseColor+';stroke-width:'+axisBaseLineStrokeWidth);
			
	    	
	    	g2d.insertSVG(axisBaseLine.buildHTML());
	    },
	    
	    /**
	     * paint metric tick marker
	     * @param {Object} g2d the graphics context
	     * @param {Object} metrics the metrics to paint
	     */
	    paintMetricsTickMarker : function(g2d,part,metric) {
	    	var tickMarkerSize = metric.getTickMarkerSize();
	    	var tickMarkerStroke = metric.getTickMarkerStroke();
	    	var tickMarkerColor = metric.getTickMarkerColor();
	        var start=undefined;
	        var end=undefined;
	        var prefix=undefined;
	        var position = metric.getMarkerLocation();
	       // console.log("position "+position.x+"/"+position.y);
            if (metric.getMarkerPosition() === 'S') {
            	prefix = 'southtick';
            	start = {x:position.x,y:position.y + 2};
            	end= {x:position.x,y:position.y + tickMarkerSize + 2};
            }
            if (metric.getMarkerPosition() == 'N') {
            	prefix = 'northtick';
            	start = {x:position.x,y:position.y - 2};
            	end= {x:position.x,y:position.y - tickMarkerSize - 2};
            }
            if (metric.getMarkerPosition() == 'W') {
            	prefix = 'westtick';
            	start = {x:position.x- tickMarkerSize - 2,y:position.y};
            	end= {x:position.x-2,y:position.y};

            }
            if (metric.getMarkerPosition() == 'E') {
            	prefix = 'easttick';
            	start = {x:position.x+ 2,y:position.y};
            	end= {x:position.x + tickMarkerSize + 2,y:position.y};
            }
	        var tick = new JenScript.SVGElement().name('line')
								 .attr('id',prefix+JenScript.sequenceId++)
								 .attr('x1',start.x)
								 .attr('y1',start.y)
								 .attr('x2',end.x)
								 .attr('y2',end.y)
								 .attr('stroke',tickMarkerColor)
								 .attr('stroke-width',tickMarkerStroke);
					
	       
	        g2d.insertSVG(tick.buildHTML());
	    },
	    
	    
	    /**
	     * paint south metric label
	     * @param {Object} g2d the graphics context
	     * @param {Object} metrics the metrics to paint
	     */
	   paintSouthMetricsLabel : function (g2d,metric){
	        var loc = metric.getMarkerLocation();
	        var tickMarkerSize = metric.getTickMarkerSize();
	    	var tickTextColor = metric.getTickTextColor();
	    	var tickTextFontSize = metric.getTickTextFontSize();
	    	var tickTextOffset = metric.getTickTextOffset();
	    	
	        var text = new JenScript.SVGElement().name('text')
												.attr('id',"southmetrics"+JenScript.sequenceId++)
												.attr('x',loc.x+'px')
												.attr('y',(loc.y+tickMarkerSize +tickTextFontSize+tickTextOffset+ 2)+'px')
												.attr('font-size',tickTextFontSize)
												.attr('fill',tickTextColor)
												.attr('text-anchor','middle')
												.textContent(metric.format());
			
	        var label = text.buildHTML();
	        g2d.insertSVG(label);
	        
//	        var svgRect = label.getBBox();
//		       console.log("south label bbox : "+svgRect.x+","+svgRect.y+","+svgRect.width+","+svgRect.height);
//		       var box = new JenScript.SVGRect().origin(svgRect.x,svgRect.y)
//								.size(svgRect.width,svgRect.height)
//								.strokeWidth(1)
//								.stroke('pink')
//								.fillNone()
//								.strokeOpacity(0.8)
//								.toSVG();
//			
//		       g2d.insertSVG(box);
	    },
	    
	    /**
	     * paint north metric label
	     * @param {Object} g2d the graphics context
	     * @param {Object} metrics the metrics to paint
	     */
		paintNorthMetricsLabel : function (g2d,metric){
			   var loc = metric.getMarkerLocation();
		       var tickMarkerSize = metric.getTickMarkerSize();
		       var tickTextColor = metric.getTickTextColor();
		       var tickTextFontSize = metric.getTickTextFontSize();
		       var tickTextOffset = metric.getTickTextOffset();
		       var text = new JenScript.SVGElement().name('text')
												.attr('id',"northmetrics"+JenScript.sequenceId++)
												.attr('x',loc.x+'px')
												.attr('y',(loc.y-tickMarkerSize-tickTextOffset - 4)+'px')
												.attr('font-size',tickTextFontSize)
												.attr('fill',tickTextColor)
												.attr('text-anchor','middle')
												.textContent(metric.format());

		       g2d.insertSVG(text.buildHTML());
		    },
		    
		    /**
		     * paint west metric label
		     * @param {Object} g2d the graphics context
		     * @param {Object} metrics the metrics to paint
		     */
		    paintWestMetricsLabel : function (g2d,metric){
		    	
		    	
		    	if(metric.isRotate()){
		    		 	var loc = metric.getMarkerLocation();
				        var tickMarkerSize = metric.getTickMarkerSize();
				    	var tickTextColor = metric.getTickTextColor();
				    	var tickTextFontSize = metric.getTickTextFontSize();
				    	var tickTextOffset = metric.getTickTextOffset();
				    	var Id = "metrics"+JenScript.sequenceId++;
				        var text = new JenScript.SVGElement().name('text')
															.attr('id',Id)
															.attr('x',loc.x+'px')
															.attr('y',loc.y+'px')
															.attr('font-size',tickTextFontSize)
															.attr('fill',tickTextColor)
															.attr('text-anchor','middle')
															.attr('transform','translate('+(-tickMarkerSize-tickTextOffset-6)+',0) rotate(-90,'+loc.x+','+loc.y+')')
															.textContent(metric.format());
				        
				       var label= text.buildHTML();
				       g2d.insertSVG(label);
				       
				       var bb = this.transformedBoundingBox(label);
				       if(bb.y < 0 || (bb.y+bb.height) > this.getMetricsPlugin().getProjection().getView().getDevice().getHeight()){
//					       var box = new JenScript.SVGRect().origin(bb.x,bb.y)
//											.size(bb.width,bb.height)
//											.strokeWidth(1)
//											.stroke('red')
//											.fillNone()
//											.strokeOpacity(1)
//											.toSVG();
//					       g2d.insertSVG(box);
					       g2d.deleteGraphicsElement(Id);
				       }
		    	}else{
		    		var loc = metric.getMarkerLocation();
			        var tickMarkerSize = metric.getTickMarkerSize();
			    	var tickTextColor = metric.getTickTextColor();
			    	var tickTextFontSize = metric.getTickTextFontSize();
			    	 var tickTextOffset = metric.getTickTextOffset();
			    	var Id = "metrics"+JenScript.sequenceId++;
			        var text = new JenScript.SVGElement().name('text')
														.attr('id',Id)
														.attr('x',loc.x+'px')
														.attr('y',loc.y+'px')
														.attr('font-size',tickTextFontSize)
														.attr('fill',tickTextColor)
														.attr('text-anchor','end')
														.attr('transform','translate('+(-tickMarkerSize-tickTextOffset-6)+','+tickTextFontSize/2+')')
														.textContent(metric.format());
			        
			       // console.log("metrics marker size : "+tickMarkerSize+" for metrics value : "+metric.format());
			        
			       var label= text.buildHTML();
			       g2d.insertSVG(label);
			       
			       var bb = this.transformedBoundingBox(label);
			       if(bb.y < -1 || (bb.y+bb.height) > this.getMetricsPlugin().getProjection().getView().getDevice().getHeight()+1){
//				       var box = new JenScript.SVGRect().origin(bb.x,bb.y)
//										.size(bb.width,bb.height)
//										.strokeWidth(1)
//										.stroke('red')
//										.fillNone()
//										.strokeOpacity(1)
//										.toSVG();
//				       g2d.insertSVG(box);
				       g2d.deleteGraphicsElement(Id);
			       }
		    	}
		       
		       	
		    },
		    
		    
		 // Calculate the bounding box of an element with respect to its parent element
		 transformedBoundingBox : function(el){
		      var bb  = el.getBBox(),
		          svg = el.ownerSVGElement,
		          m   = el.getTransformToElement(el.parentNode);
		      var pts = [
		        svg.createSVGPoint(), svg.createSVGPoint(),
		        svg.createSVGPoint(), svg.createSVGPoint()
		      ];
		      pts[0].x=bb.x;          pts[0].y=bb.y;
		      pts[1].x=bb.x+bb.width; pts[1].y=bb.y;
		      pts[2].x=bb.x+bb.width; pts[2].y=bb.y+bb.height;
		      pts[3].x=bb.x;          pts[3].y=bb.y+bb.height;

		      var xMin=Infinity,xMax=-Infinity,yMin=Infinity,yMax=-Infinity;
		      pts.forEach(function(pt){
		        pt = pt.matrixTransform(m);
		        xMin = Math.min(xMin,pt.x);
		        xMax = Math.max(xMax,pt.x);
		        yMin = Math.min(yMin,pt.y);
		        yMax = Math.max(yMax,pt.y);
		      });

		     // bb.x = xMin; bb.width  = xMax-xMin;
		      //bb.y = yMin; bb.height = yMax-yMin;
		      
		        /**
			     * create new bow object
			     * (IE, BUG)
			     */
			    return {x: xMin, y: yMin, width: (xMax-xMin), height: (yMax-yMin)};
			    
		    },
		    
		    /**
		     * paint east metric label
		     * @param {Object} g2d the graphics context
		     * @param {Object} metrics the metrics to paint
		     */
		    paintEastMetricsLabel : function (g2d,metric){
		    	if(metric.isRotate()){
		    		   var loc = metric.getMarkerLocation();
				       var tickMarkerSize = metric.getTickMarkerSize();
				       var tickTextColor = metric.getTickTextColor();
				       var tickTextFontSize = metric.getTickTextFontSize();
				       var tickTextOffset = metric.getTickTextOffset();
				       var Id = "metrics"+JenScript.sequenceId++;
				       var text = new JenScript.SVGElement().name('text')
				        									.attr('id',Id)
				        									.attr('x',loc.x)
				        									.attr('y',loc.y)
				        									.attr('font-size',tickTextFontSize)
															.attr('fill',tickTextColor)
				        									.attr('text-anchor','middle')
				        									.attr('transform','translate('+(tickMarkerSize+tickTextOffset-6)+',0) rotate(90,'+(loc.x)+','+loc.y+')')
				        									.textContent(metric.format());
				        									
				        									
				       g2d.insertSVG(text.buildHTML());
				       
				       var bb = this.transformedBoundingBox(label);
				       if(bb.y < 0 || (bb.y+bb.height) > this.getMetricsPlugin().getProjection().getView().getDevice().getHeight()){
//					       var box = new JenScript.SVGRect().origin(bb.x,bb.y)
//											.size(bb.width,bb.height)
//											.strokeWidth(1)
//											.stroke('red')
//											.fillNone()
//											.strokeOpacity(1)
//											.toSVG();
//					       g2d.insertSVG(box);
					       g2d.deleteGraphicsElement(Id);
				       }
				       
		    	}else{
		    		var loc = metric.getMarkerLocation();
			        var tickMarkerSize = metric.getTickMarkerSize();
			    	var tickTextColor = metric.getTickTextColor();
			    	var tickTextFontSize = metric.getTickTextFontSize();
			    	var tickTextOffset = metric.getTickTextOffset();
			    	var Id = "metrics"+JenScript.sequenceId++;
			        var text = new JenScript.SVGElement().name('text')
														.attr('id',Id)
														.attr('x',loc.x+'px')
														.attr('y',loc.y+'px')
														.attr('font-size',tickTextFontSize)
														.attr('fill',tickTextColor)
														.attr('text-anchor','start')
														.attr('transform','translate('+(tickMarkerSize+tickTextOffset)+','+tickTextFontSize/2+')')
														.textContent(metric.format());
			        
			       // console.log("metrics marker size : "+tickMarkerSize+" for metrics value : "+metric.format());
			        
			       var label= text.buildHTML();
			       g2d.insertSVG(label);
			       
			       var bb = this.transformedBoundingBox(label);
			       if(bb.y < -1 || (bb.y+bb.height) > this.getMetricsPlugin().getProjection().getView().getDevice().getHeight()+1){
//				       var box = new JenScript.SVGRect().origin(bb.x,bb.y)
//										.size(bb.width,bb.height)
//										.strokeWidth(1)
//										.stroke('red')
//										.fillNone()
//										.strokeOpacity(1)
//										.toSVG();
//				       g2d.insertSVG(box);
				       g2d.deleteGraphicsElement(Id);
			       }
		    	}
			
		    },
	    
	    /**
	     * paint metrics tick labels
	     * @param {Object} g2d the graphics context
	     * @param {Object} metrics the metrics to paint
	     */
	    paintMetricsTickLabel : function(g2d,part,metric) {
	    	if(metric.minor === true) return;
            if (metric.getMarkerPosition() === 'S') {
               this.paintSouthMetricsLabel(g2d, metric);
            }
            if (metric.getMarkerPosition() === 'N') {
               this.paintNorthMetricsLabel(g2d, metric);
            }
            if (metric.getMarkerPosition() === 'W') {
               this.paintWestMetricsLabel(g2d, metric);
            }
            if (metric.getMarkerPosition() === 'E') {
               this.paintEastMetricsLabel(g2d, metric);
            }
	    },

	    /**
	     * paint metrics
	     * @param {Object} g2d the graphics context
	     * @param {Object} metrics the metrics to paint
	     */
	    doPaintMetrics :  function(g2d,part,metrics){
	        for (var i = 0; i < metrics.length; i++) {
	            var metric = metrics[i];
	            if (!metric.visible) {
	                continue;
	            }
	            var loc = metric.getMarkerLocation();
	            if(!isNaN(loc.x) && !isNaN(loc.y)){
	            	this.paintMetricsTickMarker(g2d, part,metric);
	 	            this.paintMetricsTickLabel(g2d,part, metric);
	            }
	        }
	    }
	});
})();