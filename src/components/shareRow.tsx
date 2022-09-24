import React from "react";
import styled from "styled-components";
import { CalculatedShareClass, formatCommaSeparated } from "../utils";

export const Row = styled.div`
  display: table-row;
`;

export const Cell = styled.p`
  display: table-cell;
  padding: 0.5em 1em;
  text-align: right;
`;

export const ShareRow = ({
  title,
  shareCount,
  purchasePrice,
  exitAmount,
  capped,
  common,
}: CalculatedShareClass) => (
  <Row>
    <Cell>{title}</Cell>
    <Cell>{formatCommaSeparated(shareCount)}</Cell>
    <Cell>€{formatCommaSeparated(purchasePrice)}</Cell>
    <Cell>€{formatCommaSeparated(exitAmount)}</Cell>
    <Cell>{`${capped}`}</Cell>
    <Cell>{`${common}`}</Cell>
  </Row>
);
