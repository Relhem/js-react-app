import { useDispatch, useSelector } from "react-redux"
import { selectSelectedId, setNodeById, setSelectedNode } from "store/hierarchySlice";
import { selectFoundNodes, selectIsSearching, selectSearchLine } from "store/searchSlice"

import Loader from 'views/utils/Loader';

export default function Table() {
    const dispatch = useDispatch();

    const foundNodes = useSelector(selectFoundNodes);
    const selectedNodeId = useSelector(selectSelectedId);
    const searchLine = useSelector(selectSearchLine);
    const isSearching = useSelector(selectIsSearching);

    const nodeElements = Object.keys(foundNodes).map((nodeIndex) => {
      const nodeObject = foundNodes[nodeIndex];
      return <div key={nodeObject.name}>
        <div className="table__dash"></div>
        <div className={`table__row ${selectedNodeId === nodeObject.id ? 'table__row_selected' : ''}`}
          onClick={() => { console.log(nodeObject.id);
            dispatch(setNodeById({ nodeId: nodeObject.id, options: nodeObject }))
            dispatch(setSelectedNode({ nodeId: nodeObject.id })) }}>
          { nodeObject.name }
        </div>
      </div>
    });

    return <div>
      {
        isSearching ?  <div className="table__no-entries">
        <Loader/>
      </div> : <div> {
        Object.keys(foundNodes).length == 0 && searchLine ? <div className="table__no-entries">
          Ничего не найдено
        </div> : '' }
        </div>
      }
    <div className="table">
      {!isSearching ? nodeElements : ''}
    </div>
  </div>
}