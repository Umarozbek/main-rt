type Listener = (open: boolean) => void;

let listeners: Listener[] = [];
let _open = false;

export const menuState = {
  get open() {
    return _open;
  },
  toggle() {
    _open = !_open;
    this.notify();
  },
  close() {
    _open = false;
    this.notify();
  },
  notify() {
    listeners.forEach((fn) => fn(_open));
  },
  subscribe(fn: Listener) {
    listeners.push(fn);
    return () => {
      listeners = listeners.filter((l) => l !== fn);
    };
  },
};
