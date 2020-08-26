<?php
header("Content-type: application/xml; charset=UTF-8");
if (empty($_GET)) {
    $url =  "http://jws.jalan.net/APICommon/AreaSearch/V1/?key=???????????";
}
// array_key_exists('reg',$_GET) = 'reg'キーが存在するかしないか 
// reg = キー、$_GET = 配列

else if (array_key_exists('reg', $_GET)) {
    $url =  "http://jws.jalan.net/APICommon/AreaSearch/V1/?key=&reg=" . $_GET['reg'];
}   
else if (array_key_exists('pref', $_GET)) {
    $url =  "http://jws.jalan.net/APICommon/AreaSearch/V1/?key=&pref=" . $_GET['pref'];
}
else if (array_key_exists('l_area', $_GET)) {
    $url =  "http://jws.jalan.net/APICommon/AreaSearch/V1/?key=&l_area=" . $_GET['l_area'];
}
else if (array_key_exists('s_area', $_GET)) {
    $url =  "http://jws.jalan.net/APILite/HotelSearch/V1/?key=&s_area=" . $_GET['s_area'];
}
$xml = file_get_contents($url);
echo $xml;