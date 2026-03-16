
/**
 * Utility to parse AI responses containing <TAGS> into structured compartments.
 */
export const parseCompartments = (content: string): Record<string, string> => {
  const sections: Record<string, string> = {};
  const tags = ['STANDPUNT', 'ANALYSE', 'NUANCE', 'ADVIES'];

  tags.forEach(tag => {
    const regex = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, 'i');
    const match = content.match(regex);
    if (match && match[1]) {
      sections[tag] = match[1].trim();
    }
  });

  // Fallback: If no tags found, put alles in 'GENERAL'
  if (Object.keys(sections).length === 0) {
    sections['GENERAL'] = content.trim();
  }

  return sections;
};
