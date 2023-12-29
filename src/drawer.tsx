import React from 'react';
import { createPortal } from 'react-dom';
import Drawer from './component/drawer';

interface IPortalProps {
}

const Portal: React.FC<IPortalProps> = (props: any) => createPortal(<Drawer {...props} />, document.getElementById('drawer')!);

export default Portal;