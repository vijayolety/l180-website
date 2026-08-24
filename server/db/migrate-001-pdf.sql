-- One-off migration for databases created before the PDF slideshow feature.
-- Fresh installs get these columns from schema.sql directly - this file is
-- only for upgrading an already-live database. Safe to run once.

ALTER TABLE work_items
  ADD COLUMN pdf_path VARCHAR(255) NULL AFTER art_key,
  ADD COLUMN pdf_original_name VARCHAR(255) NULL AFTER pdf_path;
