import { useState } from 'react';
import { database } from '@/lib/database';
import { Upload } from 'lucide-react';

export const DatabaseManager = () => {
  const [importing, setImporting] = useState(false);

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    database.importDatabase(file)
      .then(() => {
        alert('Database imported successfully! Please refresh the page to see changes.');
        window.location.reload();
      })
      .catch((error) => {
        console.error('Failed to import database:', error);
        alert('Failed to import database. Please check file format.');
      })
      .finally(() => {
        setImporting(false);
      });
  };

  return (
    <div className="flex items-center gap-2">
      <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-input bg-background text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
        <Upload className="h-4 w-4" />
        {importing ? 'Importing...' : 'Import'}
        <input
          type="file"
          accept=".json"
          onChange={handleImport}
          disabled={importing}
          className="hidden"
        />
      </label>
    </div>
  );
};
