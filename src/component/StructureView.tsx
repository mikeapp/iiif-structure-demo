import StructureNode from "./StructureNode";
import Range from "../model/Range";
import { useSelectionContext } from "../contexts/SelectionContext";
import { useStructureContext } from "../contexts/StructureContext";

const StructureView = () => {
  const {
    setHighlightItems,
    highlightItems,
    setSelectedRangeId,
    selectedRange,
    selectedItems,
  } = useSelectionContext();
  const {
    topLevelRange,
    setTopLevelRange,
    structures,
    setStructures,
    removeItem,
    addPages,
  } = useStructureContext();

  const handleClearClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setHighlightItems([]);
    setSelectedRangeId(null);
  };

  const handleCreateRangeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const r = new Range(
      {
        id: "https://collections.library.yale.edu/manifest/range/uuid",
        type: "Range",
        label: { en: ["New range"] },
        items: [],
      },
      new Map()
    );
    const newTopLevelRanges = [...structures, r];
    setStructures(newTopLevelRanges);
    setTopLevelRange(r);
    setSelectedRangeId(null);
  };

  const handleAppendClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (selectedRange && topLevelRange) {
      addPages(topLevelRange, selectedRange, selectedItems);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (selectedRange && topLevelRange) {
      const otherStructures = structures.filter((s) => s !== topLevelRange);
      if (selectedRange === topLevelRange) {
        setStructures(otherStructures);
        setTopLevelRange(otherStructures?.[0]);
        setSelectedRangeId(null);
        setHighlightItems([]);
        return;
      }
      const rangeParent = topLevelRange.findParent(selectedRange);
      if (rangeParent) {
        removeItem(topLevelRange, rangeParent, selectedRange);
        setSelectedRangeId(null);
        setHighlightItems([]);
      }
    }
  };

  return (
    <div className="HierarchyView">
      <h2>Object Structure</h2>
      {topLevelRange
        ? [topLevelRange].map((s) => <StructureNode item={s} key={s.id} />)
        : "No structure selected"}

      <button onClick={handleClearClick}>Clear selection</button>
      <button onClick={handleAppendClick} disabled={!selectedRange}>
        Append to selected range
      </button>
      <button onClick={handleDeleteClick} disabled={!selectedRange}>
        Remove selected range
      </button>
      <button onClick={handleCreateRangeClick}>Create a Range</button>
    </div>
  );
};

export default StructureView;
