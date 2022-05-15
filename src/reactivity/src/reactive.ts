import { track, trigger } from "./effect";

export function reactive(raw) {
  return new Proxy(raw, {
    get(target, key, receiver) {
      const res = Reflect.get(target, key, receiver);
      // 依赖收集
      track(target, key);
      return res;
    },
    set(target, key, value, receiver) {
      const res = Reflect.set(target, key, value, receiver);
      // 依赖触发
      trigger(target, key)
      return res;
    }
  })
}