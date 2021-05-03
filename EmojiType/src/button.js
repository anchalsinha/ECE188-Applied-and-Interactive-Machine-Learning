const LOWERCASE = 0;
const UPPERCASE = 1; 

class Button {
    constructor(button, letterButtons, groupLabel) {
        this.button = button;
        this.letterButtons = letterButtons;
        this.groupLabel = groupLabel;

        this.disabled = false;
        this.case = LOWERCASE;
    }

    isLetterGroupButton() {
        return !jQuery.isEmptyObject(this.letterButtons);
    }

    showLetterButtons() {
        if (!this.isLetterGroupButton())
            return;
        this.letterButtons.forEach(button => {
            button.show();
        });
    }

    hideLetterButtons() {
        if (!this.isLetterGroupButton())
            return;
        this.letterButtons.forEach(button => {
            button.hide();
        });
    }

    enableButton() {
        this.groupLabel.show();
        this.disabled = false;
    }

    disableButton(hide) {
        if (hide)
            this.groupLabel.hide();
        this.disabled = true;
    }

    switchCase(force, forceCase) {
        if (this.isLetterGroupButton() || force) {
            if (this.case == UPPERCASE || forceCase == LOWERCASE) {
                if (this.letterButtons) {
                    this.letterButtons.forEach((letterButton) => {
                        letterButton.val(letterButton.val().toLowerCase());
                    });
                }
                this.groupLabel.text(this.groupLabel.text().toLowerCase());
                this.case = LOWERCASE;
            }
            else if (this.case == LOWERCASE || forceCase == UPPERCASE) {
                if (this.letterButtons) {
                    this.letterButtons.forEach((letterButton) => {
                        letterButton.val(letterButton.val().toUpperCase());
                    });
                }
                this.groupLabel.text(this.groupLabel.text().toUpperCase());
                this.case = UPPERCASE;
            }
        }
    }
}