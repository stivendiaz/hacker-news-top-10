import { useEffect, useState, useCallback } from "react";
import Spinner from "./Spinner";

const HackerNewsTop10 = () => {
  const [topStories, setTopStories] = useState([]);
  const [fullStories, setFullStories] = useState([]);
  const [currentRange, setCurrentRange] = useState([0, 10]);
  const [loading, setLoading] = useState(false);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1 &&
      !loading
    ) {
      setCurrentRange((prevRange) => {
        return [prevRange[0] + 10, prevRange[1] + 10];
      });
    }
  }, [loading]);

  const fetchStoryDetails = async (articleId) => {
    const response = await fetch(
      `https://hacker-news.firebaseio.com/v0/item/${articleId}.json`
    );
    return await response.json();
  };

  const fetchTopStories = async () => {
    const response = await fetch(
      "https://hacker-news.firebaseio.com/v0/topstories.json"
    );
    const data = await response.json();
    setFullStories(data);
  };

  useEffect(() => {
    fetchTopStories();
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (currentRange[0] === 0) {
      return;
    }
    setLoading(true);
    const fetchStories = async () => {
      const stories = await Promise.all(
        fullStories
          .slice(currentRange[0], currentRange[1])
          .map(fetchStoryDetails)
      );
      setTopStories((prevTopStories) => [...prevTopStories, ...stories]);
      setLoading(false);
    };
    fetchStories();
  }, [currentRange, fullStories]);

  useEffect(() => {
    if (fullStories.length > 0) {
      setLoading(true);
      const fetchInitialStories = async () => {
        const stories = await Promise.all(
          fullStories.slice(0, 10).map(fetchStoryDetails)
        );
        setTopStories(stories);
        setLoading(false);
      };
      fetchInitialStories();
    }
  }, [fullStories]);

  const formatDate = (unixDate) => {
    const date = new Date(unixDate * 1000);
    let options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <div>
      {topStories.length > 0 && (
        <ul>
          {topStories.map((story) => (
            <li
              className="bg-white rounded-lg shadow-md border p-4 mb-4"
              key={story.id}
            >
              <div className="p-2 flex flex-col gap-2mb-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {formatDate(story.time)}
                  </div>
                  <div className="rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                    +{story.score}
                  </div>
                </div>
                <h2 className="text-lg font-medium">{story.title}</h2>
              </div>

              <div className="flex justify-end">
                <a href={story.url} className="text-blue-500 font-semibold">
                  Read More
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
      {loading && <Spinner />}
    </div>
  );
};

export default HackerNewsTop10;
