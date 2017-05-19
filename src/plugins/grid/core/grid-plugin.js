(function(){
	
	
	
	JenScript.AbstractGridPlugin = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.AbstractGridPlugin, JenScript.Plugin);
	JenScript.Model.addMethods(JenScript.AbstractGridPlugin, {
		_init : function(config){
			config = config ||{};
			this.grids = [];
			this.sensible = 5;
			config.name = (config.name !== undefined)?config.name : 'AbstractGridPlugin';
			config.priority = -10000;
			this.gridOrientation = config.gridOrientation;
			this.gridColor = config.gridColor;
			var fn = function(g){};
			this.gridWidth =(config.gridWidth !== undefined)?config.gridWidth : 1;
			this.gridOpacity =(config.gridOpacity !== undefined)?config.gridOpacity : 1;
			this.onGridPress = (config.onGridPress !== undefined)?config.onGridPress : fn;
			this.onGridRelease = (config.onGridRelease !== undefined)?config.onGridRelease : fn;
			this.onGridEnter = (config.onGridEnter !== undefined)?config.onGridEnter : fn;
			this.onGridExit = (config.onGridExit !== undefined)?config.onGridExit : fn;
			this.onGrid = (config.onGrid !== undefined)?config.onGrid : fn;
			
			JenScript.Plugin.call(this,config);
		},
		
		onProjectionRegister : function(){
			var that = this;
			this.getProjection().addProjectionListener('boundChanged', function(){
				that.repaintPlugin();
			},that.toString());
		},
		
		onMove : function(evt,part,x,y){
			for (var i = 0; i < this.grids.length; i++) {
                var g = this.grids[i];
                var z = (this.gridOrientation === 'Vertical')?x:y;
                if(Math.abs(z - g.deviceValue) < this.sensible && !g.enter){
                	g.enter = true;
                	this.onGridEnter(g);
                	this.onGrid('enter',g);
                }else if(Math.abs(z - g.deviceValue) > this.sensible && g.enter){
                	g.enter = false;
                	this.onGridExit(g);
                	this.onGrid('exit',g);
                }
			}
		},
		
		onPress : function(evt,part,x,y){
			for (var i = 0; i < this.grids.length; i++) {
                var g = this.grids[i];
                if(g.enter){
                    g.press = true;
                	this.onGridPress(g);
                	this.onGrid('press',g);
                }
			}
		},
		
		onRelease : function(evt,part,x,y){
			for (var i = 0; i < this.grids.length; i++) {
                var g = this.grids[i];
                if(g.press){
                	this.press = false;
                	this.onGridRelease(g);
                	this.onGrid('release',g);
                }
            }
		},
		
		/**
		 * provides method override to get grids manager that generates grids
		 */
		getGridManager : function(){
			throw new Error('Abstract, grid manager should be supplied.');
		},
		
		paintGrids : function(g2d,grids) {
			for (var i = 0; i < grids.length; i++) {
                var grid = grids[i];
                var gd = grid.deviceValue;
                var or = this.gridOrientation;
                var color = (this.gridColor !== undefined)?this.gridColor:this.getProjection().themeColor;
                var x1 = (or === 'Vertical')?gd:0;
                var y1 = (or === 'Vertical')?0:gd;
                var x2 = (or === 'Vertical')?gd:this.getProjection().getPixelWidth();
                var y2 = (or === 'Vertical')?this.getProjection().getPixelHeight():gd;
                var gridLine = new JenScript.SVGLine().Id('grid'+JenScript.sequenceId++).from(x1,y1).to(x2,y2).stroke(color).strokeWidth(this.gridWidth).strokeOpacity(this.gridOpacity).fillNone();
                grid.element = gridLine.toSVG();
                g2d.insertSVG(grid.element);
			}
	    },
		
		paintPlugin : function(g2d,part) {
	        if (part != JenScript.ViewPart.Device) {
	            return;
	        }
	        this.getGridManager().setGridsPlugin(this);
	        this.grids = this.getGridManager().getGrids();
	        this.paintGrids(g2d,this.grids);
	    },
	});
	
})();