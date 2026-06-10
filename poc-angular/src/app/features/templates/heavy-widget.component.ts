import { Component } from '@angular/core';

// Stands in for an expensive component (chart lib, editor, map). Because it's
// only referenced inside a @defer block, its JS ships as a SEPARATE chunk and
// is fetched on the trigger — never in the initial bundle.
@Component({
  selector: 'app-heavy-widget',
  template: `<div style="padding:8px;border:1px solid #ccc">🧩 heavy widget loaded</div>`,
})
export class HeavyWidgetComponent {}
