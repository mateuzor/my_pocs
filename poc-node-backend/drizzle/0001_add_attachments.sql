-- Aula 13 — Adiciona tabela `attachments` (arquivos ligados a tasks).
-- Gerada por `drizzle-kit generate` a partir do diff do schema TS.
--
-- NOTE que este arquivo é NOVO — o 0000_initial.sql não muda mais. O que
-- existe em bancos "atualizados" é ADICIONADO em novos arquivos. É essa a
-- diferença fundamental de `CREATE TABLE IF NOT EXISTS`.

CREATE TABLE `attachments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`task_id` integer NOT NULL,
	`original_name` text NOT NULL,
	`stored_name` text NOT NULL,
	`mime_type` text NOT NULL,
	`size_bytes` integer NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`task_id`) REFERENCES `tasks`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `attachments_stored_name_unique` ON `attachments` (`stored_name`);
--> statement-breakpoint
CREATE INDEX `idx_attachments_task` ON `attachments` (`task_id`);
