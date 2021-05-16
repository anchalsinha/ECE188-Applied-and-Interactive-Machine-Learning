
// Code adapted from Google Teachable Machine reference
// https://teachablemachine.withgoogle.com/train/image

const URL = "../model/";
const predictionThreshold = 0.95;
const continuousPredictionMs = 500;
let continuousPredictionStart, repeat;
let previousClassPrediction;

let model, webcam, labelContainer, maxPredictions;
const canvasLength = 150;

// Load the image model and setup the webcam
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // or files from your local hard drive
    // Note: the pose library adds "tmImage" object to your window (window.tmImage)
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Convenience function to setup a webcam
    const flip = true; // whether to flip the webcam
    webcam = new tmImage.Webcam(canvasLength, canvasLength, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    // append elements to the DOM
    document.getElementById("webcamContainer").appendChild(webcam.canvas);
    // labelContainer = document.getElementById("label-container");
    // for (let i = 0; i < maxPredictions; i++) { // and class labels
    //     labelContainer.appendChild(document.createElement("div"));
    // }
}

async function loop() {
        webcam.update(); // update the webcam frame
        if (currentKeyboard == 1) {
            await predict();
        }
        window.requestAnimationFrame(loop);
}

// run the webcam image through the image model
async function predict() {
    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = prediction[i].probability.toFixed(2);
        if (classPrediction > predictionThreshold) {
            if (i != previousClassPrediction) {
                previousClassPrediction = i;
                repeat = false;
                continuousPredictionStart = Date.now();
            }
            else if (!repeat && Date.now() - continuousPredictionStart > continuousPredictionMs) {
                addEmojiText(i);
                repeat = true;
            }
        }
    }
}

function addEmojiText(id) {
    console.log("Predicted: " + id);
    switch (id) {
        case 0:
            inputTextAppend('😀');
            break;
        case 1:
            inputTextAppend('🙁');
            break;
        case 2:
            inputTextAppend('😐');
            break;
        case 3:
            inputTextAppend('👍');
            break;
        case 4:
            inputTextAppend('👎');
            break;
        case 5:
            inputTextAppend('👌');
            break;
        case 7:
            console.log("neutral");
            break;
    }
}

init();