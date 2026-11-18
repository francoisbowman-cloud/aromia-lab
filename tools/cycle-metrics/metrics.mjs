// Dependency-free cycle metrics: no fabricated speedups, no production side effects.
export function summarize(cycles) {
  if (!Array.isArray(cycles)) throw new Error('cycles_must_be_array');
  return cycles.map((c, index) => {
    if (!c || typeof c !== 'object' || !['legacy', 'container'].includes(c.method)) throw new Error(`invalid_method_${index}`);
    for (const key of ['minutes', 'featuresCompleted', 'testsPassed', 'testsRun', 'postUploadFixes']) {
      if (!Number.isFinite(c[key]) || c[key] < 0 || (key !== 'minutes' && !Number.isInteger(c[key]))) throw new Error(`invalid_${key}_${index}`);
    }
    if (c.testsPassed > c.testsRun || c.minutes === 0) throw new Error(`invalid_totals_${index}`);
    return {
      id: String(c.id ?? index + 1), method: c.method,
      minutes: c.minutes, featuresCompleted: c.featuresCompleted,
      tests: `${c.testsPassed}/${c.testsRun}`, postUploadFixes: c.postUploadFixes,
      minutesPerFeature: c.featuresCompleted ? +(c.minutes / c.featuresCompleted).toFixed(2) : null,
    };
  });
}
export function compare(cycles) {
  const rows = summarize(cycles);
  const groups = Object.fromEntries(['legacy', 'container'].map(method => {
    const subset = rows.filter(r => r.method === method);
    const minutes = subset.reduce((n,r) => n+r.minutes,0);
    const features = subset.reduce((n,r) => n+r.featuresCompleted,0);
    return [method, { cycles: subset.length, minutes, features, minutesPerFeature: features ? +(minutes/features).toFixed(2) : null }];
  }));
  return { cycles: rows, groups,
    speedup: groups.legacy.minutesPerFeature && groups.container.minutesPerFeature
      ? +(groups.legacy.minutesPerFeature / groups.container.minutesPerFeature).toFixed(2) : null };
}
