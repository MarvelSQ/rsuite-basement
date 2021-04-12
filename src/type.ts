export enum PropsIdentifer {
  PROPS = "PROPS",
  CONST = "CONST",
  STR = "STR",
  NUM = "NUM",
  BOOL = "BOOL",
}

export type PropsValue = `${PropsIdentifer}.${string}`;

export type BuildComponent = {
  name: string;
  component: string;
  props: Record<string, PropsValue>;
  children: BuildComponent | string | PropsValue;
};

export type Page = {
  name: string;
  children: BuildComponent[];
};

export type BuildConfiguration = {
  components: {};
  page: Page[];
};
