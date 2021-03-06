const maxRot = 10;
const minRot = -10;
const stepRot = 4;

function transformDrawing(base64data, angle) {
    var transformCanvas = document.createElement("canvas");
    transformCanvas.width = 150;
    transformCanvas.height = 150;
    var transformCtx = transformCanvas.getContext("2d");

    var image = new Image();
    image.src = base64data;
    return new Promise(resolve => {
        image.onload = function () {
            transformCtx.translate(image.width / 2, image.height / 2);
            const rad = angle * Math.PI / 180;
            transformCtx.rotate(rad);
            transformCtx.drawImage(image, -image.width / 2, -image.width / 2, image.width, image.height);

            resolve(transformCanvas.toDataURL("image/png"));
        };
    });
}

async function augmentData() {
    for (const key of Object.keys(data)) {
        await Promise.all(data[key].map(async img => {
            let transformed = [];
            for (let rot = minRot; rot <= maxRot; rot += stepRot) {
                const transformedImg = await transformDrawing(img, rot);
                transformed.push(transformedImg);
            }
            data[key] = data[key].concat(transformed);
        }));
    }
}

// https://stackoverflow.com/questions/48419167/how-to-convert-one-emoji-character-to-unicode-codepoint-number-in-javascript
function emojiUnicode(emoji) {
    var comp;
    if (emoji.length === 1) {
        comp = emoji.charCodeAt(0);
    }
    comp = (
        (emoji.charCodeAt(0) - 0xD800) * 0x400
        + (emoji.charCodeAt(1) - 0xDC00) + 0x10000
    );
    if (comp < 0) {
        comp = emoji.charCodeAt(0);
    }
    return comp.toString("16");
};

// Export all image data into organized dataset
$("#exportButton").click(async function () {
    var zip = new JSZip();
    await augmentData();

    console.log(data);
    Object.keys(data).forEach(function (key) {
        let counter = 0;
        const name = key;
        let folder = zip.folder(name);

        data[key].forEach(function (img) {
            folder.file(`${counter}.png`, img.split('base64,')[1], { base64: true });
            counter++;
        });
    });

    zip.generateAsync({ type: "blob" })
        .then(function (content) {
            saveAs(content, "data.zip");
        });
});