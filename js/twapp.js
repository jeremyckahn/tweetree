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
	loadingIndicator: '#loading-indicator'
};

prop = {
	rootCount : 0,
	verticalBranchSpacing : 180
};

debug = false;

branches = [];

$(function(){
	
	// Do some general setup
	select.cache();
	
	$(select.word)
		.live('mouseover', function(){
			$(this).css({background : 'yellow'});
		})
		.live('mouseout', function(){
			$(this).css({background : ''});
		})
		.live('click', function(){
			var coord = $(this).offset();
			
			tweetree.init({
				query : $(this).html(),
				container : select.cached.twitterOutput,
				xOrigin : coord.left - (branchManager.width.base / 2),
				yOrigin : coord.top,
				x : coord.left - (branchManager.width.base / 2),
				y : coord.top + prop.verticalBranchSpacing
				
			});
		});
	
	tweetree.init({
		query : 'jeremyckahn',
		container : select.cached.twitterOutput
	});
	
});

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