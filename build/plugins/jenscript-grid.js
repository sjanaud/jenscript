// JenScript -  JavaScript HTML5/SVG Library
// version : 1.2.0
// Author : Sebastien Janaud 
// Web Site : http://jenscript.io
// Twitter  : http://twitter.com/JenSoftAPI
// Copyright (C) 2008 - 2017 JenScript, product by JenSoftAPI company, France.
// build: 2017-05-23
// All Rights reserved

(function(){
	JenScript.Grid = function(config) {
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.Grid, {
		
	 init : function(config){
			config=config||{};
			
			/** device value */
			this.deviceValue;
		    /** user value */
			this.userValue;
		    /** grid marker color */
			this.metricsMarkerColor;
		    /** grid label color */
			this.metricsLabelColor;
		    /** grid format */
			this.format;
		    /** grid label */
			this.gridLabel;
			/** lock marker flag */
		    this.lockMarker;
		    /** lock label */
		    this.lockLabel;
		    /** visible flag */
		    this.visible = true;
	 },
	 
	 setDeviceValue : function(value){
	    	this.deviceValue=value;
	 },
	 
	 setUserValue : function(value){
	    	this.userValue=value;
	 },
	 
	 getDeviceValue : function(){
	    	return this.deviceValue;
	 },
	 getUserValue : function(){
	    	return this.userValue;
	 },
	});
})();
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
(function(){

	JenScript.GridManager = function(config) {
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.GridManager, {
		init : function(config){
			config = config ||{};
		},
		getOrientation : function(){
			return this.getGridsPlugin().gridOrientation;
		},
		setGridsPlugin : function(metricsPlugin){
			this.gridsPlugin=metricsPlugin;
		},
		getGridsPlugin : function(){
			return this.gridsPlugin;
		},
		getProjection : function(){
			return this.getGridsPlugin().getProjection();
		},
		getGrids : function(){}
	});
})();
(function(){

	/**
	 * grids model takes the responsibility to create grid based on multiplier exponent model
	 */
	JenScript.GridsExponentModel = function(config) {
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.GridsExponentModel, {
		/**
		 * init grids exponent model
		 */
		init : function(config){
			config = config||{};
	        /**model exponent*/
	        this.exponent = config.exponent;
	        /** grids factor */
	        this.factor = config.factor;
	        /** grids manager */
	        this.gridsManager;
	        /** the start reference to generate metrics */
	        this.ref;
	        /** the max value to attempt */
	        this.maxValue;
	        /** pixel label holder */
	        this.pixelLabelHolder;
	        this.solveType = 'major';
		},
		
		/**
		 * get grids manager of this model
		 * @returns {Object} grids manager
		 */
		getGridsManager : function(){
			return this.gridsManager;
		},
		
		/**
		 * set grids manager of this model
		 * @param {Object} grids manager
		 */
		setGridsManager : function(gridsManager){
			this.gridsManager = gridsManager;
		},
		
		/**
         * generates median grids for this model
         * @return median grids
         */
        generateMedianGrids : function() {
        	this.solveType = 'median';
        	this.solve();
        	var originFactor = this.factor;
        	this.factor = this.factor.multiply(0.5);
        	var that = this;
        	var formater = function(){
            	if(that.exponent < 0){
            		if(new JenScript.BigNumber("0").equals(this.userValue))return '0';
    	        	return this.userValue.toFixed(Math.abs(that.exponent)+1);
    	        }
    	        else{
    	        	return this.userValue;
    	        }
            };
        	var grids = this.generateGrids();
        	for(var i = 0;i<grids.length;i++){
        		grids[i].median = true;
        		grids[i].format = formater;
        	}
        	this.factor = originFactor;
        	return grids;
        },
		
		/**
         * generates all grids for this model
         * @return {Object} grids array
         */
        generateGrids : function() {
        	this.solveType = 'major';
        	this.solve();
        	var grids = [];
            var flag = true;
            var metricsValue = this.ref;
            var that = this;
            var formater = function(){
            	if(that.exponent < 0){
    	        	if(new JenScript.BigNumber("0").equals(this.userValue))return '0';
            		return this.userValue.toFixed(Math.abs(that.exponent));
    	        }
    	        else{
    	        	return this.userValue;
    	        }
            };
            var m0 = this.getGridsManager().generateGrid(metricsValue.toNumber(), this);
            if (m0 !== undefined) {
            	grids[grids.length]=m0;
                m0.major = true;
                m0.format = formater;
            }
            while(flag){
            	metricsValue = metricsValue.add(this.factor);
            	 var m = this.getGridsManager().generateGrid(metricsValue.toNumber(), this);
                 if (m !== undefined) {
                	 m.major = true;
                	 m.format = formater;
                	 //console.log("grid model generate grid : "+metricsValue);
                	 grids[grids.length]=m;
                 }
                 if(metricsValue.greaterThanOrEqualTo(this.maxValue))
                	 flag = false;
            }
            return grids;
        },
		
        /**
         * solve this model according with given model parameters
         */
        solve : function (){
        	var proj = this.getGridsManager().getProjection();
            if (this.getGridsManager().getOrientation() === 'Vertical') {
            	this.userSize = new JenScript.BigNumber(proj.getUserWidth()+'');
            	JenScript.BigNumber.config({ ROUNDING_MODE : JenScript.BigNumber.ROUND_CEIL });
                var bd1 = new JenScript.BigNumber(proj.getMinX()+'').divide(this.factor);
                var bi1 = new JenScript.BigNumber(bd1.toFixed(0));
                this.ref = new JenScript.BigNumber(bi1).multiply(this.factor);
                this.ref = this.ref.subtract(this.factor);
                if(this.ref.equals(0)){
                	this.ref = this.ref.subtract(this.factor);
                }
                this.pixelSize = new JenScript.BigNumber(proj.getPixelWidth()+'');
                this.maxValue = new JenScript.BigNumber(proj.getMaxX()+'');
            }
            else if (this.getGridsManager().getOrientation() === 'Horizontal') {
            	this.userSize = new JenScript.BigNumber(proj.getUserHeight()+'');
            	JenScript.BigNumber.config({ ROUNDING_MODE : JenScript.BigNumber.ROUND_CEIL });
                var bd1 = new JenScript.BigNumber(proj.getMinY()+'').divide(this.factor);
                var bi1 = new JenScript.BigNumber(bd1.toFixed(0));
                this.ref = new JenScript.BigNumber(bi1).multiply(this.factor);
                this.ref = this.ref.subtract(this.factor);
                
                if(this.ref.equals(0)){
                	this.ref = this.ref.subtract(this.factor);
                }
                this.pixelSize = new JenScript.BigNumber(proj.getPixelHeight()+'');
                this.maxValue = new JenScript.BigNumber(proj.getMaxY()+'');
            }
            JenScript.BigNumber.config({ ROUNDING_MODE : JenScript.BigNumber.ROUND_HALF_EVEN });
            if(this.solveType === 'major')
            	this.pixelLabelHolder = 80;
            else if(this.solveType === 'median')
            	this.pixelLabelHolder = 60;
            else if(this.solveType === 'minor')
            	this.pixelLabelHolder = 8;
        },
        
    
        
		 /**
         * return true if this model is applicable, false otherwise
         * @return {Boolean} true if this model is applicable, false otherwise
         */
        isValid : function() {
            this.solve();
            var compare = (this.userSize.divide(this.factor)).multiply(new JenScript.BigNumber(this.pixelLabelHolder)).compareTo(this.pixelSize);
            return (compare === -1) ? true: false;
        }
	});
	
	
	JenScript.GridManagerModeled = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.GridManagerModeled, JenScript.GridManager);
	JenScript.Model.addMethods(JenScript.GridManagerModeled, {
		_init : function(config){
			config = config ||{};
			JenScript.GridManager.call(this,config);
			this.gridsModels =[];
		},
		
		/**
	     * create symmetric list model for given exponent (from -exponent to +exponent list model)
	     * @param {Object} exp  the reference exponent model
	     * @return {Object} a new collection of exponent model from -exp to +exp
	     */
	    createSymmetricListModel : function(exp) {
	        var models =[];
	        for (var i = -exp; i <= exp; i++) {
	            var m = this.createExponentModel(i);
	            models[models.length]=m;
	        }
	        return models;
	    },
		
	    /**
	     * create standard exponent model with the given exponent
	     * @param {Object} exp  the reference exponent model
	     * @return {Object} a new exponent model
	     */
	    createExponentModel : function(exp) {
	        var model = undefined;
	        var mutPattern = '';
	        if (exp < 0) {
	            mutPattern = mutPattern+"0.";
	            for (var j = 1; j < Math.abs(exp); j++) {
	                mutPattern = mutPattern+"0";
	            }
	            mutPattern = mutPattern+"1";
	            var multiplier = mutPattern;
	            model = new JenScript.GridsExponentModel({exponent : exp,factor :new JenScript.BigNumber(multiplier)});

	        }
	        else if (exp > 0) {
	            mutPattern = mutPattern +"1";
	            for (var j = 1; j <= Math.abs(exp); j++) {
	            	mutPattern = mutPattern+"0";
	            }
	            var multiplier = mutPattern;
	            model = new JenScript.GridsExponentModel({exponent : exp,factor:new JenScript.BigNumber(multiplier)});

	        }
	        else if (exp == 0) {
	            model = new JenScript.GridsExponentModel({exponent : 0,factor : new JenScript.BigNumber("1")});
	        }
	        return model;
	    },
		
		
		
	    /**
	     * register the given model
	     * @param {Object} model
	     */
	    registerGridModel :  function(model) {
	    	model.setGridsManager(this);
	    	this.gridsModels[this.gridsModels.length] = model;
	        this.gridsModels.sort(function(m1,m2){
	        	return m1.factor.compareTo(m2.factor);
	        });
	    },

	    /**
	     * register the given model array
	     * @param {Object} models array
	     */
	    registerGridModels : function(models) {
	        for (var i = 0; i < models.length; i++) {
	            this.registerGridModel(models[i]);
	        }
	    },
	    
	    /**
	     * get all generated grids based on the registered exponent model
	     */
	    getGrids : function(){
	    	var m1=[];
	    	var m2=[];
			for (var m = 0; m < this.gridsModels.length; m++) {
				var valid = this.gridsModels[m].isValid();
				if(valid){
					//console.log("Apply exponent model: "+this.metricsModels[m].exponent);
					m1 = this.gridsModels[m].generateGrids();
					var filterm1 = function(mf){
						 for (var f = 0; f < m1.length; f++) {
							 if(mf.userValue === m1[f].userValue)
								 return true;
						 }
						 return false;
					 };
					
					 if(m1.length < 4){
						var mf2 = this.gridsModels[m].generateMedianGrids();
						for (var a = 0; a < mf2.length; a++) {
							if(!filterm1(mf2[a])){
								m2[m2.length] = mf2[a];
							}
						}
					 }
					 return [].concat(m1,m2);
				}
			}
	    },
		

	    /**
	     * generate grid for the given value
	     * @param  {Number} userValue the user value for this grid
	     * @param  {Number} model the given exponent model
	     * @return {Object} return new grid
	     */
	    generateGrid : function (userValue, model) {
	        var grid = new JenScript.Grid();
	        var proj = this.getProjection();
	        var deviceValue = 0;
	        var maxPixelValue = 0;
	        if (this.getOrientation() === 'Vertical') {
	            deviceValue = proj.userToPixelX(userValue);
	            maxPixelValue = proj.getPixelWidth();
	        }
	        else if (this.getOrientation() === 'Horizontal') {
	            deviceValue = proj.userToPixelY(userValue);
	            maxPixelValue = proj.getPixelHeight();
	        }
	        if (deviceValue < 0 || deviceValue > maxPixelValue) {
	            return undefined;
	        }
	        grid.setDeviceValue(deviceValue);
	        grid.setUserValue(userValue);
	        return grid;
	    }
	});
})();
(function(){
	
	JenScript.GridModeledPlugin = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.GridModeledPlugin, JenScript.AbstractGridPlugin);
	JenScript.Model.addMethods(JenScript.GridModeledPlugin, {
		__init : function(config){
			config = config ||{};
			config.name ='GridModeledPlugin';
			this.gridManager = new JenScript.GridManagerModeled(config);
			var models = this.gridManager.createSymmetricListModel(20);
			this.gridManager.registerGridModels(models);
			JenScript.AbstractGridPlugin.call(this,config);
		},
		
		getGridManager : function(){
			return this.gridManager;
		},
		
	});
	
})();