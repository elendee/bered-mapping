<?php



function LOG( $msg ){

	if( !file_exists( __DIR__ . '/.bered-log.txt') ){
		// return;
	}

	$type = gettype( $msg );
	if( $type  === 'object' || $type === 'array' ){
		$msg = '(' . $type . ')
' . json_encode($msg, JSON_PRETTY_PRINT);
	}
    $logfile = __DIR__ . '/.bered-log.txt';
    // file_put_contents($logfile, date('M:D:H:i') . ':
// ' . $msg . PHP_EOL, FILE_APPEND | LOCK_EX);
    file_put_contents($logfile, $msg . PHP_EOL, FILE_APPEND | LOCK_EX);

}	

session_start();


LOG('yea we have ajax...' . isset( $_POST ) );