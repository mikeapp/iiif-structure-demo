import { useState } from "react";
import "./App.css";
import ImageSelectPanel from "./component/ImageSelectPanel";
import StructureView from "./component/StructureView";
import ManifestSelector from "./component/ManifestSelector";
import ManifestObject from "./model/ManifestObject";
import { Manifest } from "@iiif/presentation-3";
import Range from "./model/Range";
import { SelectionContextProvider } from "./contexts/SelectionContext";
import { StructureContextProvider } from "./contexts/StructureContext";

function App() {
  const [manifest, setManifest] = useState<ManifestObject>(null!);
  const [structures, setStructures] = useState<Array<Range>>([]);

  const updateManifest = (json: any) => {
    const newManifest = new ManifestObject(json as Manifest);
    setManifest(newManifest);
    setStructures(newManifest.structures);
  };

  if (!manifest?.items) {
    return (
      <div className="App">
        <header className="App-header"></header>
        <ManifestSelector setManifest={updateManifest} />
      </div>
    );
  }

  return (
    <StructureContextProvider manifest={manifest}>
      <SelectionContextProvider manifest={manifest}>
        <div className="App">
          <header className="App-header"></header>
          <div className="main">
            <StructureView />
            <div className="rightPanel">
              <ImageSelectPanel pages={manifest.items} />
            </div>
          </div>
        </div>
      </SelectionContextProvider>
    </StructureContextProvider>
  );
}

export default App;
