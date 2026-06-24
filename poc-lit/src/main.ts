// Entry point just imports the element modules. Each module calls
// customElements.define() (via @customElement), registering the tag with the
// browser. After that, <mc-counter> in index.html upgrades into the component.
import "./components/mc-counter";
import "./components/mc-greeting";
import "./components/mc-todos";
import "./components/mc-card";
import "./components/mc-rating";
