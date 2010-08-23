tweetree = {
	debug : true,
	
	branches : [],
	
	container : document.body,
	
	// Call out to twitter for the initial query, and pop it out, displayed.
	init : function(options){
		if (!options)
			options = {};
		
		treequery = !!options.query ? options.query : 'hello';
		tweetree.container = !!options.container ? options.container : document.body;
		
		this.containerInstanceId = 'branch-container' + prop.rootCount.toString();
		
		$(tweetree.container).append($(make('div'))
			.addClass('branch-container')
			.attr('id', this.containerInstanceId));
			
		tweetree.container = $('#' + this.containerInstanceId);
		
		if (!!options.x && !!options.y){
			tweetree.container.css({
				position : 'absolute',
				left : options.x,
				top : options.y
			});	
		}
		
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
					$(tweetree.container).find('.root').centerInContainer();
					
					branchManager.onComplete = function(data){
						
						showLoadingIndicator(false);
						
						var root = $(tweetree.container).find(select.root);
						
						for (this.i = 0; this.i < data.twobjects.length; this.i++){
								
							// Create the branch element, place it with CSS and jQuery, add it to the branch, add the branch to the tree
							var branch = $(data.twobjects[this.i].text.toBranch())
								.css({
									left : root.position().left,
									top : root.position().top
								});
								
							
							$(branch).data('dest', 
								{
									left : ((branchManager.width.base / (data.twobjects.length - 1)) * this.i) - (branchManager.width.ofBranch / 2),
									top : branchManager.height.base + (this.i % 2 ? branchManager.height.alternate : 0) + branchManager.height.variance()
								}
							)
							
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
									//top : root.position().top
									top : dest.top
								}, 
								{duration : 1000}
							);
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

