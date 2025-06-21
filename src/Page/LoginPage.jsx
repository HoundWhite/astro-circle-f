import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const PasswordInput = ({
    id,
    name,
    value,
    onChange,
    placeholder,
    showPassword,
    setShowPassword,
    autoComplete = 'current-password',
  }) => (
    <div>
      <div className="relative flex items-center">
        <input
          id={id}
          name={name}
          type={showPassword ? 'text' : 'password'}
          autoComplete={autoComplete}
          required
          className="w-full rounded-xl py-1 px-3 bg-celestial-700 text-celestial-200 2xl:text-lg md:text-base text-lg italic focus:outline-none pr-10"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        <button
          type="button"
          tabIndex={-1}
          className="absolute right-3 text-celestial-200 hover:text-celestial-100 focus:outline-none"
          style={{ background: 'none', border: 'none' }}
          onClick={() => setShowPassword((v) => !v)}
          aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
        >
          {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
        </button>
      </div>
    </div>
  );

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const LoginPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState({})
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()

    // Обработка отправки формы
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError({})

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            })

            const data = await response.json()

            if (!response.ok) {
                if (data.non_field_errors) {
                    setError({ general: data.non_field_errors[0] })
                } else if (data.error) {
                    setError({ general: data.error })
                } else {
                    setError(data)
                }
                return
            }

            // Сохраняем токен и данные пользователя
            localStorage.setItem('token', data.token)
            localStorage.setItem('user', JSON.stringify({
                id: data.user_id,
                email: data.email,
                name: data.name,
                telephon: data.telephon
            }))

            // Перенаправляем на главную страницу
            navigate('/')
        } catch (err) {
            console.error('Ошибка при входе:', err)
            setError({ general: 'Произошла ошибка при попытке входа. Пожалуйста, попробуйте снова.' })
        }
    }

    return (
        // Страница входа
        <div className='flex items-center justify-center md:pt-5'>
            <div className='w-full max-w-lg'>
                {/* Форма входа */}
                <form onSubmit={handleSubmit} className='flex flex-col gap-y-7 bg-celestial-500 p-7 md:rounded-3xl rounded-b-2xl items-center'>
                    <div>  
                        <h3 className='2xl:text-2xl md:text-2xl text-xl font-bold text-center text-celestial-100'>Вход в систему</h3>
                    </div>
                {error.general && (
                    <div className="error-message">{error.general}</div>
                )}

                <div className='space-y-3 w-full text-lg'>
                    <div>
                    <label htmlFor="email" className='text-celestial-200 2xl:text-lg md:text-base text-lg italic'>эл. почта</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value)
                                setError({ ...error, email: null })
                            }}
                            required
                            className='w-full rounded-xl py-1 px-3 bg-celestial-700 text-celestial-200 2xl:text-lg md:text-base text-lg italic focus:outline-none'
                        />
                        {error.email && <div className="error-message">{error.email}</div>}
                    </div>

                    <div>
                        <label htmlFor="password" className='text-celestial-200 2xl:text-lg md:text-base text-lg italic'>Пароль</label>
                        <PasswordInput
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value)
                                setError({ ...error, password: null })
                            }}
                            placeholder="не менее 8 символов"
                            showPassword={showPassword}
                            setShowPassword={setShowPassword}
                        />
                        {error.password && <div className="error-message">{error.password}</div>}
                    </div>
                </div>

                <button 
                    type='submit' 
                    className='bg-celestial-100 py-2 px-3 rounded-xl text-celestial-900 2xl:text-xl md:text-lg text-xl font-semibold disabled:opacity-50'
                >
                        Войти
                </button>
                <div>
                        <button 
                            type='button' 
                            className='text-celestial-200 2xl:text-base md:text-sm text-sm' 
                            onClick={() => navigate('/registre')}
                        >
                            Зарегистрироваться
                        </button>
                </div> 
                
            </form>
            </div>
        </div>
    )
}

export default LoginPage