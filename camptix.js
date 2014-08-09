/**
 * CampTix Javascript
 *
 * Hopefully runs during wp_footer.
 */
 
 // Ammar's magic jQuery that modifies prices in table based on workshop checkboxes
(function($){
	
	var	updated_ticket_price;

	//this updates the order summary table with checked checkbox prices each time the pages loads like if there is an error when the user submits the form
	$(".tix-attendee-form input[type='checkbox']").each(function () {
		if ( $(this).is(":checked") ){
			update_prices( $(this) );
		};
	});


 //this updates the order summary table prices according to checkbox states n.b. only checkbox values that start with "." are considered in appending the price
	$(".tix-attendee-form input[type='checkbox']").change(function(){
		update_prices( $(this) );
	});



	function update_prices(e){
		var checkbox_price = e.attr("value");
		if (checkbox_price[0] == ".") {
			checkbox_price = checkbox_price.substr(checkbox_price.indexOf("$") + 1 , checkbox_price.length - 1);
			checkbox_price = parseFloat(checkbox_price);
	
			var ticket_name = e.parents(".tix-attendee-form").find("th").html();
			var ticket_number = ticket_name.substr(0 , ticket_name.indexOf(".")) - 1;
			//ticket_name = ticket_name.substr(ticket_name.indexOf(".") , ticket_name.length - 1);
	
			var current_ticket_price = $(".tix-order-summary tbody tr:eq(" + ticket_number + ")").find(".tix-column-price").html();
			var extra_price = $(".tix-order-summary tbody tr:eq(" + ticket_number + ")").find(".tix-column-extra-price").html();
	
			if (current_ticket_price.indexOf(';') > -1) { // removes &nbsp; from current_ticket_price if it exists
				current_ticket_price = current_ticket_price.substr(current_ticket_price.indexOf(";") + 1 , current_ticket_price.length - 1);
			};
			if (extra_price.indexOf(';') > -1) { // removes &nbsp; from extra_price if it exists
				extra_price = extra_price.substr(extra_price.indexOf(";") + 1 , extra_price.length - 1);
			};
			
			var total_price = $(".tix-order-summary .tix-row-total td:eq(1) strong").html();
			if (total_price.indexOf(';') > -1) { // removes &nbsp; from total_price if it exists
				total_price = total_price.substr(total_price.indexOf(";") + 1 , total_price.length - 1);
			};
	
			total_price = parseFloat(total_price);
			current_ticket_price = parseFloat(current_ticket_price);
			extra_price = parseFloat(extra_price);
	
			if(e.is(":checked")) {
				updated_ticket_price = current_ticket_price + checkbox_price;
				updated_ticket_price = updated_ticket_price.toFixed(2);
				updated_ticket_price = "$&nbsp;" + updated_ticket_price;
				$(".tix-order-summary tbody tr:eq(" + ticket_number + ")").find(".tix-column-price").html(updated_ticket_price);
	
				extra_price = extra_price + checkbox_price;
				extra_price = extra_price.toFixed(2);
				extra_price = "$&nbsp;" + extra_price;
				$(".tix-order-summary tbody tr:eq(" + ticket_number + ")").find(".tix-column-extra-price").html(extra_price);
	
				total_price = total_price + checkbox_price;
				total_price = total_price.toFixed(2);
				total_price = "$&nbsp;" + total_price;
				$(".tix-order-summary .tix-row-total td:eq(1) strong").html(total_price);
			} else {
				updated_ticket_price = current_ticket_price - checkbox_price;
				updated_ticket_price = updated_ticket_price.toFixed(2);
				updated_ticket_price = "$&nbsp;" + updated_ticket_price;
				$(".tix-order-summary tbody tr:eq(" + ticket_number + ")").find(".tix-column-price").html(updated_ticket_price);
	
				extra_price = extra_price - checkbox_price;
				extra_price = extra_price.toFixed(2);
				extra_price = "$&nbsp;" + extra_price;
				$(".tix-order-summary tbody tr:eq(" + ticket_number + ")").find(".tix-column-extra-price").html(extra_price);
	
				total_price = total_price - checkbox_price;
				total_price = total_price.toFixed(2);
				total_price = "$&nbsp;" + total_price;
				$(".tix-order-summary .tix-row-total td:eq(1) strong").html(total_price);
			};
		};
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