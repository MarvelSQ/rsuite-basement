import React from 'react';
import {
  Panel, InputGroup, Input, Icon, Table,
} from 'rsuite';

function UserListPage(props: {
  pageName: string;
  data: any[];
}) {
  return (
    <Panel>
      <div style={{ padding: '20px' }}>
        {props.pageName}
        <InputGroup>
          <Input value={search.value} onChange={search.change} />
          <InputGroup.Button><Icon icon="search" /></InputGroup.Button>
        </InputGroup>
      </div>
      <Table data={props.data}>
        <Table.Column>
          <Table.HeaderCell>ID</Table.HeaderCell>
          <Table.Cell dataKey="id" />
        </Table.Column>
      </Table>
    </Panel>
  );
}

export default UserListPage;
