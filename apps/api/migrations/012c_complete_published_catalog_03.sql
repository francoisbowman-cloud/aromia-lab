-- Published catalog enrichment chunk 3/5 (15 rows)
ALTER TABLE perfumes
  ADD COLUMN IF NOT EXISTS amazon_url TEXT,
  ADD COLUMN IF NOT EXISTS image_source TEXT,
  ADD COLUMN IF NOT EXISTS affiliate_status TEXT,
  ADD COLUMN IF NOT EXISTS visual_quality TEXT;

WITH e(slug,image_url,image_source,amazon_url,description) AS (
  VALUES
  ('leau-dissey-edt','https://fimgs.net/mdimg/perfume-social-cards/en-social-720.jpeg','https://www.fragrantica.com/perfume/Issey-Miyake/L-eau-d-Issey-720.html','https://www.amazon.com/s?k=Issey+Miyake+L%27Eau+d%27Issey+EDT+perfume&tag=aromialab-20','Acuático floral fundacional de los 90; pionero de la categoría acuática en perfumería femenina.'),
  ('eternity-edp','https://fimgs.net/mdimg/perfume-social-cards/en-social-257.jpeg','https://www.fragrantica.com/perfume/Calvin-Klein/Eternity-257.html','https://www.amazon.com/s?k=Calvin+Klein+Eternity+EDP+perfume&tag=aromialab-20','Floral clásico de los 80; símbolo de romanticismo atemporal de la marca.'),
  ('burberry-her-edp','https://assets.burberry.com/is/image/Burberryltd/2D69FAFE-2129-4BAC-9B19-DE027F64E4D9','https://us.burberry.com/her-eau-de-parfum-50ml-p40804581','https://www.amazon.com/s?k=Burberry+Her+EDP+perfume&tag=aromialab-20','Floral frutal con acorde de bayas rojas; campaña icónica de calle londinense.'),
  ('daisy-edt','https://fimgs.net/mdimg/perfume-social-cards/en-social-1361.jpeg','https://www.fragrantica.com/perfume/Marc-Jacobs/Daisy-1361.html','https://www.amazon.com/s?k=Marc+Jacobs+Daisy+EDT+perfume&tag=aromialab-20','Fresco floral juvenil; frasco icónico con tapa de margaritas, ícono de la marca.'),
  ('spicebomb-edt','https://fimgs.net/mdimg/perfume-social-cards/en-social-13857.jpeg','https://www.fragrantica.com/perfume/Viktor-Rolf/Spicebomb-13857.html','https://www.amazon.com/s?k=Viktor+%26+Rolf+Spicebomb+EDT+perfume&tag=aromialab-20','Amaderado especiado explosivo; frasco en forma de granada, ícono masculino de la marca.'),
  ('invictus-edt','https://fimgs.net/mdimg/perfume-social-cards/en-social-18471.jpeg','https://www.fragrantica.com/perfume/Rabanne/Invictus-18471.html','https://www.amazon.com/s?k=Paco+Rabanne+Invictus+EDT+perfume&tag=aromialab-20','Amaderado acuático deportivo; uno de los masculinos más vendidos de la marca.'),
  ('wanted-edt','https://fimgs.net/mdimg/perfume-social-cards/en-social-38686.jpeg','https://www.fragrantica.com/perfume/Azzaro/Wanted-38686.html','https://www.amazon.com/s?k=Azzaro+Wanted+EDT+perfume&tag=aromialab-20','Amaderado especiado masculino con imagen de héroe de western moderno.'),
  ('boss-bottled-edt','https://fimgs.net/mdimg/perfume-social-cards/en-social-383.jpeg','https://www.fragrantica.com/perfume/Hugo-Boss/Boss-Bottled-383.html','https://www.amazon.com/s?k=Hugo+Boss+Boss+Bottled+EDT+perfume&tag=aromialab-20','Fougère oriental clásico masculino; uno de los más reconocibles de la marca desde los 90.'),
  ('chloe-edp','https://www.chloe.com/dw/image/v2/BLMX_PRD/on/demandware.static/-/Sites-chloe-master/default/dw8d6c6e55/images/all-images/CHCA64980409/5PkOQ09jQN6w6uYNBP9kHA_50c613c9.jpeg?sw=1440&sfrm=png&q=90','https://www.chloe.com/en-us/p/fragrances/eau-de-parfum/CHCA64980409.html','https://www.amazon.com/s?k=Chlo%C3%A9+Chlo%C3%A9+EDP+perfume&tag=aromialab-20','Floral rosado epónimo de la maison; elegancia parisina en un frasco icónico color rosa pálido.'),
  ('tresor-edp','https://fimgs.net/mdimg/perfume-social-cards/en-social-172.jpeg','https://www.fragrantica.com/perfume/Lancome/Tresor-172.html','https://www.amazon.com/s?k=Lanc%C3%B4me+Tr%C3%A9sor+EDP+perfume&tag=aromialab-20','Floral romántico icónico de los 90; frasco dorado símbolo de feminidad clásica.'),
  ('mon-guerlain-edp','https://fimgs.net/mdimg/perfume-social-cards/en-social-43297.jpeg','https://www.fragrantica.com/perfume/Guerlain/Mon-Guerlain-43297.html','https://www.amazon.com/s?k=Guerlain+Mon+Guerlain+EDP+perfume&tag=aromialab-20','Ambarado amaderado moderno; primera fragancia femenina compuesta específicamente con Angelina Jolie como imagen.'),
  ('beautiful-edp','https://fimgs.net/mdimg/perfume-social-cards/en-social-528.jpeg','https://www.fragrantica.com/perfume/Estee-Lauder/Beautiful-528.html','https://www.amazon.com/s?k=Est%C3%A9e+Lauder+Beautiful+EDP+perfume&tag=aromialab-20','Floral clásico de los 80; una de las fragancias femeninas más longevas del catálogo Estée Lauder.'),
  ('philosykos-edt','https://us.diptyqueparis.com/cdn/shop/files/diptyque-philosykos-eau-de-toilette-100ml-philo100-1_0831aeef-f2a4-4617-a6a1-6ea9bb724a47.jpg?v=1781571387','https://us.diptyqueparis.com/en-us/products/eau-de-toilette-philosykos-philo100v2','https://www.amazon.com/s?k=Diptyque+Philosykos+EDT+perfume&tag=aromialab-20','Verde acuoso de higuera; evoca el mediterráneo con hoja, savia y madera de higuera.'),
  ('do-son-edt','https://diptyqueparis.com/cdn/shop/files/diptyque-do-son-eau-de-toilette-100ml-doson100-1_694199fa-441a-43f4-9676-d5a6897f7fb5.jpg?v=1756926248','https://diptyqueparis.com/en-al/products/eau-de-toilette-do-son-doson100v2','https://www.amazon.com/s?k=Diptyque+Do+Son+EDT+perfume&tag=aromialab-20','Floral blanco marino; tuberosa sobre brisa de mar, evocando el jardín natal de sus fundadores en Vietnam.'),
  ('portrait-of-a-lady-edp','https://fimgs.net/mdimg/perfume-social-cards/en-social-10464.jpeg','https://www.fragrantica.com/perfume/Frederic-Malle/Portrait-of-a-Lady-10464.html','https://www.amazon.com/s?k=Frederic+Malle+Portrait+of+a+Lady+EDP+perfume&tag=aromialab-20','Chipre floral opulento; rosa intensa sobre pachulí, uno de los perfumes de nicho más aclamados de la década 2010.')
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
