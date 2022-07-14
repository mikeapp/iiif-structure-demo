import Range from "../model/Range";
import StructureNodeCanvas from "./StructureNodeCanvas";
import Page from "../model/Page";
import { useSelectionContext } from "../contexts/SelectionContext";

interface StructureNodeProps {
  item: Range;
}

const StructureNode = ({ item }: StructureNodeProps) => {
  const { setSelectedRangeId, selectedRange } = useSelectionContext();

  const getComponent = (child: Range | Page) => {
    return "Range" === child.type ? (
      <StructureNode item={child as Range} key={child.id} />
    ) : (
      <StructureNodeCanvas page={child as Page} range={item} key={child.id} />
    );
  };

  const handleSelectClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!selectedRange || selectedRange.id !== item.id) {
      setSelectedRangeId(item.id);
    } else {
      setSelectedRangeId(null);
    }
  };

  const getClassName = () => {
    if (item.id === selectedRange?.id) return "StructureNode selectedRange";
    return "StructureNode";
  };

  return (
    <div className={getClassName()}>
      <div onClick={handleSelectClick}>
        <b>{item.label}</b>
      </div>
      <div>{item.items.map((c) => getComponent(c))}</div>
    </div>
  );
};

export default StructureNode;
