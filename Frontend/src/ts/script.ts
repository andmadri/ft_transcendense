
const button = document.getElementById('click')!;
const blok = document.getElementById('blok')!;

button.addEventListener('click', async () => {
  const res = await fetch('/api/move', { method: 'POST' });
  const data = await res.json();

  if (data.top !== undefined) {
    blok.style.top = `${data.top}px`;
  }
});