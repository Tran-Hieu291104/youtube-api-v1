import { useState, useEffect } from "react";

interface Language {
  id: string;
  snippet: {
    name: string;
  };
}

interface Region {
  id: string;
  snippet: {
    name: string;
  };
}

const I18nLanguagesAndRegionsPage = () => {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/i18nLanguages?part=snippet&key=${API_KEY}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch languages");
        }
        const data = await response.json();
        setLanguages(data.items);
      } catch (error) {
        console.error("Error fetching languages:", error);
      }
    };

    const fetchRegions = async () => {
      try {
        const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/i18nRegions?part=snippet&key=${API_KEY}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch regions");
        }
        const data = await response.json();
        setRegions(data.items);
      } catch (error) {
        console.error("Error fetching regions:", error);
      }
    };

    fetchLanguages();
    fetchRegions();
  }, []);

  return (
    <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
      <div style={{ flex: 1 }}>
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
          Supported Languages
        </h1>
        <ul style={{ listStyleType: "none", padding: "0" }}>
          {languages.map((language) => (
            <li
              key={language.id}
              style={{
                marginBottom: "10px",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h2
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  margin: "0 0 5px 0",
                }}
              >
                {language.snippet.name}
              </h2>
              <p
                style={{
                  fontSize: "14px",
                  color: "#555",
                  margin: "0",
                }}
              >
                Language ID: {language.id}
              </p>
            </li>
          ))}
        </ul>
      </div>
      <div style={{ flex: 1 }}>
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
          Supported Regions
        </h1>
        <ul style={{ listStyleType: "none", padding: "0" }}>
          {regions.map((region) => (
            <li
              key={region.id}
              style={{
                marginBottom: "10px",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h2
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  margin: "0 0 5px 0",
                }}
              >
                {region.snippet.name}
              </h2>
              <p
                style={{
                  fontSize: "14px",
                  color: "#555",
                  margin: "0",
                }}
              >
                Region ID: {region.id}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default I18nLanguagesAndRegionsPage;