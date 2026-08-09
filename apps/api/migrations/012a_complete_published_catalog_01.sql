-- Published catalog enrichment chunk 1/5 (15 rows)
ALTER TABLE perfumes
  ADD COLUMN IF NOT EXISTS amazon_url TEXT,
  ADD COLUMN IF NOT EXISTS image_source TEXT,
  ADD COLUMN IF NOT EXISTS affiliate_status TEXT,
  ADD COLUMN IF NOT EXISTS visual_quality TEXT;

WITH e(slug,image_url,image_source,amazon_url,description) AS (
  VALUES
  ('chanel-no5-edp','https://www.incendia.mv/cdn/shop/files/ChanelNo5_2.png?v=1723956405&width=1946','https://www.incendia.mv/products/chanel-no-5-edp-100ml-w','https://www.amazon.com/s?k=Chanel+No.5+EDP+perfume&tag=aromialab-20','Icono absoluto de la perfumeria; aldehidos y flores blancas en un floral atemporal.'),
  ('tobacco-vanille-edp','https://www.tomfordbeauty.com/cdn/shop/files/tf_sku_T0CA01_2000x2000_0.png?v=1786289134','https://www.tomfordbeauty.com/products/tobacco-vanille-eau-de-parfum','https://www.amazon.com/s?k=Tom+Ford+Tobacco+Vanille+EDP+perfume&tag=aromialab-20','Tabaco dulce y especiado sobre una base golosa de vainilla y cacao; culto entre orientales.'),
  ('santal-33-edp','https://lelabo.ips.photos/lelabo-java/images/skus/S33S26250245__PRODUCT_01--IMG_1200--SANTAL33SANTAL26SET--1982433974.jpg','https://www.lelabofragrances.com/fine-fragrances/sets/santal-33-and-santal-26','https://www.amazon.com/s?k=Le+Labo+Santal+33+EDP+perfume&tag=aromialab-20','Amaderado seco de sandalo y cuero, uno de los perfumes de nicho mas imitados de la década.'),
  ('shalimar-edp','https://fimgs.net/mdimg/perfume-social-cards/en-social-53.jpeg','https://www.fragrantica.com/perfume/Guerlain/Shalimar-Eau-de-Parfum-53.html','https://www.amazon.com/s?k=Guerlain+Shalimar+EDP+perfume&tag=aromialab-20','Oriental clasico fundacional; cítricos frescos sobre una base sensual de vainilla, cuero e incienso.'),
  ('eros-parfum','https://fimgs.net/mdimg/perfume-social-cards/en-social-70090.jpeg','https://www.fragrantica.com/perfume/Versace/Eros-Parfum-70090.html','https://www.amazon.com/s?k=Versace+Eros+Parfum+perfume&tag=aromialab-20','Version en concentracion Parfum del Eros original; mas intenso y envolvente que la EDT clasica.'),
  ('paradoxe-edp','https://fimgs.net/mdimg/perfume-social-cards/en-social-75668.jpeg','https://www.fragrantica.com/perfume/Prada/Prada-Paradoxe-75668.html','https://www.amazon.com/s?k=Prada+Paradoxe+EDP+perfume&tag=aromialab-20','Floral almizclado moderno desarrollado con Miuccia Prada y Raf Simons; neroli y vainilla bourbon.'),
  ('armani-code-parfum','https://fimgs.net/mdimg/perfume-social-cards/en-social-75126.jpeg','https://www.fragrantica.com/perfume/Giorgio-Armani/Armani-Code-Parfum-75126.html','https://www.amazon.com/s?k=Giorgio+Armani+Code+Parfum+perfume&tag=aromialab-20','Version Parfum del clasico Armani Code; mayor concentración y persistencia.'),
  ('naxos-edp','https://www.xerjoff.com/cdn/shop/files/listing-naxos-eau-de-parfum-100ml.png?v=1745399063','https://www.xerjoff.com/en-us/products/naxos-eau-de-parfum','https://www.amazon.com/s?k=Xerjoff+Naxos+EDP+perfume&tag=aromialab-20','De la colección 1861 de Xerjoff; miel, tabaco y jazmín sambac en un oriental cálido.'),
  ('side-effect-edp','https://fimgs.net/mdimg/perfume-social-cards/en-social-42260.jpeg','https://www.fragrantica.com/perfume/Initio-Parfums-Prives/Side-Effect-42260.html','https://www.amazon.com/s?k=Initio+Parfums+Prives+Side+Effect+EDP+perfume&tag=aromialab-20','Oriental especiado con acorde de ron, tabaco y azafrán; intenso y adictivo.'),
  ('212-vip-edp','https://fimgs.net/mdimg/perfume-social-cards/en-social-10126.jpeg','https://www.fragrantica.com/perfume/Carolina-Herrera/212-VIP-10126.html','https://www.amazon.com/s?k=Carolina+Herrera+212+VIP+EDP+perfume&tag=aromialab-20','Floral frutal vibrante con maracuyá y gardenia; ícono de fiesta de la marca.'),
  ('explorer-edp','https://fimgs.net/mdimg/perfume-social-cards/en-social-52002.jpeg','https://www.fragrantica.com/perfume/Montblanc/Explorer-52002.html','https://www.amazon.com/s?k=Montblanc+Explorer+EDP+perfume&tag=aromialab-20','Amaderado especiado inspirado en la aventura; vetiver y cacao sobre base de pachulí.'),
  ('scandal-edp','https://fimgs.net/mdimg/perfume-social-cards/en-social-45651.jpeg','https://www.fragrantica.com/perfume/Jean-Paul-Gaultier/Scandal-45651.html','https://www.amazon.com/s?k=Jean+Paul+Gaultier+Scandal+EDP+perfume&tag=aromialab-20','Floral mielado audaz con gardenia y caramelo; frasco icónico en forma de torso.'),
  ('the-one-for-men-edt','https://www.dolcegabbana.com/on/demandware.static/-/Sites-15/default/dw877062d5/images/zoom/VP6491VP107_9V000_0.jpg','https://www.dolcegabbana.com/en-ad/beauty/perfumes-for-him/the-one-for-men/the-one-for-men-eau-de-toilette---VP6491VP1079V000.html','https://www.amazon.com/s?k=Dolce+%26+Gabbana+The+One+for+Men+EDT+perfume&tag=aromialab-20','Oriental especiado masculino con pomelo y cardamomo sobre base de ámbar y tabaco.'),
  ('interlude-woman-edp','https://fimgs.net/mdimg/perfume-social-cards/en-social-15295.jpeg','https://www.fragrantica.com/perfume/Amouage/Interlude-Woman-15295.html','https://www.amazon.com/s?k=Amouage+Interlude+Woman+EDP+perfume&tag=aromialab-20','Contraparte femenina del Interlude Man; incienso y rosa sobre una base de oud y cuero.'),
  ('vibrant-leather-edp','https://fimgs.net/mdimg/perfume-social-cards/en-social-50122.jpeg','https://www.fragrantica.com/perfume/Zara/Vibrant-Leather-Eau-de-Parfum-50122.html','https://www.amazon.com/s?k=Zara+Vibrant+Leather+EDP+perfume&tag=aromialab-20','Cuero accesible con toque cítrico; buena relación calidad-precio en la categoría cuero.')
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
