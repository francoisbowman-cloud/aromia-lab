-- One-time, production-safe catalog image normalization for Aromia's white canvas.
-- This migration is deliberately guarded by a persistent marker so later manual
-- image improvements are never overwritten on subsequent API restarts.

CREATE TABLE IF NOT EXISTS aromia_data_fixes (
  key TEXT PRIMARY KEY,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM aromia_data_fixes WHERE key = 'catalog-white-background-v1'
  ) THEN
    UPDATE perfumes SET imagen_url = 'https://www.mugler.co.uk/dw/image/v2/AAQP_PRD/on/demandware.static/-/Sites-mug-master-catalog/default/dw042a3dc5/images/pdp/M020101024/3439600055740-amen-eau-de-toilette-50ml-main.jpg?q=70&sfrm=jpg&sw=1005' WHERE slug = 'amen-edt';
    UPDATE perfumes SET imagen_url = 'https://backend.mazaya.eg/media/catalog/product/n/a/nasomatto-product_blackafgano2_8717774840061_na0017.jpg?image-type=image&store=en' WHERE slug = 'black-afgano-extrait';
    UPDATE perfumes SET imagen_url = 'https://u-mercari-images.mercdn.net/photos/m98417701423_1.jpg' WHERE slug = 'chance-eau-tendre';
    UPDATE perfumes SET imagen_url = 'https://cdn.jarrolds.co.uk/brands/killian/3700550235767_0.jpg' WHERE slug = 'good-girl-gone-bad';
    UPDATE perfumes SET imagen_url = 'https://www.lessenteurs.com/cdn/shop/files/creed-green-irish-tweed-100ml_27b0eaf1-5ac3-4d82-ad46-6c985c01ef97.jpg?v=1741770146' WHERE slug = 'green-irish-tweed-edp';
    UPDATE perfumes SET imagen_url = 'https://www.marcgebauer.com/cdn/shop/files/amouage-Jubilation-25-woman-100-ml-image1_grande.webp?v=1764154380' WHERE slug = 'jubilation-25-woman-edp';
    UPDATE perfumes SET imagen_url = 'https://scentbar.com.au/cdn/shop/files/amouage-jubilation-xxv-man-eau-de-parfum-100ml-bottle.jpg?v=1775464749&width=1024' WHERE slug = 'jubilation-xxv-man-edp';
    UPDATE perfumes SET imagen_url = 'https://www.aeliadutyfree.co.uk/media/catalog/product/3/2/3274872372153_1_2ca1.jpg?bg-color=255%2C255%2C255&canvas=934%3A934&fit=bounds&height=934&quality=80&width=934' WHERE slug = 'linterdit-edp';
    UPDATE perfumes SET imagen_url = 'https://www.creedperfume.com.au/cdn/shop/files/MillesimeImperial100mlrestaged_600x.png?v=1760480164' WHERE slug = 'millesime-imperial-edp';
    UPDATE perfumes SET imagen_url = 'https://cdn4.beautinow.com/wp-content/uploads/2023/08/FMMusc.jpg' WHERE slug = 'musc-ravageur-edp';
    UPDATE perfumes SET imagen_url = 'https://www.odoraperfume.com/media/1831/catalog/BOND-NO.9-NYC-SIGNATURE-GOLD-UNISEX-EAU-DE-PARFUM-100ML.jpg?size=1380' WHERE slug = 'new-york-signature-scent-pure-perfume';
    UPDATE perfumes SET imagen_url = 'https://merchantandrhoades.com/cdn/shop/files/2203_MARLY_PERCIVAL_125ml_2v3_1000x_24ad9567-a41e-40d0-824f-6914e523766d.webp?v=1709665871' WHERE slug = 'percival-edp';
    UPDATE perfumes SET imagen_url = 'https://wewardoble.com/cdn/shop/files/santal33.png?v=1722461038' WHERE slug = 'santal-33-edp';
    UPDATE perfumes SET imagen_url = 'https://ounass-sa.atgcdn.ae/small_light%28of%3Dwebp%2Cq%3D90%29/pub/media/catalog/product/2/0/204734169_NOCOLOR_in.jpg?ts=1519724163.5661' WHERE slug = 'tobacco-vanille-edp';
    UPDATE perfumes SET imagen_url = 'https://en.bloomingdales.sa/on/demandware.static/-/Sites-bloomingdales-master-catalog/default/dwfe39c4fd/sfcc-new-blm-production/2/1/6/5/1/216519946_IN.jpg' WHERE slug = 'loewe-001-man-edp';
    UPDATE perfumes SET imagen_url = 'https://media.sephora.eu/content/dam/digital/pim/published/S/SERGE_LUTENS/P927002/1214-media_principal.jpg?scaleMode=fit&scaleWidth=640' WHERE slug = 'ambre-sultan-edp';
    UPDATE perfumes SET imagen_url = 'https://cdn.basler-beauty.de/out/pictures/generated/product/1/980_980_100/40285fef8c7e8812018c8c57eddb1f20-TOM-FORD-Fucking-Fabulous-Eau-de-Parfum.190c907d.jpg' WHERE slug = 'fucking-fabulous';
    UPDATE perfumes SET imagen_url = 'https://d3e7ardzpaj3y4.cloudfront.net/image/catalog/92671803_Versace%20Pour%20Homme-500x500.png' WHERE slug = 'versace-pour-homme';
    UPDATE perfumes SET imagen_url = 'https://cdn.shopify.com/s/files/1/0772/1448/2736/products/VersaceEros.jpg?v=1705606705' WHERE slug = 'eros';
    UPDATE perfumes SET imagen_url = 'https://abclive1.s3.amazonaws.com/31a7f8a4-c7f7-4d3a-81a6-26f396972754/productimage/P-3614272629370___L.jpg' WHERE slug = 'idole-edp';
    UPDATE perfumes SET imagen_url = 'https://cdn0.woolworths.media/content/wowproductimages/large/1100816689_1.jpg' WHERE slug = 'nishane-hacivat';
    UPDATE perfumes SET imagen_url = 'https://www.giorgioarmanibeauty-usa.com/dw/image/v2/AANG_PRD/on/demandware.static/-/Sites-gab-master-catalog/default/dwf244fb59/products/A2061/A2061%20new%20packshots/GA_2018_ww-00086-arm_EA-stronger-with-you-100ml.jpg' WHERE slug = 'stronger-with-you';
    UPDATE perfumes SET imagen_url = 'https://cdn.salla.sa/ebmQD/24KjatV4Vkwac5vACz87mW9bexNOV6rPnT5CCNwY.jpg' WHERE slug = 'taif-edp';
    UPDATE perfumes SET imagen_url = 'https://perfumesyperfumes.com/cdn/shop/files/MOLECULE01.png?v=1715296396' WHERE slug = 'molecule-01';
    UPDATE perfumes SET imagen_url = 'https://www.victoriassecret.com/p/874x1165/png/zz/25/03/05/00/112542102457_OM_F.jpg' WHERE slug = 'bombshell';

    IF (SELECT COUNT(*) FROM perfumes WHERE slug IN (
      'amen-edt','black-afgano-extrait','chance-eau-tendre','good-girl-gone-bad','green-irish-tweed-edp',
      'jubilation-25-woman-edp','jubilation-xxv-man-edp','linterdit-edp','millesime-imperial-edp','musc-ravageur-edp',
      'new-york-signature-scent-pure-perfume','percival-edp','santal-33-edp','tobacco-vanille-edp','loewe-001-man-edp',
      'ambre-sultan-edp','fucking-fabulous','versace-pour-homme','eros','idole-edp','nishane-hacivat','stronger-with-you',
      'taif-edp','molecule-01','bombshell'
    )) <> 25 THEN
      RAISE EXCEPTION 'catalog-white-background-v1 expected 25 target perfumes';
    END IF;

    INSERT INTO aromia_data_fixes (key) VALUES ('catalog-white-background-v1');
  END IF;
END $$;
