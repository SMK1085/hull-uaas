export interface HullIdentImportCommon {
  id?: string;
  external_id?: string;
  anonymous_id?: string;
}

export interface HullIdentImportUser extends HullIdentImportCommon {
  email?: string;
}

export interface HullIdentImportAccount extends HullIdentImportCommon {
  domain?: string;
}

export interface HullSegment {
  id: string;
  name: string;
  type: "users_segment" | "accounts_segment";
  stats: any;
  created_at: string;
  updated_at: string;
}

export type Type$HullAttribute =
  | string
  | string[]
  | boolean
  | number
  | null
  | undefined
  | Object;

export interface Schema$HullAttributesCommon {
  id?: string | null;
  external_id?: string | null;
  anonymous_ids?: string[] | null;
  [key: string]:
    | Type$HullAttribute
    | {
        value: Type$HullAttribute;
        operation: "set" | "setIfNull" | "inc" | "dec";
      };
}

export interface Schema$HullAttributesUser extends Schema$HullAttributesCommon {
  email?: string | null;
}

export interface Schema$HullAttributesAccount
  extends Schema$HullAttributesCommon {
  domain?: string | null;
}
