module.exports = async function downloadDatesetTask() {
  const request = require("request"),
    path = require("path"),
    fs = require("fs"),
    cliProgress = require("cli-progress");

  const MNIST_IMAGES_URI =
      "https://storage.googleapis.com/learnjs-data/model-builder/mnist_images.png",
    MNIST_LABELS_URI =
      "https://storage.googleapis.com/learnjs-data/model-builder/mnist_labels_uint8";

  const MNIST_IMAGES_PATH = path.join(
      __dirname,
      "../resource/mnist_images.png"
    ),
    MNIST_LABELS_PATH = path.join(__dirname, "../resource/mnist_labels_uint8");

  if (fs.existsSync(MNIST_IMAGES_PATH) && fs.existsSync(MNIST_LABELS_PATH))
    return;

  const multibar = new cliProgress.MultiBar(
    {
      clearOnComplete: false,
      hideCursor: true,
    },
    cliProgress.Presets.shades_grey
  );

  const options = {};
  if (process.env.http_proxy) {
    console.log("Using Http Tunnel %s", process.env.http_proxy);
    options.proxy = process.env.http_proxy;
    options.tunnel = true;
  }

  function downloadFile(uri, stream, onProgress) {
    return new Promise((resolve, reject) => {
      let totalBytes = 0.000001,
        receivedBytes = 0;
      const bar = multibar.create(Infinity, 0);

      request({
        ...options,
        url: uri,
      })
        .on("end", () => {
          resolve();
        })
        .on("error", (err) => {
          reject(err);
        })
        .on("response", (data) => {
          console.log(`Start To Download ${uri}`);
          totalBytes = parseInt(data.headers["content-length"]);
          bar && bar.setTotal(totalBytes);
        })
        .on("data", (chunk) => {
          receivedBytes += chunk.length;
          bar && bar.update(receivedBytes);
          onProgress && onProgress(receivedBytes, totalBytes);
        })
        .pipe(stream);
    });
  }
  return Promise.all([
    downloadFile(MNIST_IMAGES_URI, fs.createWriteStream(MNIST_IMAGES_PATH)),
    downloadFile(MNIST_LABELS_URI, fs.createWriteStream(MNIST_LABELS_PATH)),
  ])
    .then(() => {
      console.log("Download Complete");
      multibar && multibar.stop();
    })
    .catch((err) => {
      console.error(err);
    });
};
