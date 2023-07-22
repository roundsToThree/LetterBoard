/*
Letterboard
A simple On Screen keyboard designed for use in Chrome Kiosk mode
Please lmk of any bugs / features if you plan on using it.

John Sakoutis (johnpsakoutis@gmail.com)
Github: RoundsToThree

Available as Open Source Software (With attribution please if you use it)
July 21st, 2023
*/

interface LetterBoardConfig {
    x: string,
    y: string,
    w: string,
    h: string,
    layout: LetterBoardLayout,
}

interface LetterBoardLayout {
    'standard': string[][],
    'uppercase': string[][],
}

const qwertyLayout: LetterBoardLayout = {
    standard: [
        ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', '⌫'],
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']'],
        ['a', 's', 'd', 'e', 'f', 'g', 'h', 'j', 'k', 'l', ';', '"'],
        ['⇧', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
    ],
    uppercase: [
        ['~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '⌫'],
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']'],
        ['A', 'S', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', ';', '"'],
        ['⇧', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<', '>', '?'],
    ]
};

let lb_osk: HTMLDivElement;
let lb_osk_target: Element;
let lb_osk_config: LetterBoardConfig;

const defaultLBConfig = {
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
function openOSK(element: Element, config: LetterBoardConfig = defaultLBConfig) {
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
        lb_osk.style.setProperty('left', `calc(${window.innerWidth / 2}px - ${config.w}/2)`);

    if (config.y == 'auto')
        lb_osk.style.setProperty('top', `calc(${window.innerHeight / 2}px - ${config.h}/2)`);

    document.body.appendChild(lb_osk);

    const clickTarget = document.createElement('div');
    clickTarget.classList.add('letterBoard-clickTarget');
    clickTarget.addEventListener('click', (event: MouseEvent) => {
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
function letterboardClicked(event: MouseEvent) {
    const selectedKey: EventTarget | null = event.target;

    if (selectedKey instanceof Element && selectedKey.textContent) {
        const selected: string = selectedKey.textContent;



        switch (selected) {
            case '⇧':
                // Toggle case
                selectedKey.classList.toggle('letterBoard-letterHold');
                letterboardToggleCase();
                return;
            case '⌫':
                if (lb_osk_target instanceof HTMLInputElement && lb_osk_target.value.length > 0)
                    lb_osk_target.value = lb_osk_target.value.substring(0, lb_osk_target.value.length - 1);
                else if (lb_osk_target.textContent && lb_osk_target.textContent.length > 0)
                    lb_osk_target.textContent = lb_osk_target.textContent.substring(0, lb_osk_target.textContent.length - 1);

                return;
        }

        if (lb_osk_target instanceof HTMLInputElement)
            lb_osk_target.value += selectedKey.textContent;
        else
            lb_osk_target.textContent += selectedKey.textContent;

    }
}

/**
 * Generates the elements for the keyboard
 * @returns {HTMLDivElement} The keyboard container
 */
function generateKeyboard(): HTMLDivElement {
    let container: HTMLDivElement = document.createElement('div');
    container.classList.add('letterBoard-container');
    container.addEventListener('click', letterboardClicked);
    container.setAttribute('type', 'standard');

    // Add letters to container
    lb_osk_config.layout.standard.forEach((row) => {
        let flex: HTMLDivElement = document.createElement('div');
        flex.classList.add('letterBoard-row');

        row.forEach((char) => {
            let letter = document.createElement('span');
            letter.classList.add('letterBoard-letter');
            letter.textContent = char;
            flex.appendChild(letter);
        })

        container.appendChild(flex);
    })

    return container;

}

/**
 * Toggles the case of the letterboard
 */
function letterboardToggleCase() {
    const isStandard: boolean = !(lb_osk.getAttribute('type') === 'standard');

    lb_osk.setAttribute('type', isStandard ? 'standard' : 'uppercase');

    // Change letters in container
    const divs: NodeListOf<HTMLDivElement> = lb_osk.querySelectorAll('div');
    for (let r = 0; r < divs.length; ++r) {
        const letters: NodeListOf<HTMLSpanElement> = divs[r].querySelectorAll('span');
        for (let c = 0; c < letters.length; ++c) {
            letters[c].textContent = (isStandard ?
                lb_osk_config.layout.standard :
                lb_osk_config.layout.uppercase
            )[r][c];
        }

    }
}