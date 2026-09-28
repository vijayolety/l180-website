-- One-off migration for databases created before client_domain/testimonial
-- fields existed. Fresh installs get these columns (and this content,
-- baked into the seed rows) from schema.sql directly - this file is only
-- for upgrading an already-live database. Safe to run once.
--
-- Adds the columns, then backfills marketing copy (emoji-prefixed
-- highlights, client domain, testimonial) for the five existing case
-- studies by slug. Run with:
--   node src/run-schema.js migrate-002-case-study-marketing.sql

ALTER TABLE work_items
  ADD COLUMN client_domain VARCHAR(120) NULL AFTER pdf_original_name,
  ADD COLUMN testimonial_quote VARCHAR(500) NULL AFTER client_domain,
  ADD COLUMN testimonial_author VARCHAR(120) NULL AFTER testimonial_quote,
  ADD COLUMN testimonial_title VARCHAR(150) NULL AFTER testimonial_author;

UPDATE work_items SET
  summary = 'Turn one topic into a publish-ready video in under 10 minutes - script, voice, and avatar included.',
  bullets = '["🧠 AI-drafted script & storyboard from a single topic","🎤 ElevenLabs voice + HeyGen avatar generation","🎬 3 content formats from one pipeline","⏱️ <10 min topic-to-publish"]',
  client_domain = 'D2C Skincare Brand',
  testimonial_quote = 'We used to burn a full day briefing scripts and waiting on edits. Now our content lead drops in a topic before lunch and has a publish-ready video by the time she is back from it.',
  testimonial_author = 'Ananya Rao',
  testimonial_title = 'Head of Content, D2C Skincare Brand'
WHERE slug = 'ai-content-studio';

UPDATE work_items SET
  summary = 'Upload a lead list, get personalized outreach and hot/warm/cold scoring - with zero manual follow-up.',
  bullets = '["📤 Upload leads, get personalized emails instantly","🔁 Automatic Day 3 / Day 7 follow-ups","🌡️ Hot / Warm / Cold lead scoring","📈 100% personalized, zero manual outreach"]',
  client_domain = 'B2B SaaS Sales Team',
  testimonial_quote = 'Our SDRs were spending more time writing follow-ups than actually selling. This gave every lead a personal touch without anyone lifting a finger after the upload.',
  testimonial_author = 'Karthik Iyer',
  testimonial_title = 'VP Sales, B2B SaaS Company'
WHERE slug = 'ai-email-bot';

UPDATE work_items SET
  summary = 'Turn one product photo into a full, on-brand catalog - colors, backgrounds, and video - in days, not weeks.',
  bullets = '["🖼️ 1,000+ QA-ready images per batch","🎨 12 color variants from a single shot","🧹 Automated background removal","🚀 <3 days end-to-end, studio-free"]',
  client_domain = 'E-commerce Apparel Brand',
  testimonial_quote = 'We cut an entire studio shoot cycle out of our catalog refresh. What used to take our team three weeks now happens before the next drop even launches.',
  testimonial_author = 'Meera Shah',
  testimonial_title = 'Creative Ops Lead, E-commerce Apparel Brand'
WHERE slug = 'chromacraft-ai';

UPDATE work_items SET
  summary = 'Point it at a repo, get a confidence-scored engineering report - no manual code review required.',
  bullets = '["🔍 8 automated evaluation categories","🤖 100% AI-driven, 0 manual reviews","📄 Instant, confidence-scored PDF report","🧭 Plain-English recommendations engineers act on"]',
  client_domain = 'Growth-Stage SaaS Startup',
  testimonial_quote = 'Before every funding round we used to scramble for a manual code audit. Now I run Sentinel the same day and hand investors a report I actually trust.',
  testimonial_author = 'Rohit Verma',
  testimonial_title = 'CTO, Growth-Stage SaaS Startup'
WHERE slug = 'life180-sentinel';

UPDATE work_items SET
  summary = 'Walk any team through all seven RAG stages live in the browser - no ML background required.',
  bullets = '["🧩 7 interactive pipeline stages, start to finish","🧠 Zero ML background needed for the team","💻 100% client-side, nothing to install","🎯 LLM-as-judge scoring across 5 quality dimensions"]',
  client_domain = 'Enterprise L&D / AI Training Team',
  testimonial_quote = 'Our engineers finally understood what "retrieval" actually meant instead of nodding along in slideware. It is the fastest AI training session we have run all year.',
  testimonial_author = 'Divya Nair',
  testimonial_title = 'Head of L&D, Enterprise Technology Team'
WHERE slug = 'rag-pipeline-visualizer';
