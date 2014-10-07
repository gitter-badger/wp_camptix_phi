jQuery(document).ready(function($) {
	$("input[name='tix_attended']").on("click", function (e) {
		var directory = $("span#pluginsdir").html();
		var	attendee_id = parseFloat($(this).next().attr("value"));
	    if ( !$(this).is(":checked") ) {
		    if (confirm("Are you sure you want to uncheck this attendee?") == true) {
				var tix_attended = 0;
				$.ajax({
		            type: "POST",
					url: directory,
					data: { "tix_attendee_id" : attendee_id , "tix_attended" : tix_attended }
				})
/*				.done(function(result) {
					alert(result);
				}).fail(function(error) {
					alert( error.responseText );
				})
*/		    } else {
				e.preventDefault();
				return false;
		    }
   	    } else {
			var tix_attended = 1;
			$.ajax({
	            type: "POST",
				url: directory,
				data: { "tix_attendee_id" : attendee_id , "tix_attended" : tix_attended }
			})
/*			.done(function(result) {
				alert(result);
			}).fail(function(error) {
				alert( error.responseText );
			});
*/		}


	});


})
