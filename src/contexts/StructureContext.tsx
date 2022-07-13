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
  removeItem: (
    topLevelRange: Range,
    range: Range,
    target: Range | Page
  ) => void;
  addPages: (topLevelRange: Range, range: Range, pages: Array<Page>) => void;
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

  const removeItem = (
    topLevelRange: Range,
    range: Range,
    target: Range | Page
  ) => {
    const nextStructures = produce(structures, (draft) => {
      const topLevel = draft.find((s) => s.id == topLevelRange.id);
      topLevel?.removeItem(range, target);
    });
    setStructures(nextStructures);
    setTopLevelRange(nextStructures.find((r) => r.id == topLevelRange.id)!);
  };

  const addPages = (topLevelRange: Range, range: Range, pages: Array<Page>) => {
    const nextStructures = produce(structures, (draft) => {
      const newRange = draft
        .find((s) => s.id == topLevelRange.id)!
        .findRange(range.id);
      pages.forEach((p) => newRange!.items.push(p));
    });
    setStructures(nextStructures);
    setTopLevelRange(nextStructures.find((r) => r.id == topLevelRange.id)!);
  };

  const context: StructureContextType = {
    topLevelRange,
    setTopLevelRange,
    structures,
    setStructures,
    removeItem,
    addPages,
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
