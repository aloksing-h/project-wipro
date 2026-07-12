import dataMapWpObj from '../../scripts/constant.js';

export default function decorate(block) {
  dataMapWpObj.CLASS_PREFIXES = [
    'bp-item',
    'bp-subitem',
  ];
  dataMapWpObj.addIndexed(block);
}
