import React from 'react';
import { createPortal } from 'react-dom';
import Modal from './component/modal';

export default (props) => createPortal(<Modal {...props} />, document.getElementById('portal'));
