(function(){
	
	JenScript.SymbolBar = function(config) {
		//SymbolBar
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.SymbolBar, JenScript.SymbolComponent);
	JenScript.Model.addMethods(JenScript.SymbolBar,{
		
		_init : function(config){
			config=config||{};
			/** the bar value */
			this.value  = config.value;
			/** the bar base */
			this.base =  config.base;
			this.setBase(this.base);
			
			/** morphe style, default is Rectangle */
			this.morpheStyle =(config.morpheStyle !== undefined)?config.morpheStyle: 'Rectangle';
			
			/** bar symbol label*/
			this.symbol =(config.symbol !== undefined)?config.symbol : 'Unamed Bar Symbol';
			/** round constant */
			this.round = (config.round !== undefined)?config.round : 5;
			
			this.direction=(config.direction !== undefined)?config.direction : 'ascent';
			/** ascent bar type */
			this.ascent = false;
			/** descent bar type */
			this.descent = false;
			if(this.direction === 'descent'){
				this.setDescentValue(this.value);
			}
			else{
				this.setAscentValue(this.value);
			}
			
			/** bar stroke */
			this.barStroke = config.barStroke;
			/** bar fill */
			this.barFill = (config.barFill !== undefined)?config.barFill : new JenScript.SymbolBarFill0({});
			/** bar effect */
			this.barEffect = config.barEffect;
			/** bar label */
			this.barLabel;
			/** axis label */
			this.axisLabel;
			/** bar shape */
			this.barShape;
			/** part buffer */
			this.part;
			/** boolean inflating operation flag */
			this.inflating = false;
			/** deflating operation flag */
			this.deflating = false;
			/** current inflate */
			this.inflate;
			/** current deflate */
			this.deflate;
			JenScript.SymbolComponent.call(this, config);
		},
		
		/**
		 * get the bar label
		 * 
		 * @return the bar Label
		 */
		getBarLabel : function() {
			return this.barLabel;
		},

		/**
		 * set the bar label
		 * 
		 * @param barLabel
		 *            the bar label to set
		 */
		setBarLabel : function( barLabel) {
			this.barLabel = barLabel;
		},

		/**
		 * @return the axisLabel
		 */
		getAxisLabel : function() {
			return this.axisLabel;
		},

		/**
		 * @param axisLabel
		 *            the axisLabel to set
		 */
		setAxisLabel : function( axisLabel) {
			this.axisLabel = axisLabel;
		},

		/**
		 * get the part buffer
		 * 
		 * @return the part buffer
		 */
		getPart  : function() {
			return this.part;
		},

		/**
		 * set the bar part buffer
		 * 
		 * @param part
		 */
		setPart : function( part) {
			this.part = part;
		},

		/**
		 * get the round
		 * 
		 * @return the round
		 */
		getRound : function() {
			return this.round;
		},

		/**
		 * set round constant to set
		 * 
		 * @param round
		 *            the round to set
		 */
		setRound : function( round) {
			this.round = round;
		},

		/**
		 * get the morphe style
		 * 
		 * @return morphe style
		 */
		getMorpheStyle : function() {
			return this.morpheStyle;
		},

		/**
		 * set the morphe style
		 * 
		 * @param morpheStyle
		 *            the morphe style to set
		 */
		setMorpheStyle : function( morpheStyle) {
			this.morpheStyle = morpheStyle;
		},

		/**
		 * get bar shape
		 * 
		 * @return the bar shape
		 */
		getBarShape : function() {
			return this.barShape;
		},

		/**
		 * set bar shape
		 * 
		 * @param barShape
		 *            the bar shpae to set
		 */
		setBarShape : function( barShape) {
			this.barShape = barShape;
		},

		/**
		 * get symbol
		 * 
		 * @return the symbol
		 */
		getSymbol : function() {
			return this.symbol;
		},

		/**
		 * set symbol
		 * 
		 * @param symbol
		 *            the symbol to set
		 */
		setSymbol : function( symbol) {
			this.symbol = symbol;
		},

		getValue : function() {
			return this.value;
		},

		setAscentValue : function(value) {
			this.ascent = true;
			this.descent = false;
			if (value < 0) {
				throw new Error("bar value should be greater than 0");
			}
			this.value = value;
		},

		/**
		 * @return the inflating
		 */
		isInflating : function() {
			return this.inflating;
		},

		/**
		 * @param inflating
		 *            the inflating to set
		 */
		setInflating : function( inflating) {
			this.inflating = inflating;
		},

		/**
		 * @return the deflating
		 */
		isDeflating : function() {
			return this.deflating;
		},

		/**
		 * @param deflating
		 *            the deflating to set
		 */
		setDeflating : function( deflating) {
			this.deflating = deflating;
		},
		
		/**
		 * set the descent value
		 * 
		 * @param value
		 *            the descent value
		 */
		setDescentValue : function( value) {
			this.ascent = false;
			this.descent = true;
			if (value < 0) {
				throw new Error("bar value should be greater than 0");
			}
			this.value = value;
		},

		/**
		 * get bar base
		 * 
		 * @return  bar base
		 */
		getBase : function() {
			return this.base;
		},

		/**
		 * set bar base
		 * 
		 * @param base
		 *            the base to set
		 */
		setBase : function( base) {
			this.baseSet = true;
			this.base = base;
		},

		/**
		 * return true if the base has been set, false otherwise
		 * 
		 * @return true if the base has been set, false otherwise
		 */
		isBaseSet : function() {
			return this.baseSet;
		},

		/**
		 * return true is the bar is ascent, false otherwise
		 * 
		 * @return true is the bar is ascent, false otherwise
		 */
		isAscent : function() {
			return this.ascent;
		},

		/**
		 * return true is the bar is descent, false otherwise
		 * 
		 * @return true is the bar is descent, false otherwise
		 */
		isDescent : function() {
			return this.descent;
		},

		/**
		 * true if the bar symbol descent or ascent value is set, false otherwise
		 * 
		 * @return true if the bar symbol descent or ascent value is set, false
		 *         otherwise
		 */
		isValueSet : function() {
			return this.ascent || this.descent;
		},

		/**
		 * get the bar stroke
		 * 
		 * @return the bar stroke
		 */
		getBarStroke : function() {
			return this.barStroke;
		},

		/**
		 * set the bar stroke
		 * 
		 * @param barStroke
		 *            the bar stroke to set
		 */
		setBarStroke : function(barStroke) {
			this.barStroke = barStroke;
		},

		/**
		 * get bar fill
		 * 
		 * @return the bar fill
		 */
		getBarFill : function() {
			return this.barFill;
		},

		/**
		 * set the bar fill
		 * 
		 * @param barFill
		 *            the bar fill to ser
		 */
		setBarFill : function( barFill) {
			this.barFill = barFill;
		},

		/**
		 * get bar effect
		 * 
		 * @return the bar effect
		 */
		 getBarEffect : function() {
			return this.barEffect;
		 },

		/**
		 * set the bar effect
		 * 
		 * @param barEffect
		 *            the bar effect to set
		 */
		setBarEffect : function(barEffect) {
			this.barEffect = barEffect;
		},
		
		
		
	});
	
	
})();