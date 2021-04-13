import { BuildComponent, BuildConfiguration, Page, PropsIdentifer, PropsType, VarValue } from './type';
declare type PageVarMap = {
    [x: string]: {
        type: string;
        body: string;
    };
};
declare class Dependency {
    require: string;
    partial: string[];
    main: string;
    constructor(require: string);
    hasMember(name: string): "main" | "partial" | null;
    addExport(name: string, isDefault?: boolean): void;
    toString(): string;
}
declare class DependencyList {
    dependencyMap: Record<string, Dependency>;
    constructor();
    checkAllMember(name: string): Dependency | null;
    addExport(requireId: string, name: string, isDefault: boolean): void;
    toString(): string;
}
declare class PageCreation {
    global: Creation;
    page: Page;
    dependencies: DependencyList;
    components: string[];
    [PropsIdentifer.CONST]: PageVarMap;
    [PropsIdentifer.PROPS]: PageVarMap;
    [PropsIdentifer.STATES]: PageVarMap;
    [PropsIdentifer.MEMOS]: PageVarMap;
    effects: [];
    callbacks: [];
    returnValue: string;
    constructor(global: Creation, page: Page);
    renderVarValue(value: VarValue): string;
    renderProps(props: PropsType): string;
    renderComponent(component: BuildComponent): string;
    renderDependencies(): void;
    init(): void;
    toString(): string;
}
declare class Creation {
    config: BuildConfiguration;
    components: {
        [x: string]: {
            type: 'partial' | 'default';
            require: string;
        };
    };
    constructor(config: BuildConfiguration);
    buildPage(): void;
    build(): PageCreation[];
}
declare function build(config: BuildConfiguration): PageCreation[];
declare const handler: import('express').Handler;
export { build, handler };
