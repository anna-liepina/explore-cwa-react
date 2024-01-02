import React from 'react';
import type { PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';
import Drawer from './component/drawer/drawer';

interface IPortalProps extends PropsWithChildren {
    onClose?: () => void;
}

const Portal: React.FC<React.ComponentPropsWithRef<'div'> & IPortalProps> = 
    (props: any) => createPortal(<Drawer {...props} />, document.getElementById('portal')!);

export default Portal;