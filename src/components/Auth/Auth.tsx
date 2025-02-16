import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import './Auth.css'

interface FormData {
  username: string
  password: string
}

export const Auth = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()
  const navigate = useNavigate()

  const onSubmit = (data: FormData) => {
    localStorage.setItem('user', JSON.stringify({ username: data.username }))
    navigate('/')
  }

  return (
    <div className="auth-container">
      <h2>Вход в систему</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="input-group">
          <label htmlFor="username">Логин</label>
          <input type="text" id="username" {...register('username', { required: 'Логин обязателен' })} />
          {errors.username && <p className="error-message">{errors.username.message}</p>}
        </div>

        <div className="input-group">
          <label htmlFor="password">Пароль</label>
          <input type="password" id="password" {...register('password', { required: 'Пароль обязателен' })} />
          {errors.password && <p className="error-message">{errors.password.message}</p>}
        </div>

        <button type="submit">Войти</button>
      </form>
    </div>
  )
}
