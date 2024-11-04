// pages/SignupPage.js
import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const SignupPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      // Gửi yêu cầu đăng ký tới server
      await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/auth/register`,
        {
          username: data.username,
          fullName: data.name,
          email: data.email,
          phone: data.phone,
          password: data.password,
        }
      );

      alert('Đăng ký thành công');
      navigate('/'); // Chuyển đến màn hình HomePage
    } catch (error) {
      console.error('Đăng ký thất bại:', error.response?.data.message || 'Đăng ký thất bại');
      alert(error.response?.data.message || 'Đăng ký thất bại');
    }
  };

  return (
    <div className="auth-container">
      <h2>Đăng ký</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
        <div className="form-group">
          <label htmlFor="username">Tên đăng nhập:</label>
          <input
            id="username"
            type="text"
            {...register('username', { required: 'Tên đăng nhập là bắt buộc' })}
          />
          {errors.username && <p className="error">{errors.username.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="name">Họ và tên:</label>
          <input
            id="name"
            type="text"
            {...register('name', { required: 'Họ và tên là bắt buộc' })}
          />
          {errors.name && <p className="error">{errors.name.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            {...register('email', { required: 'Email là bắt buộc' })}
          />
          {errors.email && <p className="error">{errors.email.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="phone">Số điện thoại:</label>
          <input
            id="phone"
            type="tel"
            {...register('phone', { required: 'Số điện thoại là bắt buộc' })}
          />
          {errors.phone && <p className="error">{errors.phone.message}</p>}
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

        <button type="submit" className="btn-primary">Đăng ký</button>
      </form>
    </div>
  );
};

export default SignupPage;
