import { useDispatch, useSelector } from "react-redux";
import { selectNodes,
  selectSelectedId,
  } from 'store/hierarchySlice';
import { useEffect, useState } from "react";

import { showNotification } from 'store/notificationSlice';

import {
  handleUpdateAsync
} from 'store/hierarchySlice';

import validationUtils from "../../../utils/validationUtils";
import { selectSearchLine, setFoundNodeById } from "store/searchSlice";

import { Trans, useTranslation } from "react-i18next";


export default function Selected() {
    const selectedId = useSelector(selectSelectedId);
    const nodes = useSelector(selectNodes);
    const searchLine = useSelector(selectSearchLine);

    const dispatch = useDispatch();
    const { t } = useTranslation();

    const [nodeName, setNodeName] = useState('');
    const [ip, setIp] = useState('');
    const [port, setPort] = useState('');
    const [id, setId] = useState('--');
    let [savedState, setSavedState] = useState({
      nodeName: '',
      ip: '',
      port: '',
      id: '',
    });

    const selectedNode = nodes[selectedId];

    useEffect(() => {
      if (selectedId) {
        setNodeName(`${selectedNode.name}`);
        setIp(selectedNode.IP);
        setPort(selectedNode.port);
        setId(selectedNode.id);
        setSavedState({ ip: selectedNode.IP,
          port: selectedNode.port,
          id: selectedNode.id,
          nodeName: selectedNode.name });
      } else {
        setNodeName('');
        setIp('');
        setPort('');
        setId('');
      }
    }, [selectedId]);

    const handleRollback = () => {
      setNodeName(savedState.nodeName);
      setIp(savedState.ip);
      setPort(savedState.port);
      setId(savedState.id);
    };

    const updateNode = (port, id, nodeName) => {
      if (nodeName.trim() === '') {
        dispatch(showNotification({ text: `${`${t('Error: name is empty')}`}`, usedClasses: 'alert-danger'}))
        return;
      }
      if (!ip || !validationUtils.checkIP(ip) || !port || !validationUtils.checkPort(port)) return;

      dispatch(handleUpdateAsync({ port, id, ip, nodeName })).then((result) => {
        if (result.error) {
          const error = JSON.parse(result.error.message);
          dispatch(showNotification({ text: `${`${t('Error')}`}: ${error.data.message}`, usedClasses: 'custom-notification_danger'}));
        } else {
          setSavedState({ ip,
            port,
            id,
            nodeName });
          if (searchLine) dispatch(setFoundNodeById({ nodeId: id, options: { ip, port, name: nodeName, id } }));
          // dispatch(showNotification({ text: `??? ???????? ??${selectedNode.name}?? (ID: ${selectedId}) ?????????????? ????????????????`, usedClasses: 'custom-notification_info' }));
          dispatch(showNotification({ text: `${t('NOTIFICATION.NODE_UPDATED', { nodeName: selectedNode.name, nodeId: selectedId })}`,
          usedClasses: 'custom-notification_info' }));
        }
      });
    };


    return <div>
      <div className="mb-3">
        <div className="text-center"><strong><Trans>Node edit</Trans></strong></div>
      </div>
      <div className="mb-3">
        ID: <div className="d-inline-block pl-1">
          {id}
        </div>
      </div>
      <div>
        <div className="input-group mb-3">
          <input type="text"
          disabled={selectedId == null}
          value={nodeName}
          onChange={(e) => { 
            setNodeName(e.target.value) }}
          className="form-control" placeholder={`${t('Node name')}`} aria-label={`${t('Enter node name')}`}/>
        </div>
        <div className="input-group mb-3">
          <input required
            disabled={selectedId == null}
            value={ip}
            onChange={(e) => { setIp(e.target.value); }}
            type="text" className={`form-control ${ ip && !validationUtils.checkIP(ip) ? 'is-invalid' : '' }`} placeholder={`${t('IP-address')}`}
            aria-label={`${t('Enter IP')}`}/>
            <div className="invalid-feedback">
            {`${t('IP address is incorrect')}`}
            </div>
        </div>
        <div className="input-group mb-3">
          <input
          disabled={selectedId == null}
          value={port}
          onChange={(e) => {
            const port = e.target.value;
            if (port && !validationUtils.isNumber(e.target.value)) return;
            setPort(port);
            }
          }
          type="text" className={`form-control ${ port && !validationUtils.checkPort(port) ? 'is-invalid' : '' }`}
          placeholder={`${t('Web-port')}`} aria-label={`${t('Input port...')}`}/>
        <div className="invalid-feedback">
            {`${t('Port is incorrect')}`}
        </div>
        </div>
      </div>
      <div className="mt-3">
          <div>
            <div className="mb-2">
              <button disabled={selectedId == null || !nodeName || nodeName.trim() == ''
                || !validationUtils.checkIP(ip) || !validationUtils.checkPort(port) }
                onClick={() => { updateNode(port, id, nodeName) }}
                type="button" className="w-100 btn btn-primary btn-block">{`${t('Save')}`}</button>
            </div>
            <div>
              <button 
                disabled={selectedId == null}
                onClick={() => { handleRollback() }}
                type="button" className="w-100 btn btn-secondary btn-block">{`${t('Cancel')}`}</button>
            </div>
          </div>
      </div>
    </div>
}
