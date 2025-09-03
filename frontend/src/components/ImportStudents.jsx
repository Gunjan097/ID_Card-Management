import { useState } from "react";
import axios from "axios";

const ImportStudents = ({ onSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImport = async () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", file);

      await axios.post("/api/students/import", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Students imported successfully");
      setFile(null);
      if (onSuccess) onSuccess(); // ✅ refresh parent data
    } catch (err) {
      console.error("Error importing:", err);
      alert("Failed to import students");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      <input
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={handleFileChange}
        className="border p-1 rounded"
      />
      <button
        onClick={handleImport}
        disabled={loading}
        className="bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50"
      >
        {loading ? "Importing..." : "Import"}
      </button>
    </div>
  );
};

export default ImportStudents;
