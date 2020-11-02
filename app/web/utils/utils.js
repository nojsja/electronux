
const path = require('path');

/**
* @name: jsonstr2Object
* @description: 去除shell返回的json字符串内容的最后一个','符号，并转化成对象
*/
export function jsonstr2Object (_str) {
  let str = _str;

  try {
    str = str.substr(0, (str.length - 1));
    str = `{${str}}`;
    str = JSON.parse(str);
  } catch (e) {
    str = '{}';
    console.error(e);
  }

  return str;
};


/* 转换真值 */
export function boolValue(str) {
  if (str === 'true') {
    return true;
  }
  if (str === 'false') {
    return false;
  }
  if (str === '') {
    return false;
  }
  return str;
}

/* str trim */
export function trim(str) {
  if (!str) {
    return '';
  }
  if (str.trim) {
    return str.trim();
  }
  return '';
}
