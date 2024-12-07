const handler = {
  get(target, key, receiver) {
    const res = Reflect.get(target, key, receiver);
    // アクセスされたobjectがtargetという変数で渡ってくる
    console.log("get:", target, "key:" + key, "res:" + res);
    track(target, key);
    return res;
  },
  set(target, key, value, receiver) {
    const res = Reflect.set(target, key, value, receiver);
    console.log("set:", target, "key:" + key, "value:" + value);
    trigger(target, key);
    return res;
  }
}

const reactive = (target) => {
  return new Proxy(target, handler);
}

let activeEffect = null;

const effect = (fn) => {
  activeEffect = fn;
  activeEffect();
  activeEffect = null;
}

// objectとcallbackを関連付ける
const targetMap = new WeakMap();
const track = (target, key) => {
  console.log("track", target, "activeEffect", activeEffect);
  let dependencyMap = targetMap.get(target);

  if (!dependencyMap) {
    dependencyMap = new Map();
    targetMap.set(target, dependencyMap);
  } 

  dependencyMap.set(key, activeEffect);
}

const trigger = (target, key) => {
  const dependencyMap = targetMap.get(target);
  if (!dependencyMap) return;

  const effect = dependencyMap.get(key);
  effect();
}

export { effect, trigger, reactive }