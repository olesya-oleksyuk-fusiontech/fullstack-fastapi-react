import React from 'react';
import { Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import ButtonCandyPrimary from '../buttons/ButtonCandyPrimary';
import HumanIcon from '../../svg/humanIcon';
import useBreakpoints from '../../hooks/useBreakpoints';

import { oldLavender, pink } from '../../styles/colors.module.scss';
import './style.scss';

const AuthorizationScreenWrapper = (
  {
    headerLogo: HeaderLogo,
    submitAuthorizationForm,
    humanIcon = false,
    loginPage,
    registerPage,
    redirect = '/home',
    children,
  },
) => {
  const viewport = useBreakpoints(window);
  const viewportsDesktop = ['lg', 'xl'];
  const viewportsMobile = ['md', 'sm', 'xs'];

  const registerPageGrid = registerPage ? 'authorization-grid--register-page' : '';
  const loginBtnPositioning = 'mt-5';
  const registerBtnPositioning = 'mt-3 mt-sm-5';

  // eslint-disable-next-line max-len
  const submitBtnPositioning = (registerPage && registerBtnPositioning) || (loginPage && loginBtnPositioning);

  return (
    <>
      <div className={`authorization-grid ${registerPageGrid}`}>
        <aside className="authorization-grid__aside-img position-relative">
          {viewportsMobile.includes(viewport)
          && (
            <>
              <p className="aside-img__header-logo position-absolute">
                <HeaderLogo fill={oldLavender} size={{ width: '58%', height: 'auto' }} />
              </p>
              <div className="candies-on-table" />
            </>
          )}
          {viewportsDesktop.includes(viewport)
          && (
            <>
              <div className="candies-on-table" />
            </>
          )}
        </aside>
        <main className="authorization-grid__authorization-content">
          { viewportsDesktop.includes(viewport)
          && (
            <>
              <p className="authorization-content__header-logo">
                <HeaderLogo />
              </p>
              { humanIcon && viewportsDesktop.includes(viewport) && (
                <div className="authorization-content__human-logo">
                  <HumanIcon
                    colors={{ circle: pink, body: '#faefee', head: '#faefee' }}
                    strokeColor="none"
                    size={{ height: '100px', width: '100px' }}
                  />
                </div>
              ) }
            </>
          ) }
          <div className="authorization-content__content-wrapper">
            <Form onSubmit={submitAuthorizationForm} className="authorization__form-wrapper">
              {children}
              <ButtonCandyPrimary
                type="submit"
                fullWidth
                className={submitBtnPositioning}
              >
                {loginPage && 'Вход'}
                {registerPage && 'Создать'}
              </ButtonCandyPrimary>
            </Form>
          </div>
          { loginPage && (
            <p className="authorization__redirect">
              Впервые у нас?
              <Link
                to={redirect ? `/register?redirect=${redirect}` : '/register'}
                style={{ marginLeft: '0.5rem' }}
                className="inline-link"
              >
                Зарегистрироваться
              </Link>
            </p>
          )}
          { registerPage && (
            <p className="authorization__redirect">
              Уже зарегистрированы?
              <Link
                to={redirect ? `/login?redirect=${redirect}` : '/login'}
                style={{ marginLeft: '0.5rem' }}
                className="inline-link"
              >
                Авторизироваться
              </Link>
            </p>
          )}
        </main>
      </div>
    </>
  );
};

export default AuthorizationScreenWrapper;
