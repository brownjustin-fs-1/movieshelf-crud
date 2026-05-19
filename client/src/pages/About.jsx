function About() {
  return (
    <main className="container">
      <section className="hero">
        <h1>About MovieShelf</h1>

        <p>
          MovieShelf is a MERN CRUD application built
          with React, Node.js, Express, and MongoDB.
        </p>
      </section>

      <section className="card">
        <h2>Features</h2>

        <ul>
          <li>Create movies</li>
          <li>Read movie list</li>
          <li>Update movies</li>
          <li>Delete movies</li>
          <li>MongoDB database integration</li>
        </ul>
      </section>
    </main>
  );
}

export default About;