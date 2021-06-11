import styles from 'css/table/styles.module.scss';
import { useEffect, useState } from 'react';
import { fetchNodes, updateNode } from 'api/hierarchyAPI';
import validationUtils from 'utils/validationUtils';
import { useDispatch } from 'react-redux';
import { showNotification } from 'store/notificationSlice';

import sortSvg from 'assets/sort.svg';
import Loader from 'views/utils/Loader';

import { SORT_CRITERIA, SEARCH_CRITERIA, sortArrayByCriteria, searchFilter, objectAndObjectInCopyAreSame } from 'utils/tableUtils';
// let b = 1;
export default function Table() {
    const dispatch = useDispatch();

    const [sortOrder, setSortOrder] = useState(1);

    const [isLoaded, setIsLoaded] = useState(false);

    const [search, setSearch] = useState('');

    const [nodes, setNodes] = useState([]);

    const [nodesCopy, setNodesCopy] = useState([]);

    const [isFocusedOnIds, setIsFocusedOnIds] = useState([]);

    const [sortBy, setSortBy] = useState({ criteria: SORT_CRITERIA.ID, isNumber: true });

    const [searchBy, setSearchBy] = useState(SEARCH_CRITERIA.NAME);

    const [needsMore, setNeedsMore] = useState(false);

    /* window.onscroll = function(ev) {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
          const a = nodes;
          for (let i = 0; i < 10; i += 1) {
            a.push({ id: 100 + b, name: 'test', IP: '1.1.1.1', port: '1' });
            b += 1;
          }
          setNodes([...a]);
          console.log('AT BOTTOM');
      }
    }; */

    useEffect(() => {
      setIsFocusedOnIds([]);
    }, [search]);

    useEffect(() => {
      const nodesArray = sortArrayByCriteria({ array: nodes, sortCriteria: sortBy.criteria, isNumber: sortBy.isNumber, sortOrder });
        setNodes(nodesArray);
        setNodesCopy(nodesArray.slice());
    }, [sortBy, sortOrder]);

    useEffect(() => {
      fetchNodes().then((fetchResult) => {
        let nodesArray = sortArrayByCriteria({ array: fetchResult.data, sortCriteria: sortBy.criteria, isNumber: sortBy.isNumber, sortOrder });
        setNodes(nodesArray);
        const copyArray = JSON.parse(JSON.stringify(nodesArray));
        setNodesCopy(copyArray);
        setIsLoaded(true);
      });
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
            console.log(newValue);
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
        </div> : <div className="text-center mb-3 mt-3"> <Loader></Loader> </div>
      }

        { (isFocusedOnIds.length == 0) &&
        searchFilter({ array: nodes, search, isFocusedOnIds, searchBy }).length == 0 ? <div className="mt-3 mb-3 text-center">
          Ничего не найдено
        </div> : ''
        }
    </div>
}


    /* const [nodeCreator, setNodeCreator] = useState({
      port: '',
      name: '',
      ip: '',
      parentId: '',
    }); */