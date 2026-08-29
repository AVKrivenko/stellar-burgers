import { FC, useState } from 'react';
import { useDispatch } from '../../services/store';
import { resetPassword } from '../../services/slices/userSlice';
import { ResetPasswordUI } from '../../components/ui/pages/reset-password';
import { useNavigate } from 'react-router-dom';

export const ResetPassword: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [errorText, setErrorText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');

    if (!password || !token) {
      setErrorText('Заполните все поля');
      return;
    }

    dispatch(resetPassword({ password, token }))
      .unwrap()
      .then(() => {
        navigate('/login');
      })
      .catch((err: { message: string }) => {
        setErrorText(err.message || 'Ошибка сброса пароля');
      });
  };

  return (
    <ResetPasswordUI
      password={password}
      setPassword={setPassword}
      token={token}
      setToken={setToken}
      errorText={errorText}
      handleSubmit={handleSubmit}
    />
  );
};
