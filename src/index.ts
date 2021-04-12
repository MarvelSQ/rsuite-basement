import {
  BuildComponent,
  BuildConfiguration,
  Page,
  PropsIdentifer,
  PropsType,
  PropsValue,
  VarValue,
} from './type';

type PageEnv = {
  dependencies: string[];
  props: string[];
  states: string[];
  effects: string[];
  callbacks: string[];
  memos: string[];
};

function renderPropsValue(value: PropsValue, env: PageEnv) {
  if (typeof value == 'object' && 'type' in value) {
    if (value.type === PropsIdentifer.PROPS) {
      if (!env.props.includes(value.name)) {
        env.props.push(value.name);
      }
      return `{props.${value.name}}`;
    }
  }
}

function renderProps(props: PropsType, env: PageEnv) {
  return Object.keys(props)
    .map((key) => {
      const target = props[key];
      if (target === 'true') {
        return key;
      }
      if (typeof target === 'object') {
        if (target.type === PropsIdentifer.PROPS) {
          if (!env.props.includes(target.name)) {
            env.props.push(target.name);
          }
          return `${key}={props.${target.name}}`;
        }
      }
      return `${key}={${props[key]}}`;
    })
    .join(' ');
}

function renderComponent(component: BuildComponent, env: PageEnv): string {
  // 渲染Drawer
  // if (component.component === 'Drawer') {
  //   const controller = {
  //     name: `${component.name}Helper`,
  //     body: `const ${component.name}Helper = useModal();`,
  //   };
  //   const defaultProps = {
  //     show: `${controller.name}.show`,
  //     data: `${controller.name}.data`,
  //     onHide: `${controller.name}.close`,
  //     onSuccess: undefined,
  //   };

  //   return (children) =>
  //     `<Drawer ${renderProps({
  //       ...component.props,
  //       ...defaultProps,
  //     })}>${children}</Drawer>`;
  // }

  return `<${component.component}${
    component.props ? ` ${renderProps(component.props, env)}` : ''
  }>${
    component.children
      ?.map((e) => {
        if (typeof e === 'object') {
          if ('component' in e) {
            return renderComponent(e, env);
          }
          if ('type' in e) {
            return renderPropsValue(e, env);
          }
        }
        return e;
      })
      .join('') || ''
  }</${component.component}>`;
}

function buildPage(
  page: Page,
  global: {
    dependencies: BuildConfiguration['dependencies'];
  }
) {
  const pageEnv = {
    dependencies: [],
    props: [],
    states: [],
    effects: [],
    callbacks: [],
    memos: [],
  };
  const returnValue = renderComponent(page.children, pageEnv);
  return {
    ...pageEnv,
    returnValue,
  };
}

type PageVarMap = {
  [x: string]: {
    type: string;
    body: string;
  };
};

class PageCreation {
  global: Creation;

  page: Page;

  dependencies: {
    [x: string]: {
      default: string;
      partial: string[];
    };
  };

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
    this.dependencies = {};
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

    if (!Object.keys(relativeMap).includes(value.name)) {
      relativeMap[value.name] = {
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

  renderComponent(component: BuildComponent) {
    const require = component.component.match(/[A-Z][^.]+/);
    if (require && !this.components.includes(require[0])) {
      this.components.push(require[0]);
    }

    this.returnValue = `<${component.component}${
      component.props ? ` ${this.renderProps(component.props)}` : ''
    }>${
      component.children
        ?.map((e) => {
          if (typeof e === 'object') {
            if ('component' in e) {
              return this.renderComponent(e);
            }
            if ('type' in e) {
              return this.renderVarValue(e);
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
      if (this.dependencies[info.require]) {
        if (info.type === 'partial') {
          if (!this.dependencies[info.require].partial.includes(comp)) {
            this.dependencies[info.require].partial.push(comp);
          }
        }
      } else {
        this.dependencies[info.require] = {
          partial: info.type === 'partial' ? [comp] : [],
          default: info.type === 'default' ? comp : '',
        };
      }
    });
  }

  init() {
    const page = this.page;
    this.renderComponent(page.children);
    this.renderDependencies();
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

    console.log(result);
  }
}

function build(config: BuildConfiguration) {
  const creation = new Creation(config);
  creation.build();
}

const handler: import('express').Handler = (req, res, next) => {
  res.send({
    message: 'success',
  });
};

export { build, handler };
