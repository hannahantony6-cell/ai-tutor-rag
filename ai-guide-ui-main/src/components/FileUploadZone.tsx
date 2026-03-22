import { useCallback, useState } from "react";
import { Upload, FileText, X } from "lucide-react";

interface FileUploadZoneProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
}

const FileUploadZone = ({ file, onFileChange }: FileUploadZoneProps) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped && dropped.name.endsWith(".txt")) {
        onFileChange(dropped);
      }
    },
    [onFileChange]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) onFileChange(selected);
  };

  if (file) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary px-4 py-3">
        <FileText className="h-4 w-4 shrink-0 text-primary" />
        <span className="truncate text-sm text-foreground">{file.name}</span>
        <button
          onClick={() => onFileChange(null)}
          className="ml-auto shrink-0 rounded-md p-1 text-muted-foreground transition-colors duration-[40ms] hover:bg-accent hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <label
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      className={`flex min-h-[120px] cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed transition-colors duration-[40ms] ${
        isDragOver
          ? "border-primary bg-primary/5"
          : "border-border hover:border-muted-foreground"
      }`}
    >
      <Upload className="h-5 w-5 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">
        Drop your syllabus here or click to browse
      </span>
      <span className="text-xs text-muted-foreground/60">.txt files only</span>
      <input
        type="file"
        accept=".txt"
        className="hidden"
        onChange={handleFileInput}
      />
    </label>
  );
};

export default FileUploadZone;
