const uppercases = "QWERTYUIOPASDFGHJKLZXCVBNM";
const lowercases = "qwertyuiopasdfghjklzxcvbnm";
const chars = "~`!@#$%^&*()_+-=/?><,.;:'\"[]{}\\";
const languages = "àäèéëïĳöüçğıöşüÀÂÆÇÉÈÊËÎÏÔŒÙÛÜŸàâæçéèêëîïôœùûüÿ";
const numbers = "1234567890";

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

function saveOptions() {
    const lenPass = document.getElementById('passLen').value;
    const upper = document.getElementById('upper').checked;
    const nums = document.getElementById('nums').checked;
    const char = document.getElementById('chars').checked;
    const langs = document.getElementById('langs').checked;
    const noIncElem = document.getElementById('noInc').value;
    chrome.storage.sync.set({
        passLen: lenPass,
        upper: upper,
        nums: nums,
        char: char,
        langs: langs,
        noInc: noIncElem
    });
}

function loadOptions() {
    chrome.storage.sync.get({
        passLen: '8',
        upper: false,
        nums: false,
        char: false,
        langs: false,
        noInc: ''
    }, function (items) {
        document.getElementById('passLen').value = items.passLen;
        document.getElementById('upper').checked = items.upper;
        document.getElementById('nums').checked = items.nums;
        document.getElementById('chars').checked = items.char;
        document.getElementById('langs').checked = items.langs;
        document.getElementById('noInc').value = items.noInc;
        document.getElementById('lenVal').value = items.passLen;
    });
}


document.addEventListener('DOMContentLoaded', function () {
    loadOptions();

    const lenPass = document.getElementById('passLen');
    const val = document.getElementById('lenVal');
    const buttonGenPass = document.getElementById('genPass');
    const upper = document.getElementById('upper');
    const nums = document.getElementById('nums');
    const char = document.getElementById('chars');
    const langs = document.getElementById('langs');
    const noIncElem = document.getElementById('noInc');
    const passField = document.getElementById('pass');
    const clicktoC = document.getElementById('clickToC');

    if (buttonGenPass) {
        buttonGenPass.addEventListener('click', function () {
            let noInc = {};
            for (let each of noIncElem.value) {
                noInc[each] = true;
            }
            passField.value = genPassword(upper.checked, nums.checked, char.checked, langs.checked, lenPass.value, noInc);
        });
    }

    if (passField) {
        passField.addEventListener('click', function () {
            navigator.clipboard.writeText(passField.value);
            clicktoC.innerHTML = "Copied!";
        });
        passField.addEventListener('mouseover', function () {
            clicktoC.classList.add('comeback');
            clicktoC.classList.remove('goaway');
            clicktoC.classList.remove('hidden-complete');
        });
        passField.addEventListener("mouseleave", function () {
            clicktoC.classList.add('goaway');
            clicktoC.classList.remove('comeback');
            clicktoC.classList.remove('hidden-complete');
        });
        clicktoC.addEventListener('transitionend', function () {
            if (!clicktoC.classList.contains('comeback')) {
                clicktoC.classList.add('hidden-complete');
                clicktoC.innerHTML = "Click to Copy!";
            }
        });
    }
    
    lenPass.oninput = function () {
        val.value = this.value;
        saveOptions();
    };
    val.oninput = function () {
        lenPass.value = this.value;
        saveOptions();
    };

    upper.addEventListener('change', saveOptions);
    nums.addEventListener('change', saveOptions);
    char.addEventListener('change', saveOptions);
    langs.addEventListener('change', saveOptions);
    noIncElem.addEventListener('input', saveOptions);
    window.addEventListener('beforeunload', saveOptions);
});




