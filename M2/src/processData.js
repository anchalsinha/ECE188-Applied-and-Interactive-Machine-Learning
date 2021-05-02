const maxRot = 10;
const minRot = -10;
const stepRot = 4;

function transformDrawing(base64data, angle) {
    var transformCanvas = document.createElement("canvas");
    transformCanvas.width = 256;
    transformCanvas.height = 256;
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

$("#importButton").click(async function () {
    data = await new JSZip.external.Promise(function (resolve, reject) {
        JSZipUtils.getBinaryContent('../data/data.zip', function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    }).then(data => {
        return JSZip.loadAsync(data);
    }).then(zip => {
        let importData = {}
        let total = Object.keys(zip.files).length;
        let counter = 0;
        return new Promise(async (resolve, reject) => {
            zip.forEach((path, file) => {
                const [label, filename] = path.split('/');
                if (!file.dir) { //check if file or dir
                    if (!(label in importData)) {
                        importData[label] = []
                        createCategory(String.fromCodePoint(parseInt (label, 16)));
                    }
                    file.async('base64').then(contents => {
                        importData[label].push(contents);
                        counter += 1;
                        if (counter == total) {
                            console.log("Resolving");
                            resolve(importData);
                        }
                    });
                }
                else
                    counter += 1;
            });
        });
    });
});