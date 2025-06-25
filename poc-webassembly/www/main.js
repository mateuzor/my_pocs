  // Import the WebAssembly module and the exposed grayscale function
  import init, { grayscale, greet } from './pkg/poc_webassembly.js';

  // DOM elements
  const upload = document.getElementById('upload');
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const apply = document.getElementById('apply');
  const reset = document.getElementById('reset');

  // Global variables to store current and original image data
  let imageData;
  let originalImageData;

  // Main async function to initialize the WASM module and set up event listeners
  async function main() {
      // Initialize the WASM module (loads and compiles .wasm)
    await init();

      // Event listener for file input change
    upload.addEventListener('change', (e) => {
      const file = e.target.files[0];

      if (!file) {
        return;
      }

      const reader = new FileReader();

        // Triggered when the file is read as base64 data URL
      reader.onload = function (event) {

        const img = new Image();

          // Once the image is loaded in memory
        img.onload = function () {
            // Set canvas dimensions to match the image
          canvas.width = img.width;
          canvas.height = img.height;

            // Allow the layout to settle before drawing
          setTimeout(() => {
            ctx.drawImage(img, 0, 0);

              // Extract pixel data from canvas
            imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

            // Clone original image data for later reset
            originalImageData = new ImageData(
              new Uint8ClampedArray(imageData.data),
              imageData.width,
              imageData.height
            );
          }, 10);
          greet("Mateus");
        };

        img.onerror = function () {
          console.error("Image failed to load");
        };

          // Assign the base64 image data as source
        img.src = event.target.result;
      };

        // Read the image file as base64
      reader.readAsDataURL(file);
    });

      // Event listener for the grayscale button click
    apply.addEventListener('click', () => {
        // Call the WASM grayscale function with the raw pixel data
      grayscale(imageData.data);

      // Redraw the modified image to canvas
      ctx.putImageData(imageData, 0, 0);
    });

    // When user clicks "Reset Image"
    reset.addEventListener('click', () => {
      if (!originalImageData) return;

      // Restore the image data to the original version
      imageData = new ImageData(
        new Uint8ClampedArray(originalImageData.data),
        originalImageData.width,
        originalImageData.height
      );

      // Redraw the original image to canvas
      ctx.putImageData(imageData, 0, 0);
    });
  }

  main();