/**
 * CampTix Javascript
 *
 * Hopefully runs during wp_footer.
 */
(function($){
	var	updated_ticket_price;
	$(".tix-attendee-form input[type='checkbox']").change(function(){
		var checkbox_price = $(this).attr("value");
		checkbox_price = checkbox_price.substr(checkbox_price.indexOf("$") + 1 , checkbox_price.length - 1);
		checkbox_price = parseFloat(checkbox_price);

		var ticket_name = $(this).parents(".tix-attendee-form").find("th").html();
		var ticket_number = ticket_name.substr(0 , ticket_name.indexOf(".")) - 1;
		//ticket_name = ticket_name.substr(ticket_name.indexOf(".") , ticket_name.length - 1);

		var initial_ticket_price = $(".tix-order-summary tbody tr:eq(" + ticket_number + ")").find(".tix-column-per-ticket").html();
		initial_ticket_price = initial_ticket_price.substr(initial_ticket_price.indexOf(";") + 1 , initial_ticket_price.length - 1);
		initial_ticket_price = parseFloat(initial_ticket_price);

		if($(this).is(":checked")) {
			updated_ticket_price = initial_ticket_price + checkbox_price;
			updated_ticket_price = updated_ticket_price.toString();
			$(".tix-order-summary tbody tr:eq(" + ticket_number + ")").find(".tix-column-per-ticket").html(updated_ticket_price)
		} else {
			updated_ticket_price = initial_ticket_price - checkbox_price;
			updated_ticket_price = updated_ticket_price.toString();
			$(".tix-order-summary tbody tr:eq(" + ticket_number + ")").find(".tix-column-per-ticket").html(updated_ticket_price)
		};
	});

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