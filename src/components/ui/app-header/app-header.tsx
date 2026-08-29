import { FC } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  Logo,
  BurgerIcon,
  ListIcon,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import styles from './app-header.module.css';

interface AppHeaderUIProps {
  userName: string;
}

export const AppHeaderUI: FC<AppHeaderUIProps> = ({ userName }) => (
  <header className={styles.header}>
    <nav className={styles.menu}>
      <NavLink
        to='/'
        className={({ isActive }) =>
          `pt-4 pr-5 pb-4 pl-5 mr-2 ${styles.link} ${
            isActive ? styles.link_active : ''
          }`
        }
      >
        <BurgerIcon type='primary' />
        <span className='text text_type_main-default ml-2'>Конструктор</span>
      </NavLink>
      <NavLink
        to='/feed'
        className={({ isActive }) =>
          `pt-4 pr-5 pb-4 pl-5 ${styles.link} ${
            isActive ? styles.link_active : ''
          }`
        }
      >
        <ListIcon type='primary' />
        <span className='text text_type_main-default ml-2'>Лента заказов</span>
      </NavLink>
      <div className={styles.logo}>
        <Link to='/'>
          <Logo className='' />
        </Link>
      </div>
      <NavLink
        to={userName ? '/profile' : '/login'}
        className={({ isActive }) =>
          `pt-4 pr-5 pb-4 pl-5 ${styles.link} ${
            isActive ? styles.link_active : ''
          }`
        }
      >
        <ProfileIcon type='primary' />
        <span className='text text_type_main-default ml-2'>
          {userName || 'Личный кабинет'}
        </span>
      </NavLink>
    </nav>
  </header>
);
