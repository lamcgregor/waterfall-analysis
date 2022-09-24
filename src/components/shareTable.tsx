import React from "react";
import styled from "styled-components";
import { CalculatedShareClass } from "../utils";
import { Row, ShareRow, Cell } from "./shareRow";

const Table = styled.div`
  padding: 1.5rem;
  border: 1px solid;
  max-width: 80%;
`;

export const ShareTable = ({
  shareClasses,
}: {
  shareClasses: CalculatedShareClass[];
}) => (
  <Table>
    <Row>
      <Cell>Group</Cell>
      <Cell>Share count</Cell>
      <Cell>Investment</Cell>
      <Cell>Return</Cell>
      <Cell>Capped?</Cell>
    </Row>
    {shareClasses.map((shareClass, index) => (
      <ShareRow {...shareClass} key={`row-${index}`} />
    ))}
  </Table>
);
