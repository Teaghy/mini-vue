export function toRawType(value: any) {
  return Object.prototype.toString.call(value).slice(8, -1);
}

export function isObject(value) {
  // console.log(toRawType(value))
  return toRawType(value) === 'Object';
}
