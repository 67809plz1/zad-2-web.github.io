let dragSrcEl = null;

function dragStart(e) {
  dragSrcEl = this;
  this.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', this.dataset.pair);
}

function dragEnd() {
  this.classList.remove('dragging');
  const placeholder = dashboardGrid.querySelector('.widget-placeholder');
  if (placeholder) placeholder.remove();
}

dashboardGrid.addEventListener('dragover', e => {
  e.preventDefault();
  const dragging = dashboardGrid.querySelector('.dragging');
  if (!dragging) return;

  const afterElement = getDragAfterElement(dashboardGrid, e.clientY);
  const placeholder = dashboardGrid.querySelector('.widget-placeholder') || document.createElement('div');
  placeholder.className = 'widget-placeholder';
  
  if (!placeholder.parentNode) {
    if (afterElement == null) {
      dashboardGrid.appendChild(placeholder);
    } else {
      dashboardGrid.insertBefore(placeholder, afterElement);
    }
  }
});

dashboardGrid.addEventListener('drop', e => {
  e.preventDefault();
  const placeholder = dashboardGrid.querySelector('.widget-placeholder');
  if (placeholder && dragSrcEl) {
    dashboardGrid.insertBefore(dragSrcEl, placeholder);
    placeholder.remove();
    dragSrcEl.classList.remove('dragging');
    dragSrcEl = null;
    saveCurrentConfig();
  }
});

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.widget:not(.dragging)')];
  
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}