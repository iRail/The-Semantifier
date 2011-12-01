<?php
/**
 * This file foresees authenticated calls to a The DataTank instance
 *
 * @author Pieter Colpaert
 * @copyright 2011 iRail vzw/asbl
 * @copyright 2010 "Cowboy" Ben Alman
 * @license: GPL: http://benalman.com/about/license
 */

include_once("Config.class.php");

//Source stolen from: https://github.com/developerforce/Force.com-JavaScript-REST-Toolkit/blob/master/proxy.php

// Change these configuration options if needed, see above descriptions for info.
$enable_jsonp    = false;
$enable_native   = true;
$host = str_ireplace("/","\/",Config::$HOSTNAME);
$valid_url_regex = '/'. $host .'/';
$url_query_param = "url"; // 'url'
$url_header = "";
$authz_header = 'HTTP_X_AUTHORIZATION';
$return_all_headers = true;
$cors_allow_origin  = null;
$cors_allow_methods = 'GET, POST, PUT';
$cors_allow_headers = 'Authorization, Content-Type';

// ############################################################################

$status = array();

if ( $url_query_param != null ) {
    $url = isset($_GET[$url_query_param]) ? $_GET[$url_query_param] : null;
} else if ( $url_header != null ) {
    $url = isset($_SERVER[$url_header]) ? $_SERVER[$url_header] : null;
} else {
    $url = null;
}

if ( !$url ) {
  
    // Passed url not specified.
    $contents = 'ERROR: url not specified';
    $status['http_code'] = 400;
    $status['status_text'] = 'Bad Request';
  
} else if ( !preg_match( $valid_url_regex, $url ) ) {
  
    // Passed url doesn't match $valid_url_regex.
    $contents = 'ERROR: invalid url';
    $status['http_code'] = 400;
    $status['status_text'] = 'Bad Request';

} else {

    if ( isset( $cors_allow_origin ) ) {
        header( 'Access-Control-Allow-Origin: '.$cors_allow_origin );
        if ( isset( $cors_allow_methods ) ) {
            header( 'Access-Control-Allow-Methods: '.$cors_allow_methods );
        }
        if ( isset( $cors_allow_headers ) ) {
            header( 'Access-Control-Allow-Headers: '.strtolower($cors_allow_headers) );
        }
        if ( isset($_SERVER['REQUEST_METHOD']) && 
             ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') ) {
            // We're done - don't proxy CORS OPTIONS request
            exit();
        }
    }

    $ch = curl_init( $url );

    // Pass on request method, regardless of what it is
    curl_setopt( $ch, CURLOPT_CUSTOMREQUEST, 
                 isset($_SERVER['REQUEST_METHOD']) ? $_SERVER['REQUEST_METHOD'] : 'GET' );

    // Pass on content, regardless of request method
    if ( isset($_SERVER['CONTENT_LENGTH'] ) && $_SERVER['CONTENT_LENGTH'] > 0 ) {
        curl_setopt( $ch, CURLOPT_POSTFIELDS, file_get_contents("php://input") );
    }

    if ( isset($_GET['send_cookies']) ) {
        $cookie = array();
        foreach ( $_COOKIE as $key => $value ) {
            $cookie[] = $key . '=' . $value;
        }
        if ( isset($_GET['send_session']) ) {
            $cookie[] = SID;
        }
        $cookie = implode( '; ', $cookie );
    
        curl_setopt( $ch, CURLOPT_COOKIE, $cookie );
    }

    $headers = array();
    if ( isset($authz_header) && isset($_SERVER[$authz_header]) ) {
        // Set the Authorization header
        array_push($headers, "Authorization: ".$_SERVER[$authz_header] );
    }
    if ( isset($_SERVER['CONTENT_TYPE']) ) {
	// Pass through the Content-Type header
	array_push($headers, "Content-Type: ".$_SERVER['CONTENT_TYPE'] );
    }	
    if ( isset($_SERVER['HTTP_X_USER_AGENT']) ) {
	// Pass through the X-User-Agent header
	array_push($headers, "X-User-Agent: ".$_SERVER['HTTP_X_USER_AGENT'] );
    }
    if ( isset($_SERVER['HTTP_X_FORWARDED_FOR']) ) {
	array_push($headers, $_SERVER['HTTP_X_FORWARDED_FOR'].", ".$_SERVER['HTTP_X_USER_AGENT'] );
    } else if (isset($_SERVER['REMOTE_ADDR'])) {
	array_push($headers, "X-Forwarded-For: ".$_SERVER['REMOTE_ADDR'] );
    }

    if ( count($headers) > 0 ) {
	curl_setopt( $ch, CURLOPT_HTTPHEADER, $headers );
    }
  
    curl_setopt( $ch, CURLOPT_FOLLOWLOCATION, true );
    curl_setopt( $ch, CURLOPT_HEADER, true );
    curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );

    //Addition by Pieter: added The DataTank username & password for authenticated POST calls
    curl_setopt( $ch, CURLOPT_USERPWD, Config::$USER.':'.Config::$PASSWORD);   
    curl_setopt( $ch, CURLOPT_USERAGENT, 
                 isset($_GET['user_agent']) ? $_GET['user_agent'] : $_SERVER['HTTP_USER_AGENT'] );
  
    list( $header, $contents ) = preg_split( '/([\r\n][\r\n])\\1/', curl_exec( $ch ), 2 );
  
    $status = curl_getinfo( $ch );
  
    if ( curl_errno( $ch ) ) {
        $status['http_code'] = 500;
        $contents = "cURL error ".curl_errno( $ch ).": ".curl_error( $ch )."\n";
    }
  
    curl_close( $ch );
}

