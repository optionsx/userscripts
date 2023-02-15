// ==UserScript==
// @name         BingCollector
// @version      1.2.1
// @namespace    optionsx
// @description  get bingchat faster, earn points everyday
// @author       github.com/optionsx
// @match        https://www.bing.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM_openInTab
// @grant        GM.openInTab
// @updateURL    https://github.com/optionsx/userscripts/raw/master/bingCollector.user.js
// @downloadURL  https://github.com/optionsx/userscripts/raw/master/bingCollector.user.js
// @license MIT
// ==/UserScript==
(async () => {
  try {
    let maxSearch;
    let searchCount;
    const source = await fetch("https://www.bing.com/rewardsapp/flyout").then(
      (res) => res?.text()
    );
    // regex to get max search count && current search count in the source :)
    const maxRegex = /"max":"(\d+)"/;
    const progressRegex = /"progress":"(\d+)"/;
    const maxMatch = source.match(maxRegex);
    const progressMatch = source.match(progressRegex);
    if (maxMatch && progressMatch) {
      maxSearch = maxMatch[1];
      searchCount = progressMatch[1];
    }
    // fetch random questions
    while (++searchCount < maxSearch) {
      const question = await fetch("https://www.boredapi.com/api/activity")
        .then((res) => res.json())
        .then((res) => res.activity);
      let url = `https://www.bing.com/search?q=${question}`;
      let newTab =
        GM_openInTab(url, { active: false, setParent: true }) ??
        GM.openInTab(url, { active: false, setParent: true });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      newTab.close();
    }
  } catch (err) {
    console.error(err);
  }
})();

// if (await GM.getValue("count") === 0 && await GM.getValue("day") !== day) {
//     const source = await fetch(
//         "https://www.bing.com/rewardsapp/flyoutdata?channel=BingFlyout&partnerId=BingRewards",
//     ).then(res => res?.json())
//     if (source.IsAuthenticated !== true && source.IsRewardsUser !== true && source.IsUnsupportedCountry === false) return; // not logged in or unsupported country
//     // itterate through urlReward bonuses
//     for (let i = 0; i < source.FlyoutResult.MorePromotions.length; i++) {
//         const el = source.FlyoutResult.MorePromotions[i];
//         if (el.Complete !== true && el.IsRewardable === true) {
//             const newTab = GM_openInTab(el.DestinationUrl, { active: false, setParent: true }) ?? GM.openInTab(el.DestinationUrl, { active: false, setParent: true })
//             await new Promise((resolve) => setTimeout(resolve, 1500));
//             newTab.close();
//         }
//     }

// itterate through search bonuses
// for (let i = 0; i < source.FlyoutResult.UserStatus.Counters['PCSearch'].length; i++) {
//     const el = source.FlyoutResult.UserStatus.Counters['PCSearch'][i];
//     if (el.Complete !== true && el.IsRewardable === true && el.PromotionType === "Search") {
//         const newTab = GM_openInTab(el.DestinationUrl, { active: false, setParent: true }) ?? GM.openInTab(el.DestinationUrl, { active: false, setParent: true })
//         await new Promise((resolve) => setTimeout(resolve, 1500));
//         newTab.close();
//     }
// }
