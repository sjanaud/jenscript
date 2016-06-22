(function(){
	JenScript.SelectorPlugin = function(config){
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.SelectorPlugin, JenScript.Plugin);
	JenScript.Model.addMethods(JenScript.SelectorPlugin,{
		_init: function(config){
			config = config||{};
			config.name='SelectorPlugin';
			JenScript.Plugin.call(this,config);
			this.press = false;
			this.selectors = [];
			this.contextualized = true;
		},
		
		/**
		 * get selector plugin string representation
		 */
		toString : function(){
			return 'SelectorPlugin';
		},
		
		/**
		 * override function
		 * get the selectors part graphics context
		 * @param {String} part
		 * @returns {Object} plugin graphics context
		 */
		getGraphicsContext : function(part){
			return new JenScript.Graphics({definitions : this.view.svgSelectorsDefinitions,graphics : this.view.svgSelectorsGraphics});
		},
		
		
		/**
		 * override function
		 * repaint 
		 */
		repaintPlugin : function(caller){
			//console.log('Selector plugin repaint, call by '+caller);
			this.repaintPluginPart(JenScript.ViewPart.South);
			this.repaintPluginPart(JenScript.ViewPart.North);
			this.repaintPluginPart(JenScript.ViewPart.East);
			this.repaintPluginPart(JenScript.ViewPart.West);
			this.repaintPluginPart(JenScript.ViewPart.Device);
		},
		
		
		/**
		 * override function
		 * repaint part 
		 */
		repaintPluginPart : function(part){
			var graphics = this.getGraphicsContext(part);
			graphics.clearGraphics();
			this.paintPlugin(graphics,part);
		},
		
	    /**
		 * paint plugin view part
		 *  @param {Object} graphics context
		 *  @param {Object} view part
		 */
	    paintPlugin : function(g2d,viewPart) {
	    	if(this.isLockPassive()) return;
	        if (viewPart === JenScript.ViewPart.Device && this.view.projections.length > 1) {
	        	this.paintSelectors(g2d,viewPart);
	        }
	    },
		
		/**
		 * get view
		 * @returns {Object} view
		 */
		getView : function() {
	        return this.view;
	    },
	    
	    /**
		 * set view
		 * @param {Object} view
		 */
	    setView : function(view) {
	        this.view=view;
	        var that = this;
			view.addViewListener('projectionActive',function(){
				that.repaintPlugin();
			},'Projection active listener, create for internal selector plugin');
	    },
	    
	    /**
	     * on press plugin handler
	     * @param {Object} event  the mouse pressed event
	     * @param {String} part component where event occurs
	     * @param {Number} x  the mouse x coordinate
	     * @param {Number} y  the mouse y coordinate
	     */
	   onPress : function(event,part,x, y) {
		    var x2View = this.getView().west+x;
	    	var y2View = this.getView().north+y;
	    	for(var i = 0 ;i< this.selectors.length;i++){
	    		if(this.selectors[i].sensible.getBound2D().contains(x2View,y2View)){
	   				var p = this.selectors[i].projection;
	   				if(!p.isActive()){
	   					this.openSelector(this.selectors[i]);
	   					return true;
	   				}
   				}
	   		}
		    return false;
		},
		
		/**
		 * open the given projection
		 * @param {Object} projection
		 */
		openSelector : function(selector) {
			if(this.openingSelector)return;//prevent other click
			var that = this;
			this.openingSelector = true;
			var projection = selector.projection;
			var run = function(i,callback){
				setTimeout(function(){
					that.processOpeningSelector(selector,i);
					callback(i);
				},i*30);
				
			};
			for(var i=1;i<=10;i++){
				run(i,function callback(rank){
					if(rank === 10){
						that.getView().setActiveProjection(projection);
						that.openingSelector = false;
				    	document.getElementById(selector.Id).setAttribute('x',selector.x);
				    	document.getElementById(selector.Id).setAttribute('y',selector.y);
				    	document.getElementById(selector.Id).setAttribute('width','10%');
				    	document.getElementById(selector.Id).setAttribute('height','10%');
				    	that.checkSelectorSelectedOutline();
					}
				});
			}
		 },
		 
		/**
		 * paint the opening projection
		 */
		 processOpeningSelector : function(selector,factor) {
			if(!this.openingSelector)return;
	    	document.getElementById(selector.Id).setAttribute('x',0);
	    	document.getElementById(selector.Id).setAttribute('y',0);
	    	document.getElementById(selector.Id).setAttribute('width',factor*10+'%');
	    	document.getElementById(selector.Id).setAttribute('height',factor*10+'%');
		},
		
		checkSelectorSelectedOutline : function(){
			for(var i = 0;i<this.selectors.length;i++){
	    		var s = this.selectors[i];
	    		if(s.projection.isActive()){
	    			s.outlineElement.setAttribute('stroke','cyan');
	    		}else{
	    			s.outlineElement.setAttribute('stroke','gray');
	    		}
	    	}
		},
		
		/**
		 * paint static projection selector
		 *  @param {Object} graphics context
		 *  @param {Object} view part
		 */
		paintSelectors : function(g2d,viewPart) {
			if(this.isLockPassive()) return;
			if (viewPart !== JenScript.ViewPart.Device) return;
	    		
				this.selectors=[];
	    		var view = this.getView();
	    		var projections = view.getProjections();
	    		var startX = view.west+10;
	    		var startY = view.north+10;
	    		for(var i = 0;i<projections.length;i++){
	    			var proj = projections[i];
	    			var svg = proj.svgRootElement.cloneNode(true);
    	    		if(svg !== undefined){
    	    			var selectorId = 'selector_'+view.Id+'_'+proj.Id;
    	    			svg.removeAttribute('xmlns');
    	    			svg.removeAttribute('version');
    	    			svg.setAttribute('id',selectorId);
    	    			svg.setAttribute('x',startX);
    	    			svg.setAttribute('opacity',1);
    	    			svg.setAttribute('y',startY);
    	    			svg.setAttribute('width','10%');
    	    			svg.setAttribute('height','10%');
    	    			//svg.setAttribute('preserveAspectRatio','xMinYMin slice');
    	    			svg.setAttribute('preserveAspectRatio','xMinYMin');
    	    			g2d.insertSVG(svg);
    	    			
    	    			var projRect = new JenScript.SVGRect().origin(startX,startY).size(view.width*0.1,view.height*0.1);
	    	    						
	    	    		//if(proj.isActive()){
    	    			projRect.fillNone().strokeWidth(0.6);
    	    			var outline = projRect.toSVG();
    	    			g2d.insertSVG(outline);
    	    			
    	    			//}
    	    			this.selectors[this.selectors.length] = {Id :selectorId, x:startX,y:startY,projection : proj,svg:svg, outlineElement : outline,sensible :projRect};
    	    			startX = startX + view.width*0.1 + 10;
    	    		}
    			}
	    		this.checkSelectorSelectedOutline();
		},
	});
	
	
})();