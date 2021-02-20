import React from 'react';
import composeInput from './compose-form-field';

const HTMLInput = (props) => <input {...props} />;

HTMLInput.propTypes = {
};
HTMLInput.defaultProps = {
};

export default composeInput(HTMLInput);
export {
    HTMLInput as PureHTMLInput
}
