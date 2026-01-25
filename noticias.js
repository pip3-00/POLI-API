fetch("http://127.0.0.1:8000/news")
  .then(r => r.json())
  .then(data => {
    const container = document.getElementById("news");

    data.forEach(n => {
      container.innerHTML += `
        <article>
          <h2>${n.title}</h2>
          <p>${n.content}</p>
        </article>
      `;
    });
  });
