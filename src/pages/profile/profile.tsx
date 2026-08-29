import { FC, useState, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { updateUser } from '../../services/slices/userSlice';
import { ProfileUI } from '../../components/ui/pages/profile';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  const [isFormChanged, setIsFormChanged] = useState(false);
  const [updateUserError, setUpdateUserError] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    if (user) {
      setFormValue({
        name: user.name || '',
        email: user.email || '',
        password: ''
      });
      setIsFormChanged(false);
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
    setIsFormChanged(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateUserError(undefined);

    const data: any = {};
    if (formValue.name !== user?.name) data.name = formValue.name;
    if (formValue.email !== user?.email) data.email = formValue.email;
    if (formValue.password) data.password = formValue.password;

    if (Object.keys(data).length === 0) {
      setIsFormChanged(false);
      return;
    }

    dispatch(updateUser(data))
      .unwrap()
      .then(() => {
        setIsFormChanged(false);
      })
      .catch((err) => {
        setUpdateUserError(err.message || 'Ошибка обновления профиля');
      });
  };

  const handleCancel = () => {
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
    setIsFormChanged(false);
    setUpdateUserError(undefined);
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      updateUserError={updateUserError}
      handleSubmit={handleSubmit}
      handleCancel={handleCancel}
      handleInputChange={handleInputChange}
    />
  );
};
