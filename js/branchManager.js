branchManager = {
	debug : false,
	
	maxBranches : 9,
	
	onComplete : function(){},
	
	root : {
		string : '',
		array : new Array()	
	},
	
	height: {
		base : 100,
		alternate : 200,
		variance : function(){
			return random(100);
		}
	},
	
	width: {
		base : 960,
		ofBranch : 120
	},
	
	twobjects : [],
	
	getRelatedTweets : function(twobject){
		this.cleanup();
		
		response = '';
	
		tweet = twobject.results[0].text;
		words = tweet.split(' ');
		
		this.root.string = tweet;
		this.root.array = words;
		
		if (words.length > branchManager.maxBranches){
			words.length = branchManager.maxBranches;
		}
					
		for(this.i = 0; this.i < words.length; this.i++){
			searchFor(
				{
					query : words[this.i],
					howMany : 1,
					page : this.i + 2,
					max_id : twobject.max_id
				},
				((this.i == words.length - 1) ?
					function(data){
						branchManager.storeBranch(data, true);
					}
				:
					function(data){
						branchManager.storeBranch(data, false);
					}
				)
			);
		}
	},
	
	returnDataTo : function(context){
		this.returnContext = context;
	},
	
	storeBranch : function(data, final){
		if (!!data.results){
			this.twobjects.push(data.results[0]);
		}
		else{
			// Could probably use some functionality to account for bad data.	
		}
		
		if (final){
			branchManager.completeTweetLoad();
		}
	},
	
	completeTweetLoad : function(){
		branchManager.onComplete(this);
		
		this.cleanup();
	},
	
	cleanup : function(){
		// Perform some cleanup, empty the data containers
		this.root = {
			string : '',
			array : new Array()	
		}
		
		this.twobjects = [];
	}
};