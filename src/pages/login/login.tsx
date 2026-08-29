import { FC, useState } from 'react';
import { useDispatch } from '../../services/store';
import { loginUser } from '../../services/slices/userSlice';
import { LoginUI } from '../../components/ui/pages/login';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');

    if (!email || !password) {
      setErrorText('Заполните все поля');
      return;
    }

    dispatch(loginUser({ email, password }))
      .unwrap()
      .catch((err) => {
        setErrorText(err.message || 'Ошибка входа');
      });
  };

  return (
    <LoginUI
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      errorText={errorText}
      handleSubmit={handleSubmit}
    />
  );
};
