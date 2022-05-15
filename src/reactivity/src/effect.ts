let activeEffect;
const targetMap = new Map();
class ReactiveEffect {
  // _fn: Function;
  private _fn: any;
  constructor(fn: Function) {
    // this._fn = fn;
    this._fn = fn;
  }
  run() {
    activeEffect = this;
    return this._fn();
  }
};

export function track(target, key) {
  // const dep = new Set();
  // 先检查targetMap中有没有target 
  let depsMap = targetMap.get(target);
  // 如果没有 targetMap 设置一个为一个map
  // targetMap结构为
  // {
  //   [target]: { // new Map() depsMap
  //     key: [  // new Set() deps
  //     activeEffect
  //     ] 
  //   }
  // }
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }
  let deps = depsMap.get(key);
  if (!deps) {
    deps = new Set();
    depsMap.set(key, deps);
  }
  deps.add(activeEffect);
}

export function trigger(target, key) {
  // targetMap结构为
  // {
  //   [target]: { // new Map() depsMap
  //     key: [  // new Set() deps
  //     activeEffect
  //     ] 
  //   }
  // }
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  const deps = depsMap.get(key);
  if (!deps) {
    return;
  }
  deps.forEach((effectFn) => {
    effectFn.run();
  });
}

export function effect(fn) {
  const _effect = new ReactiveEffect(fn);
  _effect.run();
  return _effect.run.bind(_effect);
}

