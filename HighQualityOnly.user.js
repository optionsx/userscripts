// ==UserScript==
// @name         HighQualityOnly
// @version      0.1
// @description  selects The highest quality in Youtube
// @author       chzu
// @run-at       document-idle
// @match        https://*.youtube.com/watch?v=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// ==/UserScript==

const player = document.querySelector("#movie_player, .html5-video-player");
const quality = player.getAvailableQualityLevels();
setInterval(_ => {
  player.getPlaybackQuality !== quality[0]&&
    player.setPlaybackQuality(quality[0],
    player.setPlaybackQualityRange(quality[0]));
}, 5000);
