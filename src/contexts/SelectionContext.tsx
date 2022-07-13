import React, { createContext, useContext, useEffect, useState } from "react";
import Page from "../model/Page";
import Range from "../model/Range";
import ManifestObject from "../model/ManifestObject";
import { useStructureContext } from "./StructureContext";

type SelectionContextType = {
  selectedItems: Array<Page>;
  setSelectedItems: React.Dispatch<Array<Page>>;
  highlightItems: Array<Page>;
  setHighlightItems: React.Dispatch<Array<Page>>;
  setEndSelection: (page: Page) => void;
  selectedRange: Range | null;
  setSelectedRangeId: (id: string | null) => void;
  selectedRangeId: string | null;
};

const SelectionContext = createContext<SelectionContextType>(null!);

type Props = {
  children: React.ReactNode;
  manifest: ManifestObject;
};

export function SelectionContextProvider({ children, manifest }: Props) {
  const { structures, topLevelRange } = useStructureContext();
  const [selectionState, setSelectionState] = useState<Array<Page>>([]);
  const [highlightItems, setHighlightItems] = useState<Array<Page>>([]);
  const [selectedRangeId, setSelectedRangeId] = useState<string | null>(null);

  const selectedRange =
    topLevelRange && selectedRangeId
      ? topLevelRange.findRange(selectedRangeId)
      : null;

  useEffect(() => {
    if (selectedRange) {
      setHighlightItems(selectedRange.allPages());
    }
  }, [structures, selectedRange]);

  const setEndSelection = (page: Page) => {
    if (selectionState && selectionState.length === 1) {
      const start = manifest.items.indexOf(selectionState[0]);
      const end = manifest.items.indexOf(page);
      setSelectionState(manifest.items.slice(start, end + 1));
    } else {
      setSelectionState([page]);
    }
  };

  const context: SelectionContextType = {
    selectedItems: selectionState,
    setSelectedItems: setSelectionState,
    highlightItems,
    setHighlightItems,
    setEndSelection,
    selectedRange,
    setSelectedRangeId,
    selectedRangeId,
  };

  return <SelectionContext.Provider value={context} children={children} />;
}

export function useSelectionContext() {
  const context = useContext(SelectionContext);
  if (!context) {
    throw Error(
      "Use of `useSelectionContext` is outside of `SelectionProvider`"
    );
  }
  return context || {};
}
