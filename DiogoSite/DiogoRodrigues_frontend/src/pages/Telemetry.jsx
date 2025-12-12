import React, { useState } from 'react';
import RawDataViewer from '../components/RawDataViewer';

const Telemetry = () => {
  // Core data state
  const [laps, setLaps] = useState([]);
  const [tempFilename, setTempFilename] = useState('');
  
  // UI State
  const [activeTab, setActiveTab] = useState('lapTimes');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedGame, setSelectedGame] = useState('lmu'); // 'lmu' or 'iracing'

  // Raw Query UI State
  const [customQuery, setCustomQuery] = useState('SELECT * FROM lmu."Lap Time" LIMIT 15;');
  const [queryResult, setQueryResult] = useState(null);
  const [isQueryLoading, setIsQueryLoading] = useState(false);
  const [queryError, setQueryError] = useState('');
  const [dbTables, setDbTables] = useState([]);

  const handleFileChange = (e) => {
    // Reset everything on new file selection
    setLaps([]);
    setTempFilename('');
    setQueryResult(null);
    setError('');
    setQueryError('');
    setDbTables([]);
    setSelectedFile(e.target.files[0]);
  };

  const handleInitialAnalysis = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Por favor, selecione um ficheiro primeiro.');
      return;
    }

    setIsLoading(true);
    setError('');
    setLaps([]);
    setTempFilename('');
    setQueryResult(null);
    setQueryError('');
    setDbTables([]);
    setActiveTab('lapTimes');

    const formData = new FormData();
    formData.append('telemetryFile', selectedFile);

    try {
      const response = await fetch('/api/telemetry/analyze', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Ocorreu um erro na análise inicial.');
      if (!data.laps || data.laps.length === 0) {
        setError('Nenhuma volta encontrada no ficheiro de telemetria.');
      } else {
        setLaps(data.laps);
        setTempFilename(data.temp_filename); // Save the filename for future queries
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunQuery = async (queryToRun, title) => {
    if (!tempFilename) {
      setQueryError('Execute a análise inicial primeiro.');
      return;
    }

    setIsQueryLoading(true);
    setQueryError('');
    setQueryResult(null);

    try {
      const response = await fetch('/api/telemetry/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: tempFilename, query: queryToRun }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Ocorreu um erro na query.');
      
      // If we are listing tables, populate the dbTables state
      if (queryToRun.trim().toUpperCase() === 'SHOW ALL TABLES;') {
        setDbTables(data);
      } else {
        setQueryResult({ title: title || `Resultado para: ${queryToRun}`, data });
      }

    } catch (err) {
      setQueryError(err.message);
    } finally {
      setIsQueryLoading(false);
    }
  };


  const renderContent = () => {
    if (activeTab === 'lapTimes') {
      return (
        <div>
          <h3 className="text-lg font-bold text-neutral-200 mb-3">Tempos de Volta Calculados</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-700">
              <thead className="bg-neutral-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Volta #</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Tempo Final</th>
                </tr>
              </thead>
              <tbody className="bg-neutral-900 divide-y divide-neutral-800">
                {laps.map((lap) => (
                  <tr key={lap.lapNumber}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{lap.lapNumber}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-mono ${lap.valid ? 'text-neutral-300' : 'text-red-500 font-bold'}`}>{lap.formatted}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (activeTab === 'rawData') {
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-neutral-200 mb-3">Explorador da Base de Dados</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => handleRunQuery('SHOW ALL TABLES;', 'Tabelas na Base de Dados')}
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
              >
                Listar Todas as Tabelas
              </button>
            </div>

            {dbTables.length > 0 && (
              <div className="mb-4 p-4 border border-neutral-700 rounded-lg">
                <h4 className="font-semibold text-neutral-300 mb-2">Tabelas encontradas:</h4>
                <div className="flex flex-wrap gap-2">
                  {dbTables.map((table, idx) => (
                    <div key={idx} className="flex gap-1">
                      <button
                        onClick={() => handleRunQuery(`SELECT * FROM ${selectedGame}."${table.name}" LIMIT 20;`, `Preview da Tabela: ${table.name}`)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded-lg transition-colors text-xs"
                      >
                        {table.name}
                      </button>
                      <button
                        onClick={() => handleRunQuery(`DESCRIBE SELECT * FROM ${selectedGame}."${table.name}";`, `Schema da Tabela: ${table.name}`)}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-1 px-3 rounded-lg transition-colors text-xs"
                      >
                        Schema
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <h4 className="font-semibold text-neutral-300 mt-6 mb-2">Query SQL Customizada</h4>
            <textarea
              className="w-full h-24 p-2 bg-neutral-800 border border-neutral-700 rounded-md text-white font-mono text-sm"
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              placeholder='Escreva aqui a sua query SQL. Ex: SELECT "Steering" FROM lmu."Vehicle Telemetry" LIMIT 100;'
            />
            <button
              onClick={() => handleRunQuery(customQuery)}
              className="mt-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:bg-neutral-600"
              disabled={isQueryLoading}
            >
              {isQueryLoading ? 'A executar...' : 'Executar Query'}
            </button>
          </div>
          
          {isQueryLoading && <p className="text-neutral-300">A carregar resultado da query...</p>}
          {queryError && <p className="text-red-500 bg-red-900/50 p-3 rounded-md">{queryError}</p>}
          {queryResult && (
            <RawDataViewer queryResult={queryResult} />
          )}
        </div>
      );
    }

    return null;
  }

  return (
    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl shadow-lg animate-in fade-in duration-500">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-bold text-red-400">Análise de Telemetria</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedGame('lmu')}
            className={`py-2 px-4 font-semibold rounded-md transition-colors text-sm ${selectedGame === 'lmu' ? 'bg-red-600 text-white' : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'}`}
          >
            Le Mans Ultimate
          </button>
          <button
            onClick={() => setSelectedGame('iracing')}
            className="py-2 px-4 font-semibold rounded-md transition-colors text-sm bg-neutral-800 text-neutral-500 cursor-not-allowed"
            disabled
          >
            iRacing (Em breve)
          </button>
        </div>
      </div>
      
      <form onSubmit={handleInitialAnalysis} className="mb-6">
        <div className="mb-4">
          <label htmlFor="file-input" className="block text-sm font-semibold mb-2 text-neutral-300">Ficheiro de telemetria (.duckdb)</label>
          <input
            id="file-input"
            type="file"
            accept=".duckdb"
            onChange={handleFileChange}
            className="block w-full text-sm text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700"
          />
        </div>
        <button 
          type="submit" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors shadow-lg disabled:bg-neutral-600 disabled:cursor-not-allowed"
          disabled={isLoading || !selectedFile}
        >
          {isLoading ? 'A analisar...' : 'Analisar'}
        </button>
      </form>

      {isLoading && <p className="text-neutral-300">A processar a análise inicial...</p>}
      {error && <p className="text-red-500 bg-red-900/50 p-3 rounded-md">{error}</p>}

      {laps.length > 0 && (
        <div className="mt-6">
          <div className="border-b border-neutral-700 mb-4">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('lapTimes')}
                className={`${ activeTab === 'lapTimes' ? 'border-red-500 text-red-400' : 'border-transparent text-neutral-400 hover:text-neutral-200 hover:border-neutral-400' } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}
              >
                Tempos de Volta
              </button>
              <button
                onClick={() => setActiveTab('rawData')}
                className={`${ activeTab === 'rawData' ? 'border-red-500 text-red-400' : 'border-transparent text-neutral-400 hover:text-neutral-200 hover:border-neutral-400' } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}
              >
                Explorador de Dados
              </button>
            </nav>
          </div>
          {renderContent()}
        </div>
      )}
    </div>
  );
};

export default Telemetry;