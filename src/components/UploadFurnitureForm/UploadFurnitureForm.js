import React, { useState } from "react";

const UploadFurnitureForm = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !name) {
      alert("Vui lòng nhập tên và chọn tệp!");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("file", file);

    setLoading(true);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload thất bại!");

      const data = await response.json();
      alert("Upload thành công!");
      onUploadSuccess(data); // Cập nhật UI
    } catch (error) {
      console.error(error);
      alert("Đã có lỗi xảy ra khi upload!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="upload-form">
      <div>
        <label>Tên đồ nội thất:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nhập tên sản phẩm"
          required
        />
      </div>
      <div>
        <label>Upload model 3D:</label>
        <input
          type="file"
          accept=".glb,.gltf"
          onChange={handleFileChange}
          required
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? "Đang upload..." : "Upload"}
      </button>
    </form>
  );
};

export default UploadFurnitureForm;
