(function(){
	
	JenScript.TilePlugin = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.TilePlugin, JenScript.Plugin);
	JenScript.Model.addMethods(JenScript.TilePlugin,{
		_init : function(config){
			config = config || {};
			this.tileServer = (config.tileServer !== undefined)?config.tileServer : 'https://a.tile.openstreetmap.org';
			this.opacity= (config.opacity !== undefined)?config.opacity : 1;
			config.priority = 1000;
			config.name ='TilePlugin';
			this.tms = (config.tms !== undefined)?config.tms :false;
			JenScript.Plugin.call(this, config);
		},
		
		/**
		 * on projection register, add projection bound listener to repaint this plugin
		 */
		onProjectionRegister : function(){
			var that = this;
			this.getProjection().addProjectionListener('boundChanged', function(){
				that.repaintPlugin();
			},'Tile plugin listener for projection bound changed');
			
			this.addPluginListener('scale', function(){
				//console.log('tile plugin scale changed');
				that.repaintPlugin();
				
			},'Tile plugin listener for scale changed');
			
			this.addPluginListener('translate', function(){
				//console.log('tile plugin translate changed');
				that.repaintPlugin();
			},'Tile plugin listener for translate changed');
		},
		
		createDalle : function(g2d){
			this.destroyGraphics();
			var proj1 = this.getProjection();
			var cp = proj1.getCenterPosition();
			var dalle1 = proj1.getProjection();
			var tileSize = dalle1.getSquareTileSize(); //256
			var dL = 0;
			var factor= 1;
			if(this.sx < 1){
				var flag = true;
				var val = 1;
				var delta = -1;
				while(flag){
					var min = val/2;
					var max = val;
					if(this.sx >= min && this.sx <max){
						//console.log('found generic sx<1 values : '+this.sx +' with min/max'+min+'/'+max+' delta/divisor :'+delta+'/'+min);
						dL = delta;
						factor = min;
						flag = false;
					}
					delta--;
					val = min;
				}
			}else{
				var flag = true;
				var val = 1;
				var delta = 0;
				while(flag){
					var min = val;
					var max = val *2;
					if(this.sx >= min && this.sx <max){
						//console.log('found generic sx>1 values : '+this.sx +' with min/max : '+min+'/'+max+' delta/divisor :'+delta+'/'+min);
						dL = delta;
						factor = min;
						flag = false;
					}
					delta++;
					val = max;
				}
			}
			
			var proj = new JenScript.MapProjection({
				level : (dalle1.getZoom() + dL),
				centerPosition : cp
			});
			
			proj.view = this.getView();
			var dalle = proj.getProjection();
			var width = this.getView().getDevice().getWidth();
			var height = this.getView().getDevice().getHeight();
			
			var longMin = this.p2u({x:0,y:0}).x;
			var longMax = this.p2u({x:width,y:0}).x;
			var latMax = this.p2u({x:0,y:0}).y;
			var latMin = this.p2u({x:0,y:height}).y;
			
//			var minXIndex = dalle.longToXIndex(proj.getMinX());
//			var maxXIndex = dalle.longToXIndex(proj.getMaxX());
//			var minYIndex = dalle.latToYIndex(proj.getMaxY());
//			var maxYIndex = dalle.latToYIndex(proj.getMinY());
			
			var minXIndex = dalle.longToXIndex(longMin);
			var maxXIndex = dalle.longToXIndex(longMax);
			var minYIndex = dalle.latToYIndex(latMax);
			var maxYIndex = dalle.latToYIndex(latMin);

			//shift pixel between 2 projections
			var xx1 = proj1.longToPixel(proj.getMinX());
			var xx2 = proj.longToPixel(proj.getMinX());
			
			var yy1 = proj1.latToPixel(proj.getMinY());
			var yy2 = proj.latToPixel(proj.getMinY());
			
			var dd1 = xx1-xx2;
			var dd2 = yy1 -yy2;
			//console.log('dd1/dd2::'+dd1+','+dd2);
			for (var x = minXIndex  ; x <= maxXIndex ; x++) {
				for (var y = minYIndex ; y <= maxYIndex; y++) {
					
					var long = dalle.tileToLong(x);
					var lat = dalle.tileToLat(y);
					var xpixel = proj.longToPixel(long);
					var ypixel = proj.latToPixel(lat);
					//console.log('x,y pixels tile : '+xpixel+','+ypixel);
					if(dalle.getZoom() >= 0 && x >= 0 && y >=0 && x<= dalle.getMaxTileIndex() && y<= dalle.getMaxTileIndex()){
						var tileURL1;
						if(this.tms){
							tileURL1 = this.tileServer+'/'+dalle.getZoom()+'/'+x+'/'+(dalle.getMaxTileIndex()-y)+'.png';
						}else{
							tileURL1 = this.tileServer+'/'+dalle.getZoom()+'/'+x+'/'+y+'.png';
						}
						var imageTile = new JenScript.SVGImage().attr('transform','translate('+(dd1)+','+(-dd2) +')'+' scale('+1/factor+')').opacity(this.opacity).xlinkHref(tileURL1).origin(xpixel,ypixel).size(tileSize,tileSize);
						g2d.insertSVG(imageTile.toSVG());
						
						//var imageTile = new JenScript.SVGRect().attr('transform','translate('+(dd1)+','+(-dd2) +')'+' scale('+1/factor+')').opacity(this.opacity).origin(xpixel,ypixel).stroke('black').fillNone().size(tileSize,tileSize);
						//g2d.insertSVG(imageTile.toSVG());
					}

				}
			}

		},
		
		
		paintPlugin : function(g2d, part) {
			if (part !== JenScript.ViewPart.Device) {
				return;
			}
			this.createDalle(g2d);
		}
	});
})();