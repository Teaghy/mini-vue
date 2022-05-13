import { isObject } from '../../shared';
import { track, trigger } from './effect';
export const reactiveMap = new WeakMap();

export function reactive(target) {
  // console.log(target)
  if (!isObject(target)) {
    return target
  }
  // console.log(target)
  const proxy = new Proxy(target, {
    //get时进行依赖收集
      get(target, key, receiver) {
          const res = Reflect.get(target, key, receiver);
          if (isObject(res)) {
            return reactive(res)
          }
          track(target, key);
          return res;
      },
      //set 通知更新
      set(target, key, value, receiver) {
          Reflect.set(target, key, value, receiver);
          trigger(target, key);
          return true;
      },
      //deleteProperty 通知更新
      deleteProperty(target, key) {
          Reflect.deleteProperty(target, key);
          return true;
      },
  })
  return proxy;
}