(function(){
	/**
	 * donut 3D painter
	 */
	JenScript.Donut3DDefaultPaint = function() {	
		/** incidence angle degree */
		this.incidenceAngleDegree = 90;

		/** paint flag top effect */
		this.paintTopEffect = true;

		/** paint flag inner effect */
		this.paintInnerEffect = true;

		/** paint flag outer effect */
		this.paintOuterEffect = true;

		/** alpha use to paint top effect */
		this.alphaTop = 0.8;

		/** alpha use to paint inner effect */
		this.alphaInner = 1;

		/** alpha use to paint outer effect */
		this.alphaOuter = 1;

		/** alpha use to fill */
		this.alphaFill = 0.7;

		// fill back flag
		this.fillBackBottom = true;
		this.fillBackOuter = true;
		this.fillBackInner = true;
		this.fillBackTop = true;
		this.fillBackStart = true;
		this.fillBackEnd = true;

		// front back flag
		this.fillFrontBottom = true;
		this.fillFrontOuter = true;
		this.fillFrontInner = true;
		this.fillFrontTop = true;
		this.fillFrontStart = true;
		this.fillFrontEnd = true;
	};
	
	JenScript.Model.addMethods(JenScript.Donut3DDefaultPaint, {
		
		
		/**
		 * paint the given donut 3D
		 * @param {Object} g2d the graphics context
		 * @param {Object} donut3d the graphics context
		 */
		paintDonut3D : function(g2d,donut3d) {
			var slicesFragments = donut3d.getPaintOrderFragments();
			for (var f = 0; f < slicesFragments.length; f++) {
				var fragment = slicesFragments[f];
				this._paintDonut3DFill(g2d, donut3d, fragment);
				if (this.paintTopEffect) {
					this._paintTopEffect(g2d, donut3d, fragment);
				}
				if (this.paintOuterEffect) {
					this._paintOuterEffect(g2d, donut3d, fragment);
				}
				if (this.paintInnerEffect) {
					this._paintInnerEffect(g2d, donut3d, fragment);
				}
				fragment.painted = true;
			}
		},
		
		/**
		 * paint outer effect of given donut 3D
		 * @param {Object} g2d the graphics context
		 * @param {Object} donut3d the graphics context
		 */
		_paintOuterEffect : function(g2d,donut3d,section) {
			var c = donut3d.getDonutCenter();
			var outerFrontFace = '';
			for (var i = 0; i < donut3d.slices.length; i++) {
				var fragments = donut3d.slices[i].fragments;
				for (var j = 0; j < fragments.length; j++) {
					var frag = fragments[j];
					if (frag.type === 'Front') {
						outerFrontFace = outerFrontFace+' '+frag.outerFace;
					}
				}
			}
			var gradientId = 'gradient'+JenScript.sequenceId++;
			var startX = c.x-donut3d.outerA;
			var startY = c.y;
			var endX = c.x+donut3d.outerA;
			var endY = c.y;
			var percents = [ '0%', '40%', '80%', '100%' ];
			var c1 = 'rgb(40, 40, 40)';
			var c2 = 'rgb(40, 40, 40)';
			var c3 = 'rgb(255, 255, 255)';
			var c4 = 'rgb(255, 255, 255)';
			var colors = [ c1, c2, c3, c4 ];
			var opacity = [0.3,0.05,0.05,0.5];
			var gradient= new JenScript.SVGLinearGradient().Id(gradientId).from(startX,startY).to(endX, endY).shade(percents,colors,opacity).toSVG();
			g2d.definesSVG(gradient);
			var outerEffect = new JenScript.SVGElement().name('path')
													.attr('d',outerFrontFace)
													.attr('fill','url(#'+gradientId+')')
													.attr('opacity',this.alphaOuter)
													.buildHTML();
			g2d.insertSVG(outerEffect);
		},
		
		
		
		/**
		 * paint inner effect of given donut 3D
		 * @param {Object} g2d the graphics context
		 * @param {Object} donut3d the graphics context
		 */
		_paintInnerEffect : function(g2d,donut3d,section) {
			var innerBackFace = '';
			for (var i = 0; i < donut3d.slices.length; i++) {
				var fragments = donut3d.slices[i].fragments;
				for (var j = 0; j < fragments.length; j++) {
					var frag = fragments[j];
					if (frag.type === 'Back') {
						innerBackFace = innerBackFace+' '+frag.innerFace;
					}
				}
			}
			
			var clipId1 = 'clip'+JenScript.sequenceId++;
			var clip1 = new JenScript.SVGElement().name('clipPath')
												.attr('id',clipId1)
												.buildHTML();
			var c = donut3d.getDonutCenter();
			var clip1Path = new JenScript.SVGElement().name('ellipse')
													.attr('cx',c.x)
													.attr('cy',c.y)
													.attr('rx',donut3d.innerA)
													.attr('ry',donut3d.innerB)
													.buildHTML();
			
			clip1.appendChild(clip1Path);
			g2d.definesSVG(clip1);
			
			var startX = c.x +donut3d.innerA;
			var startY = c.y;
			var endX = c.x-donut3d.innerA;
			var endY = c.y;
			var percents = [ '0%', '40%', '80%', '100%' ];
			var c1 = 'rgb(40, 40, 40)';
			var c2 = 'rgb(40, 40, 40)';
			var c3 = 'rgb(240, 240, 240)';
			var c4 = 'rgb(240, 240, 240)';
			var colors = [ c1, c2, c3, c4 ];
			var opacity = [0.2,0.3,0,0.6];
			var gradientId = 'gradient'+JenScript.sequenceId++;
			var gradient= new JenScript.SVGLinearGradient().Id(gradientId).from(startX,startY).to(endX, endY).shade(percents,colors,opacity).toSVG();
			g2d.definesSVG(gradient);
			var innerEffect = new JenScript.SVGElement().name('path')
												.attr('d',innerBackFace)
												.attr('clip-path','url(#'+clipId1+')')
												.attr('fill','url(#'+gradientId+')')
												.attr('opacity',this.alphaInner)
												.buildHTML();
			g2d.insertSVG(innerEffect);
		},
		
		/**
		 * paint end face effect of given donut 3D
		 * @param {Object} g2d the graphics context
		 * @param {Object} donut3d the graphics context
		 * @param {Object} section the graphics context
		 */
		paintEndEffect : function(g2d,donut3d,section) {

			//g2d.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER, 1f));

//			Line2D lineBottom = section.getEndBottomLine();
//			Line2D lineTop = section.getEndTopLine();
//
//			double a = (lineTop.getY1() - lineTop.getY2()) / (lineTop.getX1() - lineTop.getX2());
//			double bTop = lineTop.getY1() - 2 * a * lineTop.getX1();
//			double bBottom = lineBottom.getY1() - 2 * a * lineBottom.getX1();
//
//			double distanceLineTop = Math.abs(bBottom - bTop) / Math.sqrt(a * a + 1);
//
//			double cxBottom = (lineBottom.getX1() + lineBottom.getX2()) / 2d;
//			double cyBottom = (lineBottom.getY1() + lineBottom.getY2()) / 2d;
//
//			double cxTop = (lineTop.getX1() + lineTop.getX2()) / 2d;
//			double cyTop = (lineTop.getY1() + lineTop.getY2()) / 2d;
//
//			GeometryPath path = new GeometryPath(lineBottom);
//			float topLength = (float) Math.sqrt((lineTop.getX2() - lineTop.getX1()) * (lineTop.getX2() - lineTop.getX1()) + (lineTop.getY2() - lineTop.getY1()) * (lineTop.getY2() - lineTop.getY1()));
//			double angleRadian = path.angleAtLength(topLength / 2f);
//
//			double px = cxBottom + distanceLineTop * Math.cos(angleRadian + Math.PI / 2);
//			double py = cyBottom + distanceLineTop * Math.sin(angleRadian + Math.PI / 2);
//
//			Point2D start2 = new Point2D.Double(cxBottom, cyBottom);
//			Point2D end2 = new Point2D.Double(px, py);
//
//			float[] dist2 = { 0f, 0.4f, 0.6f, 1.0f };
//
//			Color cStart2 : 'rgb(40, 40, 40, 140);
//			Color cStart2bis : 'rgb(40, 40, 40, 10);
//			Color cEnd2bis : 'rgb(255, 255, 255, 10);
//			Color cEnd2 : 'rgb(240, 240, 240, 140);
//
//			Color[] colors2 = { cStart2, cStart2bis, cEnd2bis, cEnd2 };
//
//			if (!start2.equals(end2)) {
//				LinearGradientPaint p2 = new LinearGradientPaint(start2, end2, dist2, colors2);
//
//				g2d.setPaint(p2);
//
//				g2d.fill(section.getEndFace());
//			}

		},
	
		/**
		 * paint top effect of given donut 3D
		 * @param {Object} g2d the graphics context
		 * @param {Object} donut3d the graphics context
		 */
		_paintTopEffect:function(g2d,donut3d,section) {
			var c = donut3d.getDonutCenter();
			var startSection = donut3d.getSliceOnAngle(this.incidenceAngleDegree);
			var exploseStartTiltRadius = startSection.divergence / 90;
			var exploseStartRadius = exploseStartTiltRadius * donut3d.tilt;
			var exploseStartA = startSection.divergence;
			var exploseStartB = exploseStartRadius;
			var centerStartX = c.x + exploseStartA * Math.cos(JenScript.Math.toRadians(startSection.startAngleDegree + Math.abs(startSection.endAngleDegree-startSection.startAngleDegree) / 2));
			var centerStartY = c.y - exploseStartB * Math.sin(JenScript.Math.toRadians(startSection.startAngleDegree + Math.abs(startSection.endAngleDegree-startSection.startAngleDegree) / 2));
			var startX = centerStartX + donut3d.outerA * Math.cos(JenScript.Math.toRadians(this.incidenceAngleDegree));
			var startY = centerStartY - donut3d.outerB * Math.sin(JenScript.Math.toRadians(this.incidenceAngleDegree));
			var endSection = donut3d.getSliceOnAngle(this.incidenceAngleDegree + 180);
			var exploseEndTiltRadius = endSection.divergence / 90;
			var exploseEndRadius = exploseEndTiltRadius * donut3d.tilt;
			var exploseEndA = endSection.divergence;
			var exploseEndB = exploseEndRadius;
			var centerEndX = c.x + exploseEndA * Math.cos(JenScript.Math.toRadians(endSection.startAngleDegree + Math.abs(endSection.endAngleDegree-endSection.startAngleDegree) / 2));
			var centerEndY = c.y - exploseEndB * Math.sin(JenScript.Math.toRadians(endSection.startAngleDegree + Math.abs(endSection.endAngleDegree-endSection.startAngleDegree) / 2));
			var endX = centerEndX + donut3d.outerA * Math.cos(JenScript.Math.toRadians(this.incidenceAngleDegree + 180));
			var endY = centerEndY - donut3d.outerB * Math.sin(JenScript.Math.toRadians(this.incidenceAngleDegree + 180));
			var c1 = 'rgb(40, 40, 40)';
			var c2 = 'rgb(40, 40, 40)';
			var c3 = 'rgb(255, 255, 255)';
			var c4 = 'rgb(255, 255, 255)';
			var percents = ['0%','45%','55%','100%'];
			var colors = [ c1, c2, c3, c4 ];
			var opacity =[0.5,0,0,0.8];
			var gradientId = 'gradient'+ JenScript.sequenceId++;
			var gradient= new JenScript.SVGLinearGradient().Id(gradientId).from(startX,startY).to(endX, endY).shade(percents,colors,opacity).toSVG();
			g2d.definesSVG(gradient);
			if (section !== undefined && section.topFace !== undefined) {
				var topFaceEffect = new JenScript.SVGElement().name('path')
									.attr('d',section.topFace)
									.attr('opacity',this.alphaTop)
									.attr('fill','url(#'+gradientId+')')
									//.attr('clip-path','url(#'+clipId1+')')
									.buildHTML();
				g2d.insertSVG(topFaceEffect);
			}
		},
		
		

		/**
		 * fill given donut 3D
		 * @param {Object} g2d the graphics context
		 * @param {Object} donut3d the graphics context
		 */
		_paintDonut3DFill : function(g2d,donut3d,s) {
			/**
			 * Back fragment outer face
			 */
			if (this.fillBackOuter) {
				if (s.type === 'Back') {
					var outerFace = new JenScript.SVGElement().name('path')
														.attr('d',s.outerFace)
														.attr('opacity',this.alphaFill)
														.attr('fill',s.themeColor)
														.buildHTML();
					g2d.insertSVG(outerFace);
				}
			}

			/**
			 * Back fragment bottom face
			 */
			if (this.fillBackBottom) {
				if (s.type === 'Back') {
					var bottomFace = new JenScript.SVGElement().name('path')
														.attr('d',s.bottomFace)
														.attr('opacity',this.alphaFill)
														.attr('fill',s.themeColor)
														.buildHTML();
					g2d.insertSVG(bottomFace);
				}
			}

			/**
			 * Back fragment inner face
			 */
			if (this.fillBackInner) {
				if (s.type == 'Back') {
					
					var clipId1 = 'clip'+JenScript.sequenceId++;
					var clip1 = new JenScript.SVGElement().name('clipPath')
														.attr('id',clipId1)
														.buildHTML();

					var clip1Path = new JenScript.SVGElement().name('path')
															.attr('d',donut3d.getTopFace())
															.buildHTML();
					
					clip1.appendChild(clip1Path);
					g2d.definesSVG(clip1);

					var visibleInnerBackFace = new JenScript.SVGElement().name('path')
															.attr('d',s.innerFace)
															.attr('opacity',this.alphaFill)
															.attr('fill',s.themeColor)
															//.attr('clip-path','url(#'+clipId1+')')
															.buildHTML();
					g2d.insertSVG(visibleInnerBackFace);
				}
			}
			
			/**
			 * Back fragment start and end face
			 */
			if (this.fillBackStart) {
				if (s.type === 'Back') {
					if (s.parentSlice.isFirst(s)) {
						var startFace = new JenScript.SVGElement().name('path')
												.attr('d',s.startFace)
												.attr('opacity',this.alphaFill)
												.attr('fill',s.themeColor)
												.buildHTML();
						g2d.insertSVG(startFace);

						if (s.parentSlice.isFirst(s) && (s.parentSlice.startAngleDegree <= 90 || s.parentSlice.startAngleDegree >= 270)) {
							//paintStartEffect(g2d, donut3d, s);
						}
					}

				}
			}

			if (this.fillBackEnd) {
				if (s.type === 'Back') {
					if (s.parentSlice.isLast(s)) {
						var endFace = new JenScript.SVGElement().name('path')
															.attr('d',s.endFace)
															.attr('opacity',this.alphaFill)
															.attr('fill',s.themeColor)
															.buildHTML();
						g2d.insertSVG(endFace);

						if (s.parentSlice.isLast(s) && (s.endAngleDegree >= 90 && s.endAngleDegree <= 270)) {
							//paintEndEffect(g2d, donut3d, s);
						}
					}
				}
			}


			/**
			 * Back fragment top face
			 */
			if (this.fillBackTop) {
				if (s.type === 'Back') {
					var topFace = new JenScript.SVGElement().name('path')
									.attr('d',s.topFace)
									.attr('opacity',this.alphaFill)
									.attr('fill',s.themeColor)
									.buildHTML();
					g2d.insertSVG(topFace);
				}
			}

			/***
			 * FRONT
			 */

			/**
			 * Front fragment inner face
			 */
			if (this.fillFrontInner) {
				if (s.type === 'Front') {
					var innerFace = new JenScript.SVGElement().name('path')
												.attr('d',s.innerFace)
												.attr('opacity',this.alphaFill)
												.attr('fill',s.themeColor)
												.buildHTML();
					g2d.insertSVG(innerFace);

				}
				
			}
			/**
			 * Front fragment bottom face
			 */
			if (this.fillFrontBottom) {
				if (s.type === 'Front') {
					var bottomFace = new JenScript.SVGElement().name('path')
												.attr('d',s.bottomFace)
												.attr('opacity',this.alphaFill)
												.attr('fill',s.themeColor)
												.buildHTML();
					g2d.insertSVG(bottomFace);
				}
			}
			
			/**
			 * Front fragment start and end face
			 */
			if (this.fillFrontStart) {
				if (s.type === 'Front') {
					if (s.parentSlice.isFirst(s)) {
						var startFace = new JenScript.SVGElement().name('path')
																.attr('d',s.startFace)
																.attr('opacity',this.alphaFill)
																.attr('fill',s.themeColor)
																.buildHTML();
						g2d.insertSVG(startFace);
						if (s.parentSlice.isFirst(s) && (s.startAngleDegree < 90 || s.startAngleDegree > 270)) {
							//paintStartEffect(g2d, donut3d, s);
						}
					}

				}
			}

			if (this.fillFrontEnd) {
				if (s.type === 'Front') {
					if (s.parentSlice.isLast(s)) {
						var endFace = new JenScript.SVGElement().name('path')
																.attr('d',s.endFace)
																.attr('opacity',this.alphaFill)
																.attr('fill',s.themeColor)
																.buildHTML();
						g2d.insertSVG(endFace);
						if (s.parentSlice.isLast(s) && (s.endAngleDegree > 90 && s.endAngleDegree < 270)) {
							//paintEndEffect(g2d, donut3d, s);
						}
					}
				}
			}

			/**
			 * Front fragment outer face
			 */
			if (this.fillFrontOuter) {
				if (s.type === 'Front') {
					var outerFace = new JenScript.SVGElement().name('path')
														.attr('d',s.outerFace)
														.attr('opacity',this.alphaFill)
														.attr('fill',s.themeColor)
														.buildHTML();
					g2d.insertSVG(outerFace);
				}
			}
			/**
			 * Front fragment top face
			 */
			if (this.fillFrontTop) {
				if (s.type === 'Front') {
					var topFace = new JenScript.SVGElement().name('path')
														.attr('d',s.topFace)
														.attr('opacity',this.alphaFill)
														.attr('fill',s.themeColor)
														.buildHTML();
					g2d.insertSVG(topFace);
				}
			}
		},
		
	});
})();