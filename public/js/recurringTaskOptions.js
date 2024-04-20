window.onload = () => {
    document.querySelectorAll('.todo-list-item').forEach((e) => {
      if (e.dataset.paused == 'true') {
        let complete = e.querySelector('.complete');
        complete.style.visibility = 'hidden';
        e.style.opacity = '0.5';
        e.querySelectorAll('a').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
          e.preventDefault();
        });
      });
      }
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    let checkbox = document.getElementById('recurring-task-checkbox');
    let recurringTaskOptions = document.querySelector('.recurring-task-options-container');
    let recurringTaskOptionsItems = recurringTaskOptions.querySelectorAll('.recurring-task-startby-and-endby-container-item.recurring-task-frequency-and-interval-container-item');

    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        recurringTaskOptions.style.display = 'flex';
        recurringTaskOptions.style.flexDirection = 'row';
        recurringTaskOptions.style.justifyContent = 'space-evenly';
      }
      else {
        recurringTaskOptions.style.display = 'none';
      }
    });
  });