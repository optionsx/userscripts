// ==UserScript==
// @name           BetterChatGPT
// @namespace      https://github.com/optionsx
// @version        1.0.5
// @author         https://github.com/optionsx
// @description    detects if chatgpt needs refresh, access to chatgpt while down, favicon based on status
// @grant          GM_setClipboard
// @run-at         document-idle
// @match          https://chat.openai.com/*
// @icon           https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @updateURL      https://github.com/optionsx/userscripts/raw/master/BetterChatGPT.user.js
// @downloadURL    https://github.com/optionsx/userscripts/raw/master/BetterChatGPT.user.js
// @license MIT
// ==/UserScript==
// check out TheTerrasque extension: https://github.com/TheTerrasque/chatgpt-firefox-extension

let accessToken = "";
document.addEventListener("keydown", function (event) {
  if (event.key === " " && event.ctrlKey) {
    GM_setClipboard(accessToken, alert("accessToken Copied to clipboard!"));
  }
});
// access while down functionality
if (document.getElementsByClassName("text-3xl font-medium").length > 0)
  location.reload();

// sessionExpired? logout? functionality
(async () => {
  try {
    const resp = await fetch("https://chat.openai.com/api/auth/session");
    console.log(resp.status === 403 ? "Session Expired" : "Session Active");
    if (resp?.error !== "RefreshAccessTokenError") {
      accessToken = await resp?.json().then((data) => data?.accessToken);
      return true;
    }
    changeFavicon("red");
    alert("Session Expired. Logging out...");
    localStorage.removeItem("__Secure-next-auth.session-token");
    location.reload();
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
  } catch {}
}, 0);

// reload if needed functionality && copy to clipboard
const triggerPoint = document.querySelector("textarea"); // "button.absolute" for submit button
triggerPoint.addEventListener("click", detectReload);
triggerPoint.addEventListener("mousemove", () => triggerPoint.focus());
async function detectReload() {
  try {
    const resp = await fetch("https://chat.openai.com/api/auth/session");
    console.log(resp?.status === 403 ? "reload" : "no reload");
    if (resp?.status !== 403) return "no reload";
    const prompt = document.querySelector("textarea").value;
    changeFavicon("yellow");
    prompt.length > 0 ? localStorage.setItem("prompt", prompt) : null;
    location.reload();
  } catch {}
}

// cache prompt functionality
setTimeout(() => {
  const prompt = localStorage.getItem("prompt");
  if (prompt) {
    document.querySelector("textarea").value = prompt;
    localStorage.removeItem("prompt");
    document.querySelector("textarea").focus();
  }
}, 500);

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
const color = ["green", "black", "white", "yellow"];
setInterval(() => {
  try {
    const randomColor = color[Math.floor(Math.random() * color.length)];
    if (
      document.querySelector(".text-4xl")?.innerHTML &&
      document.querySelector(".text-4xl")?.innerHTML !==
        `<a href="https://t.me/NimDev" class="text-4xl font-semibold text-center mt-6 sm:mt-[20vh] ml-auto mr-auto mb-10 sm:mb-16 flex gap-2 items-center justify-center">ChatGPT</a>`
    )
      document.querySelector(
        ".text-4xl"
      ).innerHTML = `<a href="https://t.me/NimDev" class="text-4xl font-semibold text-center mt-6 sm:mt-[20vh] ml-auto mr-auto mb-10 sm:mb-16 flex gap-2 items-center justify-center">ChatGPT</a>`;
    addCss(`.text-4xl { color: ${randomColor} !important; }`); // nice color right?
    if (document.querySelector("div.px-3").childNodes.length > 1)
      document.querySelector("div.px-3").childNodes[1].remove(); // remove blah blah blah text which don't exist in plus version
    if (document.querySelector(".text-gray-800").childElementCount > 1)
      document.querySelector(".text-gray-800").lastChild.remove(); // unnecessary block of text
    //if (document.querySelector(".text-4xl").textContent === "ChatGPT") document.querySelector(".text-4xl").textContent = 'ChadGPT' // xD
  } catch (e) {
    console.log(e);
  }
}, 1500);
function addCss(cssString) {
  var head = document.getElementsByTagName("head")[0];
  var newCss = document.createElement("style");
  newCss.type = "text/css";
  newCss.innerHTML = cssString;
  head.appendChild(newCss);
}
