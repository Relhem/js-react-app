import React from 'react';
import '../../css/body/styles.scss';
import Hierarchy from './hierarchy/Hierarchy';
import Selected from './selected/Selected';
import Search from './Search';
import { useSelector } from 'react-redux';
import { selectSearchLine } from 'store/searchSlice';
import Table from './table/Table';

const Body = () => {

  const searchLine = useSelector(selectSearchLine);

  const body = <div className="container main-container">
    <div className="row">
      <div className="col col-md-8">
        <div className="main-container__table-name">Иерархия узлов</div>
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