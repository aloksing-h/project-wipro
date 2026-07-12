import dataMapWpObj from '../../scripts/constant.js';

export default function decorate(block) {
    debugger;
  dataMapWpObj.CLASS_PREFIXES = [
    'bp-item',
    'bp-subitem',
    'bp-subitem-finelsub',
  ];
  dataMapWpObj.addIndexed(block);
}
