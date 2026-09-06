const DRAG_DATA_TYPE = 'application/json';
const BOARD_CELL_SELECTOR = '[data-board-cell="true"]';
const POINTER_DRAG_SLOP = 6;

const dropTargetHandlers = new WeakMap();
let activePointerDrag = null;

const getPointerPosition = (event) => ({
  x: event.clientX,
  y: event.clientY,
});

const didPointerMove = (event, start) => {
  const { x, y } = getPointerPosition(event);
  return Math.hypot(x - start.x, y - start.y) >= POINTER_DRAG_SLOP;
};

const getCellAtPoint = (event, draggedElement) => {
  if (!document.elementFromPoint) return null;

  const originalPointerEvents = draggedElement.style.pointerEvents;
  draggedElement.style.pointerEvents = 'none';
  const element = document.elementFromPoint(event.clientX, event.clientY);
  draggedElement.style.pointerEvents = originalPointerEvents;

  return element ? element.closest(BOARD_CELL_SELECTOR) : null;
};

const createDropEvent = (startPosition) => ({
  preventDefault: () => {},
  dataTransfer: {
    getData: (type) => (type === DRAG_DATA_TYPE ? JSON.stringify(startPosition) : ''),
  },
});

const createDragOverProbe = () => {
  const event = {
    defaultPrevented: false,
    preventDefault: () => {
      event.defaultPrevented = true;
    },
  };

  return event;
};

const createDragPreview = (pieceElement) => {
  const el = pieceElement.cloneNode(true);
  const { width, height } = pieceElement.getBoundingClientRect();
  const { color } = window.getComputedStyle(pieceElement);

  el.style.background = 'none';
  el.style.color = color;
  el.style.position = 'fixed';
  el.style.top = '-10000px';
  el.style.left = '-10000px';
  el.style.width = `${width}px`;
  el.style.height = `${height}px`;
  el.style.transform = 'none';
  document.body.appendChild(el);
  return el;
};

const removeDragPreview = (element) => {
  if (element.parentNode) {
    element.parentNode.removeChild(element);
  }
};

const isTouchPointer = (event) => event.pointerType !== 'mouse';

export const createPieceDragProps = ({
  canDrag,
  cellContent,
  col,
  onCancel,
  onStart,
  row,
}) => ({
  draggable: canDrag,
  onDragStart: (event) => {
    if (!canDrag) return;

    const previewElement = createDragPreview(event.currentTarget);
    const { offsetWidth: width, offsetHeight: height } = previewElement;
    event.dataTransfer.setDragImage(previewElement, width / 2, height / 2);
    event.dataTransfer.setData(DRAG_DATA_TYPE, JSON.stringify({ row, col }));
    onStart(cellContent);

    setTimeout(() => removeDragPreview(previewElement), 0);
  },
  onDragEnd: onCancel,
  onPointerDown: (event) => {
    if (!canDrag || !isTouchPointer(event) || event.button > 0) return;

    activePointerDrag = {
      hasMoved: false,
      pointerId: event.pointerId,
      startPoint: getPointerPosition(event),
      startPosition: { row, col },
    };

    event.currentTarget.setPointerCapture?.(event.pointerId);
    onStart(cellContent);
  },
  onPointerMove: (event) => {
    if (!activePointerDrag || !isTouchPointer(event) || activePointerDrag.pointerId !== event.pointerId) return;

    if (!activePointerDrag.hasMoved && didPointerMove(event, activePointerDrag.startPoint)) {
      activePointerDrag.hasMoved = true;
    }

    if (activePointerDrag.hasMoved) {
      event.preventDefault();
    }
  },
  onPointerUp: (event) => {
    if (!activePointerDrag || !isTouchPointer(event) || activePointerDrag.pointerId !== event.pointerId) return;

    const dragState = activePointerDrag;
    activePointerDrag = null;
    event.currentTarget.releasePointerCapture?.(event.pointerId);

    if (!dragState.hasMoved) {
      onCancel();
      return;
    }

    const targetCell = getCellAtPoint(event, event.currentTarget);
    const dropHandler = targetCell ? dropTargetHandlers.get(targetCell) : null;
    if (!dropHandler?.(createDropEvent(dragState.startPosition))) {
      onCancel();
    }
  },
  onPointerCancel: (event) => {
    if (!activePointerDrag || activePointerDrag.pointerId !== event.pointerId) return;

    activePointerDrag = null;
    onCancel();
  },
  style: {
    touchAction: canDrag ? 'none' : 'auto',
  },
});

export const createDropTargetProps = ({ onDragOver, onDrop }) => ({
  onDragOver,
  onDrop,
  ref: (element) => {
    if (!element) return;

    dropTargetHandlers.set(element, (dropEvent) => {
      const dragOverEvent = createDragOverProbe();
      onDragOver(dragOverEvent);
      if (!dragOverEvent.defaultPrevented) return false;

      onDrop(dropEvent);
      return true;
    });
  },
});
