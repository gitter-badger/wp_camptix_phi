/**
 * CampTix Javascript
 *
 * Hopefully runs during wp_footer.
 */
 
 // Ammar's magic jQuery that modifies prices in table based on workshop checkboxes
(function($){
	
	var	updated_ticket_price;
	var final_price;
	var previously_checked = "";
	
	var paypal_tix_submit = '<select name="tix_payment_method">\
																											<!--<option  value="paypal">PayPal</option>-->\
																											<option value="paypal">PayPal</option>\
																										</select>\
																										<!-- <input type="submit" value="Checkout &rarr;" /> -->\
																										<input type="submit" value="Checkout →">\
																										<br class="tix-clear">';


	var free_tix_submit = '<!-- <input type="submit" value="Claim Tickets &rarr;" /> -->\
																								<input type="submit" value="Claim Tickets →">\
																								<br class="tix-clear">';


// this hides all the integers
$(".tix-attendee-form td span").css("display" , "none");
//to disable a checkbox or a radio button
//$("input.group1").attr("disabled", true);
//use this to split contents of <span>
//string=str.split(" ");
//use this to get the number used for each answer option
//String=str.substring(str.lastIndexOf("(")+1,str.lastIndexOf(")"));
//use this to get all the inputs of a question into an array
//
//then get their values and get the total quantity
//
//then subtract the used from the total quantity
//then check if the remaing of a type is 0 then disable the answer option
//watch out for an issue when the remaining for some options is less than the selected number of tickets for this purchase
//will need to disable option for later attendee
//there remains the issue of when an option has 1 available only, and two users start filling the form, and both of them can select the option
//because it hasn't been reserved yet for any of them, then we will end up with surplus of attendees for that particular session
//possible walkaround for this will be to use some code from camptix; if i remember well it was "sorry! the last ticket has been purchased/reserved" this shows up when
//the user submits the form. i think it checks again when you submit, for if there are any remaining tickets (maybe someone filled the form faster than you)


	//this updates the order summary table with checked checkbox prices each time the pages loads like if there is an error when the user submits the form
	var rows = $(".tix-order-summary tbody").children().length - 1;
	var ticket_prices = 0;
	for (var i = 0; i < rows; i++) {
		var ticket_price = $(".tix-order-summary tbody tr:eq(" + i + ")").find(".tix-column-price").html();
		if (ticket_price.indexOf(';') > -1) { // removes &nbsp; from total_price if it exists
			ticket_price = ticket_price.substr(ticket_price.indexOf(";") + 1 , ticket_price.length - 1);
		};
		ticket_price = parseFloat(ticket_price);
		if (ticket_price <= 0) {
			ticket_price = 0;
		};
		ticket_prices = ticket_prices + ticket_price;
		ticket_price = ticket_price.toFixed(2);
		ticket_price = "$&nbsp;" + ticket_price;
		$(".tix-order-summary tbody tr:eq(" + i + ")").find(".tix-column-price").html(ticket_price);
	}
	if (ticket_prices <= 0) {
		$(".tix-submit select").css("display" , "none");
	};
	ticket_prices = ticket_prices.toFixed(2);
	ticket_prices = "$&nbsp;" + ticket_prices;
	$(".tix-order-summary .tix-row-total td:eq(1) strong").html(ticket_prices);



	$(".tix-attendee-form input[type='radio'], .tix-attendee-form input[type='checkbox']").each(function () {
		if ( $(this).is(":checked") ){
			update_prices( $(this) );
		};
	});


 //this updates the order summary table prices according to checkbox states n.b. only checkbox values that start with "." are considered in appending the price
	$(".tix-attendee-form td").on("mousedown" , "label" , function(){
		$(this).parent().find("input[type='radio']").each(function(){
			if ($(this).prop("checked")) {
				previously_checked = $(this).attr("value");
			};
		});
	});

	$(".tix-attendee-form input[type='radio']").on("click" , function(){
		var $radio = $(this);
		
		// if this was previously checked
		if ($radio.data('waschecked') === true) {
			$radio.prop('checked', false);
			$radio.data('waschecked', false);
		} else {
			$radio.data('waschecked', true);
		}
		update_prices( $(this) );
		// remove was checked from other radios
		$radio.parent().siblings().children('input[type="radio"]').data('waschecked', false);
	});

	function update_prices(e){
		var checkbox_price = e.attr("value");

		var ticket_name = e.parents(".tix-attendee-form").find("th").html();
		var ticket_number = ticket_name.substr(0 , ticket_name.indexOf(".")) - 1;
		//ticket_name = ticket_name.substr(ticket_name.indexOf(".") , ticket_name.length - 1);

		var current_ticket_price = $(".tix-order-summary tbody tr:eq(" + ticket_number + ")").find(".tix-column-per-ticket").html();
		var extra_price = $(".tix-order-summary tbody tr:eq(" + ticket_number + ")").find(".tix-column-extra-price").html();

		if (current_ticket_price.indexOf(';') > -1) { // removes &nbsp; from current_ticket_price if it exists
			current_ticket_price = current_ticket_price.substr(current_ticket_price.indexOf(";") + 1 , current_ticket_price.length - 1);
		};
		if (extra_price.indexOf(';') > -1) { // removes &nbsp; from extra_price if it exists
			extra_price = extra_price.substr(extra_price.indexOf(";") + 1 , extra_price.length - 1);
		};
		
		current_ticket_price = parseFloat(current_ticket_price);
		extra_price = parseFloat(extra_price);
		if (previously_checked[0] == ".") {
			previously_checked = previously_checked.substr(previously_checked.indexOf("$") + 1 , previously_checked.length - 1);
			previously_checked = parseFloat(previously_checked);
		} else {
			previously_checked = 0;
		};

		if (checkbox_price[0] == ".") {
			checkbox_price = checkbox_price.substr(checkbox_price.indexOf("$") + 1 , checkbox_price.length - 1);
			checkbox_price = parseFloat(checkbox_price);
			if (e.data('waschecked') === false) {
				extra_price = extra_price - previously_checked;
			} else {
				extra_price = extra_price + checkbox_price - previously_checked;
			}
		} else	{
			extra_price = extra_price - previously_checked;
		};
		updated_ticket_price = current_ticket_price + extra_price;
		if (parseFloat(updated_ticket_price) <= 0) {
			updated_ticket_price = 0;
		}
		updated_ticket_price = updated_ticket_price.toFixed(2);
		updated_ticket_price = "$&nbsp;" + updated_ticket_price;
		$(".tix-order-summary tbody tr:eq(" + ticket_number + ")").find(".tix-column-price").html(updated_ticket_price);

		extra_price = extra_price.toFixed(2);
		extra_price = "$&nbsp;" + extra_price;
		$(".tix-order-summary tbody tr:eq(" + ticket_number + ")").find(".tix-column-extra-price").html(extra_price);



	ticket_prices = 0;
	for (var i = 0; i < rows; i++) {
		var ticket_price = $(".tix-order-summary tbody tr:eq(" + i + ")").find(".tix-column-price").html();
		if (ticket_price.indexOf(';') > -1) { // removes &nbsp; from total_price if it exists
			ticket_price = ticket_price.substr(ticket_price.indexOf(";") + 1 , ticket_price.length - 1);
		};
		ticket_price = parseFloat(ticket_price);
		ticket_prices = ticket_prices + ticket_price;
	}
	ticket_prices = parseFloat(ticket_prices);
		
		if (ticket_prices > 0) {
			$(".tix-submit select").css("display" , "initial");
		} else {
			ticket_prices = 0;
			$(".tix-submit select").css("display" , "none");
		}
		ticket_prices = ticket_prices.toFixed(2);
		ticket_prices = "$&nbsp;" + ticket_prices;
		$(".tix-order-summary .tix-row-total td:eq(1) strong").html(ticket_prices);

	};

	$(".tix-attendee-form input[type='checkbox']").change(function(){
		 checkbox_update_prices( $(this) );
	});

	function checkbox_update_prices(e){
	 var checkbox_price = e.attr("value");
		checkbox_price = checkbox_price.substr(checkbox_price.indexOf("$") + 1 , checkbox_price.length - 1);
		checkbox_price = parseFloat(checkbox_price);
		var ticket_name = e.parents(".tix-attendee-form").find("th").html();
		var ticket_number = ticket_name.substr(0 , ticket_name.indexOf(".")) - 1;
		//ticket_name = ticket_name.substr(ticket_name.indexOf(".") , ticket_name.length - 1);
	
		var current_ticket_price = $(".tix-order-summary tbody tr:eq(" + ticket_number + ")").find(".tix-column-per-ticket").html();
		var extra_price = $(".tix-order-summary tbody tr:eq(" + ticket_number + ")").find(".tix-column-extra-price").html();
	
		if (current_ticket_price.indexOf(';') > -1) { // removes &nbsp; from current_ticket_price if it exists
			current_ticket_price = current_ticket_price.substr(current_ticket_price.indexOf(";") + 1 , current_ticket_price.length - 1);
		};
		if (extra_price.indexOf(';') > -1) { // removes &nbsp; from extra_price if it exists
			extra_price = extra_price.substr(extra_price.indexOf(";") + 1 , extra_price.length - 1);
		};
		current_ticket_price = parseFloat(current_ticket_price);
		extra_price = parseFloat(extra_price);

		if(e.is(":checked")) {
			extra_price = extra_price + checkbox_price;
		} else {
			extra_price = extra_price - checkbox_price;
		};
		updated_ticket_price = current_ticket_price + extra_price;
		if (parseFloat(updated_ticket_price) <= 0) {
			updated_ticket_price = 0;
		}

		updated_ticket_price = updated_ticket_price.toFixed(2);
		updated_ticket_price = "$&nbsp;" + updated_ticket_price;
		$(".tix-order-summary tbody tr:eq(" + ticket_number + ")").find(".tix-column-price").html(updated_ticket_price);
		extra_price = extra_price.toFixed(2);
		extra_price = "$&nbsp;" + extra_price;
		$(".tix-order-summary tbody tr:eq(" + ticket_number + ")").find(".tix-column-extra-price").html(extra_price);

	ticket_prices = 0;
	for (var i = 0; i < rows; i++) {
		var ticket_price = $(".tix-order-summary tbody tr:eq(" + i + ")").find(".tix-column-price").html();
		if (ticket_price.indexOf(';') > -1) { // removes &nbsp; from total_price if it exists
			ticket_price = ticket_price.substr(ticket_price.indexOf(";") + 1 , ticket_price.length - 1);
		};
		ticket_price = parseFloat(ticket_price);
		ticket_prices = ticket_prices + ticket_price;
	}
	ticket_prices = parseFloat(ticket_prices);
		
		if (ticket_prices > 0) {
			$(".tix-submit select").css("display" , "initial");
		} else {
			ticket_prices = 0;
			$(".tix-submit select").css("display" , "none");
		}
		ticket_prices = ticket_prices.toFixed(2);
		ticket_prices = "$&nbsp;" + ticket_prices;
		$(".tix-order-summary .tix-row-total td:eq(1) strong").html(ticket_prices);

	};




	$(".tix-submit input[type='submit']").click(function(){
		push_prices();
	});


	function push_prices(){
		var rows = $(".tix-order-summary tbody").children();
		for (var i = 0; i < rows.length - 1; i++) {
			var ammar_price = $(".tix-order-summary tbody tr:eq(" + i + ") td.tix-column-price").html();

			if (ammar_price.indexOf(';') > -1) { // removes &nbsp; from ammar_price if it exists
				ammar_price = ammar_price.substr(ammar_price.indexOf(";") + 1 , ammar_price.length - 1);
			};
	
			ammar_price = parseFloat(ammar_price);


			$(".tix-order-summary tbody tr:eq(" + i + ") input[type='hidden']").attr("value" , ammar_price);
		};

	 if (final_price == 0) {
			$(".tix-submit").html(free_tix_submit);
	 };

	};


	var tix = $( '#tix' );
	$( tix ).addClass( 'tix-js' );

	if ( $( tix ).hasClass( 'tix-has-dynamic-receipts' ) ) {
		refresh_receipt_emails = function() {
			var fields = $('.tix-field-email');
			var html = '';
			var previously_checked = $('[name="tix_receipt_email_js"]:checked').val();
			var checked = false;

			for ( var i = 0; i < fields.length; i++ ) {
				var value = fields[i].value;
				if ( value.length < 1 ) continue;

				var field = $('<div><label><input type="radio" name="tix_receipt_email_js" /> <span>container</span></label><br /></div>');
				$(field).find('span').text(value);
				$(field).find('input').attr('value', value);

				if ( previously_checked != undefined && previously_checked == value && ! checked )
					checked = $(field).find('input').attr('checked','checked');

				html += $(field).html();
			}

			if ( html.length < 1 )
				html = '<label>' + camptix_l10n.enterEmail + '</label>';

			if ( html == $('#tix-receipt-emails-list').html() )
				return;

			$('#tix-receipt-emails-list').html(html);

			previously_checked = $('[name="tix_receipt_email_js"]:checked').val();
			if ( previously_checked == undefined || previously_checked.length < 1 )
				$('#tix-receipt-emails-list input:first').attr('checked','checked');
		};

		$('.tix-field-email').change(refresh_receipt_emails);
		$('.tix-field-email').keyup(refresh_receipt_emails);
		$(document).ready(refresh_receipt_emails);
	}
}(jQuery));