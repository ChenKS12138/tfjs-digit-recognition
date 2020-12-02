const downloadDatasetTask = require("./downloadDataset"),
  generateImageBufferTask = require("./generateImageBuffer"),
  trainningTask = require("./trainning"),
  copyModelTask = require("./copyModel");

(async function () {
  try {
    await downloadDatasetTask();
    await generateImageBufferTask();
    await trainningTask();
    await copyModelTask();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
