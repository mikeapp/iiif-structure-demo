import {
  Canvas,
  IIIFExternalWebResource,
  ImageService3,
} from "@iiif/presentation-3";
import Resource from "./Resource";
import { immerable } from "immer";

class Page extends Resource {
  canvas: Canvas;
  thumbnail: string;
  [immerable] = true;

  constructor(canvas: Canvas) {
    const label = canvas.label ? canvas.label : { en: ["[No label]"] };
    super(canvas.id, "Canvas", label);
    this.canvas = canvas;
    this.thumbnail = this.deriveThumbnail();
  }

  altText(): string {
    return this.label[0];
  }

  deriveThumbnail(): string {
    let imageUrl = null;
    let thumbnail = this.canvas["thumbnail"];
    if (thumbnail && thumbnail[0]) {
      imageUrl = this.canvas["thumbnail"]![0]["id"];
    } else {
      let anno = this.canvas["items"]?.[0]?.["items"]?.[0];
      let body = anno?.["body"];
      if (body instanceof Array) {
        body = body[0];
      }
      let service = (body as IIIFExternalWebResource).service?.[0];
      let id = (service as ImageService3)["id"];
      if (id) {
        imageUrl = id + "/full/!300,300/0/default.jpg";
      }
    }
    return imageUrl || "https://example.com/imageNotFound";
  }
}

export default Page;
