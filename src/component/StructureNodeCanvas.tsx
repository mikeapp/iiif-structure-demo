import Range from "../model/Range";
import Page from "../model/Page";
import { useStructureContext } from "../contexts/StructureContext";
import { useState } from "react";
import { Button } from "antd";

interface CanvasStructureNodeProps {
  page: Page;
  range: Range;
}

const StructureNodeCanvas = ({ page, range }: CanvasStructureNodeProps) => {
  const { removeItem, topLevelRange } = useStructureContext();
  const [showRemove, setShowRemove] = useState<boolean>(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    removeItem(topLevelRange!, range, page);
  };

  const handleMouseOver = () => {
    setShowRemove(true);
  };
  const handleMouseOut = () => {
    setShowRemove(false);
  };

  return (
    <div
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      className="StructureNode"
    >
      {page.label}
      <Button
        danger
        className="removeCanvasButton"
        onClick={handleDelete}
        hidden={!showRemove}
      >
        Remove
      </Button>
    </div>
  );
};

export default StructureNodeCanvas;
