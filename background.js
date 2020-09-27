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
    console.log(tab);
    console.log(newUrl);
    chrome.tabs.update(tab.id, {
      url: newUrl,
    });
  });
}

function update_page(data) {
  let newUrl = data.url + alphanum[start];
  if (start === end) {
    completed = true;
    changePage(newUrl);
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

chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(function (msg) {
    console.log(msg);
    if (msg !== "stop") {
      completed = false;
      start = alphanum.findIndex((e) => e === msg.start);
      end = alphanum.findIndex((e) => e === msg.end);
      console.log(start, end);
      console.log(completed);
      console.log(msg);
      (function a() {
        if (!completed && msg !== "stop") {
          console.log(completed);
          update_page(msg);
          repeater = setTimeout(a, msg.timeout);
        } else {
          clearInterval(repeater);
        }
      })();
    } else if (msg === "stop") {
      completed = true;
      clearInterval(repeater);
    }
  });
});
