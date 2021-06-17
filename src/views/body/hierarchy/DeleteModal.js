import { useDispatch, useSelector } from "react-redux";
import { selectNodes } from "store/hierarchySlice";
import { showNotification } from 'store/notificationSlice';
import { handleDeleteAsync } from 'store/hierarchySlice';

import { useTranslation } from "react-i18next";

export default function DeleteModal(props) {
    const dispatch = useDispatch();
    const nodes = useSelector(selectNodes);

    const { t } = useTranslation();

    const { setNodeDeletor, nodeDeletor } = props;
    const selectedNodeName = nodes[nodeDeletor.targetId] ? nodes[nodeDeletor.targetId].name : '';

    const handleDeleteNode = () => {
      const selectedId = nodeDeletor.targetId;
      const selectedNode = Object.assign({}, nodes[selectedId]);
      dispatch(handleDeleteAsync({ selectedId: nodeDeletor.targetId })).then((deleteResult) => {
        const { nodesToDelete } = deleteResult.payload;
        setNodeDeletor({ ...nodeDeletor, isDeleting: false });
        if (nodesToDelete.length == 1) {
          dispatch(showNotification({ text: `${t('NOTIFICATION.NODE_DELETED', { nodeName: selectedNode.name })}`, usedClasses: 'custom-notification_info'}));
        } else {
          dispatch(showNotification({ text: `${t('NOTIFICATION.NODES_DELETED', { nodeNames: `${nodesToDelete.join(', #')}`})}`, usedClasses: 'custom-notification_info'}));
        }
      });
    };

    return <div className="modal-backdrop">
    <div className="custom-modal">
      <div className="modal-dialog" role="document">
        <div className="modal-content" style={{ borderStyle: 'none' }}>
          <div className="modal-header">
            <h5 className="modal-title">{`${t('Node delete')}`}</h5>
            <button
              onClick={() => setNodeDeletor({ ...nodeDeletor, isDeleting: false })}
              type="button" className="btn close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body p-3 pl-3">
          {`${t('Do you want to delete node')}`} {selectedNodeName}?
          </div>
          <div className="modal-footer">
            <button type="button"
              onClick={() => handleDeleteNode({ nodeId: nodeDeletor.targetId })}
              className="btn btn-danger">{`${t('Delete')}`}</button>
            <button 
              onClick={() => setNodeDeletor({ ...nodeDeletor, isDeleting: false })}
              type="button" className="btn btn-secondary" data-dismiss="modal">{`${t('Close')}`}</button>
          </div>
        </div>
      </div>
    </div> 
  </div>
}