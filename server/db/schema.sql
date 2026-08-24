-- Life180 Labs - Our Work admin panel (Node/Express backend on Railway)
-- Run this once against the MySQL database (Railway MySQL plugin, or local
-- MySQL for dev). See server/README.md for the full setup walkthrough.

CREATE TABLE IF NOT EXISTS admin_users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS work_items (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(100) NOT NULL UNIQUE,
  title VARCHAR(150) NOT NULL,
  eyebrow VARCHAR(100) NOT NULL DEFAULT 'Case study',
  summary VARCHAR(300) NOT NULL DEFAULT '',
  description TEXT NOT NULL,
  bullets JSON NULL,           -- array of strings, e.g. ["4-step wizard","3 AI content formats"]
  metrics JSON NULL,           -- array of [value,label] pairs, e.g. [["4","Wizard steps"]]
  art_key VARCHAR(30) NOT NULL DEFAULT 'network', -- honeycomb | orbit | grid | shield | network
  pdf_path VARCHAR(255) NULL,            -- /uploads/<uuid>.pdf - when set, the PDF slideshow replaces art_key on the card
  pdf_original_name VARCHAR(255) NULL,   -- original filename, for display in the admin panel
  link_url VARCHAR(255) NULL,
  is_visible TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- express-mysql-session's session table (created automatically by the
-- library on first run too, but included here so one schema import sets up
-- everything in one pass).
CREATE TABLE IF NOT EXISTS sessions (
  session_id VARCHAR(128) COLLATE utf8mb4_bin NOT NULL,
  expires INT UNSIGNED NOT NULL,
  data MEDIUMTEXT COLLATE utf8mb4_bin,
  PRIMARY KEY (session_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed data: the five case studies already published as static copy across
-- the site (homepage carousel, service-page case studies). Ports that real
-- content into the DB rather than inventing anything new.
INSERT INTO work_items (slug, title, eyebrow, summary, description, bullets, metrics, art_key, sort_order, is_visible) VALUES
('ai-content-studio', 'AI Content Studio', 'Case study',
 'See the pipeline. Ship content faster.',
 'An end-to-end AI pipeline that turns a topic into video-ready content in under 10 minutes, replacing hours of manual content creation.',
 '["4-step wizard","3 AI content formats","<10 min topic-to-publish"]',
 '[["4","Wizard steps"],["3","Content formats"],["<10","Minutes to publish"],["1","Unified pipeline"]]',
 'honeycomb', 1, 1),

('ai-email-bot', 'AI Email Bot', 'Case study',
 'Automate outreach. Score every lead.',
 'Automated personalized follow-ups at scale - from lead upload to scoring in a single pipeline, with no manual outreach in between.',
 '["Per-lead personalization","Day 3/7 auto follow-ups","Hot/Warm/Cold scoring"]',
 '[["2","Auto follow-ups"],["3","Scoring tiers"],["1","Upload to outreach"],["100%","Personalized"]]',
 'orbit', 2, 1),

('chromacraft-ai', 'ChromaCraft AI', 'Case study',
 'Generate at scale. Skip the studio.',
 'AI-powered batch product photography that cut timelines from weeks to days - 1,000+ QA-ready images per run.',
 '["1,000+ images per batch","12 color variants","<3 days end-to-end"]',
 '[["1,000+","Images per batch"],["12","Colour variants"],["<3","Days end-to-end"],["1","QA pass"]]',
 'grid', 3, 1),

('life180-sentinel', 'Life180 Sentinel', 'Case study',
 'Review the code. Ship with confidence.',
 'An AI evaluation pipeline that replaces manual code reviews - repository in, confidence-scored PDF report out, instantly.',
 '["8 eval categories","Confidence scoring","Instant PDF report"]',
 '[["8","Eval categories"],["1","PDF report"],["100%","Automated"],["0","Manual reviews"]]',
 'shield', 4, 1),

('rag-pipeline-visualizer', 'RAG Pipeline Visualizer', 'Case study',
 'Walk the pipeline. See it live.',
 'Retrieval-augmented generation made accessible to non-technical teams - all seven RAG stages, walked through live in the browser.',
 '["7 pipeline stages","Zero ML background needed","Fully client-side"]',
 '[["7","Pipeline stages"],["0","ML background needed"],["100%","Client-side"],["1","Browser tab"]]',
 'network', 5, 1);
