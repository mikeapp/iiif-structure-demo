import { InternationalString } from "@iiif/presentation-3";
import { v4 as uuidv4 } from "uuid";

type ResourceTypeString = "Canvas" | "Range" | "Manifest";

abstract class Resource {
  id: string;
  label: string[];
  type: ResourceTypeString;
  uuid: string;

  constructor(
    id: string,
    type: ResourceTypeString,
    label: InternationalString
  ) {
    this.id = id;
    this.type = type;
    this.uuid = uuidv4();
    const labelProps = Object.getOwnPropertyNames(label);
    const key = labelProps[0] || "en";
    this.label = label[key] || label["none"] || ["[no label]"];
  }
}

export default Resource;
