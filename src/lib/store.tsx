import { createContext, useContext, useState, type ReactNode } from "react";
import { analyzeUser, DEMO_INPUT, type Analysis } from "./model";

interface Ctx { analysis: Analysis | null; setAnalysis: (a: Analysis | null) => void }
const AnalysisCtx = createContext<Ctx>({ analysis: null, setAnalysis: () => {} });

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  return <AnalysisCtx.Provider value={{ analysis, setAnalysis }}>{children}</AnalysisCtx.Provider>;
}
export const useAnalysis = () => useContext(AnalysisCtx);
export const demoAnalysis = () => analyzeUser(DEMO_INPUT);
