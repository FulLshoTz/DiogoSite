import React from 'react';

const RawDataViewer = ({ queryResult }) => {
  if (!queryResult || !queryResult.data || queryResult.data.length === 0) {
    return <p className="text-neutral-500 mt-4">Nenhum resultado para exibir ou a query não retornou dados.</p>;
  }

  const { title, data } = queryResult;

  // Extract headers from the first data object
  const headers = Object.keys(data[0]);

  return (
    <div className="mt-6">
      <h4 className="text-md font-semibold text-red-400 mb-2">{title}</h4>
      <div className="overflow-x-auto border border-neutral-800 rounded-lg">
        <table className="min-w-full divide-y divide-neutral-700 text-sm">
          <thead className="bg-neutral-800">
            <tr>
              {headers.map((header) => (
                <th key={header} scope="col" className="px-4 py-2 text-left font-medium text-neutral-300 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-neutral-900 divide-y divide-neutral-800">
            {data.map((row, index) => (
              <tr key={index}>
                {headers.map((header) => (
                  <td key={header} className="px-4 py-2 whitespace-nowrap text-neutral-400 font-mono">
                    {/* Render complex objects as strings for readability */}
                    {typeof row[header] === 'object' && row[header] !== null
                      ? JSON.stringify(row[header])
                      : row[header]?.toString() ?? 'null'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RawDataViewer;