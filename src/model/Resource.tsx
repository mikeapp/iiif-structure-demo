import { InternationalString } from "@iiif/presentation-3";

type ResourceTypeString = "Canvas" | "Range" | "Manifest";

abstract class Resource {
  id: string;
  label: string[];
  type: ResourceTypeString;

  constructor(
    id: string,
    type: ResourceTypeString,
    label: InternationalString
  ) {
    this.id = id;
    this.type = type;
    const labelProps = Object.getOwnPropertyNames(label);
    const key = labelProps[0] || "en";
    this.label = label[key] || label["none"] || ["[no label]"];
  }
}

export default Resource;
