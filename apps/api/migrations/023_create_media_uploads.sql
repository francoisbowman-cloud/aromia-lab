-- Small CMS images live with the backed-up database rather than ephemeral disks.
-- Public URLs are immutable UUID filenames. Article/catalog list queries never read bytes.
CREATE TABLE IF NOT EXISTS media_uploads (
  filename text PRIMARY KEY,
  kind text NOT NULL CHECK (kind IN ('articles', 'perfumes')),
  content_type text NOT NULL CHECK (content_type IN ('image/png', 'image/jpeg', 'image/webp')),
  bytes bytea NOT NULL CHECK (octet_length(bytes) BETWEEN 1 AND 5242880),
  created_at timestamptz NOT NULL DEFAULT now()
);
