// ==UserScript==
// @name         HighQualityOnly
// @version      0.1
// @description  selects The highest quality in Youtube
// @author       chzu
// @run-at       document-idle
// @match        *.youtube.com/watch?v=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// ==/UserScript==
const player = document.querySelector('#movie_player, .html5-video-player');
player?.setPlaybackQualityRange("highres")
player?.setPlaybackQuality('highres');
player?.setPlaybackQualityRange(player.getPlaybackQuality())
player?.setPlaybackQuality(player.getPlaybackQuality());
