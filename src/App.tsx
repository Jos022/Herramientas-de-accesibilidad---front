import { useState } from 'react';
import { FileUploader } from './components/FileUploader';
import { AnalysisResults } from './components/AnalysisResults';
import { analyzeText, analyzePdf } from './services/api';
import type { AnalysisResponse } from './types/analysis';

export function App() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<AnalysisResponse | null>(null);

  async function handleAnalyzePdf(file: File, useMock: boolean) {
    setLoading(true);
    setError(null);
    try {
      const data = await analyzePdf(file, useMock);
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar el archivo PDF.');
    } finally {
      setLoading(false);
    }
  }

  async function handleAnalyzeText(text: string, useMock: boolean) {
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeText(text, useMock);
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar el texto.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Muestra el mensaje global de error si la API falla */}
      {error && (
        <div style={{ color: 'red', padding: '1rem', backgroundColor: '#ffebee', textAlign: 'center' }}>
          <p style={{ margin: 0 }}>🚨 {error}</p>
        </div>
      )}

      {/* Si no hay resultados aún, mostramos la pantalla principal de carga (Mockup) */}
      {!results ? (
        <FileUploader
          onAnalyzePdf={handleAnalyzePdf}
          onAnalyzeText={handleAnalyzeText}
          isLoading={loading}
        />
      ) : (
        /* Una vez que el análisis responde, mostramos la vista de resultados */
        <AnalysisResults data={results} />
      )}
    </div>
  );
}

export default App;