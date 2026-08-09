-- Published catalog enrichment chunk 2/5 (15 rows)
ALTER TABLE perfumes
  ADD COLUMN IF NOT EXISTS amazon_url TEXT,
  ADD COLUMN IF NOT EXISTS image_source TEXT,
  ADD COLUMN IF NOT EXISTS affiliate_status TEXT,
  ADD COLUMN IF NOT EXISTS visual_quality TEXT;

WITH e(slug,image_url,image_source,amazon_url,description) AS (
  VALUES
  ('cloud-edp','https://fimgs.net/mdimg/perfume-social-cards/en-social-50384.jpeg','https://www.fragrantica.com/perfume/Ariana-Grande/Cloud-50384.html','https://www.amazon.com/s?k=Ariana+Grande+Cloud+EDP+perfume&tag=aromialab-20','Gourmand cremoso con coco y praliné; uno de los perfumes celebrity mas vendidos.'),
  ('gypsy-water-edp','https://fimgs.net/mdimg/perfume-social-cards/en-social-3575.jpeg','https://www.fragrantica.com/perfume/Byredo/Gypsy-Water-3575.html','https://www.amazon.com/s?k=Byredo+Gypsy+Water+EDP+perfume&tag=aromialab-20','Amaderado bohemio con enebro e incienso; uno de los best-sellers de nicho de Byredo.'),
  ('percival-edp','https://parfums-de-marly.com/cdn/shop/files/PERCIVAL-PERFUME-125-PACK1-1X1_CENTERED_1_5476f34c-058e-4eae-a180-3e4526067d70.png?v=1759501457','https://parfums-de-marly.com/products/percival','https://www.amazon.com/s?k=Parfums+de+Marly+Percival+EDP+perfume&tag=aromialab-20','Amaderado cítrico fresco y versátil; uno de los favoritos de entrada a la marca.'),
  ('ani-extrait','https://nishane.com/wp-content/uploads/2024/06/15ml-ANI-X.jpg','https://nishane.com/product/ani-x-15ml/','https://www.amazon.com/s?k=Nishane+Ani+Extrait+perfume&tag=aromialab-20','Oriental floral especiado con grosella negra y rosa turca sobre base amaderada.'),
  ('cedrat-boise-edp','https://fimgs.net/mdimg/perfume-social-cards/en-social-15211.jpeg','https://www.fragrantica.com/perfume/Mancera/Cedrat-Boise-15211.html','https://www.amazon.com/s?k=Mancera+Cedrat+Bois%C3%A9+EDP+perfume&tag=aromialab-20','Cítrico amaderado con cuero y oud; uno de los más populares y accesibles de Mancera.'),
  ('born-in-roma-uomo-edt','https://fimgs.net/mdimg/perfume-social-cards/en-social-55963.jpeg','https://www.fragrantica.com/perfume/Valentino/Valentino-Uomo-Born-in-Roma-55963.html','https://www.amazon.com/s?k=Valentino+Uomo+Born+In+Roma+EDT+perfume&tag=aromialab-20','Amaderado especiado moderno con notas minerales y de sal; versión masculina de la línea Born In Roma.'),
  ('terre-d-hermes-parfum','https://fimgs.net/mdimg/perfume-social-cards/en-social-8282.jpeg','https://www.fragrantica.com/perfume/Hermes/Terre-d-Hermes-Parfum-8282.html','https://www.amazon.com/s?k=Herm%C3%A8s+Terre+d%27Herm%C3%A8s+Parfum+perfume&tag=aromialab-20','Version en concentracion Parfum del icónico Terre d''Hermès; mayor intensidad y persistencia amaderada.'),
  ('vanilla-28-edp','https://fimgs.net/mdimg/perfume-social-cards/en-social-52616.jpeg','https://www.fragrantica.com/perfume/Kayali-Fragrances/Vanilla-28-52616.html','https://www.amazon.com/s?k=Kayali+Vanilla+%7C+28+EDP+perfume&tag=aromialab-20','Gourmand cálido de vainilla de Madagascar con azúcar morena y maderas ambaradas; best-seller de la marca.'),
  ('elysium-pour-homme-parfum-cologne','https://fimgs.net/mdimg/perfume-social-cards/en-social-46296.jpeg','https://www.fragrantica.com/perfume/Roja-Dove/Elysium-Pour-Homme-Parfum-Cologne-46296.html','https://www.amazon.com/s?k=Roja+Parfums+Elysium+Pour+Homme+Parfum+Cologne+Parfum+Cologne+perfume&tag=aromialab-20','Fougère aromático de altísima gama; cítricos y hierbas verdes sobre una base de ámbar y cuero.'),
  ('replica-jazz-club-edt','https://fimgs.net/mdimg/perfume-social-cards/en-social-20541.jpeg','https://www.fragrantica.com/perfume/Maison-Martin-Margiela/Jazz-Club-20541.html','https://www.amazon.com/s?k=Maison+Margiela+REPLICA+Jazz+Club+EDT+perfume&tag=aromialab-20','Evoca un club de jazz nocturno; ron, tabaco y vainilla en una fragancia narrativa de la línea REPLICA.'),
  ('opium-edp','https://fimgs.net/mdimg/perfume-social-cards/en-social-7399.jpeg','https://www.fragrantica.com/perfume/Yves-Saint-Laurent/Opium-Eau-de-Parfum-2009-7399.html','https://www.amazon.com/s?k=Yves+Saint+Laurent+Opium+EDP+perfume&tag=aromialab-20','Oriental especiado icónico; reformulación EDP 2009 del clásico original de 1977.'),
  ('poison-edt','https://fimgs.net/mdimg/perfume-social-cards/en-social-218.jpeg','https://www.fragrantica.com/perfume/Dior/Poison-218.html','https://www.amazon.com/s?k=Dior+Poison+EDT+perfume&tag=aromialab-20','Oriental floral intenso y icónico de los 80; una de las fragancias más audaces de Dior.'),
  ('alien-edp','https://fimgs.net/mdimg/perfume-social-cards/en-social-707.jpeg','https://www.fragrantica.com/perfume/Mugler/Alien-707.html','https://www.amazon.com/s?k=Thierry+Mugler+Alien+EDP+perfume&tag=aromialab-20','Floral amaderado con firma de jazmín sambac; frasco icónico en forma de piedra preciosa.'),
  ('linterdit-edp','https://www.givenchybeauty.com/dw/image/v2/BBZW_PRD/on/demandware.static/-/Sites-givenchy-beauty-master/default/dw8cd80399/images/P069002/3274872372153_P069002_LINTERDIT_EDP_80ML_0.png?sw=1200&sh=1200&strip=false','https://www.givenchybeauty.com/us/p/l-interdit-F10100099.html','https://www.amazon.com/s?k=Givenchy+L%27Interdit+EDP+perfume&tag=aromialab-20','Floral blanco con contraste de tuberosa y pera; reinterpretación moderna del icónico L''Interdit.'),
  ('for-her-edp','https://fimgs.net/mdimg/perfume-social-cards/en-social-14319.jpeg','https://www.fragrantica.com/perfume/Narciso-Rodriguez/Narciso-Rodriguez-for-Her-Eau-de-Parfum-14319.html','https://www.amazon.com/s?k=Narciso+Rodriguez+For+Her+EDP+perfume&tag=aromialab-20','Floral almizclado minimalista; firma olfativa distintiva de la marca del diseñador.')
)
UPDATE perfumes p SET
  imagen_url = CASE WHEN p.imagen_url IS NULL OR btrim(p.imagen_url) = '' OR lower(btrim(p.imagen_url)) = 'pending' THEN e.image_url ELSE p.imagen_url END,
  image_source = CASE WHEN p.image_source IS NULL OR btrim(p.image_source) = '' OR lower(btrim(p.image_source)) = 'pending' THEN e.image_source ELSE p.image_source END,
  amazon_url = CASE WHEN p.amazon_url IS NULL OR btrim(p.amazon_url) = '' OR lower(btrim(p.amazon_url)) = 'pending' THEN e.amazon_url ELSE p.amazon_url END,
  link_afiliado = CASE WHEN p.link_afiliado IS NULL OR btrim(p.link_afiliado) = '' OR lower(btrim(p.link_afiliado)) = 'pending' THEN e.amazon_url ELSE p.link_afiliado END,
  affiliate_status = 'active',
  visual_quality = CASE WHEN p.visual_quality IS NULL OR btrim(p.visual_quality) = '' OR lower(btrim(p.visual_quality)) IN ('pending','not-audited') THEN 'medium' ELSE p.visual_quality END,
  descripcion_corta = CASE WHEN p.descripcion_corta IS NULL OR btrim(p.descripcion_corta) = '' OR lower(btrim(p.descripcion_corta)) = 'pending' THEN e.description ELSE p.descripcion_corta END,
  actualizado_en = now()
FROM e
WHERE p.slug = e.slug;
