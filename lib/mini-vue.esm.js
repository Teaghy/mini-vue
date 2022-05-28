let activeEffect;
const targetMap = new Map();
class ReactiveEffect {
    constructor(fn) {
        this._fn = fn;
    }
    run() {
        activeEffect = this;
        return this._fn();
    }
}
function track(target, key) {
    let depsMap = targetMap.get(target);
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
function trigger(target, key) {
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
function effect(fn) {
    const _effect = new ReactiveEffect(fn);
    _effect.run();
    console.log(activeEffect, targetMap);
    debugger;
    return _effect.run.bind(_effect);
}

function reactive(raw) {
    return new Proxy(raw, {
        get(target, key, receiver) {
            const res = Reflect.get(target, key, receiver);
            track(target, key);
            return res;
        },
        set(target, key, value, receiver) {
            const res = Reflect.set(target, key, value, receiver);
            trigger(target, key);
            return res;
        }
    });
}

export { effect, reactive };
//# sourceMappingURL=mini-vue.esm.js.map
