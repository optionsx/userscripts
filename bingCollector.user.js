// ==UserScript==
// @name         BingCollector
// @version      0.6
// @namespace    optionsx
// @description  get bingchat faster, earn points everyday
// @author       github.com/optionsx
// @match        https://www.bing.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM_openInTab
// @grant        GM.openInTab
// @require      file://C:\bingCollector.user.js
// @license MIT
// ==/UserScript==
(async () => {
    const day = new Date().getDay();
    if (await GM.getValue("count") === undefined) await GM.setValue("count", 0);
    if (await GM.getValue("day") === undefined) await GM.setValue("day", day);
    while (await GM.getValue("count") < 30 && await GM.getValue("day") === day) {
        const count = await GM.getValue("count");
        await GM.setValue("count", count + 1);

        const question = await fetch("https://www.boredapi.com/api/activity").then(
            (res) => res.json(),
        ).then((res) => res.activity);

        let url = `https://www.bing.com/search?q=${question}`;
        let newTab = GM_openInTab(url, { active: false, setParent: true }) ?? GM.openInTab(url, { active: false, setParent: true })

        if (await GM.getValue("count") === 30) {

            if (day === 6) await GM.setValue("day", 0);
            else await GM.setValue("day", day + 1);
            await GM.setValue("count", 0);
        }

        await new Promise((resolve) => setTimeout(resolve, 1500));
        newTab.close();
    }
    // collect bonuses in drop - down menu
    if (await GM.getValue("count") === 0 && await GM.getValue("day") !== day) {
        try {
            while (document.getElementById("id_rh").attributes['aria-expanded'].textContent !== "true") {
                document.getElementById("id_rh").click();
                await new Promise(resolve => setTimeout(resolve, 3000));
                for (let i = 0; i < document.getElementsByClassName("l_s l_s_b")[0].attributes[0].ownerDocument.links.length; i++) {
                    const link = document.getElementsByClassName("l_s l_s_b")[0].attributes[0].ownerDocument.links[i].href;
                    let newTab = window.open(link);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    newTab.close();

                }
            }
        } catch (e) { console.log(e) }
    }

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

})();