import StructureNode from "./StructureNode";
import Range from "../model/Range";
import { useSelectionContext } from "../contexts/SelectionContext";
import { useStructureContext } from "../contexts/StructureContext";
import { v4 as uuidv4 } from "uuid";
import { Button } from "antd";

const StructureView = () => {
  const { setSelectedRangeId, selectedRange, selectedItems } =
    useSelectionContext();
  const {
    topLevelRange,
    setTopLevelRange,
    structures,
    setStructures,
    removeItem,
    addPages,
    addRange,
  } = useStructureContext();

  const handleCreateRangeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const newRange = new Range(
      {
        id: "https://collections.library.yale.edu/manifest/range/" + uuidv4(),
        type: "Range",
        label: { en: ["New range"] },
        items: [],
      },
      new Map()
    );
    if (selectedRange && topLevelRange) {
      addRange(topLevelRange, selectedRange, newRange);
    } else if (!topLevelRange && !selectedRange) {
      addRange(null, null, newRange);
    }
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
        return;
      }
      const rangeParent = topLevelRange.findParent(selectedRange);
      if (rangeParent) {
        removeItem(topLevelRange, rangeParent, selectedRange);
        setSelectedRangeId(null);
      }
    }
  };

  return (
    <div className="HierarchyView">
      <h2>Object Structure</h2>
      {topLevelRange
        ? [topLevelRange].map((s) => <StructureNode item={s} key={s.id} />)
        : "No structure selected"}

      <Button onClick={handleAppendClick} disabled={!selectedRange}>
        Append to selected range
      </Button>
      <br />
      <Button onClick={handleDeleteClick} disabled={!selectedRange}>
        Remove selected range
      </Button>
      <br />
      <Button onClick={handleCreateRangeClick}>Create a Range</Button>
      <br />
    </div>
  );
};

export default StructureView;
