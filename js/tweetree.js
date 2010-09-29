tweetree = {
	debug : true,
	
	container : document.body,
	
	// Call out to twitter for the initial query, and pop it out, displayed.
	init : function(options){
		if (!options) {
			options = {};
		}
			
		tweetree.options = options;
		
		treequery = !!options.query ? options.query : 'hello';
		tweetree.container = !!options.container ? options.container : document.body;
		
		this.containerInstanceId = 'branch-container' + prop.rootCount.toString();
		
		// Make the container
		$(tweetree.container).append($(make('div'))
			.addClass('branch-container')
			.attr('id', this.containerInstanceId));
			
		// Give the container an ID
		tweetree.container = $('#' + this.containerInstanceId);
		
		if (!!tweetree.options.x || !!tweetree.options.y) {
			tweetree.container.css({
				position: 'absolute',
				left: tweetree.options.xOrigin,
				top: tweetree.options.yOrigin
			});
		}
		
		tweetree.container.css({
			opacity: 0
		});
		
		showLoadingIndicator(true);
		
		searchFor(
			{
				query : treequery,
				howMany : 1
			},
			function(data){
				
				if (!!data.results){
					// Data came back!  Yay!
					response = data.results[0].text;
					
					$(tweetree.container).append(response.toRoot());
									
					// It's poor form for the last parameter to be hardcoded, but whatever.
					$(tweetree.container).data('lines', new Raphael($(tweetree.container)[0], branchManager.width.base,  1000))
									
					$(tweetree.container).find(select.root).centerInContainer();
						
					tweetree.container.animate(
						{ // props
							left : tweetree.options.x || 0,
							top : tweetree.options.y || 0,
							opacity : 1
						}, 
						{ // ops
							duration: prop.animateInTime,
							complete : tweetree.options.onRootLoad || null
						}
					);
					
					if (tweetree.options.x && tweetree.options.y){
						var width = Math.abs(tweetree.options.x - tweetree.options.xOrigin),
							height = Math.abs(tweetree.options.y - tweetree.options.yOrigin),
							x1 = tweetree.options.xOrigin + width,
							y1 = tweetree.options.yOrigin,
							direction = 'right';
							
						if (tweetree.options.x < tweetree.options.xOrigin){
							// We are going to the left
							x1 -= (width * 2) - (branchManager.width.base / 2);
							direction = 'left';
							
						} else {
							// We are going to the right
							x1 += ( (branchManager.width.base / 2) - width);
							direction = 'right';
						}
							
						var connector = $('<div>', {
								'class': 'treeConnector'
							})
							.css({
								top : y1,
								left : x1,
								height : height,
								width : width,
								position : 'absolute'
							}).appendTo(select.cached.twitterOutput),
							
							calcPath = {
								left : {
									from : 
										'M' + (width) +
										' ' + prop.offset.treeConnectorStart + 
										'L' + (width) + 
										' ' + prop.offset.treeConnectorStart,
									
									to: 
										'M' + (width) + 
										' ' + prop.offset.treeConnectorStart + 
										'l' + (-width) +
										' ' + height
								},
								
								right : {
									from : 
										'M0' +  
										' ' + prop.offset.treeConnectorStart +
										'L0' +  
										' ' + prop.offset.treeConnectorStart,
									to : 
										'M0' + 
										' ' + prop.offset.treeConnectorStart + 
										'L' + width +
										' ' + height
								}
							},
							paper = new Raphael(connector.get(0), width, height)
							conn = paper.path(calcPath[direction].from);
							
						conn.animate({
								path : calcPath[direction].to
							}, 
							prop.animateInTime * 2, 
							'>');
					}
					
					branchManager.onComplete = function(data){
						
						showLoadingIndicator(false);
						
						var root = $(tweetree.container).find(select.root),
							lines = $(tweetree.container).data('lines');
						
						for (this.i = 0; this.i < data.twobjects.length; this.i++){
								
							// Create the branch element, place it with CSS and jQuery, add it to the branch, add the branch to the tree
							var branch = $(data.twobjects[this.i].text.toBranch())
								.css({
									left : root.position().left,
									top : root.position().top,
									opacity :0
								});
								
							
							$(branch).data('dest', 
								{
									left : ((branchManager.width.base / (data.twobjects.length - 1)) * this.i) - (branchManager.width.ofBranch / 2),
									top : branchManager.height.base + (this.i % 2 ? branchManager.height.alternate : 0) + branchManager.height.variance()
								}
							);
							
							$(tweetree.container)
								.append(branch)
							.end();

						}
						
						var root = $(tweetree.container).find(select.root);
						
						$(tweetree.container).find(select.branch).each(function(){
							dest = $(this).data('dest');
							
							$(this).animate(
								{ 
									left : dest.left,
									top : dest.top,
									opacity : 1
								}, 
								{
									duration : prop.animateInTime
								}
							);
							
							var x1 = root.position().left + (branchManager.width.ofBranch / 2),
								y1 = root.position().top + root.height(),
								x2 = dest.left + (branchManager.width.ofBranch / 2),
								y2 = dest.top;
							
							this.line = lines.path("M" + x1 + " " + y1 + "L" + x1 +" "+ y1)
							this.line.animate({
								path : "M" + x1 + " " + y1 + "L" + x2 +" "+ y2
							}, 
							prop.animateInTime * 2, 
							'>')
						});
						
						this.totalTweetsOutputted = $(select.root + prop.rootCount.toString() + select.branch);
						
						prop.rootCount++;
					};
					
					branchManager.getRelatedTweets(data);
				}
				else{
					// No data came back!	
				}
			}
		);
	},
	
	makeBranch : function(options){
		
	}
};

