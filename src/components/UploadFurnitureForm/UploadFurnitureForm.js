import React, { useState, useEffect } from "react";
import "./UploadFurnitureForm.css";
import axios from "axios";

const UploadFurnitureForm = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null); // Thêm trường image
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState(""); // Thêm state để lưu userId

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId || ""); // Đảm bảo userId được lưu vào state
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    console.log("Selected 3D model file:", selectedFile); // Debug thông tin file
    setFile(selectedFile);
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    console.log("Selected image file:", selectedImage); // Debug thông tin ảnh
    setImage(selectedImage);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !name || !userId) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("model3d", file); // Tệp mô hình 3D
    if (image) {
      formData.append("images", image); // Tệp ảnh
    }
    formData.append("userId", userId); // Thêm userId vào formData

    console.log("Form data to send:", formData); // Debug toàn bộ formData

    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/furnitures`,
        formData, // Gửi FormData
        {
          headers: {
            "Content-Type": "multipart/form-data", // Đảm bảo header phù hợp
            Authorization: `Bearer ${token}`, // Gửi token trong header
          },
        }
      );

      console.log("Server response:", response.data);
      setMessage("Tải lên thành công!");
      onUploadSuccess(response.data); // Gọi callback sau khi tải lên thành công
    } catch (error) {
      console.error("Error response:", error.response || error.message);
      setMessage(
        error.response?.data?.message || "Đã xảy ra lỗi trong quá trình tải lên!"
      );
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
        <label>Mô tả:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Mô tả sản phẩm"
        />
      </div>
      <div>
        <label>Chọn mô hình 3D (GLB):</label>
        <input
          type="file"
          accept=".glb,.gltf"
          onChange={handleFileChange}
          required
        />
      </div>
      <div>
        <label>Chọn ảnh:</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? "Đang tải lên..." : "Tải lên"}
      </button>
      {message && (
        <p style={{ color: message.includes("lỗi") ? "red" : "green" }}>{message}</p>
      )}
    </form>
  );
};

export default UploadFurnitureForm;
