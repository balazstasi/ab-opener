document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("start").addEventListener("click", start);
  document.getElementById("stop").addEventListener("click", stop);
});

var port = chrome.runtime.connect({
  name: "opener",
});

function start(event) {
  event.preventDefault();
  let timeout = document.getElementById("timeout").value * 1000;
  let url = document.getElementById("url").value;
  let start = document.getElementById("st").value;
  let end = document.getElementById("end").value;
  var good_url_regex = new RegExp(
    /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi
  );
  var alphanumeric_string_regex = new RegExp(/^[a-z0-9]+$/i);
  if (url && timeout && start && end) {
    if (url.match(good_url_regex)) {
      if (
        start.match(alphanumeric_string_regex) &&
        end.match(alphanumeric_string_regex)
      ) {
        if (start.length < 2 || end.length < 2) {
          alert(
            "Hibás intervallumot adtál meg. Az intervallum tagjai mindkettő 2 karakterből kell hogy álljon!"
          );
        } else {
          port.postMessage({ timeout, url, start, end });
          port.onMessage.addListener(function (msg) {
            console.log("message recieved: " + msg);
          });
        }
      } else {
        alert(
          "Helytelen intervallumot adtál meg. A Kezd és Befejez mezők mindkettő 2-2 alfanumerikus karakterből kell álljon."
        );
      }
    } else {
      alert("Helytelen weboldal. Kérlek ellenőrizd!");
    }
  } else {
    alert("Kérlek tölts ki minden mezőt!");
  }
}

function stop(event) {
  event.preventDefault();
  port.postMessage("stop");
  port.onMessage.addListener(function (msg) {
    console.log("message recieved: " + msg);
  });
}

window.onblur = function () {
  port.postMessage("stop");
  port.onMessage.addListener(function (msg) {
    console.log("message received: " + msg);
  });
};
