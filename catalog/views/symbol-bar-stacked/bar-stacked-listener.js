
/**
 * Create view with statcked bar symbols layout
 * 
 * @param container
 * @param width
 * @param height
 */
function createViewBarStackedVSymbolListener(container, width, height) {

	var view = new JenScript.View({
		name : container,
		width : width,
		height : height,
		
		west : 80,
		south:60
	});
	
	var bg1 = new JenScript.GradientViewBackground();
	view.addViewBackground(bg1);
	var textureBackground = new JenScript.TexturedViewBackground({
		opacity : 0.3,
		texture : JenScript.Texture.getTriangleCarbonFiber(),
		strokeColor : 'cyan',
		strokeWidth : 2,
		cornerRadius : 0
	});
	view.addViewBackground(textureBackground);

	var gloss = new JenScript.GlossViewForeground();
	view.addViewForeground(gloss);

	var proj = new JenScript.LinearProjection({
		name : "proj",
		paintMode : 'ACTIVE',
		minX : 0,
		maxX : 0,
		minY : -100,
		maxY : 1200
	});
	view.registerProjection(proj);

	var outline = new JenScript.DeviceOutlinePlugin({
		color : 'pink'
	});

	proj.registerPlugin(outline);
	
	var metrics = new JenScript.AxisMetricsModeled({
		axis : JenScript.Axis.AxisWest,
		minor : {
			tickMarkerSize : 2,
			tickMarkerColor : JenScript.RosePalette.AEGEANBLUE,
			tickMarkerStroke : 1
		},
		median : {
			tickMarkerSize : 4,
			tickMarkerColor : JenScript.RosePalette.EMERALD,
			tickMarkerStroke : 1.2,
			tickTextColor : JenScript.RosePalette.EMERALD,
			tickTextFontSize : 10
		},
		major : {
			tickMarkerSize : 8,
			tickMarkerColor : JenScript.RosePalette.TURQUOISE,
			tickMarkerStroke : 3,
			tickTextColor : JenScript.RosePalette.TURQUOISE,
			tickTextFontSize : 12
		}
	});
	proj.registerPlugin(metrics);
	
	var gridPlugin = new JenScript.GridModeledPlugin({
		gridOrientation : 'Horizontal',
		gridColor : 'white',
		gridWidth : 0.5,
		gridOpacity : 0.5
	});
	proj.registerPlugin(gridPlugin);
	
	//TOOL
	var tx1 = new JenScript.TranslatePlugin();
	proj.registerPlugin(tx1);
	tx1.registerWidget(new JenScript.TranslateCompassWidget({
		ringFillColor : 'pink'
	}));
	tx1.select();
	
	var zoomwheel = new JenScript.ZoomWheelPlugin({
		mode : 'wheelY'
	});
	proj.registerPlugin(zoomwheel);
	
	//BAR
	var symbolPlugin = new JenScript.SymbolPlugin({
		nature : 'Vertical'
	});
	proj.registerPlugin(symbolPlugin);
	
	//label for listener
	var labelPlugin = new JenScript.TextLabelPlugin();
	proj.registerPlugin(labelPlugin);
	
	var label = new JenScript.TextLabel({
		fillColor : 'white',
		outlineColor : 'orange',
		outlineWidth : 2,
		textColor : JenScript.RosePalette.HENNA,
		nature : 'Device'
	});
	labelPlugin.addLabel(label);
	
	var updateText = function(action,evt) {
		label.setText(action+' '+evt.symbol.name+' device point '+evt.device);
		if (evt.device.x > view.getDevice().getWidth() - 100) {
			label.setTextAnchor('end');
		} else if (evt.device.x < 100) {
			label.setTextAnchor('start');
		} else {
			label.setTextAnchor('middle');
		}
		label.setX(evt.device.x);
		label.setY(evt.device.y);
		labelPlugin.repaintPlugin();
	};
	
	
	var barLayer = new JenScript.SymbolBarLayer();
	symbolPlugin.addLayer(barLayer);
	
	var lock = false;
	var putLock = function(millis){
		lock = true;
		setTimeout(function(){lock = false;},millis);
	};
	//listener
	barLayer.addSymbolListener('press',function(evt){
		updateText('press',evt);
	},'press demo listener');
	barLayer.addSymbolListener('move',function(evt){ //move in bar
		if(!lock){//get delay from enter
			updateText('move',evt);
		}
	},'move demo listener');
	barLayer.addSymbolListener('release',function(evt){
		updateText('release',evt);
	},'release demo listener');
	barLayer.addSymbolListener('enter',function(evt){
		updateText('enter',evt);
		putLock(500);
	},'enter demo listener');
	barLayer.addSymbolListener('exit',function(evt){
		updateText('exit',evt);
		setTimeout(function(){label.setText(undefined);labelPlugin.repaintPlugin();},500);
	},'exit demo listener');
	
	
	
	var butter1 = 'rgb(249, 235, 113)';
    var butter2 = 'rgb(236, 216, 59)';
    var butter3 = 'rgb(199, 174, 47)';

    var orange1 = 'rgb(240, 187, 91)';
    var orange2 = 'rgb(231, 143, 45)';
    var orange3 = 'rgb(191, 118, 41)';


    var chameleon1 = 'rgb(176, 224, 88)';
    var chameleon2 = 'rgb(156, 210, 62)';
    var chameleon3 = 'rgb(121, 163, 39)';
    
	var bar1,bar2,bar3,s1,s2,s3;
	
	bar1 = new JenScript.SymbolBarStacked({
			name : 'the stacked bar',
			base : 0,
			value: 600,
			thickness : 32,
			direction : 'ascent',
			morpheStyle : 'Round',
			round : 8,
			barStroke : new JenScript.SymbolBarStroke({
				strokeColor: 'white'
			}),
			barFill : new JenScript.SymbolBarFill0({}),
			barEffect  : new JenScript.SymbolBarEffect1({}),
	   });
   
    
	  s1 = new JenScript.SymbolStack({
		name : 'stack1',
		themeColor : chameleon1,
		stackValue : 6
	  });
	  s2 = new JenScript.SymbolStack({
		name : 'stack2',
		themeColor : chameleon2,
		stackValue : 12
	  });
	  s3 = new JenScript.SymbolStack({
		name : 'stack3',
		themeColor : chameleon3,
		stackValue : 26
	});
	
	bar1.addStack(s1);
	bar1.addStack(s2);
	bar1.addStack(s3);
	
	
	bar2 = new JenScript.SymbolBarStacked({
		name : 'the stacked bar',
		base : 0,
		value: 800,
		thickness : 32,
		direction : 'ascent',
		morpheStyle : 'Round',
		round : 8,
		barStroke : new JenScript.SymbolBarStroke({
			strokeColor: 'white'
		}),
		barFill : new JenScript.SymbolBarFill0({}),
		barEffect  : new JenScript.SymbolBarEffect1({}),
   });


	s1 = new JenScript.SymbolStack({
		name : 'stack1',
		themeColor : butter1,
		stackValue : 10
	  });
  	s2 = new JenScript.SymbolStack({
		name : 'stack2',
		themeColor : butter2,
		stackValue : 20
  	});
  	s3 = new JenScript.SymbolStack({
		name : 'stack3',
		themeColor : butter3,
		stackValue : 40
  	});

	bar2.addStack(s1);
	bar2.addStack(s2);
	bar2.addStack(s3);
	
	bar3 = new JenScript.SymbolBarStacked({
		name : 'the stacked bar',
		base : 0,
		value: 500,
		thickness : 32,
		direction : 'ascent',
		morpheStyle : 'Round',
		round : 8,
		barStroke : new JenScript.SymbolBarStroke({
			strokeColor: 'white'
		}),
		barFill : new JenScript.SymbolBarFill0({}),
		barEffect  : new JenScript.SymbolBarEffect1({}),
   });


	s1 = new JenScript.SymbolStack({
		name : 'stack1',
		themeColor : orange1,
		stackValue : 20
	  });
  	s2 = new JenScript.SymbolStack({
		name : 'stack2',
		themeColor : orange2,
		stackValue : 20
  	});
  	s3 = new JenScript.SymbolStack({
		name : 'stack3',
		themeColor : orange3,
		stackValue : 69
  	});

	bar3.addStack(s1);
	bar3.addStack(s2);
	bar3.addStack(s3);
	
	barLayer.addSymbol(JenScript.SymbolFiller.createGlue());
	barLayer.addSymbol(bar1);
	barLayer.addSymbol(JenScript.SymbolFiller.createStrut(40));
	barLayer.addSymbol(bar2);
	barLayer.addSymbol(JenScript.SymbolFiller.createStrut(40));
	barLayer.addSymbol(bar3);
	barLayer.addSymbol(JenScript.SymbolFiller.createGlue());
	
	
}
