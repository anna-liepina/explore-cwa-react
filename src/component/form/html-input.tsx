import React from 'react';
import type { InputHTMLAttributes } from 'react';
import composeInput from './compose-form-field';

const HTMLInput: React.FC<InputHTMLAttributes<HTMLInputElement>> = (props) => <input {...props} />;

export default composeInput(HTMLInput);
export { HTMLInput as PureHTMLInput };
