import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { handleFetchWhereAsync, selectSearchLine, setSearchLine, clearFoundNodes, setIsSearching } from 'store/searchSlice';

export default function Search() {
  const dispatch = useDispatch();
  const searchValue = useSelector(selectSearchLine);

  const [timeoutId, setTimeoutId] = useState(-1);

  const fetchWhereAsync = (name) => {
    dispatch(setIsSearching({ isSearching: true }));
    clearTimeout(timeoutId);
    if (name) {
      const id = setTimeout(() => {
        dispatch(handleFetchWhereAsync({ name })).then(() => {
          dispatch(setIsSearching({ isSearching: false }));
        });
      }, 200);
      setTimeoutId(id);
    } else {
      dispatch(setIsSearching({ isSearching: false }));
      dispatch(clearFoundNodes());
    }
  };

  return  <div className="input-group mb-3 body__search">
  <input 
    value={searchValue}
    onChange={(e) => {
      console.log(e.target.value);
      dispatch(setSearchLine({ searchLine: e.target.value }));
      fetchWhereAsync(e.target.value);}}
    type="text" className="form-control" placeholder="Search..."/>
</div>;   
}