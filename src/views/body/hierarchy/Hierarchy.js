import { useSelector, useDispatch } from 'react-redux';
import {
  selectNodes,
  fetchInitialNodesAsync,
  selectSelectedId,
  handleDeleteAsync,
} from 'store/hierarchySlice';
import { useEffect, useState } from 'react';
import HierarchyItem from './HierarchyItem';
import 'css/body/styles.scss';
import CreateModal from 'views/body/hierarchy/CreateModal';
import DeleteModal from 'views/body/hierarchy/DeleteModal';

import { setText, showNotification } from 'store/notificationSlice';
import Loader from 'views/utils/Loader';

const Hierarchy = () => {
  const dispatch = useDispatch();

  const nodes = useSelector(selectNodes);

  const [isOpen, setIsOpen] = useState({});

  const [isLoaded, setIsLoaded] = useState(false);

  const [nodeDeletor, setNodeDeletor] = useState({
    targetId: null,
    isDeleting: false,
  });

  const [nodeCreator, setNodeCreator] = useState({
    object: {
      name: '',
      IP: '',
      port: ''
    },
    isCreating: false,
  });

  const toggleIsCreating = () => {
    if (nodeCreator.isCreating === true) {
      setNodeCreator({ ...nodeCreator, isCreating: false });
    } else {
      setNodeCreator({ ...nodeCreator, isCreating: true });      
    }
  };

  const selectedId = useSelector(selectSelectedId);

  useEffect(() => {
    dispatch(fetchInitialNodesAsync()).then((fetchResult) => {
      try {
      const { fetchedNodes } = fetchResult.payload;
      const newIsOpen = Object.assign({}, isOpen);
      fetchedNodes.forEach((nodeObject) => {
        const nodeId = nodeObject.id;
        newIsOpen[nodeId] = false;
      });
        setIsOpen(newIsOpen);
        setIsLoaded(true);
      } catch (error) {
        dispatch(showNotification({ text: `Ошибка при загрузке: ${error}`, usedClasses: 'alert-danger' }))
      }
    });
  }, [false]);
  
  const nodeElements = Object.keys(nodes).length ? (Object.keys(nodes).map((nodeIndex) => {
    const node = nodes[nodeIndex];
    if (node.parentId == null) return <div key={`${node.id}`} className="hierarchy__item">
    <HierarchyItem
      setNodeDeletor={setNodeDeletor}
      nodeCreatorProps={{ nodeCreator, setNodeCreator, toggleIsCreating }}
      openState={{ isOpen, setIsOpen }}
      node={node}
    /> </div> })) : [];

  return <div>
      {
        nodeDeletor.isDeleting ? <DeleteModal nodeDeletor={nodeDeletor} setNodeDeletor={setNodeDeletor}></DeleteModal> : ''
      }
      {
        nodeCreator.isCreating ?
        <CreateModal
          nodeCreator={nodeCreator}
          setNodeCreator={setNodeCreator}
          toggleIsCreating={toggleIsCreating}
          selectedId={selectedId}
        ></CreateModal>: ''
    }
    {
      isLoaded ?
      <div className="hierarchy">
        {nodeElements}
      </div> :
      <div className="text-center">
        <Loader></Loader>
      </div>
    }
  </div>
};
  
export default Hierarchy;
