import { useState } from "react";

// @ts-ignore
const ManifestSelector = ({ setManifest }) => {
  const [uri, setUri] = useState(
    "https://iiif.io/api/cookbook/recipe/0024-book-4-toc/manifest.json"
  );
  //"https://collections.library.yale.edu/manifests/11684593"
  // https://collections.library.yale.edu/manifests/30049054

  const [error, setError] = useState("");

  const handleLoadEvent = () => {
    fetch(uri)
      .then((response) => {
        if (response.status == 200) {
          response.json().then((json) => {
            if (json.type === "Manifest") {
              setError("Loaded");
              setManifest(json);
            } else {
              throw "Not a manifest";
            }
          });
        } else {
          setError(`Response code ${response.status}`);
        }
      })
      .catch((reason) => setError(reason));
  };

  return (
    <div className="ManifestSelector">
      <h2>Manifest Selector</h2>
      <p>For demo purposes only.</p>
      <input
        type="text"
        name="uri"
        size={100}
        value={uri}
        onChange={(e) => setUri(e.target.value)}
      />
      <button onClick={handleLoadEvent}>load</button>
      {error}
    </div>
  );
};

export default ManifestSelector;
