export namespace hull_connector_v1 {
  export interface Options {
    version: "v1";
  }

  export interface Schema$OptionsResponse {
    ok: boolean;
    error: null | string;
    options: Schema$OptionItem[];
  }

  export interface Schema$OptionItem {
    value: string;
    label: string;
  }
}
