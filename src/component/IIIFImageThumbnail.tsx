import Page from "../model/Page";
import { useSelectionContext } from "../contexts/SelectionContext";

interface IIIFImageThumbnailProps {
  page: Page;
}

const IIIFImageThumbnail = ({ page }: IIIFImageThumbnailProps) => {
  const { selectedItems, setSelectedItems, setEndSelection, highlightItems } =
    useSelectionContext();
  let className = "";
  className += selectedItems.includes(page) ? " selected" : "";
  className += highlightItems.includes(page)
    ? " highlighted"
    : " not-highlighted";

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.shiftKey) {
      setEndSelection(page);
    } else if (e.metaKey) {
      setSelectedItems([...selectedItems, page]);
    } else {
      if (selectedItems.length === 1 && selectedItems.includes(page)) {
        setSelectedItems([]);
      } else {
        setSelectedItems([page]);
      }
    }
  };

  return (
    <div className={className} onClick={handleClick}>
      <img
        id={page.id}
        src={page.thumbnail}
        loading="lazy"
        alt={page.label.toString()}
      />
      <br />
      <span className="label">{page.altText().toString()}</span>
    </div>
  );
};

export default IIIFImageThumbnail;
