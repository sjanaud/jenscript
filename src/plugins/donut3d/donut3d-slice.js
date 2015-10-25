(function(){
	/**
	 * Donut3D Slice
	 * @param {Object} config
	 */
	JenScript.Donut3DSlice = function(config) {
		this.init(config);
	};
	
	JenScript.Model.addMethods(JenScript.Donut3DSlice,{
		
		/**
		 * init the donut 3D slice
		 * @param {Object} config
		 */
		init : function(config){
			config = config || {};
			this.Id = 'donut3dslice'+JenScript.sequenceId++;
			/** slice name */
		    this.name = config.name;
		    /** value */
		    this.value =  (config.value !== undefined)?config.value:1;
		    /** theme color */
		    this.themeColor = config.themeColor;
		    /** divergence */
		    this.divergence = (config.divergence !== undefined)?config.divergence:0;
		    /** percent normalize value */
		    this.normalizedValue;
		    /** start angle degree */
		    this.startAngleDegree;
		    /** end angle degree */
		    this.endAngleDegree;
		    /** outer arc top */
		    this.outerArcTop;
		    /** inner arc top */
		    this.innerArcTop;
		    /** outer arc bottom */
		    this.outerArcBottom;
		    /** inner Arc bottom */
		    this.innerArcBottom;
		    /** top face */
		    this.topFace;
		    /** bottom face */
		    this.bottomFace;
		    /** start face */
		    this.startFace;
		    /** end face */
		    this.endFace;
		    /** inner face */
		    this.innerFace;
		    /** outer face */
		    this.outerFace;
		    /** edge point */
		    this.sos;
		    /** edge point */
		    this.soe;
		    /** edge point */
		    this.sis;
		    /** edge point */
		    this.sie;
		    /** slice label */
		    this.sliceLabels = [];
		    /** fragment type Front or Back */
		    this.type;
		    /**fragment slice flag*/
		    this.isFragment;
		    /**slice parent for this fragment*/
		    this.parentSlice;
		    /** inner model */
		    this.innerModel;
		    /** center x */
		    this.centerX;
		    /** center y */
		    this.centerY;
		    /** paint flag */
		    this.painted = false;
		    /** enter flag */
		    this.lockEnter = false;
		    /** host donut 3D */
		    this.donut;
		    /**fragment*/
		    this.fragments = [];
		    
		   // alert("slice value : "+this.name+","+this.value);
		    if(this.value <= 0 )
		    	throw new Error('Slice value should be greater than 0');
		},
		
		setName : function(name) {
			this.name = name;
		},

		getName : function() {
			return this.name;
		},

		setValue : function(value) {
			this.value = value;
		},

		getValue : function() {
			return this.value;
		},
		
		setDivergence : function(divergence) {
			this.divergence = divergence;
		},

		getDivergence : function() {
			return this.divergence;
		},
		
		setThemeColor : function(themeColor) {
			this.themeColor = themeColor;
		},

		getThemeColor : function() {
			return this.themeColor;
		},

		
		/**
	     * get all slice label that have been registered on this slice
	     * 
	     * @return the slice Label collection of this slice
	     */
	     getSliceLabels : function() {
	        return this.sliceLabels;
	     },

	    /**
	     * @param sliceLabel
	     *            the slice label to add
	     */
	    addSliceLabel : function(sliceLabel) {
	        this.sliceLabels[this.sliceLabels.length] = sliceLabel;
	        sliceLabel.slice = this;
	        if(this.donut !== undefined && this.donut.plugin !== undefined){
	        	this.donut.plugin.repaintDonuts();	
	        }
	    },
		
		/**
		 * set slice parameters
		 */
		set : function(name,value,themeColor){
		    this.name = name;
		    this.value = value;
		    this.themeColor = themeColor;
		    if(this.donut !== undefined && this.donut.plugin !== undefined){
	        	this.donut.plugin.repaintDonuts();	
	        }
		},
		
		/**
		 * clear slice fragments
		 */
		clearFragments : function(){
			this.fragments = [];
		},
		
		/**
		 * add fragment in this slice
		 * @param {Object} fragment
		 */
		addFragment : function(fragment){
			this.fragments[this.fragments.length] = fragment;
		},
		
		/**
	     * return true if the specified fragment is the first fragment of this slice, false otherwise
	     * @param {Object} fragment
	     * @return true if the specified fragment is the first fragment of this   slice, false otherwise
	     */
	    isFirst : function(fragment) {
	        return this.fragments[0].Id === fragment.Id;
	    },

	    /**
	     * return true if the specified fragment is the last fragment of this slice, false otherwise
	     * @param {Object} fragment
	     * @return true if the specified fragment is the last fragment of this slice, false otherwise
	     *        
	     */
	    isLast : function(fragment) {
	    	return this.fragments[this.fragments.length-1].Id === fragment.Id;
	    },

		
		/**
	     * get the front inner face of this slice
	     * @return {Object} front inner face of this slice
	     */
	    getFrontInnerFace : function() {
	        var frontInnerFace='';
	        for (var f = 0; f < this.fragments.length; f++) {
	        	var fragment = this.fragments[f];
	        	 if (fragment.type === 'Front') {
		                frontInnerFace = frontInnerFace + fragment.innerFace;
		         }
			}
	        return frontInnerFace;
	    },

	    /**
	     * get the back inner face of this slice
	     * @return {Object} back inner face of this slice
	     */
	    getBackInnerFace : function() {
	        var backInnerFace ='';
	        for (var f = 0; f < this.fragments.length; f++) {
	        	var fragment = this.fragments[f];
	        	 if (fragment.type === 'Back') {
	        		 backInnerFace = backInnerFace + fragment.innerFace;
		         }
			}
	        return backInnerFace;
	    }
	});	
})();