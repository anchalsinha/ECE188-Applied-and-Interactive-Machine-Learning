
var categoryButtonWrapper = $("#categoryButtonContainer");

var categoryButtons = [];
var data = {};

function saveDrawing() {
    const label = emojiUnicode($(this).currText());
    if (!(label in data))
        data[label] = []
    const img = canvas.toDataURL("image/png");
    data[label].push(img);
    const counter = $(this).find("span");
    counter.text(parseInt(counter.text()) + 1);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

$.fn.currText = function() {
    return this.contents().not(this.children()).text();
};

emojiPicker = new emojiButtonList("createCategoryButton", {
    onEmojiClick: createCategory 
});

function createCategory(emojiText) {
    var newCategoryButton = document.createElement("button");
    newCategoryButton.id = "categoryButton";
    newCategoryButton.innerHTML = emojiText;
    newCategoryButton.addEventListener("click", saveDrawing);

    var newCategoryCounter = document.createElement("span");
    newCategoryCounter.id = "categoryButtonCounter";
    newCategoryCounter.innerHTML = "0";

    newCategoryButton.appendChild(newCategoryCounter);
    categoryButtonWrapper.append(newCategoryButton);
}