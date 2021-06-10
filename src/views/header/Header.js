import React from 'react';
import '../../css/header/styles.scss';

const header = () => {

  const navbar = (
    <div className="navbar navbar_gray">
      <div className="navbar__left-title">
        Nodes REST
      </div>
    </div>
  )

  return navbar;
};

export default header;