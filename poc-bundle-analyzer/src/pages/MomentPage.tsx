import moment from 'moment';
// Anti-pattern on purpose: importing all of lodash (~70 KB min) for one helper.
// `import debounce from 'lodash/debounce'` would pull only that function.
import _ from 'lodash';

const sample = new Date(2024, 0, 15);

export default function MomentPage() {
  return (
    <section>
      <h2>moment (heavy)</h2>
      <p>Formatted: {moment(sample).format('MMMM Do YYYY')}</p>
      <p>Relative: {moment(sample).fromNow()}</p>
      <p>Capitalized with lodash: {_.capitalize('moment is in maintenance mode')}</p>
    </section>
  );
}
