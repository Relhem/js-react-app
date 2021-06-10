import { selectBuiltTree, selectNodes, selectSelectedId } from "../../../store/hierarchySlice";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedNode,
  handleFetchChildrenForIdAsync,
} from 'store/hierarchySlice';
import hierarchyUtils from 'utils/hierachyUtils';

const childrenElements = (params) => {
  const { children, nodes, isOpen, setIsOpen, nodeCreator, setNodeCreator, toggleIsCreating, setNodeDeletor } = params;
  if (children) return children.filter((childId) => {
    const childObject = nodes[childId];
    const shouldBeVisible = hierarchyUtils.checkVisibility(childObject, nodes, isOpen);
    if (shouldBeVisible) return true;
    return false;
  }).map((childId) => {
    const childObject = nodes[childId];
    return <div key={childId} className="hierarchy__item hierarchy__item_inner">
        <div className="hierarchy__line"></div>
        <HierarchyItem
          setNodeDeletor={setNodeDeletor}
          nodeCreatorProps={{ nodeCreator, setNodeCreator, toggleIsCreating }}
          openState={{isOpen, setIsOpen}}
          node={childObject}>
         </HierarchyItem>
    </div>
  });
};

export default function HierarchyItem(props) {
    const nodes = useSelector(selectNodes);
    const { node } = props;

    const { isOpen, setIsOpen } = props.openState;
    const { nodeCreator, setNodeCreator, toggleIsCreating } = props.nodeCreatorProps;

    const dispatch = useDispatch();

    const builtTree = useSelector(selectBuiltTree);

    const { setNodeDeletor } = props;

    const handleFetch = (nodeId) => {
      if (isOpen[nodeId]) {
        setIsOpen({ ...isOpen , [nodeId]: false });
      } else {
        dispatch(handleFetchChildrenForIdAsync({ id: node.id })).then((fetchResult) => {
          const { fetchedNewNodes } = fetchResult.payload;
          const newIsOpen = Object.assign({}, isOpen);
          fetchedNewNodes.forEach((nodeObject) => {
            newIsOpen[nodeObject.id] = false;
          });
          newIsOpen[nodeId] = true;
          setIsOpen(newIsOpen);
        });
      }
    };

    let nameClasses = `hierarchy__row__name`;
    const selectedId = useSelector(selectSelectedId);
    if (selectedId === node.id) nameClasses = `hierarchy__row__name hierarchy__row__name_selected`;
    return <div className="hierarchy__row">
      <div onClick={() => { handleFetch(node.id) }}>
        {
          builtTree[node.id] && builtTree[node.id].length > 0 ? <div className="hierarchy__triangle">
          { isOpen[node.id] ? 
          <span>&#9662;</span> : <span>&#9656;</span> }
          </div> : ''
        }
      </div>
      <div>
        {
          !builtTree[node.id] ? <div>
            {
              node.parentId != null ? <div>
                <div className="hierarchy__dash"></div>
              </div>: 
                <div className="hierarchy__dash-outer"></div>
            }
          </div> : ''
        }
      </div>
      <div className={nameClasses} onClick={() => { dispatch(setSelectedNode({ nodeId: node.id })); }}>
          {node.name}
      </div>
      <div className="hierarchy__row__create-delete">
          <div onClick={() => { 
          dispatch(setSelectedNode({ nodeId: node.id }));
          toggleIsCreating(); }} className="hierarchy__row__create-delete hierarchy__row__create-delete__plus">+</div>
          <div 
          onClick={() => {
            dispatch(setSelectedNode({ nodeId: node.id }));
            setNodeDeletor({ targetId: node.id, isDeleting: true });
          }}
          className="hierarchy__row__create-delete hierarchy__row__create-delete__minus">-</div>
        </div>
      {
        builtTree[node.id] && <div>
        { childrenElements( { 
            children: builtTree[node.id],
            nodes,
            isOpen,
            setIsOpen,
            nodeCreator,
            setNodeCreator,
            toggleIsCreating,
            setNodeDeletor
          } ) }
      </div>
      }
    </div>
}