// Split header text into an array.
$header_text = isset($header) ? preg_split( '/[\r\n]+/', $header ) : array();

if ( isset($_GET['mode']) && $_GET['mode'] == 'native' ) {
    if ( !$enable_native ) {
        $contents = 'ERROR: invalid mode';
        $status['http_code'] = 400;
        $status['status_text'] = 'Bad Request';
    }

    if ( isset( $status['http_code'] ) ) {
        $header = "HTTP/1.1 ".$status['http_code'];
        if (isset($status['status_text'])) {
            $header .= " ".$status['status_text'];
        }
        header( $header );

        $header_match = '/^(?:Content-Type|Content-Language|Set-Cookie)/i';
    } else {
        $header_match = '/^(?:HTTP|Content-Type|Content-Language|Set-Cookie)/i';
    }
  
    foreach ( $header_text as $header ) {
        if ( preg_match( $header_match, $header ) ) {
            header( $header );
        }
    }

    print $contents;
  
} else {
  
    // $data will be serialized into JSON data.
    $data = array();
  
    // Propagate all HTTP headers into the JSON data object.
    if ( isset($_GET['full_headers']) ) {
        $data['headers'] = array();
    
        foreach ( $header_text as $header ) {
            preg_match( '/^(.+?):\s+(.*)$/', $header, $matches );
            if ( $matches ) {
                $data['headers'][ $matches[1] ] = $matches[2];
            }
        }
    }
  
    // Propagate all cURL request / response info to the JSON data object.
    if ( isset($_GET['full_status']) ) {
        $data['status'] = $status;
    } else {
        $data['status'] = array();
        $data['status']['http_code'] = $status['http_code'];
    }
  
    // Set the JSON data object contents, decoding it from JSON if possible.
    $decoded_json = json_decode( $contents );
    $data['contents'] = $decoded_json ? $decoded_json : $contents;

    // Generate appropriate content-type header.
    $is_xhr = isset($_SERVER['HTTP_X_REQUESTED_WITH']) && 
        (strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest');
    header( 'Content-type: application/' . ( $is_xhr ? 'json' : 'x-javascript' ) );
  
    // Get JSONP callback.
    $jsonp_callback = ($enable_jsonp && isset($_GET['callback'])) ? $_GET['callback'] : null;
  
    // Generate JSON/JSONP string
    $json = json_encode( $data );
  
    print $jsonp_callback ? "$jsonp_callback($json)" : $json;

}

?>