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
        chrome.storage.sync.get(['passLen', 'upper', 'nums', 'char', 'langs', 'noInc'], (items) => {
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
                    if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) {
                        const [start, end] = [el.selectionStart, el.selectionEnd];
                        if (typeof el.setRangeText === 'function') {
                            el.setRangeText(password, start, end, 'select');
                        } else {
                            const value = el.value;
                            el.value = value.slice(0, start) + password + value.slice(end);
                            el.setSelectionRange(start + password.length, start + password.length);
                        }
                    }
                },
                args: [
                    uppercases, lowercases, chars, languages, numbers,
                    items.passLen, items.upper, items.nums, items.char, items.langs, items.noInc
                ]
            });
        });
    }
});
