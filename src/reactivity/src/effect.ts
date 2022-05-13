let activeEffect;

export function effect(fn) {
  const effectFn = () => {
    try {
      activeEffect = effectFn;
      return fn();
    } finally {
      // todo
    }
  }
  effectFn();
  return effectFn;
}

const targetMap = new WeakMap();
// window.targetMap = targetMap;
/**
 * 
 * target设计成weakMap 存储副作用
 */
// {
//   [target]: { reactive 作为key value是一个map结构
//     [key]: [] key是reactive中的键值， value是set
//   }
// }
export function track(target, key) {
  if (!activeEffect) {
    return ;
  }
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
  let deps = depsMap.get(key);
  if (!deps) {
    depsMap.set(key, (deps = new Set()))
  }
  deps.add(activeEffect);
}

export function trigger(target, key) {
  // debugger
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  const deps = depsMap.get(key);
  if (!deps) {
    return;
  }
  deps.forEach(effectFn => {
    effectFn()
  });
}

