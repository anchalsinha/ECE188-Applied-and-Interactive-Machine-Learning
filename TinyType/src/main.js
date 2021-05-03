
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
    const label = $('<span>').attr({
        class: 'buttonLabel'
    }).text(text);
    label.appendTo($(this));

    let b = new Button($(this), null, label);
    buttons[id] = b;
});


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
    const input = $("#inputText");
    if (element.hasClass('letterButton')) {
        input.val(input.val() + element.attr('value'));
    }
    else if (id == 'Space' && !buttons[id].disabled) {
        input.val(input.val() + ' ');
    }
    else if (id == 'back' && !buttons[id].disabled) {
        input.val(input.val().substring(0, input.val().length-1));
    }
    else if (id == 'ABC' && !buttons[id].disabled) {
        switchCase(id);
    }
    else if (id == 'Submit' && !buttons[id].disabled) {
        const res = input.val();
        input.val('');
        alert(res);
    }
    resetButtons();
});
$('#inputText').on('keypress', function(e) {
    e.preventDefault();
    return false;
});