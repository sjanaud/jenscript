(function(){
	JenScript.ProgressPlugin = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.ProgressPlugin, JenScript.Plugin);
	JenScript.Model.addMethods(JenScript.ProgressPlugin, {
		_init : function(config){
			this.width= config.width;
			this.height = config.height;
			this.x=config.x;
			this.y=config.y;
			config.name='ProgressPlugin';
			JenScript.Plugin.call(this,config);
			this.monitors = [];
		},
		
		addMonitor : function(monitor){
			monitor.plugin = this;
			this.monitors[this.monitors.length] = monitor;
			this.repaintPlugin();
		},
		
		
		paintMonitor : function(g2d, part, monitor,x,y){
			var progress = new JenScript.SVGRect().origin(x,y).size(this.width,this.height).radius(monitor.cornerRadius,monitor.cornerRadius).fillNone().strokeNone();
		       
	        if(monitor.outlineColor !== undefined)
	        	progress.stroke(monitor.outlineColor);
	        if(monitor.outlineStrokeWidth !== undefined)
	        	progress.strokeWidth(monitor.outlineStrokeWidth);
	        if(monitor.backgroundColor !== undefined)
	        	progress.fill(monitor.backgroundColor);
	        
	        progress.fillOpacity(monitor.backgroundOpacity);
	        g2d.insertSVG(progress.toSVG());
	        
	        if(monitor.value !==undefined && monitor.total !== undefined){
	        	var currentWidth = this.width*monitor.value/monitor.total;
	        	var cprogress = new JenScript.SVGRect().origin(x,y).size(currentWidth,this.height).radius(monitor.cornerRadius,monitor.cornerRadius);
		        
	        	if(monitor.outlineColor !== undefined)
	        		cprogress.stroke(monitor.outlineColor);
	        	
	        	g2d.insertSVG(cprogress.strokeNone().fill(monitor.foregroundColor).fillOpacity(monitor.foregroundOpacity).toSVG());
	        }
	        
	        if(monitor.text !== undefined){
	        	//console.log('(y+this.height+monitor.fontSize)='+y+','+this.height+','+monitor.fontSize);
	        	var t = new JenScript.SVGElement().name('text')
					.attr('x',x)
					.attr('y',(y+this.height+monitor.fontSize))
					.attr('font-size',monitor.fontSize)
					.attr('fill',monitor.textColor)
					.attr('fill-opacity',1)
					.attr('text-anchor','start')
					.textContent(monitor.text);
		        	 g2d.insertSVG(t.buildHTML());
		        	 
	        }
		},
		
		
		paintPlugin : function(g2d,part) {
	        if (part != JenScript.ViewPart.Device) {
	            return;
	        }
	        var startX = this.x;
	        var startY = this.y;
	        var nm=[];
	        var dy = 5;
	        for (var i = 0; i < this.monitors.length; i++) {
	        	var monitor = this.monitors[i];
	        	if(!monitor.completed){
	        		this.paintMonitor(g2d,part,monitor,startX,startY);
	        		startY = startY + (this.height+monitor.fontSize)+dy;
	        		nm[nm.length]=monitor;
	        	}
			}
	        this.monitors=nm;
	    },
	    
	    onProjectionRegister : function(){
			var that = this;
			this.getProjection().addProjectionListener('boundChanged', function(){
				that.repaintPlugin();
			},'monitor');
		},
		
	});
})();