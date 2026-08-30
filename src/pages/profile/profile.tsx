import { FC, useState, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { updateUser } from '../../services/slices/userSlice';
import { ProfileUI } from '../../components/ui/pages/profile';
import { TRegisterData } from '../../utils/burger-api';

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

    const updatedFields: Partial<TRegisterData> = {};
    if (formValue.name !== user?.name) updatedFields.name = formValue.name;
    if (formValue.email !== user?.email) updatedFields.email = formValue.email;
    if (formValue.password) updatedFields.password = formValue.password;

    if (Object.keys(updatedFields).length === 0) {
      setIsFormChanged(false);
      return;
    }

    dispatch(updateUser(updatedFields)).catch((err) => {
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
