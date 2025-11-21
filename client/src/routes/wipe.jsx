import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

const WipeApp = () => {
  const { auth, isLoading, error, clearError, fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);

  const loadFiles = async () => {
    try {
      const list = await fs.readDir("./");
      setFiles(list);
    } catch (err) {
      console.error("Error reading files:", err);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate("/auth?next=/wipe");
    }
  }, [isLoading]);

  const handleDelete = async () => {
    try {
      for (const file of files) {
        await fs.delete(file.path);
      }

      await kv.flush();
      loadFiles();
    } catch (err) {
      console.error("Error deleting files:", err);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold">
        Authenticated as: {auth.user?.username}
      </h2>

      <div className="mt-4">
        <h3 className="text-md font-bold">Existing files:</h3>

        <div className="flex flex-col gap-2 mt-2">
          {files.length > 0 ? (
            files.map((file) => (
              <div key={file.id} className="flex gap-4">
                <p>{file.name}</p>
              </div>
            ))
          ) : (
            <p>No files found.</p>
          )}
        </div>
      </div>

      <div className="mt-6">
        <button
          className="bg-red-600 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-red-700"
          onClick={handleDelete}
        >
          Wipe App Data
        </button>
      </div>
    </div>
  );
};

export default WipeApp;
