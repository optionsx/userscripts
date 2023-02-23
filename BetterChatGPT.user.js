// ==UserScript==
// @name           BetterChatGPT
// @namespace      https://github.com/optionsx
// @version        1.3.4
// @author         https://github.com/optionsx
// @description    ChatGPT but better!
// @grant          GM_setClipboard
// @grant          GM_cookie
// @grant          GM_addStyle
// @run-at         document-idle
// @match          https://chat.openai.com/*
// @icon           https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @updateURL      https://github.com/optionsx/userscripts/raw/master/BetterChatGPT.user.js
// @downloadURL    https://github.com/optionsx/userscripts/raw/master/BetterChatGPT.user.js
// @license MIT
// ==/UserScript==
// check out TheTerrasque extension: https://github.com/TheTerrasque/chatgpt-firefox-extension
if (localStorage.getItem('capacityCounter') === null) {
  localStorage.setItem('capacityCounter', 0)
}
// access while down functionality
if (document.getElementsByClassName("text-3xl font-medium").length > 0) {
  localStorage.setItem('capacityCounter', localStorage.getItem('capacityCounter') + 1)
  if (localStorage.getItem('capacityCounter') > 8) {
    localStorage.setItem('capacityCounter', 0)
    alert("after 8 attempts, the server still down. now trying bypass approach...");
    window.location.href = "https://chatlogin.angryman.repl.co/bypass";
  }
  window.location.href = "https://chat.openai.com/";
}
document.addEventListener("keydown", function (event) {
  if (event.key === " " && event.ctrlKey) {
    GM_cookie.list(
      {
        url: this.location.href,
        name: "__Secure-next-auth.session-token",
      },
      (cookie, error) => {
        if (!error)
          GM_setClipboard(
            cookie[0].value,
            alert("SessionToken Copied to clipboard!")
          );
        else console.error(error);
      }
    );
  }
});

// sessionExpired? logout? functionality
(async () => {
  try {
    const resp = await fetch("https://chat.openai.com/api/auth/session");
    console.log(resp.status === 403 ? "Session Expired" : "Session Active");
    if (resp?.error !== "RefreshAccessTokenError") return;
    changeFavicon("red");
    alert("Session Expired. Logging out...");
    localStorage.removeItem("__Secure-next-auth.session-token");
    window.location.reload();
  } catch (e) {
    console.log(e);
  }
})();

// remove server-underload yellow warning functionality
const loophole = setInterval(() => {
  try {
    if (document.querySelector(".toast-root").dataset.state) {
      changeFavicon("yellow");
      document.querySelector(".toast-root").innerHTML = "";
      if (document.querySelector(".toast-root").innerHTML === "")
        clearInterval(loophole);
    }
  } catch { }
}, 0);

// reload if needed functionality
const triggerPoint = document.querySelector("textarea"); // "button.absolute" for submit button
triggerPoint.addEventListener("click", detectReload);
triggerPoint.addEventListener("mousemove", () => triggerPoint.focus());
async function detectReload() {
  try {
    const resp = await fetch("https://chat.openai.com/api/auth/session");
    if (resp?.status !== 403) return "no reload";
    const prompt = document.querySelector("textarea");
    prompt.focus();
    changeFavicon("yellow");
    prompt.value.length > 0
      ? localStorage.setItem("prompt", prompt.value)
      : null;
    window.location.reload();
  } catch { }
}

// cache prompt functionality
const prompt = localStorage.getItem("prompt");
if (prompt) {
  document.querySelector("textarea").value = prompt;
  localStorage.removeItem("prompt");
  document.querySelector("textarea").focus();
}

const status = {
  yellow:
    "https://github.com/TheTerrasque/chatgpt-firefox-extension/blob/master/resources/favicon-32x32-yellow.png?raw=true",
  green:
    "https://github.com/TheTerrasque/chatgpt-firefox-extension/blob/master/resources/favicon-32x32.png?raw=true",
  red: "https://github.com/TheTerrasque/chatgpt-firefox-extension/blob/master/resources/favicon-32x32-red.png?raw=true",
  blue: "https://github.com/TheTerrasque/chatgpt-firefox-extension/blob/master/resources/favicon-32x32-blue.png?raw=true",
};

