

const form = document.querySelector('#sighting-form');
const formMessage = document.querySelector('#form-message');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Same field names as data.json (your server decides the id)
  const formData = {
    title: document.querySelector('#title').value.trim(),
    datetime: document.querySelector('#datetime').value, // kept as ISO, script.js formats it for display
    location: document.querySelector('#location').value.trim(),
    details: document.querySelector('#details').value.trim()
  };

  try {
    // Send form data using the fetch API
    formMessage.textContent = '';
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      formMessage.innerHTML = 'Your sighting was uploaded. View it <a href="#" data-view="read">here</a>.';
      form.reset();
      await loadSightings(); // refresh the Read page list
    } else {
      formMessage.textContent = 'The server ghosted you. Please try again.';
      console.error('Server Error:', response.statusText);
    }
  } catch (err) {
    formMessage.textContent = 'Could not reach the server. Please try again.';
    console.error('Fetch Error:', err);
  }
});

// The "here" link inside the message switches to the Read view
formMessage.addEventListener('click', (e) => {
  if (!e.target.dataset.view) return;
  e.preventDefault();
  showView(e.target.dataset.view);
});