import { Manifest } from "@iiif/presentation-3";
import Resource from "./Resource";
import Page from "./Page";
import Range from "./Range";

class ManifestObject extends Resource {
  manifest: Manifest;
  items: Array<Page>;
  structures: Array<Range>;
  pageMap: Map<string, Page>;

  constructor(manifest: Manifest) {
    super(manifest.id, "Manifest", manifest.label);
    this.manifest = manifest;
    this.items = manifest.items.map((c) => new Page(c));
    this.pageMap = new Map(this.items.map((page) => [page.id, page]));
    this.structures = manifest.structures
      ? manifest.structures.map((r) => new Range(r, this.pageMap))
      : [];
  }
}

export default ManifestObject;
