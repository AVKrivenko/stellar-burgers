import { FC, useState } from 'react';
import { useDispatch } from '../../services/store';
import { forgotPassword } from '../../services/slices/userSlice';
import { ForgotPasswordUI } from '../../components/ui/pages/forgot-password';
import { useNavigate } from 'react-router-dom';

export const ForgotPassword: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [errorText, setErrorText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');

    if (!email) {
      setErrorText('Введите email');
      return;
    }

    dispatch(forgotPassword({ email }))
      .unwrap()
      .then(() => {
        navigate('/reset-password');
      })
      .catch((err: { message: string }) => {
        setErrorText(err.message || 'Ошибка восстановления');
      });
  };

  return (
    <ForgotPasswordUI
      email={email}
      setEmail={setEmail}
      errorText={errorText}
      handleSubmit={handleSubmit}
    />
  );
};
