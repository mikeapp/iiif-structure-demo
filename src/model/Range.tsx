import Page from "./Page";
import Resource from "./Resource";
import {
  Canvas,
  InternationalString,
  Range as PreziRange,
  RangeItems,
} from "@iiif/presentation-3";
import { immerable } from "immer";

export type RangeChildren = Array<Range | Page>;

class Range extends Resource {
  [immerable] = true;
  items: RangeChildren;

  constructor(rangeItem: any, pageMap: Map<string, Page>) {
    if (rangeItem instanceof String) throw "Cannot parse referenced ranges";
    super(
      rangeItem.id as string,
      "Range",
      rangeItem.label as InternationalString
    );
    this.items =
      rangeItem["type"] === "Range"
        ? this.mapChildren(rangeItem.items as Array<PreziRange>, pageMap)
        : [];
  }

  mapChildren(
    rangeItems: Array<RangeItems>,
    pageMap: Map<string, Page>
  ): RangeChildren {
    const children: RangeChildren = [];
    rangeItems.forEach((ri) => {
      if (ri instanceof String) {
        // remote
      } else if ((ri as PreziRange)["type"] === "Range") {
        children.push(new Range(ri, pageMap));
      } else if ((ri as Canvas)["type"] === "Canvas") {
        const c: Canvas = ri as Canvas;
        const page = pageMap.get(c.id);
        if (page) {
          children.push(page);
        }
      }
    });
    return children;
  }

  allPages(): Array<Page> {
    return this.items.flatMap((rp) => {
      return rp instanceof Page ? (rp as Page) : rp.allPages();
    });
  }

  allRanges(): Array<Range> {
    return this.items.filter((rp) => rp.type === "Range") as Array<Range>;
  }

  clone(): Range {
    return new Range(
      {
        id: this.id,
        type: this.type,
        label: this.label,
      },
      new Map()
    );
  }

  findParent(target: Range | Page): Range | null {
    const index = this.items.indexOf(target);
    if (index > -1) return this;
    for (const r of this.allRanges()) {
      const result = r.findParent(target);
      if (result) return result;
    }
    return null;
  }

  findRange(target: string): Range | null {
    if (this.id == target) return this;
    for (const r of this.allRanges()) {
      const result = r.findRange(target);
      if (result) return result;
    }
    return null;
  }

  removeItem(parent: Range, target: Range | Page): boolean {
    if (this.id == parent.id) {
      const item = this.items.find((i) => i.id == target.id);
      if (item) {
        const index = this.items.indexOf(item);
        if (index > -1) {
          this.items.splice(index, 1);
          return true;
        }
      }
    } else {
      for (const r of this.allRanges()) {
        const result = r.removeItem(parent, target);
        if (result) return result;
      }
    }
    return false;
  }
}

export default Range;
