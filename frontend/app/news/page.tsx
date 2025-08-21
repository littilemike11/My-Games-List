// app/components/GoogleNewsFeed.tsx
import Parser from "rss-parser";

type Article = {
  title: string;
  link: string;
  pubDate: string;
  contentSnippet?: string;
};

const parser = new Parser();

async function fetchGoogleNews(): Promise<Article[]> {
  const feed = await parser.parseURL(
    "https://news.google.com/rss/search?q=gaming&hl=en-US&gl=US&ceid=US:en"
  );

  console.log(feed);
  return feed.items.map((item) => ({
    title: item.title ?? "",
    link: item.link ?? "",
    pubDate: item.pubDate ?? "",
    contentSnippet: item.contentSnippet,
  }));
}

export default async function GoogleNewsFeed() {
  const articles = await fetchGoogleNews();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Google News - Gaming</h2>
      <ul>
        {articles.map((article, i) => (
          <li key={i} className="mb-3">
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="link hover:underline"
            >
              {article.title}
            </a>
            <p className="text-sm text-gray-500">{article.pubDate}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
