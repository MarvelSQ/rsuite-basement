export declare enum PropsIdentifer {
    CONST = "const",
    PROPS = "props",
    STATES = "states",
    MEMOS = "memos"
}
export declare type VarValue = {
    type: PropsIdentifer;
    name: string;
};
export declare type PropsValue = string | VarValue;
export declare type PropsType = Record<string, PropsValue>;
export declare type BuildComponent = {
    name: string;
    component: string;
    props: Record<string, PropsValue>;
    children: (BuildComponent | PropsValue)[];
};
export declare type Page = {
    name: string;
    children: BuildComponent;
};
export declare type BuildConfiguration = {
    dependencies: Record<string, {
        exports: string[];
        default: string;
    }>;
    components: {};
    pages: Page[];
};
