import { render } from 'solid-js/web';
import { App } from './App';

// Solid's render() takes a function that returns the component tree.
// There's no <StrictMode> equivalent — strict-mode behavior would defeat
// the whole "run once at mount" model.
render(() => <App />, document.getElementById('root')!);
