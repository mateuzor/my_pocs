# WebAssembly POC – Mini Photoshop

This project is a Proof of Concept (POC) that demonstrates how to use **WebAssembly (WASM)** to build a browser-based image processing tool – a simplified "Mini Photoshop". We use Rust to write image filters and compile them into WASM, then load and execute them using JavaScript in a modern browser.

---

## 🧠 What is WebAssembly?

**WebAssembly (WASM)** is a low-level binary instruction format designed as a portable compilation target for high-level languages like C, C++, and Rust. It allows code written in these languages to run in the browser with near-native speed.

### Key Benefits:

* **Performance:** Great for compute-intensive tasks like image processing, 3D rendering, or cryptography.
* **Portability:** Supported by all major browsers.
* **Security:** Runs in a sandboxed environment.
* **Language Interop:** JavaScript can easily call into WebAssembly and share memory.

### Trade-offs:

* **Complexity:** Requires a toolchain and knowledge of lower-level languages.
* **Debugging:** Harder than plain JavaScript.
* **Cold Start:** The `.wasm` file must be fetched and compiled at runtime.

---

## 🎯 Real-World Use Cases

* **Figma:** Vector rendering via WASM for performance.
* **Google Earth Web:** Uses WASM to run 3D engine in the browser.
* **Adobe & AutoCAD Web:** WASM used to port desktop-grade rendering logic.
* **Games:** Unity and Unreal support WebAssembly builds for browser gaming.
* **Cryptography:** Libraries like libsodium and OpenPGP.js ported to WASM.

---

## 🚀 Getting Started

1. Install Rust and `wasm-pack`:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
cargo install wasm-pack
```

2. Build the WebAssembly package:

```bash
npm run build
```

3. Serve the frontend:

```bash
npm run serve
```

4. Open the app in your browser:

```
http://localhost:3000
```

---

## 🔍 What You Should See

* A UI allowing you to upload an image.
* The image is drawn to a `<canvas>`.
* On clicking the **Apply Grayscale** button, the pixels are processed via WebAssembly.
* The image updates in-place with a grayscale effect applied.

---

## 📁 Project Structure

```
poc-webassembly/
├── rust/                    # Rust source code (lib.rs, Cargo.toml)
│   └── src/lib.rs          # Rust logic exposed to WASM
├── www/                    # Web-facing files
│   ├── index.html          # UI with file input and canvas
│   ├── style.css           # Basic styling
│   └── pkg/                # Output from wasm-pack build
├── package.json            # Scripts for building and serving
```

---

## 🧪 Tech Stack

* **Rust**: Language used to write performant image filters.
* **wasm-bindgen**: Exposes Rust functions to JS.
* **wasm-pack**: Tool to compile and generate the WASM package.
* **JavaScript (ES Modules)**: Glue code for invoking WASM.
* **HTML5 Canvas**: For rendering and displaying images.

---

## 💡 Tips for Debugging

* Make sure your `.wasm` file path is correct in the JS import.
* Serve your app from the `www/` directory to ensure correct asset resolution.
* Use `console.log` to verify if image loading and canvas drawing is working.
* Check `Network` tab in DevTools for `.wasm` and JS file loading.

---

