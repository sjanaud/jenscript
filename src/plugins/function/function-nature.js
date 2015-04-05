(function(){
	JenScript.FunctionNature = function(nature){
		this.nature = nature;
		
		this.isXFunction = function (){
			if(this.nature === undefined)
				return false;
			if(this.nature instanceof JenScript.FunctionNature){
				return this.nature.isXFunction();
			}
			if(this.nature.toLowerCase() === 'xfunction' || this.nature.toLowerCase() === 'x')
				return true;
			return false;
		};
		
		this.isYFunction = function (){
			if(this.nature === undefined)
				return false;
			if(this.nature instanceof JenScript.FunctionNature){
				return this.nature.isYFunction();
			}
			if(this.nature.toLowerCase() === 'yfunction' || this.nature.toLowerCase() === 'y')
				return true;
			return false;
		};
		
		this.toString = function(){
			if(this.isXFunction())
				return 'x';
			if(this.isYFunction())
				return 'y';
			return 'undefined nature';
		};
	};
})();