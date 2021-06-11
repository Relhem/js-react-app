export const SORT_CRITERIA = { IP: 'IP', PORT: 'port', ID: 'id', NAME: 'name', PARENT: 'parentId' };

export const sortArrayByCriteria = ({ array, sortCriteria, isNumber }) => {
  const newArray = array.slice();
  const sortComparator = (a, b) => {
    if (isNumber) {
      if ( Number(a[sortCriteria]) < Number(b[sortCriteria]) ){
        return -1;
      }
      if ( Number(a[sortCriteria]) > Number(b[sortCriteria]) ){
        return 1;
      }
      return 0;
    } else {
      if ( a[sortCriteria] < b[sortCriteria] ){
        return -1;
      }
      if ( a[sortCriteria] > b[sortCriteria] ){
        return 1;
      }
      return 0;
    }
  };
  return newArray.sort(sortComparator);
};

export const searchFilter = ({ array, search, isFocusedOnIds }) => {
  if (!search) return array;
  const newArray = array.filter((nodeObject) => {
    if (isFocusedOnIds)
    if (isFocusedOnIds.includes(nodeObject.id)) return true;
    if (nodeObject.IP.includes(search)) return true;
    if (nodeObject.name.toLowerCase().includes(search.toLowerCase())) return true;
    if (nodeObject.port.toString().includes(search)) return true;
    return false;
  });
  return newArray;
}