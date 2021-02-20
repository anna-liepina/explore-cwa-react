import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'

const Tile = ({ className, ...props }) =>
    <Link
        {...props}
        className={`tile ${className}`}
    />;

Tile.propTypes = {
    className: PropTypes.string,
};

Tile.defaultProps = {
    className: '',
};

export default Tile;
