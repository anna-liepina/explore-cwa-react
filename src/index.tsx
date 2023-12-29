import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import TopNav from './component/topnav/topnav';
import routes from './__config/routes';
import './index.scss';

ReactDOM.render(
    <BrowserRouter>
        <TopNav />
        <Switch>
            {
                routes.map((props, i) => <Route key={i} {...props} />)
            }
        </Switch>
    </BrowserRouter>,
    document.getElementById('root')
);
