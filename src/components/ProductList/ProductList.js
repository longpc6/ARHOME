// // src/components/ProductList.js
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import ProductCard from './ProductCard'; // Component để hiển thị mỗi sản phẩm (đã tạo sẵn)

// const ProductList = () => {
//   const [products, setProducts] = useState([]); // State để lưu danh sách sản phẩm
//   const [loading, setLoading] = useState(true); // State để theo dõi quá trình tải dữ liệu
//   const [error, setError] = useState(null); // State để lưu lỗi (nếu có)

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await axios.get('http://localhost:3000/api/products'); // Thay thế bằng URL thật của API
//         setProducts(response.data);
//         setLoading(false);
//       } catch (err) {
//         setError("Could not fetch products");
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   if (loading) return <p>Loading products...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div className="product-list">
//       {products.map(product => (
//         <ProductCard key={product._id} product={product} />
//       ))}
//     </div>
//   );
// };

// export default ProductList;
