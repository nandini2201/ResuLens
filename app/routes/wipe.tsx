import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "~/components/Navbar";
import { usePuterStore } from "~/lib/puter";

const WipeApp = () => {
  const { auth, isLoading, error, fs, kv } = usePuterStore();
  const navigate = useNavigate();
  const [files, setFiles] = useState<FSItem[]>([]);

  const loadFiles = async () => {
    const listedFiles = (await fs.readDir("./")) as FSItem[] | undefined;
    setFiles(listedFiles || []);
  };

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate("/auth?next=/wipe");
    }
  }, [auth.isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    if (auth.isAuthenticated) loadFiles();
  }, [auth.isAuthenticated]);

  const handleDelete = async () => {
    await Promise.all(files.map((file) => fs.delete(file.path)));
    await kv.flush();
    loadFiles();
  };

  return (
    <main className="app-shell">
      <Navbar />
      <section className="settings-panel">
        <p className="eyebrow">Workspace reset</p>
        <h1>Stored app data</h1>
        {isLoading && <p className="muted-copy">Loading...</p>}
        {error && <p className="form-status">Error: {error}</p>}
        <div className="file-list">
          {files.map((file) => (
            <div key={file.id} className="file-row">
              <span>{file.name}</span>
              <small>{file.path}</small>
            </div>
          ))}
        </div>
        <button className="danger-button" onClick={handleDelete} disabled={!files.length}>
          Wipe App Data
        </button>
      </section>
    </main>
  );
};

export default WipeApp;
