import { useDispatch, useSelector } from "react-redux"
import { selectSelectedId, setNodeById, setSelectedNode } from "store/hierarchySlice";
import { selectFoundNodes, selectIsSearching, selectSearchLine } from "store/searchSlice"

import Loader from 'views/utils/Loader';

import { useTranslation } from "react-i18next";

export default function Table() {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const foundNodes = useSelector(selectFoundNodes);
    const selectedNodeId = useSelector(selectSelectedId);
    const searchLine = useSelector(selectSearchLine);
    const isSearching = useSelector(selectIsSearching);

    const nodeElements = Object.keys(foundNodes).map((nodeIndex) => {
      const nodeObject = foundNodes[nodeIndex];
      return <div key={nodeObject.name}>
        <div className="custom-table__dash"></div>
        <div className={`custom-table__row ${selectedNodeId === nodeObject.id ? 'custom-table__row_selected' : ''}`}
          onClick={() => {
            dispatch(setNodeById({ nodeId: nodeObject.id, options: nodeObject }))
            dispatch(setSelectedNode({ nodeId: nodeObject.id })) }}>
          { nodeObject.name }
        </div>
      </div>
    });

    return <div>
      {
        isSearching ?  <div className="custom-table__no-entries">
        <Loader/>
      </div> : <div> {
        Object.keys(foundNodes).length == 0 && searchLine ? <div className="custom-table__no-entries">
          {t('Nothing is found')}
        </div> : '' }
        </div>
      }
    <div className="custom-table">
      {!isSearching ? nodeElements : ''}
    </div>
  </div>
}