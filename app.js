var map;
let currentInfoWindow = null;

function initMap() {
  var latlng = new google.maps.LatLng(34.698654, 135.499265);
  var opts = {
    zoom: 15,
    center: latlng,
    styles: [
      //全てのラベルを非表示
      {
        featureType: "all",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
    ],
  };
  map = new google.maps.Map(document.getElementById("map"), opts);
  console.log(opts);
}
("use strict");
let makers = [];

$("#sub").click(() => {
  let con = $('input[name="id"]').val();
  console.log(con);
  var geocoder;
  geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address: con }, function (result, status) {
    // 位置情報を正常に取得できているかを判断
    // だめだった場合、statusに「NO」が入る。

    if (status == google.maps.GeocoderStatus.OK) {
      var latlng = result[0].geometry.location;
      // 入力された住所を地図のセンターに持ってくる。
      var options = {
        center: latlng,
      };
      map.setOptions(options);

      // マーカー情報処理
      let text =
        "<h1>" +
        con +
        "</h1>" +
        "<p>" +
        '<a href="https://google.com/search?q=' +
        con +
        '" target="_blank">' +
        "検索</a>";

      let infoWindow = new google.maps.InfoWindow({
        content: text,
      });
      console.log(infoWindow);
      // マーカーを挿入する処理。
      let maker;
      maker = new google.maps.Marker({
        position: latlng,
        map: map,
        icon: {
          path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
          scale: 8,
          fillColor: "#00B7CE",
          fillOpacity: 1,
          strokeWeight: 2.5,
        },
      });

      maker.addListener("click", function () {
        if (currentInfoWindow) {
          currentInfoWindow.close();
        }
        infoWindow.open(map, maker);
        currentInfoWindow = infoWindow;
      });

      makers.push(maker);
      console.log(makers);
      // resultの中には入力された住所の情報が入れられている。
      console.log(result);

      // formatted_addressでresult[0]に入っている住所を取得してくる
      $(".post").text(result[0].formatted_address);
    } else {
      alert(status);
    }
  });
});

$("#clear").click(function () {
  for (var i = 0; i < makers.length; i++) {
    makers[i].setMap(null);
  }
  console.log(makers);
  makers = [];
});

$("#style").change(function () {
  let value = $("option:selected").val();
  map.setMapTypeId(value);
});

$('input[name="str"]').click(() => {
  let result = $('input[name="str"]:checked').val();
  console.log(result);
  if (result == "true") {
    opts = { streetViewControl: true };
    map.setOptions(opts);
  } else if (result == "false") {
    opts = { streetViewControl: false };
    map.setOptions(opts);
  }
});
$('input[name="ful"]').click(() => {
  let result = $('input[name="ful"]:checked').val();
  console.log(result);
  if (result == "true") {
    opts = { fullscreenControl: true };
    map.setOptions(opts);
  } else if (result == "false") {
    opts = { fullscreenControl: false };
    map.setOptions(opts);
  }
});
$('input[name="map"]').click(() => {
  let result = $('input[name="map"]:checked').val();
  console.log(result);
  if (result == "true") {
    opts = { mapTypeControl: true };
    map.setOptions(opts);
  } else if (result == "false") {
    opts = { mapTypeControl: false };
    map.setOptions(opts);
  }
});
$('input[name="zoom"]').click(() => {
  let result = $('input[name="zoom"]:checked').val();
  console.log(result);
  if (result == "true") {
    opts = { zoomControl: true };
    map.setOptions(opts);
  } else if (result == "false") {
    var opts = { zoomControl: false };
    map.setOptions(opts);
  }
});
