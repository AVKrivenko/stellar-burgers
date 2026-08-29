import { FC, useState } from 'react';
import { useDispatch } from '../../services/store';
import { registerUser } from '../../services/slices/userSlice';
import { RegisterUI } from '../../components/ui/pages/register';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');

    if (!email || !userName || !password) {
      setErrorText('Заполните все поля');
      return;
    }

    dispatch(registerUser({ email, name: userName, password }))
      .unwrap()
      .catch((err) => {
        setErrorText(err.message || 'Ошибка регистрации');
      });
  };

  return (
    <RegisterUI
      email={email}
      setEmail={setEmail}
      userName={userName}
      setUserName={setUserName}
      password={password}
      setPassword={setPassword}
      errorText={errorText}
      handleSubmit={handleSubmit}
    />
  );
};
