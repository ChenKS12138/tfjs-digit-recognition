async function CopyModelTask() {
  const fs = require("fs"),
    path = require("path");
  const SRC_MODEL_PATH = path.resolve(
      __dirname,
      "../resource/model/model.json"
    ),
    SRC_WEIGHTS_PATH = path.resolve(__dirname, "../resource/model/weights.bin"),
    DEST_DIR_PATH = path.resolve(__dirname, "../assets/"),
    DEST_MODEL_PATH = path.resolve(DEST_DIR_PATH, "model.json"),
    DEST_WEIGHTS_PATH = path.resolve(DEST_DIR_PATH, "weights.bin");
  if (!fs.existsSync(DEST_DIR_PATH)) {
    fs.mkdirSync(DEST_DIR_PATH);
  }
  if (fs.existsSync(SRC_MODEL_PATH)) {
    fs.copyFileSync(SRC_MODEL_PATH, DEST_MODEL_PATH);
  }
  if (fs.existsSync(SRC_WEIGHTS_PATH)) {
    fs.copyFileSync(SRC_WEIGHTS_PATH, DEST_WEIGHTS_PATH);
  }
}

module.exports = CopyModelTask;
