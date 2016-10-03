import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, browserHistory } from 'react-router';
import {Provider} from 'react-redux';
import {store} from './react/redux/store';
// Here we put our React instance to the global scope. Make sure you do not put it
// into production and make sure that you close and open your console if the
// DEV-TOOLS does not display
// window.React = React;
import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();
import App from './react/App.jsx';
import MarketContainer from './react/components/MarketContainer.jsx';
import ProfileContainer from './react/components/ProfileContainer.jsx';
import MarketDetailContainer from './react/components/MarketDetailContainer.jsx';
import EventDetailContainer from './react/components/EventDetailContainer.jsx';
import Position from './react/components/profile/position/Position.jsx';
import MyHistory from './react/components/profile/history/MyHistory.jsx';
import Funds from './react/components/profile/funds/Funds.jsx';
import MyOrders from './react/components/profile/order/MyOrders.jsx';
import MyConfig from './react/components/profile/config/MyConfig.jsx';

ReactDOM.render((
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route component={App}>
        <Route path="/app/" component={MarketContainer} />
        <Route path="/app/perfil" component={ProfileContainer}>
          <Route path="minhas-posicoes" component={Position}/>
          <Route path="minhas-ordens" component={MyOrders}/>
          <Route path="historico-transacoes" component={MyHistory}/>
          <Route path="fundos" component={Funds}/>
          <Route path="minhas-configuracoes" component={MyConfig}/>
        </Route>
        <Route path="/app/mercado/:id" component={MarketDetailContainer} />
        <Route path="/app/evento/:id" component={EventDetailContainer} />
      </Route>
    </Router>
  </Provider>
), document.getElementById('app'))

// ReactDOM.render(<App />, document.getElementById('app'));
