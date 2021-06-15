import styles from 'css/table/styles.module.scss';
import { useEffect, useState } from 'react';
import { fetchNodes, updateNode } from 'api/hierarchyAPI';
import validationUtils from 'utils/validationUtils';
import { useDispatch } from 'react-redux';
import { showNotification } from 'store/notificationSlice';

import sortSvg from 'assets/sort.svg';
import undoSvg from 'assets/undo.svg';

import Loader from 'views/utils/Loader';

import { SORT_CRITERIA, SEARCH_CRITERIA, sortArrayByCriteria, searchFilter, objectAndObjectInCopyAreSame } from 'utils/tableUtils';

let offset = 0, limit = 5;

export default function Table() {
    const dispatch = useDispatch();
    
    const [hasMore, setHasMore] = useState(true);

    const [sortOrder, setSortOrder] = useState(1);

    const [isLoaded, setIsLoaded] = useState(false);

    const [search, setSearch] = useState('');

    const [nodes, setNodes] = useState([]);

    const [nodesCopy, setNodesCopy] = useState([]);

    const [isFocusedOnIds, setIsFocusedOnIds] = useState([]);

    const [sortBy, setSortBy] = useState({ criteria: SORT_CRITERIA.ID, isNumber: true });

    const [searchBy, setSearchBy] = useState(SEARCH_CRITERIA.NAME);

    const [isLoadingNew, setIsLoadingNew] = useState(false);

    const addNewNodes = () => {
      if (search) return;
      if (!isLoadingNew && hasMore) {
        setIsLoadingNew(true);
        const currentNodes = nodes;
        fetchNodes({ params: { offset, limit }}).then((nodesResult) => {
          const newNodes = nodesResult.data;
          if (newNodes.length == 0)  {
            setHasMore(false);
          }
          newNodes.forEach((nodeObject) => {
            currentNodes.push(nodeObject);
          });
          setNodes([...currentNodes]);
          setNodesCopy([...JSON.parse(JSON.stringify(currentNodes))]);
          offset += 5;
          setIsLoadingNew(false);
        });
      }
    };

    window.onscroll = function(ev) {
      if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 50)) {
        addNewNodes();
      }
    };

    useEffect(() => {
      setIsFocusedOnIds([]);
    }, [search]);

    useEffect(() => {
      const newNodes = JSON.parse(JSON.stringify(nodesCopy));
      const nodesArray = sortArrayByCriteria({ array: newNodes, sortCriteria: sortBy.criteria, isNumber: sortBy.isNumber, sortOrder });
        setNodes(nodesArray);
        setNodesCopy(JSON.parse(JSON.stringify(nodesArray)));
    }, [sortBy, sortOrder]);

    const fetchInitialNodes = async ({ fetchedNodes }) => {
      return fetchNodes({ params: { offset, limit: 5 } }).then(async (fetchResult) => {
        if (fetchResult.data.length == 0) {
          setHasMore(false);
          return;
        }
        fetchResult.data.forEach((nodeObject) => {
          fetchedNodes.push(nodeObject);
        });
        const sortedNodes = sortArrayByCriteria({ array: fetchedNodes, sortCriteria: sortBy.criteria, isNumber: sortBy.isNumber, sortOrder });
        const sortedNodesCopy = JSON.parse(JSON.stringify(sortedNodes));
        setNodes([...sortedNodes]);
        setNodesCopy([...sortedNodesCopy]);
        offset += 5;
        if (window.innerWidth <= document.body.clientWidth) {
          await new Promise((resolve) => {
            setTimeout(() => {
              fetchInitialNodes({ fetchedNodes });
              resolve();
            }, 0);
          });
        }
      });
    };

    useEffect(async () => {
      offset = 0;
      await fetchInitialNodes({ fetchedNodes: [] });
      setIsLoaded(true);
    }, [false]);

    const handleSave = ({ nodeObject }) => {
      updateNode(nodeObject.id, nodeObject).then(() => {
        const copyArray = JSON.parse(JSON.stringify(nodes));
        setNodesCopy(copyArray);       
        dispatch(showNotification({ text: `✓ Узел «${nodeObject.name}» (ID: ${nodeObject.id}) успешно обновлён`, usedClasses: "custom-notification_info" }));
      }).catch((error) => {
        const message = error.response.data.message;
        dispatch(showNotification({ text: `Ошибка: ${message}`, usedClasses: 'custom-notification_danger' }));
      });
    };

    const revert = ({ nodeId }) => {
      try {
        const objectInNodes = nodes.filter((nodeObject) => nodeObject.id == nodeId)[0];
        const objectInNodesCopy = nodesCopy.slice(0).filter((nodeObject) => nodeObject.id == nodeId)[0];
        objectInNodes.IP = objectInNodesCopy.IP;
        objectInNodes.port = objectInNodesCopy.port;
        objectInNodes.name = objectInNodesCopy.name;
        setNodes([...nodes]);
      } catch (error) {
        console.error(error);
        dispatch(showNotification({ text: 'Ошибка: не удалось вернуть состояние', usedClasses: 'custom-notification_danger' }));
      }
    };

    const sortOrderElement = <div className={`d-flex d-align-items-center ${styles['custom-select']}`}>
      <div className="d-inline-block" style={{marginRight: '12px', marginTop: '3px'}}> Сортировать </div>
      <div className="d-inline-block">
        <select value={sortOrder} className={`form-select form-select-sm ${styles['select']}`}
          onChange={() => {
            const newValue = sortOrder * -1;
            setSortOrder(newValue);
          }} >
          <option value={1}>По возрастанию</option>
          <option value={-1}>По убыванию</option>
        </select>
      </div>
    </div>

    const nodesElements = searchFilter({ array: nodes, search, isFocusedOnIds, searchBy }).map((nodeObject) => {
      return <tr key={nodeObject.id}>
            <th scope="row">
              <div className={`${styles['table-text-middle']} text-left`}>
                {nodeObject.id}
              </div>
            </th>
            <td>
            <div className="input-group">
          <input style={{minWidth: '100px'}}
            onFocus={() => { const focusedOn = isFocusedOnIds.slice();
              if (!focusedOn.includes(nodeObject.id)) focusedOn.push(nodeObject.id);
              setIsFocusedOnIds(focusedOn) }}
            value={nodeObject.name}
            onChange={(e) => { 
              const newName = e.target.value;
              nodeObject.name = newName;
              const newNodes = nodes.slice();
              setNodes(newNodes);
             }}
            type="text" className={`form-control`}
            placeholder="Имя"/>
        </div>
            </td>
            <td>
              <div className={`input-group ${styles['table-container__input']}`}>
                <input
                  onFocus={() => { const focusedOn = isFocusedOnIds.slice();
                    if (!focusedOn.includes(nodeObject.id)) focusedOn.push(nodeObject.id);
                    setIsFocusedOnIds(focusedOn) }}
                  value={nodeObject.IP}
                  onChange={(e) => { 
                    const newIp = e.target.value;
                    nodeObject.IP = newIp;
                    const newNodes = nodes.slice();
                    setNodes(newNodes);
                  }}
                  type="text" className={`form-control ${ nodeObject.IP && !validationUtils.checkIP(nodeObject.IP) ? 'is-invalid' : '' }`}
                  placeholder="IP-адрес"/>
                  <div className="invalid-feedback">
                    IP-адрес введён некорректно
                  </div>
              </div>
            </td>
            <td>
              <div className={`input-group ${styles['table-container__input']}`}>
                <input
                  onFocus={() => { const focusedOn = isFocusedOnIds.slice();
                    if (!focusedOn.includes(nodeObject.id)) focusedOn.push(nodeObject.id);
                    setIsFocusedOnIds(focusedOn) }}
                    value={nodeObject.port}
                    onChange={(e) => { 
                    const newPort = e.target.value;
                    nodeObject.port = newPort;
                    const newNodes = nodes.slice();
                    setNodes(newNodes);
                  }}
                  type="text" className={`form-control ${ nodeObject.port && !validationUtils.checkPort(nodeObject.port) ? 'is-invalid' : '' }`}
                  placeholder="Порт" aria-label="Введите порт..."/>
                  <div className="invalid-feedback">
                    Значение порта введено некорректно
                  </div>
              </div>
            </td>

            <td>
            <div className={`${styles['table-text-middle']} text-center`}>
                {nodeObject.parentId}
              </div>
            </td>
            <td>
              {
                !objectAndObjectInCopyAreSame({ nodes, nodesCopy, nodeId: nodeObject.id }) ?
                <img onClick={() => { revert({ nodeId: nodeObject.id }) }}
                  src={undoSvg}
                  className={styles['undo-img']}></img>
                : ''
              }
              
              <button className="float-end"
              onClick={() => { handleSave({ nodeObject }) }}
              disabled={
                objectAndObjectInCopyAreSame({ nodes, nodesCopy, nodeId: nodeObject.id })
                || !(nodeObject.name && nodeObject.name.trim() )
                || !nodeObject.IP || !validationUtils.checkIP(nodeObject.IP) 
                || !nodeObject.port || !validationUtils.checkPort(nodeObject.port) }
              className="btn btn-primary">Сохранить</button>
            </td>
      </tr>
    });

    return <div className={`container ${styles['table-container']} overflow-auto`}>
      {
        isLoaded ? <div>
          <div>
            <div className="d-flex d-flex-row mb-3">
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value) }}
                type="text" className="form-control" placeholder="Поиск..."/>
              <div className="input-group-append" style={{marginLeft: "3px", minWidth: '100px'}}>
              <select value={searchBy} className={`form-select ${styles['select']}`}
          onChange={(e) => {
            const newValue = e.target.value;
            setSearchBy(newValue);
          }} >
          <option value={SEARCH_CRITERIA.NAME}>Имя</option>
          <option value={SEARCH_CRITERIA.IP}>IP</option>
          <option value={SEARCH_CRITERIA.PORT}>Порт</option>
        </select>
              </div>
            </div>
          </div>
          { sortOrderElement }
          <table className='table'>
            <thead>
              <tr className="table">
                <th style={{whiteSpace: 'nowrap'}} className={styles['no-bottom-line']} scope="col">
                  #
                  <img alt="Сортировка"
                  onClick={() => { setSortBy({ criteria: SORT_CRITERIA.ID, isNumber: true, sortOrder });
                    dispatch(showNotification({ text: '✓ Отсортировано по ID узла', usedClasses: 'custom-notification_info' }));
                  }}
                  src={sortSvg} className={`${styles['sort-image']} ${sortBy.criteria == SORT_CRITERIA.ID ? styles['filter-icon'] : ''}`}></img>
                </th>
                <th className={styles['no-bottom-line']} scope="col">
                  Узел
                  <img alt="Сортировка"
                  onClick={() => { setSortBy({ criteria: SORT_CRITERIA.NAME, isNumber: false, sortOrder });
                    dispatch(showNotification({ text: '✓ Отсортировано по имени узла', usedClasses: 'custom-notification_info' }));
                  }}
                  src={sortSvg} className={`${styles['sort-image']} ${sortBy.criteria == SORT_CRITERIA.NAME ? styles['filter-icon'] : ''}`}></img>
                </th>
                <th className={styles['no-bottom-line']} scope="col">
                  IP
                  <img alt="Сортировка"
                  onClick={() => { setSortBy({ criteria: SORT_CRITERIA.IP, isNumber: false, sortOrder });
                    dispatch(showNotification({ text: '✓ Отсортировано по IP узла', usedClasses: 'custom-notification_info' }));
                  }}
                  src={sortSvg} className={`${styles['sort-image']} ${sortBy.criteria == SORT_CRITERIA.IP ? styles['filter-icon'] : ''}`}></img>
                </th>
                <th className={styles['no-bottom-line']} scope="col">
                  Порт
                  <img alt="Сортировка"
                  onClick={() => { setSortBy({ criteria: SORT_CRITERIA.PORT, isNumber: true, sortOrder }); 
                    dispatch(showNotification({ text: '✓ Отсортировано по значению порта узла', usedClasses: 'custom-notification_info' }));}}
                  src={sortSvg} className={`${styles['sort-image']} ${sortBy.criteria == SORT_CRITERIA.PORT ? styles['filter-icon'] : ''}`}></img>
                </th>
                <th style={{whiteSpace: 'nowrap'}} className={styles['no-bottom-line']} scope="col">
                  Родитель
                  <img alt="Сортировка"
                  onClick={() => { setSortBy({ criteria: SORT_CRITERIA.PARENT, isNumber: true, sortOrder });
                    dispatch(showNotification({ text: '✓ Отсортировано по родителю узла', usedClasses: 'custom-notification_info' }));
                  }}
                  src={sortSvg} className={`${styles['sort-image']} ${sortBy.criteria == SORT_CRITERIA.PARENT ? styles['filter-icon'] : ''}`}></img>
                </th>
                <th className={styles['no-bottom-line']}></th>
              </tr>
            </thead>
            <tbody>
              {
                nodesElements
              }
            </tbody>
          </table>
        </div> : <div className="text-center mb-3 mt-3" style={{height: '70px'}}> <Loader></Loader> </div>
      }

        { (isFocusedOnIds.length == 0) && (isLoaded) &&
        searchFilter({ array: nodes, search, isFocusedOnIds, searchBy }).length == 0 ? <div className="mt-3 mb-3 text-center">
          Ничего не найдено
        </div> : ''
        }
        {
          hasMore && !search ?
          <div onClick={() => { addNewNodes() }} className={styles['down-arrow-block']}>
            <div>&#8675;</div>
          </div>  : ''
        }
    </div>
}
