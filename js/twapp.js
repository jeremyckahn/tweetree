select = {
	cached			: {},
	cache			: function(){
		for(selector in select){
			if (selector != 'cache' && selector != 'cached'){
				select.cached[selector] = $(select[selector]);
			}
		}
	},
	twitterOutput	: '#twitter-output',
	query			: '#search-query',
	btnQuery		: '#execute-query',
	root			: '.root',
	branch			: '.branch',
	branchContainer : '.branch-container',
	word			: '.word',
	branchWord		: '.branch .word',
	loadingIndicator: '#loading-indicator',
	draggableContainer : '#draggable-container',
	dragConstrain	: '#drag-constrain'
};

prop = {
	rootCount : 0,
	verticalBranchSpacing : 400,
	animateInTime : 1000
};

debug = false;

branches = [];

$(function(){
	
	// Do some general setup
	select.cache();
	
	$(select.branchWord)
		.live('mouseover', function(){
			$(this).css({background : 'yellow'});
		})
		.live('mouseout', function(){
			$(this).css({background : ''});
		})
		.live('click', function(){
			var coord = $(this).offset();
			
			coord.left -= pxToInt(select.cached.twitterOutput.css('left'));
			coord.top -= pxToInt(select.cached.twitterOutput.css('top'));
			
			tweetree.init({
				query : $(this).html(),
				container : select.cached.twitterOutput,
				xOrigin : coord.left - (branchManager.width.base / 2),
				yOrigin : coord.top,
				x : coord.left - (branchManager.width.base / 2) + ( $(this).parent().data('dest').left - (branchManager.width.base / 2) ),
				y : coord.top + prop.verticalBranchSpacing,
				onRootLoad : slideToNewBranch
				
			});
		});
		
	$(window)
		.resize(updateDragHandles)
		.resize();
		
	select.cached.draggableContainer
		.draggable({
			stop : function(event, ui){
				select.cached.twitterOutput.css({
					left : pxToInt(select.cached.twitterOutput.css('left')) + pxToInt(select.cached.draggableContainer.css('left')),
					top : pxToInt(select.cached.twitterOutput.css('top')) + pxToInt(select.cached.draggableContainer.css('top'))
				});
				
				select.cached.draggableContainer.css({
					left : 0,
					top: 0
				});
				
			}
		})
	
	tweetree.init({
		query : 'jeremyckahn',
		container : select.cached.twitterOutput,
		onRootLoad : slideToNewBranch,
		y : ($(window).height() / 2) - (branchManager.height.base + branchManager.height.alternate)
	});
	
	select.cached.twitterOutput.centerInContainer();
	
	//lineDisplay.init(0, 0, $(window).width(), $(window).height())
	
});

function slideToNewBranch(){ 
	
	select.cached.twitterOutput.animate(
		{ // css
			// CRAAAAZY math
			left : -tweetree.options.x + ( ($(window).width() - branchManager.width.base) / 2 ) || select.cached.twitterOutput.css('left'),
			top : -tweetree.options.y + ($(window).height() / 2) - (branchManager.height.base + branchManager.height.alternate) || select.cached.twitterOutput.css('top')
		}, 
		{ // options
			duration : 1000
		}
	);	
}

function pxToInt(str){
	return parseInt(str.replace(/px/gi, ''));
}

function updateDragHandles(){
	select.cached.dragConstrain
		.height($(window).height())
		.width($(window).width());
	
	select.cached.draggableContainer
		.height($(window).height())
		.width($(window).width());
}

String.prototype.toRoot = function(op){
	return twelement.apply(this, ['root', op]);
};

String.prototype.toBranch = function(op){
	return twelement.apply(this, ['branch', op]);
};

function twelement(type, op){
	
	if (!op)
		op = {};
		
	op.x = !!op.x ? op.x : 0;
	op.y = !!op.y ? op.y : 0;
	
	contents = '';
	words = this.split(' ');
	
	for (i = 0; i < words.length; i++){
		contents += '<span class="word">' + words[i] + ' </span>';	
	}
	
	return $('<div>')
		.addClass('root' + prop.rootCount.toString())
		.addClass(type)
		.html(contents)
		.css({ top: op.y, left: op.x })
		.get(0);
}

function make(element){
	return document.createElement(element);
}

function makeUL(arr){
	jqUL = $(make('UL'))
	
	for (this.i = 0; this.i < arr.length; this.i++){
		jqUL.append(make('LI'));
		jqUL.find('li:last').html(arr[this.i])
	}
	
	return jqUL.get(0);
}

jQuery.fn.centerInContainer = function(options){
	
	if (!options)
		options = {};
		
	if ((options.orientation != 'vertical') &&
	(options.orientation != 'horizontal') &&
	(options.orientation != 'both')){
		options.orientation = 'horizontal'	
	}
	
	// cache the parent
	this.parentEl = this.parent();
	
	this.offsetCoord = {};
	
	this.orig = this.position();
	
	this.offsetCoord.left = (this.parentEl.width() / 2) - (this.width() / 2);
	this.offsetCoord.top = (this.parentEl.height() / 2) - (this.height() / 2);

	switch(options.orientation){
		case 'horizontal':
			this.offsetCoord.top = this.orig.top;
		break;
		
		case 'vertical':
			this.offsetCoord.left = this.orig.left;
		break;
	}
	
	this.css(
	{
		left : this.offsetCoord.left,
		top : this.offsetCoord.top
	});
	
	return this;
}

function log(text){
	try{
		console.log(text)	
	}
	catch(err){}
}

// Useful for getting random values.  Parameters are optional
function random(max, min){
	if (max == null && min == null)
		return Math.random();
	
	if (min == null)
		return (Math.random() * max);
		
	difference = max - min;
	return min + Math.random() * difference;
};

function showLoadingIndicator(show){
	if (show){
		select.cached.loadingIndicator.removeClass('hidden');
	}else{
		select.cached.loadingIndicator.addClass('hidden');
	}
}