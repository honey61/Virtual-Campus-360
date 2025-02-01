import React, { useEffect } from 'react';

const Popup = ({ visible, onEmailSubmit }) => {
  if (!visible) return null;

  return (
    <EmailPopup onEmailSubmit={(email) => onEmailSubmit(email)} />
  );
};

export default Popup;
