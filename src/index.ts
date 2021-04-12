import type { BuildComponent, BuildConfiguration, Page } from './type';

type PageEnv = {
  props: [];
  states: [];
  effects: [];
  callbacks: [];
  memos: [];
};

function renderProps(props) {
  return Object.keys(props)
    .map((key) => {
      if (props[key] === 'true') {
        return key;
      }
      return `${key}={${props[key]}}`;
    })
    .join(' ');
}

function renderComponent(component: BuildComponent, env: PageEnv) {
  // 渲染Drawer
  if (component.component === 'Drawer') {
    const controller = {
      name: `${component.name}Helper`,
      body: `const ${component.name}Helper = useModal();`,
    };
    const defaultProps = {
      show: `${controller.name}.show`,
      data: `${controller.name}.data`,
      onHide: `${controller.name}.close`,
      onSuccess: undefined,
    };

    return (children) =>
      `<Drawer ${renderProps({
        ...component.props,
        ...defaultProps,
      })}>${children}</Drawer>`;
  }

  if (component.component === 'Table') {
    env['callbacks'][
      `on${component.name}Update`
    ] = `useCallback((params)=>{}, [])`;
  }
}

function buildPage(page: Page) {}

function build(config: BuildConfiguration) {
  const { page } = config;
  const file = buildPage();
}
