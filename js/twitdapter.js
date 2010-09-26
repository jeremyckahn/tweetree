twitdapter = {
	debug : false
};

function searchFor(options, callback){
	
	// A quickie pretend fixture ;)
	if (twitdapter.debug){
		callback({"results":[{"profile_image_url":"http://a3.twimg.com/profile_images/1018201775/neobux_twittermini_normal.jpg","created_at":"Sun, 26 Sep 2010 15:42:11 +0000","from_user":"neobuxing","metadata":{"result_type":"recent"},"to_user_id":null,"text":"This is a test tweet.  Hello world!","id":25600615045,"from_user_id":128051764,"geo":null,"iso_language_code":"en","source":"&lt;a href=&quot;http://www.Tweet-U-Later.com&quot; rel=&quot;nofollow&quot;&gt;Tweet-U-Later&lt;/a&gt;"}],"max_id":25600615045,"since_id":25548777112,"refresh_url":"?since_id=25600615045&q=hello","next_page":"?page=2&max_id=25600615045&rpp=1&lang=en&q=hello","results_per_page":1,"page":1,"completed_in":0.032602,"warning":"adjusted since_id to 25548777112 due to temporary error -- since_id removed for pagination.","query":"hello"});
		
		return
	}
	
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