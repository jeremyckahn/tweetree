/*
jQuery Value Easer v0.1
by Jeremy Kahn - jeremyckahn@gmail.com

Idea of animating a detached DOM element inspired from Ben Nadel:
http://www.bennadel.com/blog/2007-Using-jQuery-s-animate-Method-To-Power-Easing-Based-Iteration.htm

Sample usage:

$.valEase({
	from : -2, 
	to: 20, 
	duration : 1500, 
	step: function(num){
		console.log(num);
	}
});

*/

(function( $ ){

  $.valEase = function(options) {
	
	var	dummy = $($('<div>'))
			.css({ 
				'val' : options.from || 0 
			});
	
	dummy.animate({
		'val': options.to || 0
	},
	$.extend(true, {
		'easing': 'swing',
		'duration': 1000
		}, 
		options, {
			// This funtion cannot be overridden by the options.
			'step': function(index){
				options.step(index);
			}
		})
	);
	
	return this;
	
  };
})( jQuery );