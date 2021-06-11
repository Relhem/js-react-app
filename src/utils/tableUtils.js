export const SORT_CRITERIA = { IP: 'IP', PORT: 'port', ID: 'id', NAME: 'name', PARENT: 'parentId' };

export const SEARCH_CRITERIA = { IP: 'IP', PORT: 'port', NAME: 'name'}

export const sortArrayByCriteria = ({ array, sortCriteria, isNumber, sortOrder }) => {
  const newArray = array.slice();
  const sortComparator = (a, b) => {
    if (isNumber) {
      if ( Number(a[sortCriteria]) < Number(b[sortCriteria]) ){
        return -1 * Number(sortOrder);
      }
      if ( Number(a[sortCriteria]) > Number(b[sortCriteria]) ){
        return Number(sortOrder);
      }
      return 0;
    } else {
      if ( a[sortCriteria] < b[sortCriteria] ){
        return -1 * Number(sortOrder);
      }
      if ( a[sortCriteria] > b[sortCriteria] ){
        return Number(sortOrder);
      }
      return 0;
    }
  };
  return newArray.sort(sortComparator);
};

export function objectAndObjectInCopyAreSame({ nodes, nodesCopy, nodeId }) {
    try {
      const objectInNodes = nodes.filter((nodeObject) => nodeObject.id == nodeId)[0];
      const objectInNodesCopy = nodesCopy.slice(0).filter((nodeObject) => nodeObject.id == nodeId)[0];

      console.log('in nodes', objectInNodes);
      console.log('in copy', objectInNodesCopy);
      console.log(objectInNodes == objectInNodesCopy);

      if (objectInNodes.IP !== objectInNodesCopy.IP) return false;
      if (objectInNodes.name !== objectInNodesCopy.name) return false;
      if (objectInNodes.port !== objectInNodesCopy.port) return false;

    } catch {
      return true;
    }
    return true;
}

export const searchFilter = ({ array, search, isFocusedOnIds, searchBy }) => {
  if (!search) return array;
  const newArray = array.filter((nodeObject) => {
    if (isFocusedOnIds)
    if (isFocusedOnIds.includes(nodeObject.id)) return true;
    if (nodeObject[searchBy].toString().toLowerCase().includes(search)) return true;
    /* if (nodeObject.name.toLowerCase().includes(search.toLowerCase())) return true;
    if (nodeObject.port.toString().includes(search)) return true; */
    return false;
  });
  return newArray;
}