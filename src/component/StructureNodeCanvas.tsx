import Range from "../model/Range";
import Page from "../model/Page";
import { useStructureContext } from "../contexts/StructureContext";

interface CanvasStructureNodeProps {
  page: Page;
  range: Range;
}

const StructureNodeCanvas = ({ page, range }: CanvasStructureNodeProps) => {
  const { removeItem, topLevelRange } = useStructureContext();

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    removeItem(topLevelRange!, range, page);
  };

  return (
    <div className="StructureNode">
      {page.label}
      <button onClick={handleDelete}>Remove</button>
    </div>
  );
};

export default StructureNodeCanvas;
