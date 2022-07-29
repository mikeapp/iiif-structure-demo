import ImageThumbnail from "./ImageThumbnail";
import Page from "../model/Page";
import {Segmented} from 'antd';

interface ImageSelectPanelProps {
    pages: Array<Page>;
}

const ImageSelectPanel = ({pages}: ImageSelectPanelProps) => {
    return (
        <div className="ImageSelectPanel prevent-select">
            <h2>Images</h2>
            <div className='imageSelectControl'>
                <Segmented className='imageSizeSelector' options={['small', 'medium', 'single']} />
            </div>
            <div className='imageGrid'>
                {pages.map((page) => (
                    <ImageThumbnail page={page} key={page.id}/>
                ))}
            </div>
        </div>
    );
};

export default ImageSelectPanel;
