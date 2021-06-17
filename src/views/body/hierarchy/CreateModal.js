import { useDispatch, useSelector } from "react-redux";
import { selectNodes } from "store/hierarchySlice";
import { showNotification } from 'store/notificationSlice';
import { handleCreateAsync } from 'store/hierarchySlice';
import validationUtils from "utils/validationUtils";

import { useTranslation } from "react-i18next";

export default function CreateModal(props) {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const nodes = useSelector(selectNodes);

    const { nodeCreator,  setNodeCreator, toggleIsCreating, selectedId } = props;

    const createNode = (nodeCreator, toggleIsCreating) => {
      const nodeName = nodeCreator.object.name;
      if (nodeName.trim() == '') {
        dispatch(showNotification({ text: `${t('Error: name is empty')}`, usedClasses: 'custom-notification_danger' }));
        toggleIsCreating();
        return;
      }
      dispatch(handleCreateAsync({ nodeCreator, toggleIsCreating })).then((result) => {
        if (result.error) {
          const error = JSON.parse(result.error.message);
          dispatch(showNotification({ text: `${t('Error')}: ${error.data.message}`, usedClasses: 'custom-notification_danger' }));
          toggleIsCreating();  
        } else {
          dispatch(showNotification({ text: `${t('NOTIFICATION.NODE_CREATED', { nodeName })}`, usedClasses: 'custom-notification_success' }));
          toggleIsCreating(); 
        }
      });
    };

    return <div className="modal-backdrop">
    <div className="custom-modal">
      <div className="modal-dialog" role="document">
        <div className="modal-content" style={{ borderStyle: 'none' }}>
          <div className="modal-header">
            <h5 className="modal-title">{`${t('New node')}`}</h5>
            <button
              onClick={() => toggleIsCreating()}
              type="button" className="btn close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">

            <div className="input-group mb-3">
    <input type="text"
    value={nodeCreator.object.name}
    onChange={(e) => {
      const newNodeCreator = Object.assign({}, nodeCreator);
      nodeCreator.object.name = e.target.value;
      setNodeCreator(newNodeCreator);
    }}
    disabled={selectedId == null}
    className="form-control" placeholder={`${t('Node name')}`} aria-label={`${t('Enter node name')}`}/>
  </div>
  <div className="input-group mb-3">
    <input
      value={nodeCreator.object.IP}
      onChange={(e) => {
        const newNodeCreator = Object.assign({}, nodeCreator);
        nodeCreator.object.IP = e.target.value;
        setNodeCreator(newNodeCreator);
      }}
      disabled={selectedId == null}
      type="text"
      className={`form-control ${nodeCreator.object.IP
        && !validationUtils.checkIP(nodeCreator.object.IP) ? 'is-invalid' : ''}`}
      placeholder={`${t('IP address')}`} aria-label={`${t('Enter node IP')}`}/>
      <div className="invalid-feedback">
        {`${t('IP address is incorrect')}`}
      </div>
  </div>
  <div className="input-group mb-3">
    <input
      onChange={(e) => {
        if (e.target.value && !validationUtils.isNumber(e.target.value)) return;
        const newNodeCreator = Object.assign({}, nodeCreator);
        nodeCreator.object.port = e.target.value;
        setNodeCreator(newNodeCreator);
      }}
      value={nodeCreator.object.port}
      disabled={selectedId == null}
      type="text" className={`form-control ${nodeCreator.object.port
        && !validationUtils.checkPort(nodeCreator.object.port) ? 'is-invalid' : ''}`} placeholder={`${t('Web-port')}`} aria-label={`${t('Enter port')}`}/>
      <div className="invalid-feedback">
        {`${t('Port is incorrect')}`}
      </div>
  </div>
              
          </div>
          <div className="modal-footer">
            <button type="button"
              disabled={!nodeCreator.object.name || !nodeCreator.object.port || !nodeCreator.object.IP || 
                !validationUtils.checkPort(nodeCreator.object.port) || !validationUtils.checkIP(nodeCreator.object.IP)}
              onClick={() => { createNode(nodeCreator, toggleIsCreating) }}
              className="btn btn-primary">{`${t('Create')}`}</button>
            <button 
              onClick={() => toggleIsCreating()}
              type="button" className="btn btn-secondary" data-dismiss="modal">{`${t('Close')}`}</button>
          </div>
        </div>
      </div>
    </div> 
  </div>
}