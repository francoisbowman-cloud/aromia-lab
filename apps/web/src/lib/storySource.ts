export function extractStorySource(source: string) {
  const heading = /^# ([^\r\n]+)\r?$/m.exec(source);
  if (!heading) throw new Error("Aromia: editorial source requires a story heading before rendering.");
  return {
    title: heading[1].trim(),
    body: source.slice(heading.index + heading[0].length).trim(),
  };
}
