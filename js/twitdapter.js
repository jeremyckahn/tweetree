twitdapter = {
	debug : false
};

function searchFor(options, callback){
	
	$.ajax({
		url : 'http://search.twitter.com/search.json?callback=?',
		dataType : 'json',
		data : {
			// http://apiwiki.twitter.com/Twitter-Search-API-Method:-search
			q 			: !!options.query ? options.query : '',
			rpp 		: !!options.howMany ? options.howMany : 15,
			page 		: !!options.page ? options.page : '',
			lang 		: !!options.language ? options.language : 'en',
			since_id	: !!options.since_id ? options.since_id : '',
			max_id 		: !!options.max_id ? options.max_id : '',
			since 		: !!options.since_date ? options.since_date : '',
			until 		: !!options.until_date ? options.until_date : '',
			result_type : !!options.recent_or_popular ? options.recent_or_popular : 'recent'
		},
		success : function(data){
			if (!!callback){
				// If the returned data has no length, try to just send back an empty object
				try{
					callback( (data.results.length > 0) ? data : {});
				}
				catch(ex){
					if (twitdapter.debug){
						console.log('Twitter gave a bad response!');
						console.log(data);
						console.log(ex);
					}
					callback({})
				}
			}
		},
		async : !!options.async ? options.async : true
	});
}