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
  client_domain VARCHAR(120) NULL,       -- e.g. "D2C Skincare Brand" - shown as a tag on the card
  testimonial_quote VARCHAR(500) NULL,
  testimonial_author VARCHAR(120) NULL,  -- e.g. "Ananya Rao"
  testimonial_title VARCHAR(150) NULL,   -- e.g. "Head of Content, D2C Skincare Brand"
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
INSERT INTO work_items (slug, title, eyebrow, summary, description, bullets, metrics, art_key, client_domain, testimonial_quote, testimonial_author, testimonial_title, sort_order, is_visible) VALUES
('ai-content-studio', 'AI Content Studio', 'Case study',
 'Turn one topic into a publish-ready video in under 10 minutes - script, voice, and avatar included.',
 'An end-to-end AI pipeline that turns a topic into video-ready content in under 10 minutes, replacing hours of manual content creation.',
 '["🧠 AI-drafted script & storyboard from a single topic","🎤 ElevenLabs voice + HeyGen avatar generation","🎬 3 content formats from one pipeline","⏱️ <10 min topic-to-publish"]',
 '[["4","Wizard steps"],["3","Content formats"],["<10","Minutes to publish"],["1","Unified pipeline"]]',
 'honeycomb', 'D2C Skincare Brand',
 'We used to burn a full day briefing scripts and waiting on edits. Now our content lead drops in a topic before lunch and has a publish-ready video by the time she is back from it.',
 'Ananya Rao', 'Head of Content, D2C Skincare Brand',
 1, 1),

('ai-email-bot', 'AI Email Bot', 'Case study',
 'Upload a lead list, get personalized outreach and hot/warm/cold scoring - with zero manual follow-up.',
 'Automated personalized follow-ups at scale - from lead upload to scoring in a single pipeline, with no manual outreach in between.',
 '["📤 Upload leads, get personalized emails instantly","🔁 Automatic Day 3 / Day 7 follow-ups","🌡️ Hot / Warm / Cold lead scoring","📈 100% personalized, zero manual outreach"]',
 '[["2","Auto follow-ups"],["3","Scoring tiers"],["1","Upload to outreach"],["100%","Personalized"]]',
 'orbit', 'B2B SaaS Sales Team',
 'Our SDRs were spending more time writing follow-ups than actually selling. This gave every lead a personal touch without anyone lifting a finger after the upload.',
 'Karthik Iyer', 'VP Sales, B2B SaaS Company',
 2, 1),

('chromacraft-ai', 'ChromaCraft AI', 'Case study',
 'Turn one product photo into a full, on-brand catalog - colors, backgrounds, and video - in days, not weeks.',
 'AI-powered batch product photography that cut timelines from weeks to days - 1,000+ QA-ready images per run.',
 '["🖼️ 1,000+ QA-ready images per batch","🎨 12 color variants from a single shot","🧹 Automated background removal","🚀 <3 days end-to-end, studio-free"]',
 '[["1,000+","Images per batch"],["12","Colour variants"],["<3","Days end-to-end"],["1","QA pass"]]',
 'grid', 'E-commerce Apparel Brand',
 'We cut an entire studio shoot cycle out of our catalog refresh. What used to take our team three weeks now happens before the next drop even launches.',
 'Meera Shah', 'Creative Ops Lead, E-commerce Apparel Brand',
 3, 1),

('life180-sentinel', 'Life180 Sentinel', 'Case study',
 'Point it at a repo, get a confidence-scored engineering report - no manual code review required.',
 'An AI evaluation pipeline that replaces manual code reviews - repository in, confidence-scored PDF report out, instantly.',
 '["🔍 8 automated evaluation categories","🤖 100% AI-driven, 0 manual reviews","📄 Instant, confidence-scored PDF report","🧭 Plain-English recommendations engineers act on"]',
 '[["8","Eval categories"],["1","PDF report"],["100%","Automated"],["0","Manual reviews"]]',
 'shield', 'Growth-Stage SaaS Startup',
 'Before every funding round we used to scramble for a manual code audit. Now I run Sentinel the same day and hand investors a report I actually trust.',
 'Rohit Verma', 'CTO, Growth-Stage SaaS Startup',
 4, 1),

('rag-pipeline-visualizer', 'RAG Pipeline Visualizer', 'Case study',
 'Walk any team through all seven RAG stages live in the browser - no ML background required.',
 'Retrieval-augmented generation made accessible to non-technical teams - all seven RAG stages, walked through live in the browser.',
 '["🧩 7 interactive pipeline stages, start to finish","🧠 Zero ML background needed for the team","💻 100% client-side, nothing to install","🎯 LLM-as-judge scoring across 5 quality dimensions"]',
 '[["7","Pipeline stages"],["0","ML background needed"],["100%","Client-side"],["1","Browser tab"]]',
 'network', 'Enterprise L&D / AI Training Team',
 'Our engineers finally understood what "retrieval" actually meant instead of nodding along in slideware. It is the fastest AI training session we have run all year.',
 'Divya Nair', 'Head of L&D, Enterprise Technology Team',
 5, 1);