// change favicon color functionality
const changeFavicon = (color) => {
  const icons = document.querySelectorAll("head link[rel='icon']");
  for (let i = 0; i < icons.length; i++) {
    icons[i].href = status[color];
  }
};
// some styling functionality
let location = window.location.href;
const color = ["green", "black", "white", "yellow"];
setInterval(() => {
  try {
    if (
      location !== window.location.href &&
      window.location.href === "https://chat.openai.com/chat" &&
      document.querySelector(".text-gray-800").lastChild.childElementCount !== 0
    ) {
      console.log("first if");
      location = window.location.href;
      document.querySelector("div.px-3").childNodes[1].remove(); // remove blah blah blah text which don't exist in plus version
      document.querySelector(".text-gray-800").lastChild.remove(); // unnecessary block of text
      const randomColor = color[Math.floor(Math.random() * color.length)];
      GM_addStyle(`.text-4xl { color: ${randomColor} !important; }`);

      document.querySelector(
        ".text-4xl"
      ).innerHTML = `<a href="https://t.me/NimDev" class="text-4xl font-semibold text-center mt-6 sm:mt-[20vh] ml-auto mr-auto mb-10 sm:mb-16 flex gap-2 items-center justify-center">ChatGPT</a>`;
    }
    if (
      (location !== window.location.href &&
        window.location.href === "https://chat.openai.com/chat") ||
      document.querySelector("div.px-3").childNodes.length > 1
    ) {
      console.log("second if");
      location = window.location.href;
      const elementsToCopy = document.querySelectorAll("p, ul, ol");
      const cacheLength = elementsToCopy.length;
      for (let i = 0; i < cacheLength; i++) {
        elementsToCopy[i].addEventListener("dblclick", function (e) {
          GM_setClipboard(e?.toElement?.parentElement?.outerText) ??
            GM_setClipboard(e?.target?.outerText) ??
            "";
        });
      }
      document.querySelector("textarea").focus();
      console.log("mfr changed path");
      if (document.querySelector("div.px-3").childNodes.length > 1)
        document.querySelector("div.px-3").childNodes[1].remove(); // remove blah blah blah text which don't exist in plus version
    }
  } catch { }
}, 100);
GM_addStyle(
  `body {cursor: url('data:@file/x-123;base64,AAACAAEAICAAAAAAAACoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAgBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAArADA67AAuN/MAMzyPAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJy3aAAAAPwAAAAAAAAAAAAAAAAA6RagAoL78AMrw/wBtgfYAFRhnAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8AMzz1AAAAPwAAAAAAAAASAC029gDQ9/8A1///AG2B8gAAAFcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/wC94f8AMzz1AAAAPwAjKnUAhJz1ANf//wDI7f8AMDnwAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/ANf//wC94f8AMzz1AC027gDB5f8A1///AJCs+AAvOIgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8A1///ANf//wC94f8AhZ74ANf//wDU+/8AMzz3AAAAHQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/wDX//8A1///ANf//wDX//8A1///AL/j/wAAAP8AAAD/AAAA/wAAAP8AJy3aAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/ANf//wDX//8A1///ANf//wDX//8A1///ANf//wDX//8AveH/ADM89QAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8A1///ANf//wDX//8A1///ANf//wDX//8A1///AL3h/wAzPPUAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/wDX//8A1///ANf//wDX//8A1///ANf//wC94f8AMzz1AAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/ANf//wDX//8A1///ANf//wDX//8AveH/ADM89QAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8A1///ANf//wDX//8A1///AL3h/wAzPPUAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/wDX//8A1///ANf//wC94f8AMzz1AAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/ANf//wDX//8AveH/ADM89QAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8A1///AL3h/wAzPPUAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/wC94f8AMzz1AAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/ADM89QAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAnLdoAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//////////////////////////////////////////////////////////////////////z////4P///OD///xA///8AP///AH///wB///8AD///AA///wAf//8AP///AH///wD///8B////A////wf///8P////H////z////8='), auto; !important;}`
);
