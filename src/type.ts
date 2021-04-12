export enum PropsIdentifer {
  CONST = 'const',
  PROPS = 'props',
  STATES = 'states',
  MEMOS = 'memos',
}

export type VarValue = {
  type: PropsIdentifer;
  name: string;
};

export type PropsValue = string | VarValue;

export type PropsType = Record<string, PropsValue>;

export type BuildComponent = {
  name: string;
  component: string;
  props: Record<string, PropsValue>;
  children: (BuildComponent | PropsValue)[];
};

export type Page = {
  name: string;
  children: BuildComponent;
};

export type BuildConfiguration = {
  dependencies: Record<
    string,
    {
      exports: string[];
      default: string;
    }
  >;
  components: {};
  pages: Page[];
};
