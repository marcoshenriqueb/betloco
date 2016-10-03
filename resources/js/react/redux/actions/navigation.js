import { browserHistory } from 'react-router';

export const _logout = () => {
  window.location = "/accounts/logout/";
}

export const _login = () => {
  window.location = "/accounts/login/?next=" + window.location.pathname;
}

export const _register = () => {
  window.location = "/accounts/signup/?next=" + window.location.pathname;
}

export const _profileRoute = () => {
  browserHistory.push('/app/perfil/minhas-posicoes/');
}

export const _marketRoute = () => {
  browserHistory.push('/app/');
}
