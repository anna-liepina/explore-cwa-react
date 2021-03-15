import React from 'react';
import { createPortal } from 'react-dom';
import Drawer from './component/drawer';

export default (props) => createPortal(<Drawer {...props} />, document.getElementById('drawer'));
