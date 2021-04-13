import React, { useCallback, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Panel,
  Table,
  Container,
  Header,
  Content,
  Footer,
  Sidebar,
  Navbar,
  Nav,
  Dropdown,
  Icon,
  Sidenav,
  InputGroup,
  Input,
} from 'rsuite';
import TablePagination from 'rsuite/lib/Table/TablePagination';

const headerStyles: React.CSSProperties = {
  padding: 18,
  fontSize: 16,
  height: 56,
  background: '#34c3ff',
  color: ' #fff',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
};

export default function UserPage() {
  const [expand, setExpand] = useState(true);

  const [search, setSearch] = useState('');

  const onChange = useCallback(() => {
    setExpand((expand) => !expand);
  }, []);

  const onSearch = useCallback((word: string) => {
    setSearch(word);
  }, []);

  return (
    <Container className="page">
      <Sidebar
        style={{ display: 'flex', flexDirection: 'column' }}
        width={expand ? 260 : 56}
        collapsible
      >
        <Sidenav expanded={expand} defaultOpenKeys={['3']} appearance="subtle">
          <Sidenav.Header>
            <div style={headerStyles}>
              <Icon
                icon="logo-analytics"
                size="lg"
                style={{ verticalAlign: 0 }}
              />
              <span style={{ marginLeft: 12 }}> BRAND</span>
            </div>
          </Sidenav.Header>
          <Sidenav.Body>
            <Nav>
              <Nav.Item
                eventKey="1"
                icon={<Icon icon="dashboard" />}
                componentClass={NavLink}
                exact
                to="/"
              >
                Dashboard
              </Nav.Item>
              <Nav.Item
                eventKey="2"
                icon={<Icon icon="group" />}
                componentClass={NavLink}
                to="/user"
              >
                User Group
              </Nav.Item>
              <Dropdown
                eventKey="3"
                trigger="hover"
                title="Advanced"
                icon={<Icon icon="magic" />}
                placement="rightStart"
              >
                <Dropdown.Item eventKey="3-1">Geo</Dropdown.Item>
                <Dropdown.Item eventKey="3-2">Devices</Dropdown.Item>
                <Dropdown.Item eventKey="3-3">Brand</Dropdown.Item>
                <Dropdown.Item eventKey="3-4">Loyalty</Dropdown.Item>
                <Dropdown.Item eventKey="3-5">Visit Depth</Dropdown.Item>
              </Dropdown>
              <Dropdown
                eventKey="4"
                trigger="hover"
                title="Settings"
                icon={<Icon icon="gear-circle" />}
                placement="rightStart"
              >
                <Dropdown.Item eventKey="4-1">Applications</Dropdown.Item>
                <Dropdown.Item eventKey="4-2">Websites</Dropdown.Item>
                <Dropdown.Item eventKey="4-3">Channels</Dropdown.Item>
                <Dropdown.Item eventKey="4-4">Tags</Dropdown.Item>
                <Dropdown.Item eventKey="4-5">Versions</Dropdown.Item>
              </Dropdown>
            </Nav>
          </Sidenav.Body>
        </Sidenav>
        <Navbar appearance="subtle" className="nav-toggle">
          <Navbar.Body>
            <Nav>
              <Dropdown
                placement="topStart"
                trigger="click"
                renderTitle={(children) => {
                  return <Icon icon="cog" />;
                }}
              >
                <Dropdown.Item>Help</Dropdown.Item>
                <Dropdown.Item>Settings</Dropdown.Item>
                <Dropdown.Item>Sign out</Dropdown.Item>
              </Dropdown>
            </Nav>

            <Nav pullRight>
              <Nav.Item
                onClick={onChange}
                style={{ width: 56, textAlign: 'center' }}
              >
                <Icon icon={expand ? 'angle-left' : 'angle-right'} />
              </Nav.Item>
            </Nav>
          </Navbar.Body>
        </Navbar>
      </Sidebar>
      <Container>
        <Content>
          <Panel bodyFill>
            <div style={{ padding: '20px' }}>
              <InputGroup inside>
                <Input value={search} onChange={onSearch} />
                <InputGroup.Button>
                  <Icon icon="search" />
                </InputGroup.Button>
              </InputGroup>
            </div>
            <Table height={window.innerHeight - 257}>
              <Table.Column>
                <Table.HeaderCell>ID</Table.HeaderCell>
                <Table.Cell dataKey="id" />
              </Table.Column>
            </Table>
            <TablePagination
              lengthMenu={[
                {
                  value: 10,
                  label: 10,
                },
                {
                  value: 20,
                  label: 20,
                },
              ]}
              activePage={1}
              displayLength={10}
              total={100}
            />
          </Panel>
        </Content>
        <Footer></Footer>
      </Container>
    </Container>
  );
}
