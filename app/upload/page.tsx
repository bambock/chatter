"use client";

import { useState } from "react";
import { uploadFile } from "./actions";

export default function UploadPage() {
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    const result = await uploadFile(formData);
    if (result.error) {
      setError(result.error);
    } else {
      setError(null);
      alert("File uploaded and data stored!");
    }
  }

  return (
    <div>
      <h1>Upload Chat Data</h1>
      <form action={handleSubmit}>
        <input type="file" name="file" accept=".json" required />
        <button type="submit">Upload</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
