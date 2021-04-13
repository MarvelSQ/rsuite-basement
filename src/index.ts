import path from 'path';
import {
  BuildComponent,
  BuildConfiguration,
  Page,
  PropsIdentifer,
  PropsType,
  VarValue,
} from './type';

type PageVarMap = {
  [x: string]: {
    type: string;
    body: string;
  };
};

class Dependency {
  require: string;

  partial: string[];

  main: string;

  constructor(require: string) {
    this.require = require;
    this.partial = [];
    this.main = '';
  }

  hasMember(name: string) {
    if (this.main === name) {
      return 'main';
    }
    if (this.partial.includes(name)) {
      return 'partial';
    }
    return null;
  }

  addExport(name: string, isDefault: boolean = false) {
    const type = isDefault ? 'main' : 'partial';
    const exist = this.hasMember(name);
    if (!exist) {
      if (isDefault) {
        this.main = name;
      } else {
        this.partial.push(name);
      }
      return;
    }
    if (exist !== type) {
      throw Error(
        `required name duplicates "${name}" in require "${this.require}"`
      );
    }
  }

  toString() {
    const part = this.partial.join(',');
    const main = this.main;
    const split = main && part ? ',' : '';
    return `import ${main}${split}${part ? `{${part}}` : ''} from '${
      this.require
    }'`;
  }
}

class DependencyList {
  dependencyMap: Record<string, Dependency>;

  constructor() {
    this.dependencyMap = {};
  }

  checkAllMember(name: string): Dependency | null {
    let dep: Dependency | null = null;
    Object.keys(this.dependencyMap).some((key) => {
      if (this.dependencyMap[key].hasMember(name)) {
        dep = this.dependencyMap[key];
        return true;
      }
    });
    return dep;
  }

  addExport(requireId: string, name: string, isDefault: boolean) {
    const dep = this.checkAllMember(name);
    // 本地引用使用相对路径
    const relativeRequire = requireId.startsWith('.')
      ? path.relative('./pages', requireId)
      : requireId;

    if (dep && dep.require !== relativeRequire) {
      throw Error(
        `duplicates member "${name}" in ["${requireId}", "${dep.require}"]`
      );
    }

    this.dependencyMap[relativeRequire] =
      this.dependencyMap[relativeRequire] || new Dependency(relativeRequire);
    this.dependencyMap[relativeRequire].addExport(name, isDefault);
  }

  toString() {
    return Object.keys(this.dependencyMap)
      .sort()
      .map((e) => this.dependencyMap[e].toString())
      .join('\n');
  }
}

class PageCreation {
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

  constructor(global: Creation, page: Page) {
    this.global = global;
    this.page = page;
    this.components = [];
    this.dependencies = new DependencyList();
    // react 默认引用
    this.dependencies.addExport('react', 'React', true);
    this.const = {};
    this.props = {};
    this.states = {};
    this.memos = {};
    this.effects = [];
    this.callbacks = [];
    this.returnValue = '';
    this.init();
  }

  renderVarValue(value: VarValue) {
    const relativeMap = this[value.type];

    const realName = (value.name.match(/[^\d][^.]+/) || [''])[0];

    if (!Object.keys(relativeMap).includes(realName)) {
      relativeMap[realName] = {
        type: '',
        body: ``,
      };
    }

    if (value.type === PropsIdentifer.PROPS) {
      return `props.${value.name}`;
    }

    return value.name;
  }

  renderProps(props: PropsType) {
    return Object.keys(props)
      .map((key) => {
        const value = props[key];
        if (value === 'true') {
          return key;
        }
        if (typeof value === 'object') {
          return `${key}={${this.renderVarValue(value)}}`;
        }
        return `${key}={${value}}`;
      })
      .join(' ');
  }

  renderComponent(component: BuildComponent): string {
    const require = component.component.match(/[A-Z][^.]+/);
    if (require && !this.components.includes(require[0])) {
      this.components.push(require[0]);
    }

    return `<${component.component}${
      component.props ? ` ${this.renderProps(component.props)}` : ''
    }>${
      component.children
        ?.map((e) => {
          if (typeof e === 'object') {
            if ('component' in e) {
              return this.renderComponent(e);
            }
            if ('type' in e) {
              return `{${this.renderVarValue(e)}}`;
            }
          }
          return e;
        })
        .join('') || ''
    }</${component.component}>`;
  }

  renderDependencies() {
    const { components } = this;
    components.forEach((comp) => {
      const info = this.global.components[comp];
      this.dependencies.addExport(info.require, comp, info.type === 'default');
    });
  }

  init() {
    const page = this.page;
    this.returnValue = this.renderComponent(page.children);
    this.renderDependencies();
  }

  toString() {
    return `${this.dependencies.toString()}
function ${this.page.name}(props){

return ${this.returnValue};
}

export default ${this.page.name}`;
  }
}

class Creation {
  config: BuildConfiguration;

  components: {
    [x: string]: {
      type: 'partial' | 'default';
      require: string;
    };
  };

  constructor(config: BuildConfiguration) {
    this.config = config;
    this.components = config.components;
  }

  buildPage() {}

  build() {
    const { pages } = this.config;

    const result = pages.map((page) => new PageCreation(this, page));

    return result;
  }
}

function build(config: BuildConfiguration) {
  const creation = new Creation(config);
  return creation.build();
}

const handler: import('express').Handler = (req, res, next) => {
  res.send({
    message: 'success',
  });
};

export { build, handler };
