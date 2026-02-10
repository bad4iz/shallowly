/**
 * Derives readable component/tag name for React element `type` values,
 * including exotic wrappers like `forwardRef` and `memo`.
 *
 * @param {*} type - React element type.
 * @returns {string} Human-friendly type name.
 */
export function getElementTypeName(type) {
  if (typeof type === 'string') {
    return type;
  }

  if (typeof type === 'function') {
    return type.displayName || type.name || 'Unknown';
  }

  if (type && typeof type === 'object') {
    if (type.displayName) {
      return type.displayName;
    }

    if (typeof type.render === 'function') {
      return type.render.displayName || type.render.name || 'ForwardRef';
    }

    if (type.type) {
      return getElementTypeName(type.type);
    }
  }

  return 'Unknown';
}
