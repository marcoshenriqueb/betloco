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

export const _marketRoute = () => {
  browserHistory.push('/app/');
}

export const _profileRoute = () => {
  browserHistory.push('/app/perfil/minhas-posicoes/');
}

export const _ordersRoute = () => {
  browserHistory.push('/app/perfil/minhas-ordens/');
}

export const _historyRoute = () => {
  browserHistory.push('/app/perfil/historico-transacoes/');
}

export const _fundsRoute = () => {
  browserHistory.push('/app/perfil/fundos/');
}

export const _configRoute = () => {
  browserHistory.push('/app/perfil/minhas-configuracoes/');
}

export const _passwordReset = () => {
  window.location = '/accounts/password/change/';
}

export const togglenav = (e) => {
  e.stopPropagation();
  if (e.target.id == 'navtoggle') {
    var result = true;
  }else {
    var result = false;
  }
  return {
    type: 'UPDATE_NAV_MENU_OPEN',
    payload: result
  };
}
