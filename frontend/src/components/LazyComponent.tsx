import React from 'react';

interface LazyComponentProps {
  title?: string;
  data?: string[];
}

const LazyComponent: React.FC<LazyComponentProps> = ({ 
  title = "Default Title", 
  data = [] 
}) => {
  return (
    <div className="p-6 bg-blue-50 rounded-lg border">
      <h3 className="text-lg font-semibold text-blue-800">{title}</h3>
      <p className="text-blue-600 mt-2">This component was loaded lazily!</p>
      {data.length > 0 && (
        <ul className="mt-4 space-y-1">
          {data.map((item, index) => (
            <li key={index} className="text-sm text-blue-700">• {item}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LazyComponent;