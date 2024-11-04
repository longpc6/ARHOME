// pages/LoginPage.js
import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      // Gửi yêu cầu đăng nhập tới server
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/auth/login`,
        {
          loginId: data.email,  // `loginId` có thể là email, số điện thoại hoặc username
          password: data.password,
        }
      );

      // Lưu token vào localStorage
      localStorage.setItem('token', response.data.token);

      // Thông báo đăng nhập thành công và điều hướng về HomePage
      alert('Đăng nhập thành công');
      navigate('/'); // Chuyển đến màn hình HomePage
      window.location.reload(); // Làm mới trang để cập nhật lại header
    } catch (error) {
      console.error('Đăng nhập thất bại:', error.response?.data.message || 'Đăng nhập thất bại');
      alert(error.response?.data.message || 'Đăng nhập thất bại');
    }
  };

  return (
    <div className="auth-container">
      <h2>Đăng nhập</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
        <div className="form-group">
          <label htmlFor="email">Email, Tên đăng nhập hoặc Số điện thoại:</label>
          <input
            id="email"
            type="text"
            {...register('email', { required: 'Email là bắt buộc' })}
          />
          {errors.email && <p className="error">{errors.email.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Mật khẩu:</label>
          <input
            id="password"
            type="password"
            {...register('password', { required: 'Mật khẩu là bắt buộc' })}
          />
          {errors.password && <p className="error">{errors.password.message}</p>}
        </div>

        <button type="submit" className="btn-primary">Đăng nhập</button>
      </form>
    </div>
  );
};

export default LoginPage;
