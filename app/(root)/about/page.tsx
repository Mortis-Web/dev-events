const about = async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Failed To Fetch Data");

  const albums = await response.json();
  return (
    <section>
      {albums.map((card: { id: number; title: string; body: string }) => (
        <article key={card.id}>
          <h3>{card.title}</h3>
          <p>{card.body}</p>
        </article>
      ))}
    </section>
  );
};

export default about;
