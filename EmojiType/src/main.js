
var emojiCanvas = $('#emojiCanvas')[0];
emojiCanvas.style.display = 'none';
var keyboard = $('#keyboard')[0];
var currentKeyboard = 0; //0 for alphabet, 1 for emoji

const input = $("#inputText");

var prevCase = "ABC";

var currentLine = []

buttons = {}

function disableButtons(id, hide) {
    for (const [key, value] of Object.entries(buttons)) {
        if (key != id)
            value.disableButton(hide);
    }
}

function resetButtons() {    
    for (const [key, value] of Object.entries(buttons)) {
        value.hideLetterButtons();
        value.enableButton();
    }
}

function switchCase(id) {
    let letterCase = 0;
    for (const [key, value] of Object.entries(buttons)) {
        value.switchCase();
        if (value.isLetterGroupButton()) 
            letterCase = value.case;
    }
    buttons[id].switchCase(true, !letterCase);
}

// add text and letter buttons for each group button and store
$(".groupButton").each(function() {
    const id = $(this).attr('id');
    letterButtons = [];
    for (const c of id) {
        const letter = $('<input>').attr({
            type: 'button',
            class: 'ui-button ui-widget letterButton',
            value: c
        });
        letter.appendTo($(this));
        letterButtons.push(letter);
    }
    const label = $('<span>').attr({
        class: 'buttonLabel'
    }).text(id);
    label.appendTo($(this));

    let b = new Button($(this), letterButtons, label);
    b.hideLetterButtons();
    buttons[id] = b;
});

$(".utilityButton").each(function() {
    const id = $(this).attr('id');
    let text = id;
    if (id == "back")
        text = "<";
    else if (text == 'emoji') 
        text = '😀';
    const label = $('<span>').attr({
        class: 'buttonLabel'
    }).text(text);
    label.appendTo($(this));

    let b = new Button($(this), null, label);
    buttons[id] = b;
});

function inputTextAppend(s) {
    currentLine.push(s);
    input.val('\u200E' + currentLine.join('\u200E') + '\u200E');
}
function inputTextDelete() {
    currentLine.pop();
    input.val('\u200E' + currentLine.join('\u200E') + '\u200E');
}


// Handle all mouse events
$('button').on('mousedown', function(e) {
    const element = $(e.target);
    const id = element.attr('id');
    let hide = true;
    if (element.hasClass('groupButton'))
        buttons[id].showLetterButtons();
    else
        hide = false;
    disableButtons(id, hide);
    
});
$(document).on('mouseup', function(e) {
    const element = $(e.target);
    const id = element.attr('id');

    // append letters to the text box
    if (element.hasClass('letterButton')) {
        inputTextAppend(element.attr('value'));
    }
    else if (id == 'Space' && !buttons[id].disabled) {
        inputTextAppend(' ');
    }
    else if (id == 'back' && !buttons[id].disabled) {
        inputTextDelete();
    }
    else if (id == 'ABC' && !buttons[id].disabled) {
        if (currentKeyboard == 0) {
            switchCase(id);
        } else if (currentKeyboard == 1) {
            clearDrawing();
        }
    }
    else if (id == 'emoji' && !buttons[id].disabled) {
        btn = buttons['ABC'];
        if (currentKeyboard == 0) {
            emojiCanvas.style.display = 'block';
            keyboard.style.display = 'none';
            element.text("abc");
            prevCase = btn.groupLabel.text();
            btn.groupLabel.text("Clear");
            currentKeyboard = 1;
        } else if (currentKeyboard == 1) {
            emojiCanvas.style.display = 'none';
            keyboard.style.display = 'inline-flex';
            element.text('😀');
            btn.groupLabel.text(prevCase);
            currentKeyboard = 0;
        }
    }
    resetButtons();
});
$('#inputText').on('keypress', function(e) {
    e.preventDefault();
    return false;
});