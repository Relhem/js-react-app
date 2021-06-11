import { useDispatch, useSelector } from "react-redux";
import { selectNodes } from "store/hierarchySlice";
import { showNotification } from 'store/notificationSlice';
import { handleCreateAsync } from 'store/hierarchySlice';
import validationUtils from "utils/validationUtils";

export default function CreateModal(props) {
    const dispatch = useDispatch();
    const nodes = useSelector(selectNodes);

    const { nodeCreator,  setNodeCreator, toggleIsCreating, selectedId } = props;

    const createNode = (nodeCreator, toggleIsCreating) => {
      const nodeName = nodeCreator.object.name;
      if (nodeName.trim() == '') {
        dispatch(showNotification({ text: `Ошибка: не задано имя`, usedClasses: 'custom-notification_danger' }));
        toggleIsCreating();
        return;
      }
      dispatch(handleCreateAsync({ nodeCreator, toggleIsCreating })).then((result) => {
        if (result.error) {
          const error = JSON.parse(result.error.message);
          dispatch(showNotification({ text: `Ошибка: ${error.data.message}`, usedClasses: 'custom-notification_danger' }));
          toggleIsCreating();  
        } else {
          dispatch(showNotification({ text: `✓ Узел «${nodeName}» успешно создан`, usedClasses: 'custom-notification_success' }));
          toggleIsCreating(); 
        }
      });
    };

    return <div className="modal-backdrop">
    <div className="custom-modal">
      <div className="modal-dialog" role="document">
        <div className="modal-content" style={{ borderStyle: 'none' }}>
          <div className="modal-header">
            <h5 className="modal-title">Новый узел</h5>
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
    className="form-control" placeholder="Имя узла" aria-label="Введите имя узла..."/>
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
      placeholder="IP-адрес" aria-label="Введите IP узла..."/>
      <div className="invalid-feedback">
        IP-адрес введён некорректно
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
        && !validationUtils.checkPort(nodeCreator.object.port) ? 'is-invalid' : ''}`} placeholder="Web-порт" aria-label="Введите порт..."/>
      <div className="invalid-feedback">
        Неверное значение порта
      </div>
  </div>
              
          </div>
          <div className="modal-footer">
            <button type="button"
              disabled={!nodeCreator.object.name || !nodeCreator.object.port || !nodeCreator.object.IP || 
                !validationUtils.checkPort(nodeCreator.object.port) || !validationUtils.checkIP(nodeCreator.object.IP)}
              onClick={() => { createNode(nodeCreator, toggleIsCreating) }}
              className="btn btn-primary">Создать</button>
            <button 
              onClick={() => toggleIsCreating()}
              type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
          </div>
        </div>
      </div>
    </div> 
  </div>
}