// pages/SignupPage.js
import React from 'react';
import { useForm } from 'react-hook-form';
import './Auth.css'; // CSS chung cho cả trang đăng nhập và đăng ký

const SignupPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    // Thực hiện các logic đăng ký tại đây
  };

  return (
    <div className="auth-container">
      <h2>Đăng ký</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
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
