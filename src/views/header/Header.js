import i18n from 'i18n';
import React, { useEffect, useState } from 'react';
import '../../css/header/styles.scss';


const Header = () => {
  const [language, setLanguage] = useState();
  console.log(i18n);
  useEffect(() => {
    setLanguage(i18n.language);
  }, [false]);

  const languageSelector = <div>
    <select 
      value={language}
      onChange={(e) => { setLanguage(e.target.value);
      i18n.changeLanguage(e.target.value);
      }}
      className="form-select" aria-label="Default select example">
      <option value="ru">Русский</option>
      <option value="en">English</option>
    </select>
  </div>

  const navbar = (
    <div className="navbar navbar_gray">
      <div className="navbar__left-title">
        Nodes REST
      </div>
      <div className="navbar__language-selector">
        { languageSelector }
      </div>
    </div>
  )

  return navbar;
};

export default Header;