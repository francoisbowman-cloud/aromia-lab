// A review manifest, not a computer-vision verdict or authorization to reuse photographs.
// Product names/brands are catalog assertions, not evidence that a packshot is correct.
export function buildImageReviewQueue(products, findings) {
  const bySlug = new Map();
  for (const finding of findings) {
    const affected = finding.slug ? [finding.slug] : (finding.slugs ?? []);
    for (const slug of affected) {
      const reasons = bySlug.get(slug) ?? new Set();
      reasons.add(finding.reason);
      bySlug.set(slug, reasons);
    }
  }
  return products.map(product => {
    const slug = String(product.slug ?? '').trim();
    if (!slug) throw new Error('Catalog row requires slug');
    const reasons = [...(bySlug.get(slug) ?? [])].sort();
    return {
      slug,
      catalogName: String(product.nombre ?? '').trim(),
      catalogBrand: String(product.marca ?? '').trim(),
      declaredConcentration: String(product.concentracion ?? '').trim() || null,
      imageUrl: String(product.imagen_url ?? '').trim() || null,
      signals: reasons,
      priority: reasons.some(reason => reason === 'declared_concentration_conflict_requires_review' || reason === 'concentration_requires_verification' || reason === 'missing_image') ? 'high' : reasons.length ? 'medium' : 'standard',
      identity: 'unverified',
      imageRights: 'unverified',
      visualQuality: 'unverified',
      decision: 'manual_review_required',
    };
  }).sort((a, b) => a.slug.localeCompare(b.slug));
}
export function summarizeImageReviewQueue(queue) {
  return {
    total: queue.length,
    high: queue.filter(x => x.priority === 'high').length,
    medium: queue.filter(x => x.priority === 'medium').length,
    standard: queue.filter(x => x.priority === 'standard').length,
    identityVerified: 0,
    rightsVerified: 0,
    visuallyApproved: 0,
  };
}
