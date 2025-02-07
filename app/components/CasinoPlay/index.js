import React from 'react';
import PropTypes from 'prop-types';

const CasinoPlay = ({ url }) => {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <iframe
        src={url}
        title="description"
        style={{ width: '100%', height: '100%' }}
      ></iframe>
    </div>
  );
};

CasinoPlay.propTypes = {
  url: PropTypes.string.isRequired,
};

export default CasinoPlay;
