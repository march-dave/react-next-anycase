export type PersonaResponses = {
  factChecker?: string;
  contextProvider?: string;
  comedyWriter?: string;
  newsAnchor?: string;
};

export type TranscriptSegment = {
  id: string;
  text: string;
  personaResponses?: PersonaResponses;
};
