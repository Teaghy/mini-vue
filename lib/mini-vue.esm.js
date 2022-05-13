function toRawType(value) {
    return Object.prototype.toString.call(value).slice(8, -1);
}
function isObject(value) {
    return toRawType(value) === 'Object';
}

let activeEffect;
function effect(fn) {
    const effectFn = () => {
        try {
            activeEffect = effectFn;
            return fn();
        }
        finally {
        }
    };
    effectFn();
    return effectFn;
}
const targetMap = new WeakMap();
function track(target, key) {
    if (!activeEffect) {
        return;
    }
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        targetMap.set(target, (depsMap = new Map()));
    }
    let deps = depsMap.get(key);
    if (!deps) {
        depsMap.set(key, (deps = new Set()));
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
    deps.forEach(effectFn => {
        effectFn();
    });
}

function reactive(target) {
    if (!isObject(target)) {
        return target;
    }
    const proxy = new Proxy(target, {
        get(target, key, receiver) {
            const res = Reflect.get(target, key, receiver);
            if (isObject(res)) {
                return reactive(res);
            }
            track(target, key);
            return res;
        },
        set(target, key, value, receiver) {
            Reflect.set(target, key, value, receiver);
            trigger(target, key);
            return true;
        },
        deleteProperty(target, key) {
            Reflect.deleteProperty(target, key);
            return true;
        },
    });
    return proxy;
}

export { effect, reactive };
//# sourceMappingURL=mini-vue.esm.js.map
