<script lang="ts">
  // Import dependencies
  import { Button, RadioGroup, Card } from "attractions";
  const { desktopCapturer } = require("electron");
  const Jimp = require("jimp");

  let screenshotImage = null;
  let screenshotImageEncoded = null;
  let selectedScreenshotSource = null;
  let originalScreenshotDimensions: Int[] = [0, 0];
  let croppedImage = null;
  let items = [{ value: "1", label: " " }];

  let getScreenshotSources = () => {
    return new Promise((resolve, reject) => {
      desktopCapturer
        .getSources({ types: ["window", "screen"] })
        .then(async (sources) => {
          return resolve(sources);
        });
    });
  };

  getScreenshotSources().then((sources) => {
    console.log(sources);
    items = sources.map(({ id, name }) => {
      return { value: id, label: name };
    });
  });

  function fullscreenScreenshot(callback, imageFormat) {
    imageFormat = imageFormat || "image/jpeg";

    let handleStream = (stream) => {
      // Create hidden video tag
      var video = document.createElement("video");
      video.style.cssText = "position:absolute;top:-10000px;left:-10000px;";

      // Event connected to stream
      video.onloadedmetadata = function () {
        // Set video ORIGINAL height (screenshot)
        video.style.height = this.videoHeight + "px"; // videoHeight
        video.style.width = this.videoWidth + "px"; // videoWidth

        video.play();

        // Create canvas
        var canvas = document.createElement("canvas");
        canvas.width = this.videoWidth;
        canvas.height = this.videoHeight;
        var ctx = canvas.getContext("2d");
        // Draw video on canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        if (callback) {
          // Save screenshot to base64
          //   screenshotImage = canvas.toDataURL(imageFormat);
          callback(canvas.toDataURL(imageFormat));
        } else {
          console.log("Need callback!");
        }

        // Remove hidden video tag
        video.remove();
        try {
          // Destroy connect to stream
          stream.getTracks()[0].stop();
        } catch (e) {}
      };

      video.srcObject = stream;
      document.body.appendChild(video);
    };

    let handleError = (e) => {
      console.log({ message: "Handle error", e });
    };

    desktopCapturer
      .getSources({ types: ["window", "screen"] })
      .then(async (sources) => {
        console.log({ sources });

        for (const source of sources) {
          // Filter: main screen
          if (
            source.name === "Entire Screen" ||
            source.name === "Screen 1" ||
            source.name === "Screen 2"
          ) {
            try {
              const stream = await navigator.mediaDevices.getUserMedia({
                audio: false,
                video: {
                  mandatory: {
                    chromeMediaSource: "desktop",
                    chromeMediaSourceId: selectedScreenshotSource,
                    minWidth: 1280,
                    maxWidth: 4000,
                    minHeight: 720,
                    maxHeight: 4000,
                  },
                },
              });
              console.log(" take screenshot");
              handleStream(stream);
            } catch (e) {
              handleError(e);
            }
          }
        }
      });
  }

  async function crop(screenshot) {
    const image = await Jimp.read(screenshotImageEncoded);

    const crop = await image
      .crop(100, 50, 470, 270)
      .getBase64Async("image/png");

    // Update interface with cropped image
    croppedImage = crop;
  }

  function takeScreenshot() {
    fullscreenScreenshot(async (base64) => {
      screenshotImage = base64;
      await crop(base64);

      // Convert base64 to image
      screenshotImageEncoded = Buffer.from(
        screenshotImage.replace(/^data:image\/(png|gif|jpeg);base64,/, ""),
        "base64"
      );

      // Get original screenshot dimensions and update global variable
      const image = await Jimp.read(screenshotImageEncoded);
      originalScreenshotDimensions = [image.bitmap.width, image.bitmap.height];

    }, "image/png");
  }
</script>

<RadioGroup
  {items}
  name="numbers"
  on:change={(e) => {
    selectedScreenshotSource = e.detail.value;
    console.log(selectedScreenshotSource);
  }}
/>
<Button
  on:click={takeScreenshot}
  disabled={selectedScreenshotSource == null}
  filled>Take Screenshot</Button
>

<!-- Conditionally render screenshot image -->
{#if screenshotImage}
  <Card>
    <img
      src={screenshotImage}
      alt="screenshot"
      style="width: 100%; height: 100%; object-fit: contain;"
      on:click={(e) => {
        // Get coordinates of click relative to image
        let clickX = e.clientX - e.target.offsetLeft;
        let clickY = e.clientY - e.target.getBoundingClientRect().top;

        console.log({ x: clickX, y: clickY });
      }}
    />
    <img
      src={croppedImage}
      alt="screenshot"
      style="width: 100%; height: 100%; object-fit: contain;"
    />
  </Card>
{/if}
