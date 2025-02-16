import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import './Auth.css'

interface FormData {
  email: string
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
    localStorage.setItem('user', JSON.stringify({ email: data.email }))
    navigate('/')
  }

  return (
    <div className="auth-container">
      <h2>Вход в систему</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Введите ваш email"
            {...register('email', { required: 'Email обязателен' })}
          />
          {errors.email && <p className="error-message">{errors.email.message}</p>}
        </div>

        <div className="input-group">
          <label htmlFor="password">Пароль</label>
          <input
            type="password"
            id="password"
            placeholder="Введите ваш пароль"
            {...register('password', { required: 'Пароль обязателен' })}
          />
          {errors.password && <p className="error-message">{errors.password.message}</p>}
        </div>

        <button type="submit">Войти</button>
      </form>
    </div>
  )
}
