/*
Letterboard
A simple On Screen keyboard designed for use in Chrome Kiosk mode
Please lmk of any bugs / features if you plan on using it.

John Sakoutis (johnpsakoutis@gmail.com)
Github: RoundsToThree

Available as Open Source Software (With attribution please if you use it)
July 21st, 2023
*/
var qwertyLayout = {
    standard: [
        ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', '⌫'],
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']'],
        ['a', 's', 'd', 'e', 'f', 'g', 'h', 'j', 'k', 'l', ';', '"'],
        ['⇧', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', '␣'],
    ],
    uppercase: [
        ['~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '⌫'],
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']'],
        ['A', 'S', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', ';', '"'],
        ['⇧', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<', '>', '?', '␣'],
    ]
};
var lb_osk;
var lb_osk_target;
var lb_osk_config;
var defaultLBConfig = {
    x: 'auto',
    y: 'auto',
    w: '80vw',
    h: '60vh',
    layout: qwertyLayout,
    raiseSelected: true,
};
/**
 * Opens the On Screen Keyboard
 * @param {Element} element the element that intended on oepning the OSK
 * @param {LetterBoardConfig} config The config to apply to the OSK
 */
function openOSK(element, config) {
    if (config === void 0) { config = defaultLBConfig; }
    // Close existing OSK
    if (lb_osk != null) {
        lb_osk.remove();
        lb_osk_target.classList.remove('letterBoard-selected');
    }
    // bring the selected item to the top
    lb_osk_target = element;
    lb_osk_target.classList.add('letterBoard-selected');
    // Set the config 
    lb_osk_config = config;
    lb_osk = generateKeyboard();
    // Set position and dimension
    config.w = lb_osk.style.width = config.w === 'auto' ? defaultLBConfig.w : config.w;
    config.h = lb_osk.style.height = config.h === 'auto' ? defaultLBConfig.h : config.h;
    if (config.x == 'auto')
        lb_osk.style.setProperty('left', "calc(".concat(window.innerWidth / 2, "px - ").concat(config.w, "/2)"));
    if (config.y == 'auto')
        lb_osk.style.setProperty('top', "calc(".concat(window.innerHeight / 2, "px - ").concat(config.h, "/2)"));
    document.body.appendChild(lb_osk);
    var clickTarget = document.createElement('div');
    clickTarget.classList.add('letterBoard-clickTarget');
    clickTarget.addEventListener('click', function (event) {
        clickTarget.remove();
        if (lb_osk != null) {
            lb_osk.remove();
            lb_osk_target.classList.remove('letterBoard-selected');
        }
    });
    document.body.appendChild(clickTarget);
}
/**
 * Fired when the letterboard is clicked to modify the selected field
 * @param {MouseEvent} event Event from container's onclick
 */
function letterboardClicked(event) {
    var selectedKey = event.target;
    if (selectedKey instanceof Element && selectedKey.textContent) {
        var selected = selectedKey.textContent;
        switch (selected) {
            case '⇧':
                // Toggle case
                selectedKey.classList.toggle('letterBoard-letterHold');
                letterboardToggleCase();
                return;
            case '␣':
                selected = ' ';
                break;
            case '⌫':
                if (lb_osk_target instanceof HTMLInputElement && lb_osk_target.value.length > 0)
                    lb_osk_target.value = lb_osk_target.value.substring(0, lb_osk_target.value.length - 1);
                else if (lb_osk_target.textContent && lb_osk_target.textContent.length > 0)
                    lb_osk_target.textContent = lb_osk_target.textContent.substring(0, lb_osk_target.textContent.length - 1);
                return;
        }
        if (lb_osk_target instanceof HTMLInputElement)
            lb_osk_target.value += selected;
        else
            lb_osk_target.textContent += selected;
    }
}
/**
 * Generates the elements for the keyboard
 * @returns {HTMLDivElement} The keyboard container
 */
function generateKeyboard() {
    var container = document.createElement('div');
    container.classList.add('letterBoard-container');
    container.addEventListener('click', letterboardClicked);
    container.setAttribute('type', 'standard');
    // Add letters to container
    lb_osk_config.layout.standard.forEach(function (row) {
        var flex = document.createElement('div');
        flex.classList.add('letterBoard-row');
        row.forEach(function (char) {
            var letter = document.createElement('span');
            letter.classList.add('letterBoard-letter');
            letter.textContent = char;
            flex.appendChild(letter);
        });
        container.appendChild(flex);
    });
    return container;
}
/**
 * Toggles the case of the letterboard
 */
function letterboardToggleCase() {
    var isStandard = !(lb_osk.getAttribute('type') === 'standard');
    lb_osk.setAttribute('type', isStandard ? 'standard' : 'uppercase');
    // Change letters in container
    var divs = lb_osk.querySelectorAll('div');
    for (var r = 0; r < divs.length; ++r) {
        var letters = divs[r].querySelectorAll('span');
        for (var c = 0; c < letters.length; ++c) {
            letters[c].textContent = (isStandard ?
                lb_osk_config.layout.standard :
                lb_osk_config.layout.uppercase)[r][c];
        }
    }
}
