(function(){
	
	JenScript.Model.addMethods(JenScript.View, {
		
		/**
         * Initialize view with given parameters config.
         * @param {Object} config
         * @param {String} [config.name] The view chart name
         * @param {Number} [config.width] The view width in pixel
         * @param {Number} [config.height] The view height in pixel
         * @param {Number} [config.holders] The All outer's part width
         * @param {Number} [config.west] The west part width
         * @param {Number} [config.east] The east part width
         * @param {Number} [config.north] The north part height
         * @param {Number} [config.south] The south part height
         * @param {Number} [config.viewBackground] The view background painter
         * @param {Number} [config.scale] The scale in percent
         * 
         */
		init : function(config) {
			config = config || {};
			/**view part*/
			this.part = JenScript.ViewPart.View;
			
			/**div holder for the view, container Id*/
			this.name = config.name;
			this.Id = 'view_'+this.name;
			this.SVG_NS = "http://www.w3.org/2000/svg";
			this.XLINK_NS = "http://www.w3.org/1999/xlink";
			
			var container = document.getElementById(this.name);
			if(container === null || container === undefined){
				console.log('jenscript view container '+container+' does not exist');
				var element = document.createElement('div');
				element.setAttribute('id',this.name);
				document.body.appendChild(element);
				
			}else{
				while (container.hasChildNodes()) {
					container.removeChild(container.lastChild);
				}
			}
			
			//TODO : auto size strategy
			/**view dimension*/
			this.width  = (config.width !== undefined)?config.width : document.getElementById(this.name).clientWidth;
			this.height = (config.height !== undefined)?config.height : document.getElementById(this.name).clientHeight;
			this.scale  = (config.scale !== undefined)?config.scale : 1;
			
			/**part place holders*/
			
			if(config.holders!== undefined){
				config.west   = (config.west !== undefined)?  config.west  : config.holders;
				config.east   = (config.east !== undefined)?  config.east  : config.holders;
				config.south  = (config.south !== undefined)? config.south : config.holders;
				config.north  = (config.north !== undefined)? config.north : config.holders;
			}
			
			this.west  = (config.west!== undefined)?   config.west  : 40;
			this.east  = (config.east!== undefined)?   config.east  : 40;
			this.north = (config.north!== undefined)?  config.north : 40;
			this.south = (config.south !== undefined)? config.south : 40;

			if(this.width-this.west-this.east < 0)
				throw new Error('View width is two small with e/w holders');
			if(this.height-this.north-this.south < 0)
				throw new Error('View height is two small with n/s holders');
			
			/**view background painters*/
			this.viewBackgrounds = []; 
			this.backgroundEnable = true;
			
			/**view foreground painters*/
			this.viewForegrounds = [];
			this.foregroundEnable = true;
			
			/**view projections*/
			this.projections = [];
			
			/**active projection*/
			this.activeProjection;
			
			/** the widget folder guard interval */
			this.folderGuardInterval = 4;
			
			this.listeners = [];
			
			this.dispatcherStrategy = (config.dispatcher !== undefined)? config.dispatcher : 'foreground';
			/**
			 * the widget plug-in is a specific plug-in to handle widget and window meta
			 * data
			 */
			this.widgetPlugin = new JenScript.WidgetPlugin();
			this.widgetPlugin.setView(this);
			var that = this;
			
			this.addViewListener('projectionRegister',function(){that.widgetPlugin.repaintPlugin('view listener 1');},'widget plugin attach :view projection register listener');
			
			/**
			 * the selector plug-in is a specific plug-in to handle projections meta
			 * data
			 */
			this.selectorPlugin = new JenScript.SelectorPlugin();
			this.selectorPlugin.setView(this);
			var that = this;
			
			this.addViewListener('projectionRegister',function(){that.selectorPlugin.repaintPlugin('view listener 2');},'selector plugin attach :view projection register listener');
			
			//this.addViewListener('projectionActive',function(){that.widgetPlugin.repaintPlugin();},'widget plugin attach : projection active listener');
			
			/**create Part component*/
			this.createPartComponents();
			
			/**contextualize graphics*/
			this.contextualizeGraphics();
			
			//DO NOT REMOVE THIS LINE
			var copyright = new JenScript.TextViewForeground({/*textColor:'rgb(255,255,50)',*/fontSize:6,x:this.west,y:this.north-2,text:'JenScript '+JenScript.version+' - www.jensoftapi.com'});
			this.addViewForeground(copyright);
		},
		
		
		/**
		 * get the background clip for the given background
		 * @param {Object} background
		 */
		getBackgroundClip : function(background){
			var clips=[];
			for (var i = 0; i < this.viewBackgrounds.length; i++) {
				var bg = this.viewBackgrounds[i];
				if(bg.Id === background.Id)
					return clips;
				var clip = bg.getBackgroundPath();
				clips[clips.length] = clip;
			}
			return clips;
		},
		
		/**
		 * add view background
		 * @param {Object} view background to add
		 */
		addViewBackground : function(background){
			this.viewBackgrounds[this.viewBackgrounds.length]=background;
			this.contextualizeBackground(background);
		},
		
		/**
		 * remove view background
		 * @param {Object} view background to remove
		 */
		removeViewBackground : function(background){
			if(background.Id === undefined)
				return null;
			var bgs = [];
			for (var i = 0; i < this.viewBackgrounds.length; i++) {
				var bg = this.viewBackgrounds[i];
				if(bg.Id === background.Id){
					background.getGraphics().clearGraphics();
				}else{
					bgs[bgs.length] = bg;
				}
			}
			this.viewBackgrounds=bgs;
		},
		
		/**
		 * create background node
		 */
		contextualizeBackground : function(background){
			var svgBackground = new JenScript.SVGGroup().Id(background.Id).toSVG();
			var svgBackgroundDefinitions = new JenScript.SVGGroup().Id(this.Id+'_background_definitions').toSVG();
			var svgBackgroundGraphics = new JenScript.SVGGroup().Id(this.Id+'_background_graphics').toSVG();
			svgBackground.appendChild(svgBackgroundDefinitions);
			svgBackground.appendChild(svgBackgroundGraphics);
			this.svgRootBackground.appendChild(svgBackground);
			
			var g2d = new JenScript.Graphics({definitions: svgBackgroundDefinitions,graphics : svgBackgroundGraphics});
			background.view = this;
			background.g2d = g2d;
			background.paint.call(background,{});
		},
		
		
		
		/**
		 * set view foreground painter
		 */
		addViewForeground : function(foreground){
			this.viewForegrounds[this.viewForegrounds.length]=foreground;
			this.contextualizeForeground(foreground);
		},
		
		/**
		 * remove view foreground
		 * @param {Object} view foreground to remove
		 */
		removeViewForeground : function(foreground){
			if(foreground.Id === undefined)
				return null;
			var fgs = [];
			for (var i = 0; i < this.viewForegrounds.length; i++) {
				var fg = this.viewForegrounds[i];
				if(fg.Id === foreground.Id){
					foreground.getGraphics().clearGraphics();
				}else{
					fgs[fgs.length] = fg;
				}
			}
			this.viewForegrounds=fgs;
		},
		
		/**
		 * create foreground node
		 */
		contextualizeForeground : function(foreground){
			var svgForeground = new JenScript.SVGGroup().Id(foreground.Id).toSVG();
			var svgForegroundDefinitions = new JenScript.SVGGroup().Id(this.Id+'_foreground_definitions').toSVG();
			var svgForegroundGraphics = new JenScript.SVGGroup().Id(this.Id+'_foreground_graphics').toSVG();
			svgForeground.appendChild(svgForegroundDefinitions);
			svgForeground.appendChild(svgForegroundGraphics);
			this.svgRootForeground.appendChild(svgForeground);
			
			var g2d = new JenScript.Graphics({definitions: svgForegroundDefinitions,graphics : svgForegroundGraphics});
			foreground.view = this;
			foreground.g2d = g2d;
			foreground.paint.call(foreground,{});
		},
		
		
		
		/**
		 * bind actions : projectionRegister, projectionActive
		 */
		addViewListener  : function(actionEvent,listener, name){
			if(name === undefined)
				throw new Error('View listener, listener name should be supplied.');
			var l = {action:actionEvent , onEvent : listener,name:name};
			this.listeners[this.listeners.length] =l;
		},
		
		/**
		 * fire listener when view register new projection
		 */
		fireViewEvent : function(actionEvent){
			for (var i = 0; i < this.listeners.length; i++) {
				var l = this.listeners[i];
				if(actionEvent === l.action){
					l.onEvent(this);
				}
			}
		},
		
		/**
		 * create part component
		 */
		createPartComponents : function(){
			this.devicePart = new JenScript.ViewPartComponent({
					part   : JenScript.ViewPart.Device,
					width  : this.width - this.west - this.east,
					height : this.height - this.north - this.south,
					view   : this});
			
			this.westPart = new JenScript.ViewPartComponent({
					part   : JenScript.ViewPart.West,
					width  :  this.west,
					height : this.height - this.north- this.south,
					view   : this});
			
			this.eastPart = new JenScript.ViewPartComponent({
					part   : JenScript.ViewPart.East,
					width  : this.west,
					height : this.height-this.north-this.south,
					view   : this});
			
			this.southPart = new JenScript.ViewPartComponent({
					part   : JenScript.ViewPart.South,
					width  : this.width,
					height : this.south,
					view   : this});
			
			this.northPart = new JenScript.ViewPartComponent({
					part   : JenScript.ViewPart.North,
					width  : this.width,
					height : this.north,
					view   : this});
		},
		
		/**
		 * get view Id
		 */
		getId : function(){
			return this.Id;
		},
		
		/**
		 * get view width
		 */
		getWidth : function(){
			return this.width;
		},
		
		/**
		 * get view height
		 */
		getHeight : function(){
			return this.height;
		},
		
		/**
		 * get the widget plugin
		 * 
		 * @return the widget plugin
		 */
		getWidgetPlugin : function() {
			return this.widgetPlugin;
		},
		
		/**
		 * get the selector plugin
		 * 
		 * @return the widget plugin
		 */
		getSelectorPlugin : function() {
			return this.selectorPlugin;
		},
		
		/**
		 * get place holder east
		 */
		getPlaceHolderAxisEast : function() {
			return this.east;
		},
		
		/**
		 * get place holder west
		 */
		getPlaceHolderAxisWest : function() {
			return this.west;
		},
		
		/**
		 * get place holder south
		 */
		getPlaceHolderAxisSouth : function() {
			return this.south;
		},
		
		/**
		 * get place holder north
		 */
		getPlaceHolderAxisNorth : function() {
			return this.north;
		},
		
		setBackgroundEnable : function(flag){
			this.backgroundEnable = flag;
		},

		/**
		 * register projection in this view
		 * @param {Object} projection
		 * @method
		 */
		registerProjection : function(projection) {
			projection.setView(this);
			this.projections[this.projections.length] = projection;
			this.activeProjection=projection;
			this.activeProjection.setActive(true);
			this.projections.sort(function(p1, p2) {
				var x = p1.isActive();
				var y = p2.isActive();
				if(x && !y)
					return 1;
				else return -1;
			});
			this.contextualizeGraphicsProjection(projection);
			this.setActiveProjection(projection);
			this.fireViewEvent('projectionRegister');
		},
		
		
		//avoir un style stream et pour échapper au 'new JenScript.XXXXX' ?
		//affecte la clarté du paradigme?
		
//		linear : function(config){
//			var lp = new JenScript.LinearProjection(config);
//			this.registerProjection(lp);
//			return lp;
//		},
		
		/**
		 * get active projection
		 * @returns {Object} projection
		 */
		getActiveProjection : function(){
			return this.activeProjection;
		},
		
		/**
		 * get all projections of this view.
		 * @returns {Array} projections array
		 */
		getProjections : function(){
			return this.projections;
		},
		
		/**
		 * set the specified projection active
		 * fire 'projectionPassive' for projection already active that being passive
		 * fire 'projectionActive'  for projection that being active
		 * 
		 * @param {object} activeProjection the projection to activate
		 *          
		 */
		setActiveProjection : function(activeProjection) {
			for (var p = 0; p < this.projections.length; p++) {
				var proj =this.projections[p];
				if(proj.Id !== activeProjection.Id && proj.isActive()){
					proj.setActive(false);
					this.fireViewEvent('projectionPassive');
				}
			}
			
			if (this.activeProjection.Id !== activeProjection.Id) {
				this.activeProjection = activeProjection;
				this.activeProjection.setActive(true);
				this.fireViewEvent('projectionActive');
			}
		},

		/**
		 * get the component specified par given part
		 * @param {String} part the part name 
		 */
		getComponent : function(part) {
			if (part === JenScript.ViewPart.North) {
				return this.northPart;
			} else if (part === JenScript.ViewPart.South) {
				return this.southPart;
			} else if (part === JenScript.ViewPart.East) {
				return this.eastPart;
			} else if (part === JenScript.ViewPart.West) {
				return this.westPart;
			} else if (part === JenScript.ViewPart.Device) {
				return this.devicePart;
			}
		},
		
		/**
		 * contextualize view graphics
		 */
		contextualizeGraphics : function(){
			
			this.createViewNode();
			if(this.dispatcherStrategy === 'background')
				this.createDispatcherNode();
			this.createViewDefsNode();
			this.createBackgroundNode();
			this.createProjectionsNode();
			this.createSelectorsNode();
			this.createWidgetsNode();
			this.createForegroundNode();
			if(this.dispatcherStrategy === 'foreground')
				this.createDispatcherNode();
		},
		
		/**
		 * create background node
		 */
		createViewNode : function(){
			
			//this.svgRootElement = new JenScript.SVGViewBox().Id(this.Id).viewBox("0 0 "+this.width+" "+this.height).width(this.width).height(this.height).toSVG();
			
			var w = this.scale * parseFloat(this.width);
			var h = this.scale * parseFloat(this.height);
			this.svgRootElement = new JenScript.SVGViewBox().Id(this.Id).viewBox("0 0 "+this.width+" "+this.height).width(w).height(h).toSVG();
			var viewContainer = document.getElementById(this.name);
			viewContainer.appendChild(this.svgRootElement);
		},
		
		/**
		 * create view global definitions node
		 * add some commons textures with globals IDs
		 */
		createViewDefsNode : function(){
			this.svgViewGlobalDefinitions = new JenScript.SVGGroup().Id(this.Id+'_global_definitions').toSVG();
			this.svgRootElement.appendChild(this.svgViewGlobalDefinitions);
			
			var c1 =JenScript.Texture.getTriangleCarbonFiber();
			c1.Id = 'texture_carbon1';
			this.definesTexture(c1);
			
			var c2 =JenScript.Texture.getSquareCarbonFiber();
			c2.Id = 'texture_carbon2';
			this.definesTexture(c2);
		},
		
		
		/**
		 * defines a texture in the global view definitions
		 * @param {String} textureId
		 * @param {Object} texture
		 */
		definesTexture : function(texture){
			var texturePattern = texture.pattern;
			var textureDefinitions = texture.definitions;
			
			if(textureDefinitions !== undefined){
				for (var i = 0; i < textureDefinitions.length; i++) {
					var def = textureDefinitions[i];
					this.svgViewGlobalDefinitions.appendChild(def.toSVG());
				}
			}
			if(texturePattern !== undefined){
				this.svgViewGlobalDefinitions.appendChild(texturePattern.Id(texture.getId()).toSVG());
			}
			
		},
		
		/**
		 * create background node
		 */
		createBackgroundNode : function(){
			this.svgRootBackground = new JenScript.SVGGroup().Id(this.Id+'_background').toSVG();
			this.svgRootElement.appendChild(this.svgRootBackground);
		},
		
		/**
		 * create foreground node
		 */
		createForegroundNode : function(){
			this.svgRootForeground = new JenScript.SVGGroup().Id(this.Id+'_foreground').toSVG();
			this.svgRootElement.appendChild(this.svgRootForeground);
//			var svgForeground = new JenScript.SVGGroup().Id(this.Id+'_foreground').toSVG();
//			
//			this.svgForegroundDefinitions = new JenScript.SVGGroup().Id(this.Id+'_foreground_definitions').toSVG();
//			this.svgForegroundGraphics = new JenScript.SVGGroup().Id(this.Id+'_foreground_graphics').toSVG();
//			svgForeground.appendChild(this.svgForegroundDefinitions);
//			svgForeground.appendChild(this.svgForegroundGraphics);
//			
//			this.svgRootElement.appendChild(svgForeground);
//			this.setViewForeground(this.viewForeground);//force default
		},
		
		/**
		 * create projection node
		 */
		createProjectionsNode : function(){
			this.svgProjections = new JenScript.SVGGroup().Id(this.Id+'_projections').toSVG();
			this.svgRootElement.appendChild(this.svgProjections);
		},
		
		/**
		 * contextualize selectors graphics
		 */
		createSelectorsNode : function(){
			var svgSelectors = document.createElementNS(this.SVG_NS,"g");
			svgSelectors.setAttribute("id",this.Id+'_selectors');
			
			this.svgSelectorsDefinitions = document.createElementNS(this.SVG_NS,"g");
			this.svgSelectorsDefinitions.setAttribute("id",this.Id+'_selectors_definitions');
			
			this.svgSelectorsGraphics = document.createElementNS(this.SVG_NS,"g");
			this.svgSelectorsGraphics.setAttribute("id",this.Id+'_selectors_graphics');

			svgSelectors.appendChild(this.svgSelectorsDefinitions);
			svgSelectors.appendChild(this.svgSelectorsGraphics);
			
			this.svgRootElement.appendChild(svgSelectors);
		},
		
		
		/**
		 * create widgets node
		 */
		createWidgetsNode : function(){
			var svgWidgets = document.createElementNS(this.SVG_NS,"svg");
			svgWidgets.setAttribute("id",this.Id+'_widgets');
			svgWidgets.setAttribute("x",this.west);
			svgWidgets.setAttribute("y",this.north);
			svgWidgets.setAttribute("width",this.devicePart.getWidth());
			svgWidgets.setAttribute("height",this.devicePart.getHeight());
			
			this.svgWidgetsDefinitions = document.createElementNS(this.SVG_NS,"defs");
			this.svgWidgetsDefinitions.setAttribute('id',this.Id+'_widgets_definitions');
			svgWidgets.appendChild(this.svgWidgetsDefinitions);
			
			this.svgWidgetsGraphics = document.createElementNS(this.SVG_NS,"g");
			this.svgWidgetsGraphics.setAttribute('id',this.Id+'_widgets_graphics');
			svgWidgets.appendChild(this.svgWidgetsGraphics);
			
			this.svgRootElement.appendChild(svgWidgets);
		},
		
		/**
		 * create dispatcher node
		 */
		createDispatcherNode : function(){
			this.svgDispatcher = new JenScript.SVGGroup().Id(this.Id+'_dispatcher').toSVG();
			this.svgRootElement.appendChild(this.svgDispatcher);
			this.contextualizeViewDispatcher(this.southPart,new JenScript.Point2D(0,(this.height - this.south)));
			this.contextualizeViewDispatcher(this.northPart,new JenScript.Point2D(0,0));
			this.contextualizeViewDispatcher(this.eastPart,new JenScript.Point2D((this.width - this.east), this.north));
			this.contextualizeViewDispatcher(this.westPart,new JenScript.Point2D(0, this.north));
			this.contextualizeViewDispatcher(this.devicePart,new JenScript.Point2D(this.west, this.north));
		},
		
		/**
		 * contextualize projection on register
		 * @param {Object} projection
		 */
		contextualizeGraphicsProjection : function(projection){
			
			this.attachProjectionActiveListener(projection);
			this.attachProjectionSelectorListener(projection);
			
			projection.svgRootElement = document.createElementNS(this.SVG_NS,"svg");
			projection.svgRootElement.setAttribute("id",projection.Id);
			projection.svgRootElement.setAttribute("xmlns",JenScript.SVG_NS);
			projection.svgRootElement.setAttribute("xmlns:xlink",JenScript.XLINK_NS);
			
			projection.svgRootElement.setAttribute("version","1.1");
			projection.svgRootElement.setAttribute("viewBox","0 0 "+this.width+" "+this.height);
			
			projection.svgDefsElement = document.createElementNS(this.SVG_NS,"defs");
			projection.svgDefsElement.setAttribute("id",projection.Id+'_definitions');
			projection.svgRootElement.appendChild(projection.svgDefsElement);
			
			projection.svgPartsGroup = document.createElementNS(this.SVG_NS,"g");
			projection.svgPartsGroup.setAttribute("xmlns",this.SVG_NS);
			projection.svgPartsGroup.setAttribute("id",projection.Id+'_parts');
			projection.svgRootElement.appendChild(projection.svgPartsGroup);
			
			this.svgProjections.appendChild(projection.svgRootElement);
			
			projection.svgPartPlugins ={};
			this.contextualizeProjectionPartGraphics(projection,this.southPart,new JenScript.Point2D(0,(this.height - this.south)));
			this.contextualizeProjectionPartGraphics(projection,this.northPart,new JenScript.Point2D(0,0));
			this.contextualizeProjectionPartGraphics(projection,this.eastPart,new JenScript.Point2D((this.width - this.east), this.north));
			this.contextualizeProjectionPartGraphics(projection,this.westPart,new JenScript.Point2D(0, this.north));
			this.contextualizeProjectionPartGraphics(projection,this.devicePart,new JenScript.Point2D(this.west, this.north));
		},
		
		
		/**
		 * attach projection bound listener that update selector plugin 
		 *  - on projection bound change
		 */
		attachProjectionSelectorListener : function(projection){
			var that=this;
			projection.addProjectionListener('boundChanged',function(proj){
				that.selectorPlugin.repaintPlugin('selector bound listener');
			},'projection bound listener to repaint selector');
			projection.addProjectionListener('pluginRegister',function(proj){
				that.selectorPlugin.repaintPlugin('selector plugin register listener');
			},'projection plugin register listener to repaint selector');
			
		},
		
		/**
		 * attach projection lock/unlock listener that update projection visibility
		 * based on active state and paintMode (ACTIVE or ALWAYS)
		 */
		attachProjectionActiveListener : function(projection){
			projection.addProjectionListener('lockActive',function(proj){
				proj.svgRootElement.setAttribute('opacity',1);
			},'view projection active listener to change projection opacity');
			projection.addProjectionListener('unlockActive',function(proj){
				if(proj.paintMode === 'ACTIVE')
					proj.svgRootElement.setAttribute('opacity',0);
				if(proj.paintMode === 'ALWAYS')
					proj.svgRootElement.setAttribute('opacity',1);
			},'view projection unactive listener to change projection opacity');
		},
		
		
		/**
		 * contextualize projection part
		 * @param {Object} projection
		 * @param {Object} component
		 * @param {Object} location
		 */
		contextualizeProjectionPartGraphics : function(projection,component,location){
			var svgRootElement = document.createElementNS(this.SVG_NS,"svg");
			svgRootElement.setAttribute("id",projection.Id+'_'+component.part);
			
			var svgPluginPart = document.createElementNS(this.SVG_NS,"g");
			svgPluginPart.setAttribute('id',projection.Id+'_'+component.part+'_plugins');
			svgRootElement.appendChild(svgPluginPart);

			svgRootElement.setAttribute("x",location.getX());
			svgRootElement.setAttribute("y",location.getY());
			svgRootElement.setAttribute("width",component.getWidth());
			svgRootElement.setAttribute("height",component.getHeight());
			
			projection.svgPartPlugins[component.part] = svgPluginPart;
			projection.svgPartsGroup.appendChild(svgRootElement);
		},
		
		/**
		 * contextualize the given plugin on register
		 * @param {Object} plugin
		 */
		contextualizePluginGraphics : function(plugin){
			//console.log('contextualize plugin :'+plugin);
			var proj = plugin.getProjection();
			var that = this;
			plugin.svgRoot ={};
			plugin.svgPluginPartsGraphics ={};
			plugin.svgPluginPartsDefinitions={};
			var contextualizePluginPart = function(component){
				var svgRootElement = document.createElementNS(that.SVG_NS,"g");
				svgRootElement.setAttribute("id",proj.Id+'_'+component.part+'_'+plugin.Id);
				
				svgRootElement.setAttribute("transform","translate("+plugin.tx+","+plugin.ty+") scale("+plugin.sx+","+plugin.sy+")");
				
				var svgPluginPartDefinitions = document.createElementNS(that.SVG_NS,"defs");
				svgPluginPartDefinitions.setAttribute("id",proj.Id+'_'+component.part+'_'+plugin.Id+'_definition');
				svgRootElement.appendChild(svgPluginPartDefinitions);
				
				var svgPluginPartGraphics = document.createElementNS(that.SVG_NS,"g");
				svgPluginPartGraphics.setAttribute("id",proj.Id+'_'+component.part+'_'+plugin.Id+'_graphics');
				svgRootElement.appendChild(svgPluginPartGraphics);
				
				plugin.svgRoot[component.part] = svgRootElement;
				plugin.svgPluginPartsGraphics[component.part] = svgPluginPartGraphics;
				plugin.svgPluginPartsDefinitions[component.part] = svgPluginPartDefinitions;
				
				function insertAfter(plg, newNode) {
					var node = document.getElementById("id",proj.Id+'_'+component.part+'_'+plg.Id);
					proj.svgPartPlugins[component.part].insertBefore(newNode, node.nextSibling);
				}
				
//				var index = proj.getIndexOf(plugin);
//				var countAll = proj.getPlugins().length;
//				if(index === countAll-1){
//					if(component.part === 'Device'){
//						console.log('natural insert, contextualize plugin :'+plugin.Id+" with index : "+index+" for part "+component.part);	
//					}
//					
//				}else{
//					if(component.part === 'Device'){
//						
//						//console.log('shift insert, should be inserted');
//						console.log('shift insert, contextualize plugin :'+plugin.Id+" with index : "+index+" for part "+component.part);
//						
//						if(index == 0){//first position
//							
//						}else{
//							
//						}
//						
//						var pluginBefore = proj.getPluginAtIndex(index-1);
//						console.log('plugin before:'+pluginBefore);
////						if(pluginBefore !== undefined){
////							insertAfter(pluginBefore,svgRootElement);
////						}else{
////							proj.svgPartPlugins[component.part].appendChild(svgRootElement);
////						}
//					}
//					
//				}
				
				
				proj.svgPartPlugins[component.part].appendChild(svgRootElement);
				
			};
			contextualizePluginPart(this.southPart);
			contextualizePluginPart(this.northPart);
			contextualizePluginPart(this.eastPart);
			contextualizePluginPart(this.westPart);
			contextualizePluginPart(this.devicePart);
			plugin.contextualized = true;
			plugin.repaintPlugin();
			
			
			//repaint all according to new priority
			
		},
		
		/**
		 * contextualize view dispatcher for the given part component
		 * @param {Object} projection
		 * @param {Object} component the part component
		 * @param {Object} location the origin location of component in view
		 */
		contextualizeViewDispatcher : function(component,location){
			var svgRootElement = document.createElementNS(this.SVG_NS,"svg");
			svgRootElement.setAttribute("id",this.Id+'_'+component.part+'_dispatcher');
			svgRootElement.setAttribute("x",location.getX()+'px');
			svgRootElement.setAttribute("y",location.getY()+'px');
			svgRootElement.setAttribute("width",component.getWidth()+'px');
			svgRootElement.setAttribute("height",component.getHeight()+'px');
			
			var s = document.createElementNS(this.SVG_NS,"rect");
			s.setAttribute("id",this.Id+'_dispatcher');
			s.setAttribute("x",'0');
			s.setAttribute("y",'0');
			s.setAttribute("width",component.getWidth());
			s.setAttribute("height",component.getHeight());
			s.setAttribute('style','stroke: black;stroke-opacity: 0; fill: #0000ff;fill-opacity :0');
			//s.setAttribute("pointer-events",'all');
			
			
			var getLocation = function(evt) {
				
				//var rect = evt.currentTarget.getBoundingClientRect();
				var rect = s.getBoundingClientRect();
				var bx = rect.left;
				var by = rect.top;
				var x = evt.clientX-bx;
				var y = evt.clientY-by;
				return{x:x,y:y};
			};
			var that = this;
			
			var dispatchMouse = function(evt,action) {
				var loc = getLocation(evt);
				//console.log(action+" ",loc.x, loc.y+' in part '+component.part);
				that.getComponent(component.part).on(action,evt, loc.x, loc.y);
			};
			
			var dispatchTouch = function(evt,action) {
				 if(evt.preventDefault){
					 evt.preventDefault();
				 }else if(evt.defaultPrevented){
					 evt.defaultPrevented=true;
				 }
				 var touch = evt.touches[0];
				 var type = undefined;
				 if(evt.type === 'touchmove')
					 type='mousemove';
				 if(evt.type === 'touchdstart')
					 type='mousedown';
				 if(evt.type === 'touchend'){
					 type='mouseup';
					 touch = evt.changedTouches[0];
				 }
				 
				 var mouseEvent = new MouseEvent(type, {
				    clientX: touch.clientX,
				    clientY: touch.clientY,
				  });
				 
				 var rect = s.getBoundingClientRect();
				  
				//console.log(action+" ",loc.x, loc.y+' in part '+component.part);
				that.getComponent(component.part).on(action,mouseEvent,(touch.clientX-rect.left), (touch.clientY-rect.top));
			};
			
			//bubling
			//Selection and Navigation of Overlapping SVG Objects
			//https://www.stat.auckland.ac.nz/~joh024/Research/D3js/SelNavSVG/SelNavSVG.html
	    	
			if ('ontouchstart' in window) {
				console.log("touch is supported");
				s.addEventListener("touchstart", function(evt){dispatchTouch(evt,'Press');},false);
				s.addEventListener("touchmove", function(evt){dispatchTouch(evt,'Move');},false);
				s.addEventListener("touchend", function(evt){dispatchTouch(evt,'Release');},false);
			}else{//assume that is classic desktop browser
				//classic dom mouse event
				s.addEventListener("mousemove", function(evt){dispatchMouse(evt,'Move');},false);
				s.addEventListener("mouseclick", function(evt){dispatchMouse(evt,'Click');},false);
				s.addEventListener("mousedown", function(evt){dispatchMouse(evt,'Press');},false);
				s.addEventListener("mouseup", function(evt){dispatchMouse(evt,'Release');},false);
				s.addEventListener("mouseover", function(evt){dispatchMouse(evt,'Enter');},false);
				s.addEventListener("mouseout", function(evt){dispatchMouse(evt,'Exit');},false);
				
				//special case wheel
				function MouseWheelHandler(originalEvent) {
					// cross-browser wheel delta
					var e = window.event || originalEvent; // old IE support
					var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
					
					// create a normalized event object
			         var event = {
			             // keep a ref to the original event object
			             originalEvent: e,
			             target: e.target || e.srcElement,
			             type: "wheel",
			             deltaMode: e.type == "MozMousePixelScroll" ? 0 : 1,
			             deltaX: 0,
			             deltaZ: 0,
			             preventDefault: function() {
			                 e.preventDefault ?
			                     e.preventDefault() :
			                     e.returnValue = false;
			             }
			         };
			         
			         event.deltaY = delta;
			         
			         dispatchMouse(event,'Wheel');
				}
				if (s.addEventListener) {
					// IE9, Chrome, Safari, Opera
					s.addEventListener("mousewheel", MouseWheelHandler, false);
					// Firefox
					s.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
				}
				// IE 6/7/8
				else s.attachEvent("onmousewheel", MouseWheelHandler);
			}
			
			
			
			svgRootElement.appendChild(s);
			this.svgDispatcher.appendChild(svgRootElement);
		},

		/**
		 * get the device part component
		 * @returns {Object} device component
		 */
		getDevice : function() {
			return this.devicePart;
		},
		
		/**
		 * return the folder instance for the specified position
		 * 
		 * @param Id
		 *            the widget Id
		 * @param width
		 *            the widget width
		 * @param height
		 *            the widget height
		 * @param xp
		 *            the x position
		 * @param yp
		 *            the y position
		 * @return the folder instance
		 */
		newFolderIntanceByPosition : function(Id,width,height,xp,yp) {
			//console.log('newFolderIntanceByPosition for Id '+Id);
			var deviceWidth = this.getDevice().getWidth();
			var deviceHeight = this.getDevice().getHeight();
			var folderGuardInterval = this.folderGuardInterval;
			var folderMaxX =  parseInt((deviceWidth / (width + 2 * folderGuardInterval))+'');
			var folderMaxY =  parseInt((deviceHeight / (height + 2 * folderGuardInterval))+'');
			var volatilesFolders = [];
			for (var x = 0; x <= folderMaxX; x++) {
				for (var y = 0; y <= folderMaxY; y++) {
					var folder = new JenScript.WidgetFolder();
					folder.Id= Id;
					folder.width=width;
					folder.height=height;
					folder.xIndex =x ;
					folder.yIndex = y;
					folder.guardInterval= folderGuardInterval;
					volatilesFolders[volatilesFolders.length] = folder;
					if (x < folderMaxX && y < folderMaxY) {
						folder.x= (width + 2 * folderGuardInterval) * x + folderGuardInterval;
						folder.y = (height + 2 * folderGuardInterval) * y + folderGuardInterval;
					} else if (x === folderMaxX && y === folderMaxY) {
						folder.mx = true;
						folder.x=deviceWidth - width - folderGuardInterval;
						folder.y=deviceHeight - height - folderGuardInterval;
					} else if (x < folderMaxX && y === folderMaxY) {
						folder.mx = true;
						folder.x=(width + 2 * folderGuardInterval) * x + folderGuardInterval;
						folder.y=deviceHeight - height - folderGuardInterval;
					} else if (x === folderMaxX && y < folderMaxY) {
						folder.mx = false;
						folder.x=deviceWidth - width - folderGuardInterval;
						folder.y=(height + 2 * folderGuardInterval) * y + folderGuardInterval;
					}
				}
			}
			for (var i = 0; i < volatilesFolders.length; i++) {
				var vdf = volatilesFolders[i];
				if (xp > vdf.x && xp < (vdf.x + vdf.width) && yp > vdf.y && yp < vdf.y + vdf.height) {
					
					return vdf;
				}
			}
			return undefined;
		},

		/**
		 * create a new widget folder instance
		 * 
		 * @param Id
		 *            the widget Id
		 * @param width
		 *            the widget width
		 * @param height
		 *            the widget height
		 * @param xIndex
		 *            the widget folder x index
		 * @param yIndex
		 *            the widget folder y index
		 * @return widget folder
		 */
		 newWidgetFolderIntance : function(Id, width, height, xIndex, yIndex) {
			 //console.log('newWidgetFolderIntance for Id '+Id);
			var deviceWidth = this.getDevice().getWidth();
			var deviceHeight = this.getDevice().getHeight();
			var folderGuardInterval = this.folderGuardInterval;
			var folderMaxX = parseInt((deviceWidth / (width + 2 * folderGuardInterval)));
			var folderMaxY = parseInt((deviceHeight / (height + 2 * folderGuardInterval)));

			if (xIndex < 0) {
				xIndex = 0;
			}
			if (xIndex > folderMaxX) {
				xIndex = folderMaxX;
			}

			if (yIndex < 0) {
				yIndex = 0;
			}
			if (yIndex > folderMaxY) {
				yIndex = folderMaxY;
			}

			var folder = new JenScript.WidgetFolder();
			folder.Id= Id;
			folder.width=width;
			folder.height=height;
			folder.xIndex=xIndex;
			folder.yIndex=yIndex;
			folder.guardInterval=folderGuardInterval;
			if (xIndex < folderMaxX && yIndex < folderMaxY) {
				folder.x=(width + 2 * folderGuardInterval) * xIndex + folderGuardInterval; 
				folder.y=(height + 2 * folderGuardInterval) * yIndex + folderGuardInterval;
			} else if (xIndex == folderMaxX && yIndex == folderMaxY) {
				folder.x=deviceWidth - width - folderGuardInterval;
				folder.y=deviceHeight - height - folderGuardInterval;
			} else if (xIndex < folderMaxX && yIndex == folderMaxY) {
				folder.x=(width + 2 * folderGuardInterval) * xIndex + folderGuardInterval;
				folder.y = deviceHeight - height - folderGuardInterval;
			} else if (xIndex == folderMaxX && yIndex < folderMaxY) {
				folder.x=deviceWidth - width - folderGuardInterval;
				folder.y=(height + 2 * folderGuardInterval) * yIndex + folderGuardInterval;
			}
			//console.log('newWidgetFolderIntance return folder : '+folder);
			return folder;
		}
	});
})();