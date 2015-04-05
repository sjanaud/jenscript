(function(){
	
	
	JenScript.DumpCoordinatePlugin = function() {
		this.dumpListeners = [];
		JenScript.Plugin.call(this, {name : "DumpCoordinatePlugin"});
	};
	JenScript.Model.inheritPrototype(JenScript.DumpCoordinatePlugin, JenScript.Plugin);

	/**
	 * add listener maped with the given action event
	 * @param actionEvent
	 * @param listener
	 */
	JenScript.DumpCoordinatePlugin.prototype.addDumpListener = function(actionEvent,listener){
		var l = {action : actionEvent,onEvent : listener};
		this.dumpListeners[this.dumpListeners.length] = l;
	};
	
	/**
	 * add listener maped with the given action event
	 * @param actionEvent
	 * @param listener
	 */
	JenScript.DumpCoordinatePlugin.prototype.fireEvent = function(actionEvent,point,deviceX,deviceY){
		for (var i = 0; i < this.dumpListeners.length; i++) {
			if(actionEvent === this.dumpListeners[i].action)
				this.dumpListeners[i].onEvent({user:point,device:new JenScript.Point2D(deviceX,deviceY)});
		}
	};
	
	
	/**
	 * assume that x,y come from device part
	 */
	JenScript.DumpCoordinatePlugin.prototype.getUserProjection = function (deviceX,deviceY){
		return this.getProjection().pixelToUser({
			x : deviceX,
			y : deviceY
		});
	};
	
	JenScript.DumpCoordinatePlugin.prototype.onClick = function(evt,part,deviceX,deviceY) {
		if(part === JenScript.ViewPart.Device){
			var userPoint = this.getUserProjection(deviceX,deviceY);
			this.fireEvent('click',userPoint,deviceX, deviceY);
		}
	};
	
	JenScript.DumpCoordinatePlugin.prototype.onMove = function(evt,part,deviceX, deviceY) {
		if(part === JenScript.ViewPart.Device){
			var userPoint = this.getUserProjection(deviceX,deviceY);
			this.fireEvent('move',userPoint,deviceX,deviceY);
		}
	};
	
	JenScript.DumpCoordinatePlugin.prototype.onPress = function(evt,part,deviceX, deviceY) {
		if(part === JenScript.ViewPart.Device){
			var userPoint = this.getUserProjection(deviceX,deviceY);
			this.fireEvent('press',userPoint,deviceX, deviceY);
		}
	};
	
	JenScript.DumpCoordinatePlugin.prototype.onRelease = function(evt,part,deviceX, deviceY) {
		if(part === JenScript.ViewPart.Device){
			var userPoint = this.getUserProjection(deviceX,deviceY);
			this.fireEvent('release',userPoint,deviceX, deviceY);
		}
	};
})();