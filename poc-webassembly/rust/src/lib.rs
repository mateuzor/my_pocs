use wasm_bindgen::prelude::*;

/// alert e console log
#[wasm_bindgen]
extern "C" {
    pub fn alert(s: &str);                      
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);                             
}

/// Receives a mutable Uint8ClampedArray buffer (pixels from canvas)
/// Each pixel is RGBA: R, G, B, A (0-255)
#[wasm_bindgen]
pub fn grayscale(data: &mut [u8]) {
    for i in (0..data.len()).step_by(4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];

        // Calculate luminance using a common formula
        let gray = (0.299 * r as f64 + 0.587 * g as f64 + 0.114 * b as f64) as u8;

        // Replace R, G, B with gray
        data[i] = gray;
        data[i + 1] = gray;
        data[i + 2] = gray;
    }

     log("Grayscale conversion finished.");
}

/// shows an alert and writes to the console.
#[wasm_bindgen]
pub fn greet(name: &str) {
    alert(&format!("Hello, {}!", name));
}
