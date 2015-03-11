$(document).ready( function() {

	var page =1;
	 var tags ="";

	$('.unanswered-getter').submit( function(event){
		// zero out results if previous search has run
		$('.results').html('');
		// get the value of the tags the user submitted
		tags = $(this).find("input[name='tags']").val();
		getUnanswered(tags);
	}); // submit

		$('.inspiration-getter').submit( function(event){
		// zero out results if previous search has run
		$('.results').html('');
		// get the value of the tags the user submitted
		 tags = $(this).find("input[name='answerers']").val();
		getInspiration(tags);
	}); // submit
}); // ready function

$('.next-page').on('click', function() { 
		page++;
		$('.results').html('');
		getUnanswered(tags);

		console.log('next page clicked');
	});

// this function takes the question object returned by StackOverflow 
// and creates new result to be appended to DOM
var showQuestion = function(question) { // function expression
	//could be changed to a function declaration .. function showQuestion(question)
	
	// clone our result template code
	var result = $('.templates .question').clone();
	
	// Set the question properties in result
	var questionElem = result.find('.question-text a');
	questionElem.attr('href', question.link); // (target, set the target)
	questionElem.text(question.title);

	// set the date asked property in result
	var asked = result.find('.asked-date');
	var date = new Date(1000*question.creation_date); // unix timestamp convertor
	asked.text(date.toString());

	// set the #views for question property in result
	var viewed = result.find('.viewed');
	viewed.text(question.view_count);

	// set some properties related to asker
	var asker = result.find('.asker');
	asker.html('<p>Name: <a target="_blank" href=http://stackoverflow.com/users/' + question.owner.user_id + ' >' +
													question.owner.display_name +
												'</a>' +
							'</p>' +
 							'<p>Reputation: ' + question.owner.reputation + '</p>'
	);

	return result;
};

var showAnswerers = function(answerer) { // function expression
	//could be changed to a function declaration .. function showquestion(question)

	
	
	// clone our result template code
	var result = $('.templates .answerers').clone();

	var postCount = result.find('.post_count');
	postCount.text(answerer.post_count);

/*
	var acceptRate = result.find('.accept_rate');

	var rateArray =[];

	rateArray.push(answerer.user.accept_rate);

	var sorted = rateArray.sort(function(a, b){return b-a});

	acceptRate.text(sorted);


/*	var postCount = result.find('.post_count');
	postCount.text(answerer.post_count);

	var acceptRate = result.find('.accept_rate');

	var rateArray =[answerer.user.accept_rate];

	var sorted = rateArray.sort();

	acceptRate.text(sorted);
*/
	//acceptRate.text(answerer.user.accept_rate);
	//acceptRate.text(answerer.user.accept_rate);

	var scoreCount = result.find('.score');
	scoreCount.text(answerer.score);

	var profileImg = result.find('.profile_image');
	profileImg.html('<img src=' + answerer.user.profile_image +'>');
	


	// set some properties related to asker
	var person = result.find('.display_name');
	person.html('<p>Name: <a target="_blank" href=http://stackoverflow.com/users/' + answerer.user.user_id + ' >' +
													answerer.user.display_name +
												'</a>' +
							'</p>' +
 							'<p>Reputation: ' + answerer.user.reputation + '</p>'
	);

	return result;
};


// this function takes the results object from StackOverflow
// and creates info about search results to be appended to DOM
var showSearchResults = function(query, resultNum) { // request.tagged, response.items.length);
	var results = resultNum + ' results for <strong>' + query;
	return results; // makes results available to what called it

	// return resultNum + ' results for <strong>' + query; WOULD WORK FINE
};

// takes error string and turns it into displayable DOM element
var showError = function(error){
	var errorElem = $('.templates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
};

// takes a string of semi-colon separated tags to be searched
// for on StackOverflow

var getInspiration = function(inputtags) {
	
	// the parameters we need to pass in our request to StackOverflow's API
	var request = {
					tagged: inputtags,
					//pagesize: '100',
					//site: 'stackoverflow'
					
					};
	//							site: 'stackoverflow',
	//							order: 'desc',
	//							sort: 'creation'};
	
	var result = $.ajax({
		url: "http://api.stackexchange.com/2.2/tags/" + inputtags + "/top-answerers/all_time?pagesize=30&site=stackoverflow",
		data: request,
		dataType: "jsonp",
		type: "GET",
		})

		.done(function(response){ // from the ajax call

		response.items.sort(function(a, b) { 
   		 return (b.score - a.score);
		});

		console.log(response);
		var searchResults = showSearchResults(request.tagged, response.items.length);// we jump up to showSearchResults ()


		
			//var searchResults is now results from return results in showSearchResults()
		
		$('.search-results').html(searchResults);

		$.each(response.items, function(i, item) {
			var assembledAns = showAnswerers(item); // refers to item above
			$('.results').append(assembledAns);
		});
	})

	.fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};
	



var getUnanswered = function(inputtags) {

	var page = 1;
	
	// the parameters we need to pass in our request to StackOverflow's API
	var request = {
					tagged: inputtags, // pass user input into request
					site: 'stackoverflow',
					order: 'desc',
					sort: 'creation',
					page: page,
					pagesize: '20'
				  };
	
	var result = $.ajax({ // actually we dont need var result here as its not used
		url: "http://api.stackexchange.com/2.2/questions/unanswered",
		data: request,
		dataType: "jsonp",
		type: "GET"
		}) /// note .done function on this

		.done(function(response){ // from the ajax call

		console.log(response);
		var searchResults = showSearchResults(request.tagged, response.items.length);// we jump up to showSearchResults ()

			//var searchResults is now results from return results in showSearchResults()
		
		$('.search-results').html(searchResults);

		$.each(response.items, function(i, item) {
			var assembledQues = showQuestion(item);
			$('.results').append(assembledQues);
		});
	})

	.fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};



