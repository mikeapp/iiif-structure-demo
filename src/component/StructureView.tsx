import StructureNode from "./StructureNode";
import Range from "../model/Range";
import { useSelectionContext } from "../contexts/SelectionContext";
import { useStructureContext } from "../contexts/StructureContext";
import { v4 as uuidv4 } from "uuid";
import { Button, Tree } from "antd";
import StructureNodeCanvas from "./StructureNodeCanvas";

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
      addRange(selectedRange, newRange);
    } else if (!topLevelRange && !selectedRange) {
      addRange(null, newRange);
    }
  };

  const handleAppendClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (selectedRange && topLevelRange) {
      addPages(selectedRange, selectedItems);
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
        removeItem(rangeParent, selectedRange);
        setSelectedRangeId(null);
      }
    }
  };

  const mapResourceToTreeNode: any = (
    resource: any,
    parent: Range | null,
    index = 0
  ) => {
    const parentId = parent ? parent.id : "top";
    const key = resource.uuid;
    if (resource instanceof Range) {
      return {
        title: <StructureNode item={resource} />,
        key,
        children: (resource as Range).items.map((r, index) =>
          mapResourceToTreeNode(r, resource, index)
        ),
      };
    } else {
      return {
        title: <StructureNodeCanvas page={resource} range={parent!} />,
        key,
      };
    }
  };

  const children = topLevelRange
    ? [topLevelRange].map((s) => mapResourceToTreeNode(s))
    : [];
  console.log(children);

  return (
    <div className="HierarchyView">
      <h2>Object Structure</h2>

      {children ? <Tree treeData={children} /> : <></>}

      <div className="buttons">
        <Button
          onClick={handleAppendClick}
          disabled={!selectedRange}
          className="structureActionButton"
        >
          Append to selected range
        </Button>
        <br />
        <Button
          onClick={handleDeleteClick}
          disabled={!selectedRange}
          className="structureActionButton"
        >
          Remove selected range
        </Button>
        <br />
        <Button
          onClick={handleCreateRangeClick}
          className="structureActionButton"
        >
          Create a Range
        </Button>
        <br />
      </div>
    </div>
  );
};

export default StructureView;
