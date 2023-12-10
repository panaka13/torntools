import React from "react";
import { Button, Form, Table } from "react-bootstrap";
import { getStockBlock } from "../controller/StockController";
import type { Stock } from "../model/Stock";

export function ViewStockBlock() {
  const [stockBlockInfoState, setStockBlockInfo] = React.useState(Array<Stock>());
  async function handleUpdate(event: any) {
    event.preventDefault();
    const [error, stocks] = await getStockBlock();
    if (error !== null) {
      console.log(error);
      return;
    }
    console.log(stocks);
    setStockBlockInfo(stocks);
  }

  return (<>
    <div>Stock block</div>
    <Form onSubmit={handleUpdate}>
      <Button variant="primary" type="submit">Submit</Button>
    </Form>
    <Table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Acronym</th>
          <th>Description</th>
          <th>Block cost</th>
          <th>Benefit value</th>
          <th>Frequency</th>
          <th>ROI</th>
        </tr>
      </thead>
      <tbody>
        {stockBlockInfoState.map((stock: Stock, index: number) => (
          <tr key={stock.id}>
            <td>{stock.id}</td>
            <td>{stock.acr}</td>
            <td>{stock.description}</td>
            <td>{stock.getBlockCost()}</td>
            <td>{stock.benefit.getBenefitValue()}</td>
            <td>{stock.benefit.frequency}</td>
            <td>{stock.getROI()}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  </>);
}
