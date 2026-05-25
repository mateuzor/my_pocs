import { mount } from 'svelte';
import App from './App.svelte';

// Svelte 5 uses `mount` instead of `new App({ target })` from Svelte 4.
// The compiler turns App.svelte into a regular JS module that exposes a
// constructor — no runtime framework code is loaded with the app.
mount(App, { target: document.getElementById('root')! });
