<?php
require 'vendor/autoload.php';

use Walmart\Auth\Signature;

$consumerId   = "your-consumer-id";
$privateKey   = "your-base64-encoded-private-key";
$requestUrl   = "https://developer.api.walmart.com/api-proxy/service/affil/productlookup";
$requestMethod= "GET";
// Optionally supply a timestamp; otherwise getSignature() will generate one.
$timestamp = null; 

try {
    // Direct static call:
    $signature = Signature::calculateSignature($consumerId, $privateKey, $requestUrl, $requestMethod, $timestamp);
    echo "Auth signature: {$signature}\n";

    // You can then use this signature (set in the header) to call the Walmart API.
    // For example, you might assemble the additional headers as:
    $headers = [
        "WM_CONSUMER.ID"     => $consumerId,
        "WM_SEC.TIMESTAMP"   => $timestamp ? $timestamp : Signature::getMilliseconds(),
        "WM_SEC.AUTH_SIGNATURE" => $signature,
        "WM_SEC.KEY_VERSION" => "1",
    ];
    print_r($headers);
} catch (\Exception $e) {
    echo "Error generating signature: " . $e->getMessage();
}