function send_ajax(keyName, value, area, html, find) {
  /**
   * オブジェクトキーを変数にする場合、定義時に[]でkeyになる変数を指定すればちゃんと展開される。
   */
  const val = value;
  const key = keyName;
  console.log(val, key);
  // 例：15,reg

  $.ajax({
    url: "jaran-2.php",
    data: {
      [key]: value,
    },
    type: "GET",
  })

    .done((data, type) => {
      if (key != "s_area") {
        done_other(data, area, html, find);
      } else {
        done_first(data, val);
      }
    })
    .fail((XMLHttpRequest, textStatus, errorThrown) => {
      $(area).text(textStatus);
      console.log(textStatus);
    });
}

window.onload = send_ajax(
  "reg",
  "",
  "#jaranregion",
  "------地域を選択してください----",
  "Region"
);

$("#jaranregion").change(function () {
  $("#jaranprefecture").empty();
  $("#jaranlargearea").empty();
  $("#jaransmallarea").empty();
  send_ajax(
    "reg",
    $(this).val(),
    "#jaranprefecture",
    "---都道府県を選択してください---",
    "Prefecture"
  );
});
$("#jaranprefecture").change(function () {
  $("#jaranlargearea").empty();
  $("#jaransmallarea").empty();
  send_ajax(
    "pref",
    $(this).val(),
    "#jaranlargearea",
    "---大エリアを選択してください---",
    "LargeArea"
  );
});
$("#jaranlargearea").change(function () {
  $("#jaransmallarea").empty();
  send_ajax(
    "l_area",
    $(this).val(),
    "#jaransmallarea",
    "---小エリアを選択してください---",
    "SmallArea"
  );
});
$("#jaransmallarea").change(function () {
  send_ajax("s_area", $(this).val(), "", "", "");
});

function done_first(data, val) {
  var map;
  let dom = new DOMParser();
  let value = "https://www.drk7.jp/weather/xml/" + val.substr(0, 2) + ".xml";
  fetch("jaran-2.php?weather=" + value)
    .then((response) => response.text())
    .then((text) => (res = dom.parseFromString(text, "text/html")))
    .then((res) => {
      console.log(res);
      let WeatherName = res.getElementsByTagName("weatherforecast")[0];
      let wtCon = WeatherName.children[6].children[2];
      // xmlをテキスト化
      let parse = new XMLSerializer();
      let weatherPrefName = WeatherName.children[6].id;
      let weatherInfo = parse.serializeToString(wtCon.children[0]);
      let weatherMax = parse.serializeToString(wtCon.children[4].children[0]);
      let weatherMin = parse.serializeToString(wtCon.children[4].children[1]);

      const HTML = document.getElementById("weather");
      if (document.getElementById("wtCon")) {
        document.getElementById("wtCon").remove();
      }
      let section = document.createElement("section");
      section.setAttribute("id", "wtCon");
      HTML.appendChild(section);
      // テキスト化した文章をID名:weatherの場所に挿入する
      section.insertAdjacentHTML(
        "beforeend",
        "<h1>" +
          weatherPrefName +
          "</h1>" +
          "<ul class='temp'>" +
          "<li>予報：" +
          weatherInfo +
          "</li>" +
          "<li class='weatherRed'>最高温度：" +
          "<span>" +
          weatherMax +
          "</span>" +
          "度</li>" +
          "<li class='weatherBlue'>最低温度：" +
          "<span>" +
          weatherMin +
          "</span>" +
          "度</li>" +
          "</ul>"
      );
    });
  console.log(value);
  $("#Document").empty();
  iniMap();
  let funcArray = [];
  let i = 0;
  $(data)
    .find("Hotel")
    .each(function () {
      let HotelName = $(this).find("HotelName").text();
      let HotelDetailURL = $(this).find("HotelDetailURL").text();
      let HotelCatchCopy = $(this).find("HotelCatchCopy").text();
      let HotelCaption = $(this).find("HotelCaption").text();
      let PictureURL = $(this).find("PictureURL").text();
      let x = $(this).find("X").text();
      let y = $(this).find("Y").text();
      funcArray[i] = HotelName;
      $("#Document").append(
        "<section>" +
          "<h1>" +
          HotelName +
          "</h1>" +
          "<p>" +
          HotelCatchCopy +
          "</p>" +
          "<p>" +
          HotelCaption +
          "</p>" +
          "<p>" +
          "<img src='" +
          PictureURL +
          "'>" +
          "</p>" +
          "<p>" +
          "<a href='" +
          HotelDetailURL +
          "' target='blank'> " +
          "オフィシャルサイト" +
          "</a>" +
          "</p>" +
          "</section>"
      );
      i++;
    });
  function setMaker(value) {
    return new Promise((resolve, reject) => {
      viewMap(value);
      resolve();
    });
  }

  console.log(funcArray);
  let resultArray = [];
  for (let j = 0; j < funcArray.length; j++) {
    resultArray.push(setMaker(funcArray[j]));
  }
  Promise.all(resultArray).then(function () {
    var sw = new google.maps.LatLng(latitudeMax, longitudeMin);
    var ne = new google.maps.LatLng(latitudeMin, longitudeMax);
    var bounds = new google.maps.LatlngBounds(sw, ne);
    map.fitBounds(bounds);
  });
}

function done_other(data, area, html, find) {
  $(area).append($("<option>").html(html).val(0));
  $(data)
    .find(find)
    .each((index, element) => {
      const cdTxt = $(element).attr("cd");
      const nameTxt = $(element).attr("name");
      $(area).append($("<option>").html(nameTxt).val(cdTxt));
    });
}

function iniMap() {
  var opts = {
    zoom: 10,
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
}

function viewMap(HotelName) {
  let con = HotelName;
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
      // resultの中には入力された住所の情報が入れられている。

      // formatted_addressでresult[0]に入っている住所を取得してくる
      $(".post").text(result[0].formatted_address);
    } else {
      alert(status);
    }
  });
}
