(function(){
	/**
	 * Ray Plugin takes the responsibility to paint rays
	 */
	JenScript.RayPlugin = function(config) {
		this._init(config)
	};
	JenScript.Model.inheritPrototype(JenScript.RayPlugin, JenScript.Plugin);
	JenScript.Model.addMethods(JenScript.RayPlugin, {
		
		_init : function(config){
			config = config || {};
			this.rays = [];
			this.raysListeners=[];
			JenScript.Plugin.call(this,{ name : "RayPlugin"});
		},
		/**
		 * register the specified ray
		 * 
		 * @param ray
		 *            the ray to register
		 */
		addRay : function(ray) {
			ray.plugin = this;
			this.rays.push(ray);
		},

		/**
		 * check and validate the specified ray
		 * 
		 * @param ray
		 *            the ray to validate
		 */
		checkRay : function(ray) {
			console.log("check ray : "+ray);
			if (ray.getRayNature() === undefined) {
				throw new Error("Ray nature should be supplied");
			}
			// other check
			// value, thickness, ray, etc
		},

		/**
		 * resolve ray registry geometry
		 */
		resolveRayPluginGeometry : function() {
			var that = this;
			var solve = function(ray, index, array) {
				that.checkRay(ray);
				if (ray instanceof JenScript.StackedRay) {
					that.resolveStackedRayGeometry(ray);
				}
				else if (ray instanceof JenScript.RayGroup) {
					that.resolveRayGroupGeometry(ray);
				} 
				else {
					that.resolveRayGeometry(ray);
				}
			}
			this.rays.forEach(solve);
		},

		/**
		 * resolve ray registry geometry
		 */
		resolveRayComponent : function(ray) {
			if (ray instanceof JenScript.StackedRay) {
				this.resolveStackedRayGeometry(ray);
			}
			else if (ray instanceof JenScript.RayGroup) {
				this.resolveRayGroupGeometry(ray);
			}
			else {
				this.resolveRayGeometry(ray);
			}
		},

		/**
		 * resolve the specified rayGroup geometry
		 * 
		 * @param rayGroup
		 *            the ray group geometry to resolve
		 */
		resolveRayGroupGeometry : function(rayGroup) {
			rayGroup.copyToRays();
			var rays = rayGroup.getRays();
			var solve = function(ray, index, array) {
				this.resolveRayGeometry(ray);
			};	
			rays.forEach(solve);
		},

		/**
		 * resolve the specified ray geometry
		 * 
		 * @param ray
		 *            the ray geometry to resolve
		 */
		resolveRayGeometry : function(ray) {
			var proj = this.getProjection();
			if (ray.getRayNature() === 'XRay') {

				var centerUserX = ray.getRay();
				var centerDeviceX = proj.userToPixel(new JenScript.Point2D(centerUserX, 0)).getX();
				
				var deviceRayWidth = 0;
				if (ray.getThicknessType() === 'Device') {
					deviceRayWidth = ray.getThickness();
				} else {
					var left = centerUserX - ray.getThickness() / 2;
					var pLeft = proj.userToPixel(new JenScript.Point2D(left, 0));

					var right = centerUserX + ray.getThickness() / 2;
					var pRight = proj.userToPixel(new JenScript.Point2D(right, 0));

					deviceRayWidth = pRight.getX() - pLeft.getX();
				}

				var yUserRayBase = 0;
				if (ray.isAscent()) {
					yUserRayBase = ray.getRayBase();
				}
				if (ray.isDescent()) {
					yUserRayBase = ray.getRayBase() - ray.getRayValue();
				}

				var yDeviceRayBase = proj.userToPixel(new JenScript.Point2D(0, yUserRayBase)).getY();

				var yUserRayFleche = 0;
				if (ray.isAscent()) {
					yUserRayFleche = ray.getRayBase() + ray.getRayValue();
				}
				if (ray.isDescent()) {
					yUserRayFleche = ray.getRayBase();
				}

				var yDeviceRayFleche = proj.userToPixel(new JenScript.Point2D(0, yUserRayFleche)).getY();

				var x = centerDeviceX - deviceRayWidth / 2;
				var y = yDeviceRayFleche;
				var width = deviceRayWidth;
				var height = Math.abs(yDeviceRayFleche - yDeviceRayBase);

				///var rayShape = new Rectangle2D.Double(x, y, width, height);
				var rayShape = new JenScript.SVGRect().origin(x, y).size(width,height);
				ray.setRayShape(rayShape);

			} else if (ray.getRayNature() === 'YRay') {

				var centerUserY = ray.getRay();
				var centerDeviceY = proj.userToPixel(new JenScript.Point2D(0, centerUserY)).getY();

				var deviceRayHeight = 0;
				if (ray.getThicknessType() == 'Device') {
					deviceRayHeight = ray.getThickness();
				} else {
					var top = centerUserY - ray.getThickness() / 2;
					var pTop = proj.userToPixel(new JenScript.Point2D(0, top));

					var bottom = centerUserY + ray.getThickness() / 2;
					var pBottom = proj.userToPixel(new JenScript.Point2D(0, bottom));

					deviceRayHeight = Math.abs(pTop.getY() - pBottom.getY());
				}

				var xUserRayBase = 0;
				if (ray.isAscent()) {
					xUserRayBase = ray.getRayBase();
				}
				if (ray.isDescent()) {
					xUserRayBase = ray.getRayBase() - ray.getRayValue();
				}

				var xDeviceRayBase = proj.userToPixel(new JenScript.Point2D(xUserRayBase, 0)).getX();

				var xUserRayFleche = 0;
				if (ray.isAscent()) {
					xUserRayFleche = ray.getRayBase() - ray.getRayValue();
				}
				if (ray.isDescent()) {
					xUserRayFleche = ray.getRayBase();
				}

				var xDeviceRayFleche = proj.userToPixel(new JenScript.Point2D(xUserRayFleche, 0)).getX();

				var x = xDeviceRayBase;
				var y = centerDeviceY - deviceRayHeight / 2;
				var width = Math.abs(xDeviceRayFleche - xDeviceRayBase);
				var height = deviceRayHeight;

				//Rectangle2D rayShape = new Rectangle2D.Double(x, y, width, height);
				var rayShape = new JenScript.SVGRect().origin(x, y).size(width,height);
				ray.setRayShape(rayShape);
			}
		},

		/**
		 * resolve specified stacked ray geometry
		 * 
		 * @param stackedRay
		 *            the stacked ray geometry to resolve
		 */
		resolveStackedRayGeometry : function(stackedRay) {
			var proj = this.getProjection();
			stackedRay.normalize();
			if (stackedRay.getRayNature() === 'XRay') {

				var centerUserX = stackedRay.getRay();
				var centerDeviceX = proj.userToPixel(new JenScript.Point2D(centerUserX, 0)).getX();
				var deviceRayWidth = 0;
				if (stackedRay.getThicknessType() == 'Device') {
					deviceRayWidth = stackedRay.getThickness();
				} else {
					var left = centerUserX - stackedRay.getThickness() / 2;
					var pLeft = proj.userToPixel(new JenScript.Point2D(left, 0));

					var right = centerUserX + stackedRay.getThickness() / 2;
					var pRight = proj.userToPixel(new JenScript.Point2D(right, 0));

					deviceRayWidth = pRight.getX() - pLeft.getX();
				}

				var yUserRayBase = 0;
				if (stackedRay.isAscent()) {
					yUserRayBase = stackedRay.getRayBase();
				}
				if (stackedRay.isDescent()) {
					yUserRayBase = stackedRay.getRayBase() - stackedRay.getRayValue();
				}

				var yDeviceRayBase = proj.userToPixel(new JenScript.Point2D(0, yUserRayBase)).getY();

				var yUserRayFleche = 0;
				if (stackedRay.isAscent()) {
					yUserRayFleche = stackedRay.getRayBase() + stackedRay.getRayValue();
				}
				if (stackedRay.isDescent()) {
					yUserRayFleche = stackedRay.getRayBase();
				}

				var yDeviceRayFleche = proj.userToPixel(new JenScript.Point2D(0, yUserRayFleche)).getY();

				var x = centerDeviceX - deviceRayWidth / 2;
				var y = yDeviceRayFleche;
				var width = deviceRayWidth;
				var height = Math.abs(yDeviceRayFleche - yDeviceRayBase);

				//Rectangle2D rayShape = new Rectangle2D.Double(x, y, width, height);
				var rayShape = new JenScript.SVGRect().origin(x, y).size(width,height);
				stackedRay.setRayShape(rayShape);

				// stacks
				for (var i = 0; i < stackedRay.getStacks().length; i++) {
					var s = stackedRay.getStacks()[i];

					var rayStack = new JenScript.Ray();
					rayStack.setName(s.getStackName());
					rayStack.setRayNature(stackedRay.getRayNature());
					rayStack.setThickness(stackedRay.getThickness());
					rayStack.setThicknessType(stackedRay.getThicknessType());
					rayStack.setRay(stackedRay.getRay());
					rayStack.setRayBase(stackedRay.getStackBase(s));
					rayStack.setThemeColor(s.getThemeColor());
					rayStack.setRayFill(s.getRayFill());
					rayStack.setRayDraw(s.getRayDraw());
					rayStack.setRayEffect(s.getRayEffect());
					if (stackedRay.isAscent()) {
						rayStack.setAscentValue(s.getNormalizedValue());
					} else if (stackedRay.isDescent()) {
						rayStack.setDescentValue(s.getNormalizedValue());
					}

					var yUserStackRayBase = 0;
					if (stackedRay.isAscent()) {
						yUserStackRayBase = stackedRay.getStackBase(s);
					}
					if (stackedRay.isDescent()) {
						yUserStackRayBase = stackedRay.getStackBase(s) - s.getNormalizedValue();
					}

					var yDeviceStackRayBase = proj.userToPixel(new JenScript.Point2D(0, yUserStackRayBase)).getY();

					var yUserStackRayFleche = 0;
					if (stackedRay.isAscent()) {
						yUserStackRayFleche = stackedRay.getStackBase(s) + s.getNormalizedValue();
					}
					if (stackedRay.isDescent()) {
						yUserStackRayFleche = stackedRay.getStackBase(s);
					}

					var yDeviceStackRayFleche = proj.userToPixel(new JenScript.Point2D(0, yUserStackRayFleche)).getY();

					var stackx = centerDeviceX - deviceRayWidth / 2;
					var stacky = yDeviceStackRayFleche;
					var stackwidth = deviceRayWidth;
					var stackheight = Math.abs(yDeviceStackRayFleche - yDeviceStackRayBase);

					//Rectangle2D stackRayShape = new Rectangle2D.Double(stackx, stacky, stackwidth, stackheight);
					var rayShape = new JenScript.SVGRect().origin(x, y).size(width,height);
					rayStack.setRayShape(stackRayShape);

					s.setRay(rayStack);
				}

			} else if (stackedRay.getRayNature() === 'YRay') {

				var centerUserY = stackedRay.getRay();
				var centerDeviceY = proj.userToPixel(new JenScript.Point2D(0, centerUserY)).getY();

				var deviceRayHeight = 0;
				if (stackedRay.getThicknessType() == 'Device') {
					deviceRayHeight = stackedRay.getThickness();
				} else {
					var top = centerUserY - stackedRay.getThickness() / 2;
					var pTop = proj.userToPixel(new JenScript.Point2D(0, top));

					var bottom = centerUserY + stackedRay.getThickness() / 2;
					var pBottom = proj.userToPixel(new JenScript.Point2D(0, bottom));

					deviceRayHeight = Math.abs(pTop.getY() - pBottom.getY());
				}

				var xUserRayBase = 0;
				if (stackedRay.isAscent()) {
					xUserRayBase = stackedRay.getRayBase();
				}
				if (stackedRay.isDescent()) {
					xUserRayBase = stackedRay.getRayBase() - stackedRay.getRayValue();
				}

				var xDeviceRayBase = proj.userToPixel(new JenScript.Point2D(xUserRayBase, 0)).getX();

				var xUserRayFleche = 0;
				if (stackedRay.isAscent()) {
					xUserRayFleche = stackedRay.getRayBase() - stackedRay.getRayValue();
				}
				if (stackedRay.isDescent()) {
					xUserRayFleche = stackedRay.getRayBase();
				}

				var xDeviceRayFleche = proj.userToPixel(new JenScript.Point2D(xUserRayFleche, 0)).getX();

				var x = xDeviceRayBase;
				var y = centerDeviceY - deviceRayHeight / 2;
				var width = Math.abs(xDeviceRayFleche - xDeviceRayBase);
				var height = deviceRayHeight;

				//Rectangle2D rayShape = new Rectangle2D.Double(x, y, width, height);
				var rayShape = new JenScript.SVGRect().origin(x, y).size(width,height);
				stackedRay.setRayShape(rayShape);

				// stacks
				for (var i = 0; i < stackedRay.getStacks().length; i++) {
					var s = stackedRay.getStacks()[i];

					var rayStack = new JenScript.Ray();
					rayStack.setName(s.getStackName());
					rayStack.setRayNature(stackedRay.getRayNature());
					rayStack.setThickness(stackedRay.getThickness());
					rayStack.setThicknessType(stackedRay.getThicknessType());
					rayStack.setRay(stackedRay.getRay());
					rayStack.setRayBase(stackedRay.getStackBase(s));
					rayStack.setThemeColor(s.getThemeColor());
					rayStack.setRayFill(s.getRayFill());
					rayStack.setRayDraw(s.getRayDraw());
					rayStack.setRayEffect(s.getRayEffect());

					if (stackedRay.isAscent()) {
						rayStack.setAscentValue(s.getNormalizedValue());
					} else if (stackedRay.isDescent()) {
						rayStack.setDescentValue(s.getNormalizedValue());
					}

					var xUserStackRayBase = 0;
					if (stackedRay.isAscent()) {
						xUserStackRayBase = stackedRay.getStackBase(s);
					}
					if (stackedRay.isDescent()) {
						xUserStackRayBase = stackedRay.getStackBase(s) - s.getNormalizedValue();
					}

					var xDeviceStackRayBase = proj.userToPixel(new JenScript.Point2D(xUserStackRayBase, 0)).getX();

					var xUserStackRayFleche = 0;
					if (stackedRay.isAscent()) {
						xUserStackRayFleche = stackedRay.getStackBase(s) - s.getNormalizedValue();
					}
					if (stackedRay.isDescent()) {
						xUserStackRayFleche = stackedRay.getStackBase(s);
					}

					var xDeviceStackRayFleche = proj.userToPixel(new JenScript.Point2D(xUserStackRayFleche, 0)).getX();

					var stackx = xDeviceStackRayBase;
					var stacky = centerDeviceY - deviceRayHeight / 2;
					var stackwidth = Math.abs(xDeviceStackRayFleche - xDeviceStackRayBase);
					var stackheight = deviceRayHeight;

					//Rectangle2D stackRayShape = new Rectangle2D.Double(stackx, stacky, stackwidth, stackheight);
					var rayShape = new JenScript.SVGRect().origin(x, y).size(width,height);
					rayStack.setRayShape(stackRayShape);

					s.setRay(rayStack);

				}

			}
		},

		/**
		 * paint the specified ray
		 * 
		 * @param v2d
		 *            the host view
		 * @param g2d
		 *            graphics context
		 * @param ray
		 *            the ray to paint
		 */
		paintRay : function(g2d,ray,viewPart,paintRequest) {

			ray.plugin = this;

//			if (paintRequest == PaintRequest.RayLayer) {
				if (ray.getRayFill() !== undefined) {
					ray.getRayFill().paintRay(g2d, ray, viewPart);
				}

				if (ray.getRayEffect() !== undefined) {
					ray.getRayEffect().paintRay(g2d, ray, viewPart);
				}

				if (ray.getRayDraw() !== undefined) {
					ray.getRayDraw().paintRay(g2d, ray, viewPart);
				}
//			} else {
//				if (ray.getRayLabel() != null) {
//					ray.getRayLabel().paintRay(g2d, ray, viewPart);
//				}
//			}

		},

		/**
		 * paint the specified stacked ray
		 * 
		 * @param v2d
		 *            the host view
		 * @param g2d
		 *            graphics context
		 * @param stackedRay
		 *            the stackedRay to paint
		 */
		paintStackedRay : function(g2d,stackedRay,viewPart,paintRequest) {
			var stacks = stackedRay.getStacks();
			for (var i = 0; i < stacks.length; i++) {
				var s = stacks[i];
				var stackRay = s.getRay();
				this.paintRay(g2d, stackRay, viewPart, paintRequest);
			}
			this.paintRay(g2d, stackedRay, viewPart, paintRequest);
		},

		
		/**
		 * paint Ray Plugin
		 * @param g2d graphics context
		 * @param viewPart the view part
		 * 
		 */
		paintPlugin : function(g2d,viewPart) {
			this.resolveRayPluginGeometry();
			if (viewPart === JenScript.ViewPart.Device) {

				for (var i = 0; i < this.rays.length; i++) {
					var ray = this.rays[i]
					if (ray instanceof JenScript.RayGroup) {
						var group =  ray;
						var rays = group.getRays();
						for (var j = 0; j < rays.length; j++) {
							var r = rays[j];
							if (r instanceof JenScript.StackedRay && !(r instanceof JenScript.RayGroup)) {
								this.paintStackedRay(g2d, r, viewPart, 'RayLayer');
							} else if (r instanceof JenScript.Ray && !(r instanceof JenScript.RayGroup)) {
								this.paintRay(g2d, r, viewPart, 'RayLayer');
							}
						}
					} 
					else if (ray instanceof JenScript.StackedRay) {
						this.paintStackedRay(g2d, ray, viewPart, 'RayLayer');
					}
					else {
						this.paintRay(g2d, ray, viewPart, 'RayLayer');
					}
				}

				for (var i = 0; i < this.rays.length; i++) {
					var ray = this.rays[i]
					if (ray instanceof JenScript.RayGroup) {
						var group = ray;
						var rays = group.getRays();
						for (var j = 0; j < rays.length; j++) {
							var r = rays[j];
							if (r instanceof JenScript.StackedRay && !(r instanceof JenScript.RayGroup)) {
								this.paintStackedRay(g2d, r, viewPart, 'LabelLayer');
							} else if (r instanceof JenScript.Ray && !(r instanceof JenScript.RayGroup)) {
								this.paintRay(g2d, r, viewPart, 'LabelLayer');
							}
						}
						
					} 
					else if (ray instanceof JenScript.StackedRay) {
						this.paintStackedRay(g2d, ray, viewPart, 'LabelLayer');
					}
					else {
						this.paintRay(g2d, ray, viewPart, 'LabelLayer');
					}
				}
			} else {
				//this.paintRayAxisLabel(g2d, viewPart);
			}
		},

		/**
		 * paint rays axis symbols
		 * 
		 * @param g2d
		 *            the graphics context to paint
		 * @param viewPart
		 *            to view part to paint
		 */
		paintRayAxisLabel : function(g2d,viewPart) {

//			for (Ray ray : rays) {
//				ray.setHost(this);
//
//				if (ray instanceof RayGroup) {
//					RayGroup group = (RayGroup) ray;
//
//					if (group.getRayAxisLabel() != null) {
//						group.getRayAxisLabel().paintRay(g2d, ray, viewPart);
//					}
//
//					List<Ray> rays = group.getRays();
//					for (Ray r : rays) {
//						ray.setHost(this);
//						if (!(r instanceof RayGroup)) {
//							if (r.getRayAxisLabel() != null) {
//								r.getRayAxisLabel().paintRay(g2d, r, viewPart);
//							}
//						}
//					}
//				} else {
//					if (ray.getRayAxisLabel() != null) {
//						ray.getRayAxisLabel().paintRay(g2d, ray, viewPart);
//					}
//				}
//			}

		},
	});

	
})();