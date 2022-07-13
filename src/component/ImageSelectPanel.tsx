import IIIFImageThumbnail from "./IIIFImageThumbnail";
import Page from "../model/Page";

interface ImageSelectPanelProps {
  pages: Array<Page>;
}

const ImageSelectPanel = ({ pages }: ImageSelectPanelProps) => {
  return (
    <div className="ImageSelectPanel prevent-select">
      <h2>Images</h2>
      {pages.map((page) => (
        <IIIFImageThumbnail page={page} key={page.id} />
      ))}
    </div>
  );
};

export default ImageSelectPanel;
