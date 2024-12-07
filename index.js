const handler = {
  get(target, key, receiver) {
    const res = Reflect.get(target, key, receiver);
    return res;
  },
  set(target, key, value, receiver) {
    const res = Reflect.set(target, key, value, receiver);
    trigger();
    return res;
  }
}

const reactive = (target) => {
  return new Proxy(target, handler);
}

let activeEffect = null;

const effect = (fn) => {
  activeEffect = fn;
}

const trigger = (fn) => {
  activeEffect()
}

export { effect, trigger, reactive }