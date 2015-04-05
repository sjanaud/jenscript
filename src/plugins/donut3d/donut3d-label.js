(function(){
	JenScript.Donut3DAbstractLabel = function(name, text) {
		this.name = name;
		this.text = text;
		this.textColor;
	};
	
	JenScript.Model.addMethods(JenScript.Donut3DAbstractLabel, {
		setText : function(text) {
			this.text = text;
		},

		getText : function() {
			return this.text;
		},

		setTextColor : function(textColor) {
			this.textColor = textColor;
		},

		getTextColor : function() {
			return this.textColor;
		},

		paintDonutSliceLabel : function(g2d, slice) {
			console.info("abstract paint donut slice label");
		}
	});


	/**
	 * Donut3D Label Border
	 */
	JenScript.Donut3DLabelBorder = function(text) {
		this.margin = 50;
		this.linkExtends = 30;
		this.fontSize=10;
		JenScript.Donut3DAbstractLabel.call(this, "Donut3DLabelBorder", text);
	};
	JenScript.Model.inheritPrototype(JenScript.Donut3DLabelBorder, JenScript.Donut3DAbstractLabel);
	
	JenScript.Model.addMethods(JenScript.Donut3DLabelBorder, {
		
		paintDonutSliceLabel : function(g2d, slice) {
		        var pc = slice.donut.getDonutCenter();
		      
		        var medianDegree = slice.startAngleDegree + Math.abs(slice.endAngleDegree - slice.startAngleDegree) / 2;
		        if (medianDegree >= 360) {
		            medianDegree = medianDegree - 360;
		        }

		        var px1 = pc.x + (slice.donut.outerA + slice.divergence)
		                * Math.cos(JenScript.Math.toRadians(medianDegree));
		        var py1 = pc.y - (slice.donut.outerB + slice.divergence)
		                * Math.sin(JenScript.Math.toRadians(medianDegree));

		        var px2 = pc.x
		                + (slice.donut.outerA + this.linkExtends + slice.divergence)
		                * Math.cos(JenScript.Math.toRadians(medianDegree));
		        var py2 = pc.y
		                - (slice.donut.outerB + this.linkExtends + slice.divergence)
		                * Math.sin(JenScript.Math.toRadians(medianDegree));

		        var px3 = 0;
		        var py3 = py2;
		        var px4 = 0;
		        var py4 = py2;
		        var pos = 'middle';
		        if (medianDegree >= 270 && medianDegree <= 360
		                || medianDegree >= 0 && medianDegree <= 90) {
		            px3 = pc.x + slice.donut.outerA + this.margin  - 5;
		            px4 = pc.x + slice.donut.outerA + this.margin  + 5;
		            
		            pos='start';
		            if(medianDegree === 270)
		            	pos = 'middle';
		            if(medianDegree === 90)
		            	pos = 'middle';
		        }
		        else {// 90-->270
		            px3 = pc.x- slice.donut.outerA - this.margin + 5;
		            px4 = pc.x- slice.donut.outerA - this.margin -5;
		            pos='end';
		        }
		        
		        
		        var quaddata = 'M '+px1+','+py1+' Q '+px2+','+py2+' '+px3+','+py3;
		        var quadlink = new JenScript.SVGElement().name('path')
													.attr('d',quaddata)
													.attr('fill','none')
													.attr('stroke','darkgray')
													.buildHTML();
		        g2d.insertSVG(quadlink);
		        
		        var c = (this.textColor !== undefined)?this.textColor : slice.themeColor;
		        var sl = new JenScript.SVGElement().name('text')
												.attr('id',"borderLabel"+JenScript.sequenceId++)
												.attr('x',px4+'px')
												.attr('y',py4+'px')
												.attr('font-size',12)
												.attr('fill',c)
												.attr('text-anchor',pos)
												.textContent(this.text)
												.buildHTML();

		        g2d.insertSVG(sl);
		        var c = (this.textColor !== undefined)?this.textColor : slice.themeColor;
		        var svgRect = sl.getBBox();
				var gradientId = "gradient"+JenScript.sequenceId++;
				var percents = ['0%','50%','100%'];
				var colors = ['rgba(0,0,0,0.5)','rgba(0,0,0,0.8)','rgba(0,0,0,0.9)'];
				var gradient= new JenScript.SVGLinearGradient().Id(gradientId).from(svgRect.x,(svgRect.y-2)).to(svgRect.x, (svgRect.y+4+svgRect.height)).shade(percents,colors).toSVG();
				g2d.definesSVG(gradient);
				var tr = new JenScript.SVGElement().name('rect')
												.attr('x',(svgRect.x-10)+'px')
												.attr('rx','10px')
												.attr('y',(svgRect.y-2)+'px')
												.attr('ry','10px')
												.attr('width',(svgRect.width+20))
												.attr('height',svgRect.height+4)
												.attr('style','stroke:'+c+'; fill: url(#'+gradientId+')')
												.buildHTML();
		        sl.parentNode.insertBefore(tr,sl);
		        
//		        var mark1 = new JenScript.SVGElement().name('rect')
//		        									.attr('x',px1)
//		        									.attr('y',py1)
//		        									.attr('width',4)
//		        									.attr('height',4)
//		        									.attr('fill','red')
//		        									.buildHTML();
//		        
//		        g2d.insertSVG(mark1);
//		        
//		        
//		        var mark2 = new JenScript.SVGElement().name('rect')
//													.attr('x',px2)
//													.attr('y',py2)
//													.attr('width',4)
//													.attr('height',4)
//													.attr('fill','green')
//													.buildHTML();
//		        g2d.insertSVG(mark2);
//		        
//		        var mark3 = new JenScript.SVGElement().name('rect')
//													.attr('x',px3)
//													.attr('y',py3)
//													.attr('width',4)
//													.attr('height',4)
//													.attr('fill','black')
//													.buildHTML();
//		        
//		        
//		        g2d.insertSVG(mark3);
		 }
	});
})();