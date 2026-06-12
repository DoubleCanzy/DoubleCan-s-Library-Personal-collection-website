-- ============================================================
-- Link Start / DoubleCan's Library — 数据库初始化
-- 请在 Supabase SQL Editor 中执行此文件
-- ============================================================

-- 作品表：所有字段都可为 NULL
CREATE TABLE works (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title           TEXT,
  author          TEXT,
  synopsis        TEXT,
  publication_date DATE,
  publisher       TEXT,
  volume_count    INTEGER,
  type            TEXT CHECK (type IN ('Novel', 'Anime', 'Manga')),
  completion_status TEXT CHECK (completion_status IN ('Ongoing', 'Completed', 'Abandoned')),
  cover_image_url TEXT,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- 标签表
CREATE TABLE tags (
  id    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name  TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 作品-标签关联表（多对多）
CREATE TABLE work_tags (
  work_id UUID REFERENCES works(id) ON DELETE CASCADE,
  tag_id  UUID REFERENCES tags(id)  ON DELETE CASCADE,
  PRIMARY KEY (work_id, tag_id)
);

-- 书评表
CREATE TABLE reviews (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  work_id    UUID REFERENCES works(id) ON DELETE CASCADE NOT NULL,
  content    TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 索引
CREATE INDEX idx_works_created_at   ON works (created_at DESC);
CREATE INDEX idx_works_type         ON works (type);
CREATE INDEX idx_works_updated_at   ON works (updated_at DESC);
CREATE INDEX idx_reviews_work_id    ON reviews (work_id);
CREATE INDEX idx_reviews_created_at ON reviews (created_at DESC);
CREATE INDEX idx_tags_name          ON tags (name);
CREATE INDEX idx_work_tags_tag_id   ON work_tags (tag_id);

-- 自动更新 updated_at 的触发器
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER works_updated_at
  BEFORE UPDATE ON works
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
