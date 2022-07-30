import ManifestObject from "../model/ManifestObject";
import Range from "../model/Range";
import React, { createContext, useContext, useState } from "react";
import Page from "../model/Page";
import produce from "immer";

type StructureContextType = {
  topLevelRange: Range | null;
  setTopLevelRange: React.Dispatch<Range>;
  structures: Array<Range>;
  setStructures: React.Dispatch<Array<Range>>;
  removeItem: (range: Range, target: Range | Page) => void;
  addPages: (range: Range, pages: Array<Page>) => void;
  addRange: (parent: Range | null, range: Range) => void;
};

const StructureContext = createContext<StructureContextType>(null!);

type Props = {
  children: React.ReactNode;
  manifest: ManifestObject;
};

export function StructureContextProvider({ children, manifest }: Props) {
  const [structures, setStructures] = useState(manifest.structures);
  const [topLevelRange, setTopLevelRange] = useState<Range | null>(
    manifest.structures?.[0]
  );

  const removeItem = (range: Range, target: Range | Page) => {
    if (!topLevelRange) throw "No top level Range selected";
    const nextStructures = produce(structures, (draft) => {
      const draftTopLevel = getTopLevelRange(draft);
      draftTopLevel?.removeItem(range, target);
    });
    setStructures(nextStructures);
    setTopLevelRange(getTopLevelRange(nextStructures));
  };

  const addPages = (range: Range, pages: Array<Page>) => {
    if (!topLevelRange) throw "No top level Range selected";
    const nextStructures = produce(structures, (draft) => {
      const draftTopLevel = getTopLevelRange(draft);
      const newRange = draftTopLevel.findRange(range.uuid);
      pages.forEach((p) => newRange!.items.push(new Page(p.canvas)));
    });
    setStructures(nextStructures);
    setTopLevelRange(getTopLevelRange(nextStructures));
  };

  function getTopLevelRange(nextStructures: Array<Range>) {
    return (
      nextStructures.find((r) => r.id == topLevelRange?.id) ||
      nextStructures?.[0]
    );
  }

  const addRange = (parent: Range | null, range: Range) => {
    if (!topLevelRange && !parent) {
      const nextStructures = produce(structures, (draft) => {
        structures.push(range);
      });
      setStructures(nextStructures);
      setTopLevelRange(getTopLevelRange(nextStructures));
    } else if (topLevelRange && parent) {
      const nextStructures = produce(structures, (draft) => {
        const draftTopLevel = getTopLevelRange(draft);
        const newRange = draftTopLevel.findRange(parent.uuid);
        newRange!.items.push(range);
      });
      setStructures(nextStructures);
      setTopLevelRange(getTopLevelRange(nextStructures));
    }
  };

  const context: StructureContextType = {
    topLevelRange,
    setTopLevelRange,
    structures,
    setStructures,
    removeItem,
    addPages,
    addRange,
  };

  return <StructureContext.Provider value={context} children={children} />;
}

export function useStructureContext() {
  const context = useContext(StructureContext);
  if (!context) {
    throw Error(
      "Use of `useStructureContext` is outside of `StructureProvider`"
    );
  }
  return context || {};
}
