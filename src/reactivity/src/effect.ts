import { extend } from '../shared';
let activeEffect;
const targetMap = new Map();
class ReactiveEffect {
  // _fn: Function;
  private _fn: any;
  deps = [];
  active = true;
  onStop?: () => void;
  public scheduler: Function | undefined
  constructor(fn: Function, scheduler?: Function) {
    // this._fn = fn;
    this._fn = fn;
  }
  run() {
    activeEffect = this;
    // 为了返回fn的返回值
    return this._fn();
  }
  stop() {
    if (this.active) {
      if (this.onStop) {
        this.onStop();
      }
      cleanupEffect(this);
      this.active = false;
    }
  }
};

function cleanupEffect(effect) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect);
  })
}

// 收集依赖
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
  // 当没有使用effect时  没有执行run方法 导致activeEffect为undefined
  if (!activeEffect) return;
  deps.add(activeEffect);
  activeEffect.deps.push(deps)
}

// 依赖触发
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
  deps.forEach((effect) => {
    // 如果有scheduler 只执行scheduler
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run();
    }
  });
}

export function effect(fn, options: any = {}) {
  const _effect = new ReactiveEffect(fn,  options.scheduler);
  _effect.onStop = options.onStop;
  extend(_effect, options);
  _effect.run();
  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect
  // 第一次函数执行时. 会把函数体中涉及到的reactive变量依赖收集
  
  // 实现run方法 需要返回effect实例的run方法 切需要改变run中的this指向(实例对象)
  return runner;
}

export function stop(runner) {
  runner.effect.stop();
}

