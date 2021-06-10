
export default class {
  static checkVisibility(nodeObject, nodes, isOpen) {
    let shouldBeVisible = true;
    let { parentId } = { ...nodeObject };
    let parentObject;
    while (parentId != null && shouldBeVisible) {
      parentObject = nodes[parentId];
      if (isOpen[parentId] == false) {
        shouldBeVisible = false;
      }
      parentId = parentObject.parentId;
    }
    return shouldBeVisible;
  }
}