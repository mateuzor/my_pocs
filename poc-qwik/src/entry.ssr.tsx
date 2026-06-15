import { renderToStream, type RenderToStreamOptions } from '@builder.io/qwik/server';
import { manifest } from '@qwik-client-manifest';
import Root from './root';

// Server entry: streams resumable HTML to the browser. The manifest maps every
// `$` chunk so the client can lazily fetch exactly the code an interaction needs
// — nothing is eagerly downloaded just to make the page interactive.
export default function (opts: RenderToStreamOptions) {
  return renderToStream(<Root />, { manifest, ...opts });
}
