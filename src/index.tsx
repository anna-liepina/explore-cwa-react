import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import TopNav from './component/topnav/topnav';
import routes from './__config/routes';
import './index.scss';

const root = createRoot(document.getElementById('root')!);
root.render(
    <BrowserRouter>
        <TopNav />
        <Switch>
            {
                routes.map((props, i) => <Route key={i} {...props} />)
            }
        </Switch>
    </BrowserRouter>
);
