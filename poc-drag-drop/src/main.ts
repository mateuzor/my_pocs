import { makeSortable } from './sortable';
import { makeKanban } from './kanban';
import { makeFileDrop } from './filedrop';

makeSortable(document.getElementById('sortable')!);
makeKanban(document.querySelector<HTMLElement>('.board')!);
makeFileDrop(
  document.getElementById('dropzone')!,
  document.getElementById('file-list')!
);
