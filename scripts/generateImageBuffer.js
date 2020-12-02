async function GenerateImageBufferTask() {
  const jimp = require("jimp"),
    path = require("path"),
    fs = require("fs");
  const MNIST_IMAGES_BUFFER_PATH = path.resolve(
    __dirname,
    "../resource/mnist_images_buffer"
  );
  if (fs.existsSync(MNIST_IMAGES_BUFFER_PATH)) return;

  const image = await jimp.read(
    path.join(__dirname, "../resource/mnist_images.png")
  );
  if (!image) return;
  let pixels = new Int32Array({ length: image.bitmap.data.length / 4 });
  pixels = pixels.map((_item, index) => {
    return image.bitmap.data[index * 4] < 128 ? 0 : 1;
  });
  fs.writeFileSync(MNIST_IMAGES_BUFFER_PATH, Buffer.from(pixels));
  console.log("Generate Complate");
}

module.exports = GenerateImageBufferTask;
