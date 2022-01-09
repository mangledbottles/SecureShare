<script>
  import { Button, RadioGroup, Card } from "attractions";

  const { desktopCapturer } = require("electron");
  /** TODO: Implement Jimp to handle image processing */

  // const Jimp = require("jimp");

  let screenshotImage;

  function fullscreenScreenshot(callback, imageFormat) {
    imageFormat = imageFormat || "image/jpeg";

    let handleStream = (stream) => {
      console.log({ stream });

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
                    chromeMediaSourceId: source.id,
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

  function takeScreenshot() {
    fullscreenScreenshot(function (base64) {
      var encondedImageBuffer = Buffer.from(
        base64.replace(/^data:image\/(png|gif|jpeg);base64,/, ""),
        "base64"
      );

      screenshotImage = base64;
      console.log(base64);
    }, "image/png");
  }
</script>

<Button on:click={takeScreenshot}>Take Screenshot</Button>
<img src={screenshotImage} alt="screenshot" />
