<?php

    if ( ! current_user_can( 'manage_options' ) ) {
        return;
    }

    ?>

    <div class="wrap bered">
    	<?php do_action('bered_admin_menu'); ?>
    </div>

    <div class='section'>
    	section 1
    </div>
    <div class='section'>
    	section 2
    </div>
    <div class='section'>
    	section 3
    </div>
    <div class='section'>
    	section 4
    </div>


</div>
