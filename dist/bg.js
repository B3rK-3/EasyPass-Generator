const uppercases = "QWERTYUIOPASDFGHJKLZXCVBNM";
const lowercases = "qwertyuiopasdfghjklzxcvbnm";
const chars = "~`!@#$%^&*()_+-=/?><,.;:'\"[]{}\\";
const languages = "àäèéëïĳöüçğıöşüÀÂÆÇÉÈÊËÎÏÔŒÙÛÜŸàâæçéèêëîïôœùûüÿ";
const numbers = "1234567890";

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "generate-password",
        title: "Generate Password",
        contexts: ["editable"]
    });
});


chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "generate-password") {
        chrome.storage.sync.get({
            passLen: 8,
            upper: false,
            nums: false,
            char: false,
            langs: false,
            noInc: ' '
        }, (items) => {
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: (uppercases, lowercases, chars, languages, numbers, lenPass, upper, nums, char, langs, noIncStr) => {
                    function getRandInt(max) {
                        return Math.floor(Math.random() * max);
                    }

                    function genPassword(upper, nums, char, langs, len, noInc) {
                        let passStr = lowercases;
                        if (upper) {
                            passStr += uppercases;
                        }
                        if (nums) {
                            passStr += numbers;
                        }
                        if (char) {
                            passStr += chars;
                        }
                        if (langs) {
                            passStr += languages;
                        }
                        let pass = '';
                        let n = passStr.length;
                        let i = 0;
                        while (i < len) {
                            let c = passStr[getRandInt(n)];
                            if (!noInc[c]) {
                                pass += c;
                                i++;
                            }
                        }
                        return pass;
                    }

                    const noInc = {};
                    for (let each of noIncStr) {
                        noInc[each] = true;
                    }

                    const password = genPassword(upper, nums, char, langs, lenPass, noInc);
                    const el = document.activeElement;
                    document.execCommand('insertText', false, password);
                    el.dispatchEvent(new Event('change', {bubbles: true}));
                },
                args: [
                    uppercases, lowercases, chars, languages, numbers,
                    items.passLen, items.upper, items.nums, items.char, items.langs, items.noInc
                ]
            });
        });
    }
});
