import './style.css';
import * as repo from './repo';
import type { Note } from './db';

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const list = $('list');
const status = $('status');

function render(notes: Note[], msg: string) {
  status.textContent = `${msg} (${notes.length} notes)`;
  list.innerHTML = notes
    .map((n) => `<li>${n.title}<span class="tag">${n.tag}</span> ${new Date(n.createdAt).toLocaleDateString()}</li>`)
    .join('');
}

const toMs = (v: string, endOfDay = false) =>
  v ? new Date(v).getTime() + (endOfDay ? 86_399_999 : 0) : undefined;

async function runQuery(msg = 'Query') {
  const tag = $<HTMLSelectElement>('tag').value || undefined;
  const from = toMs($<HTMLInputElement>('from').value);
  const to = toMs($<HTMLInputElement>('to').value, true);
  render(await repo.query({ tag, from, to }), msg);
}

$('seed').onclick = async () => { await repo.seed(); await runQuery('Seeded'); };
$('clear').onclick = async () => { await repo.clear(); await runQuery('Cleared'); };
$('query').onclick = () => runQuery();
$('cursor').onclick = async () => {
  const n = await repo.uppercaseTitles();
  await runQuery(`Cursor updated ${n}`);
};
$('transfer').onclick = async () => {
  const moved = await repo.archiveOldestInbox();
  await runQuery(moved ? `Archived #${moved.id}` : 'Nothing to archive');
};

runQuery('Loaded');
