const handler = {
  get(target, key, receiver) {
    const res = Reflect.get(target, key, receiver);
    // アクセスされたobjectがtargetという変数で渡ってくる
    console.log("get", target, key, res);
    track(target);
    return res;
  },
  set(target, key, value, receiver) {
    const res = Reflect.set(target, key, value, receiver);
    console.log("set", target, key, value);
    trigger(target);
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
}

// objectとcallbackを関連付ける
const targetMap = new WeakMap();
const track = (target) => {
  console.log("track", target, "activeEffect", activeEffect);
  targetMap.set(target, activeEffect);
}

const trigger = (target) => {
  const effect = targetMap.get(target);
  effect();
}

export { effect, trigger, reactive }