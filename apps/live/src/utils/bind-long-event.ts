const pointTypes = ['pointerdown', 'pointerup', 'pointercancel'];
const touchTypes = ['touchstart', 'touchend', 'touchcancel'];
const mouseTypes = ['mousedown', 'mouseup'];

function createBingEvents({
  el,
  event,
  types,
  listener,
  options,
}: {
  el: HTMLElement;
  event: boolean;
  types: string[];
  listener: EventListener;
  options?: boolean | AddEventListenerOptions;
}) {
  return new Promise((res, rej) => {
    if (!event) return res();

    let timer: number | null;
    const clearTimer = () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    };

    types.forEach((type, index) => {
      el.addEventListener(
        type,
        (e) => {
          if (index === 0) {
            if (timer) clearTimer();
            timer = window.setTimeout(() => listener.call(el, e), 500);
          } else {
            clearTimer();
          }
        },
        options
      );
    });
  });
}

export function bindLongEvent(
  el: HTMLElement,
  listener: EventListener,
  options?: boolean | AddEventListenerOptions
) {
  createBingEvents({
    event: !!window.PointerEvent,
    types: pointTypes,
    el,
    listener,
    options,
  })
    .then(() =>
      createBingEvents({
        event: !!window.TouchEvent,
        types: touchTypes,
        el,
        listener,
        options,
      })
    )
    .then(() =>
      createBingEvents({
        event: !!window.TouchEvent,
        types: mouseTypes,
        el,
        listener,
        options,
      })
    );
}
