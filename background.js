let limits = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];

// let interval = null;
// let isStarted = false;

// const link = "https://www.google.hu/aa";

// function start_opening_links() {
//   console.log(link);

//   var good_url_regex = new RegExp(
//     /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi
//   );

//   function update_page() {
//     chrome.tabs.update({
//       url: link,
//     });
//   }

//   // const timeout = $("#timeout").val() * 1000;
//   timeout = 3000;

//   if (link.match(good_url_regex) && isStarted) {
//     // document.getElementById("start").innerHTML = "Stop";
//     interval = setInterval(update_page(), timeout);
//   } else if (!isStarted) {
//     // stop_interval();
//     // document.getElementById("start").innerHTML = "Start";
//   } else {
//     alert("Hibás linket adtál meg!");
//   }
// }

// chrome.runtime.onMessage.addListener(function (message, sender, reply) {
//   isStarted = true;
//   start_opening_links();
// });

// function stop_interval() {
//   clearInterval(interval);
// }

let alphanum = [];
for (let i = 0; i < limits.length; i++) {
  for (let j = 0; j < limits.length; j++) {
    alphanum.push(limits[i] + limits[j]);
  }
}
console.log(alphanum);

var interval;
var repeater;
var start, end;
var completed = false;

function changePage(newUrl) {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tab) {
    console.log(newUrl);
    chrome.tabs.update(tab.id, {
      url: newUrl,
    });
  });
}

function update_page(data) {
  let newUrl = data.url.slice(0, -2) + alphanum[start];
  if (start === end) {
    completed = true;
    changePage(newUrl);
    return;
  } else {
    changePage(newUrl);
  }

  // a felsorolas sorrendjenek eldontese
  if (data.start[0] < data.end[0]) {
    start++;
  } else if (data.start[0] === data.end[0]) {
    if (data.start[1] < data.end[1]) {
      start++;
    } else {
      start--;
    }
  } else {
    start--;
  }
}

chrome.extension.onConnect.addListener(function (port) {
  port.onMessage.addListener(function (msg) {
    console.log(msg);
    if (msg !== "stop") {
      start = alphanum.findIndex((e) => e === msg.start);
      end = alphanum.findIndex((e) => e === msg.end);
      (function a() {
        if (!completed) {
          update_page(msg);
          repeater = setTimeout(a, msg.timeout);
        } else {
          clearInterval(repeater);
        }
      })();
    } else {
      clearInterval(repeater);
    }
  });
});
