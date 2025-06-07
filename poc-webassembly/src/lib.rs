// Necessário para expor as funções rust para JS
use wasm_bindgen::prelude::*;

// Faz nossa função acessivel via JS
#[wasm_bindgen]
// Função que chamamos no JS
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}
