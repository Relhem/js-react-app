import React, { useEffect } from 'react';
import '../../css/body/styles.scss';
import Hierarchy from './hierarchy/Hierarchy';
import Selected from './selected/Selected';
import Search from './Search';
import { useDispatch, useSelector } from 'react-redux';
import { selectSearchLine } from 'store/searchSlice';
import Table from './table/Table';
import { clearNodes, setSelectedNode } from 'store/hierarchySlice';

import { Trans, t, useTranslation } from 'react-i18next';

const Body = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const searchLine = useSelector(selectSearchLine);

  useEffect(() => {
    dispatch(clearNodes());
    dispatch(setSelectedNode({ nodeId: null }));
  }, [false]);

  const body = <div className="container main-container">
    <div className="row">
      <div className="col col-md-8">
        <div className="main-container__table-name">{t('Nodes hierarchy')}</div>
      </div>
      <div className="col col-md-4">
      <div className="main-container__table-name main-container__table-name_mg"></div>
      </div>
    </div>
    <div className="row mt-2">
      <div className="col-12 col-md-6 col-lg-8">
        <Search></Search>
        <div className={searchLine ? 'visible' : 'invisible'}>
          <Table></Table>
        </div>
        <div className={searchLine ? 'invisible' : 'visible'}>
          <Hierarchy></Hierarchy>
        </div>
      </div>
      <div className="col col-md-6 col-lg-4">
        <div className="selected">
          <Selected></Selected>
        </div>
      </div>
    </div>
  </div>

  return body;
};

export default Body;