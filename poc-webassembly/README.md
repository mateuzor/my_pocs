# WebAssembly POC

This project is a simple Proof of Concept (POC) ...

## What is WebAssembly?

**WebAssembly (WASM)** is a low-level, binary instruction format designed to be a portable compilation target for high-performance applications on the web. It allows code written in languages like C, C++, or Rust to run in the browser with near-native performance.

## Why WebAssembly?

* **Speed:** Runs faster than JavaScript for compute-heavy tasks.
* **Portability:** Can be compiled from many languages and runs on all modern browsers.
* **Security:** Executes in a sandboxed environment.
* **Interoperability:** Can be called from JavaScript and share memory.


compila módulo wasm 

wasm-pack build --target web

gera a pasta pkg

poc_webassembly.js -> código js com wasm

servindo a aplicação
http://localhost:3000

click -> 
o JavaScript executa uma função Rust compilada em WASM.

Demonstra que é possível executar rust dentro de uma página com js, trazendo perfomance (how much ?)

www -> ponto de entrada do noss FE