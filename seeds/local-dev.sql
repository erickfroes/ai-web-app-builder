INSERT INTO users (id, email, display_name)
VALUES ('11111111-1111-1111-1111-111111111111', 'demo@aiwebbuilder.dev', 'Demo User')
ON CONFLICT (email) DO NOTHING;

INSERT INTO templates (id, slug, name, description, spec)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  'saas-landing',
  'SaaS Landing',
  'Marketing site with hero, pricing, and FAQ',
  '{"pages":["/","/pricing"],"theme":"modern"}'::jsonb
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO projects (id, owner_id, name, slug, description, status)
VALUES (
  '33333333-3333-3333-3333-333333333333',
  '11111111-1111-1111-1111-111111111111',
  'Demo Project',
  'demo-project',
  'Sample generated project for local development',
  'active'
)
ON CONFLICT (owner_id, slug) DO NOTHING;
