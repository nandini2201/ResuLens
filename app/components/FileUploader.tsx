import { type ChangeEvent, type DragEvent, useRef, useState } from "react";
import { cn, formatSize } from "~/lib/utils";

interface FileUploaderProps {
  onFileSelect?: (file: File | null) => void;
  disabled?: boolean;
}

const maxFileSize = 20 * 1024 * 1024;

const FileUploader = ({ onFileSelect, disabled = false }: FileUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");

  const selectFile = (selectedFile: File | null) => {
    setError("");

    if (!selectedFile) {
      setFile(null);
      onFileSelect?.(null);
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      setError("Only PDF resumes are supported.");
      return;
    }

    if (selectedFile.size > maxFileSize) {
      setError(`PDF must be ${formatSize(maxFileSize)} or smaller.`);
      return;
    }

    setFile(selectedFile);
    onFileSelect?.(selectedFile);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    selectFile(event.target.files?.[0] || null);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    selectFile(event.dataTransfer.files?.[0] || null);
  };

  const clearFile = () => {
    if (inputRef.current) inputRef.current.value = "";
    selectFile(null);
  };

  return (
    <div className="uploader-stack">
      <div
        className={cn(
          "upload-zone",
          isDragging && "upload-zone-active",
          file && "upload-zone-selected",
          disabled && "upload-zone-disabled"
        )}
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          id="uploader"
          type="file"
          accept="application/pdf"
          className="hidden"
          disabled={disabled}
          onChange={handleInputChange}
        />

        {file ? (
          <div className="uploader-selected-file" onClick={(event) => event.stopPropagation()}>
            <img src="/images/pdf.png" alt="PDF" />
            <div>
              <p>{file.name}</p>
              <span>{formatSize(file.size)}</span>
            </div>
            <button type="button" onClick={clearFile} disabled={disabled} aria-label="Remove selected file">
              <img src="/icons/cross.svg" alt="" />
            </button>
          </div>
        ) : (
          <div className="upload-empty">
            <img src="/icons/info.svg" alt="" />
            <div>
              <p>Drop PDF here</p>
              <span>or browse files, max {formatSize(maxFileSize)}</span>
            </div>
          </div>
        )}
      </div>
      {error && <p className="form-status">{error}</p>}
    </div>
  );
};

export default FileUploader;
