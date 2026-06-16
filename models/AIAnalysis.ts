export interface AIAnalysis {
  id: string;
  inputTokens?: number;
  outputTokens?: number;
  output: {
    diagnostic: string;
    issues: { title: string; effect: string }[];
    actions: { title: string; effect: string }[];
    expectation: string;
  };
  createdAt: string;
}
