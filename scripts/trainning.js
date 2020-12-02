async function trainningTask() {
  const tf = require("@tensorflow/tfjs-node"),
    fs = require("fs"),
    path = require("path");

  if (fs.existsSync(path.resolve(__dirname, "../resource/model"))) return;

  const MNIST_IMAGES_PATH = path.resolve(
    __dirname,
    "../resource/mnist_images_buffer"
  );
  const MNIST_LABELS_PATH = path.resolve(
    __dirname,
    "../resource/mnist_labels_uint8"
  );
  const images = new Int32Array(fs.readFileSync(MNIST_IMAGES_PATH));
  const labels = new Int32Array(fs.readFileSync(MNIST_LABELS_PATH));

  const training_images = images.slice(0, 55000 * 28 * 28);
  const training_labels = labels.slice(0, 55000 * 10);

  const xs = tf.buffer([55000, 28, 28, 1], "int32", training_images).toTensor();
  const ys = tf.buffer([55000, 10], "int32", training_labels).toTensor();
  console.log("tensor data ready");

  const model = tf.sequential();

  model.add(
    tf.layers.conv2d({
      inputShape: [28, 28, 1],
      kernelSize: 5,
      filters: 16,
      strides: 1,
      activation: "relu",
      kernelInitializer: "VarianceScaling",
    })
  );
  model.add(
    tf.layers.maxPooling2d({
      poolSize: [2, 2],
      strides: [2, 2],
    })
  );
  model.add(
    tf.layers.conv2d({
      kernelSize: 5,
      filters: 16,
      strides: 1,
      activation: "relu",
      kernelInitializer: "VarianceScaling",
    })
  );

  model.add(
    tf.layers.maxPooling2d({
      poolSize: [2, 2],
      strides: [2, 2],
    })
  );
  model.add(tf.layers.flatten());
  model.add(
    tf.layers.dense({
      units: 10,
      kernelInitializer: "VarianceScaling",
      activation: "softmax",
    })
  );

  model.summary();

  model.compile({
    optimizer: tf.train.sgd(0.15),
    loss: "categoricalCrossentropy",
    metrics: ["accuracy"],
  });

  await model.fit(xs, ys, {
    batchSize: 320,
    validationSplit: 0.15,
    epochs: 30,
  });

  model.save("file://" + path.resolve(__dirname, "../resource/model"));
}

module.exports = trainningTask;
