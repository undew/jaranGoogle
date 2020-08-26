<?php
header("Access-Control-Allow-Origin: *");
header(
  "Access-Control-Allow-Headers: X-Requested-With, Origin, X-Csrftoken, Content-Type, Accept"
);
header(
  "Access-Control-Allow-Methods: GET, POST, PUT, DELETE, CONNECT, OPTIONS, TRACE, PATCH, HEAD"
);
header("Content-type: application/xml; charset=UTF-8");
if(array_key_exists('weather',$_GET)){
    $url = $_GET['weather'];
    $xml = file_get_contents($url);
echo $xml;
exit;
}

if (empty($_GET)) {
    $url =  "http://jws.jalan.net/APICommon/AreaSearch/V1/?key=leo16612c23f5b";
}
// array_key_exists('reg',$_GET) = 'reg'キーが存在するかしないか 
// reg = キー、$_GET = 配列

else if (array_key_exists('reg', $_GET)) {
    $url =  "http://jws.jalan.net/APICommon/AreaSearch/V1/?key=leo16612c23f5b&reg=" . $_GET['reg'];
}   
else if (array_key_exists('pref', $_GET)) {
    $url =  "http://jws.jalan.net/APICommon/AreaSearch/V1/?key=leo16612c23f5b&pref=" . $_GET['pref'];
}
else if (array_key_exists('l_area', $_GET)) {
    $url =  "http://jws.jalan.net/APICommon/AreaSearch/V1/?key=leo16612c23f5b&l_area=" . $_GET['l_area'];
}
else if (array_key_exists('s_area', $_GET)) {
    $url =  "http://jws.jalan.net/APILite/HotelSearch/V1/?key=leo16612c23f5b&s_area=" . $_GET['s_area'];
    
}
$xml = file_get_contents($url);

echo $xml;