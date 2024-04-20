document.querySelectorAll('.complete').forEach(e => {
    const taskId = e.dataset.id;
    e.addEventListener('click', () => {
      fetch(`/complete/${taskId}`, {
        method: 'PATCH',
        redirect: 'follow'
      })
        .then(res => {
          window.location.href = res.url;
        })
        .catch(err => console.error(err));
    });
  });

  document.querySelectorAll('.pause').forEach(e => {
    const taskId = e.dataset.id;
    e.addEventListener('click', () => {
      fetch(`/pause/${taskId}`, {
        method: 'PATCH',
        redirect: 'follow'
      })
        .then(res => {
          window.location.href = res.url;
        })
        .catch(err => console.error(err));
    })
  });

  document.querySelectorAll('.resume').forEach(e => {
    const taskId = e.dataset.id;
    e.addEventListener('click', () => {
      fetch(`/resume/${taskId}`, {
        method: 'PATCH',
        redirect: 'follow'
      })
        .then(res => {
          window.location.href = res.url;
        })
        .catch(err => console.error(err));
    })
  });