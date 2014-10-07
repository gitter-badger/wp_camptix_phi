<?php 

	require_once("../../../wp-blog-header.php");

	if(isset($_POST['tix_attendee_id']) && isset($_POST['tix_attended']) ){
 		$post_id = $_POST[ 'tix_attendee_id' ];
		$attended = $_POST[ 'tix_attended' ];
		update_post_meta( $post_id, 'tix_attended', $attended );
		echo 'you wut m8?';
 	}else
 		echo "wtf?";
?>