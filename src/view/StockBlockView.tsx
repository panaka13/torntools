import React from "react";
import { Form, Table } from "react-bootstrap";
import { getStockBlock } from "../controller/StockController";
import type { Stock } from "../model/Stock";

export function ViewStockBlock() {
  const [stockBlockInfoState, setStockBlockInfo] = React.useState(Array<Stock>());
  async function handleUpdate(event: any) {
    event.preventDefault();
    const api = event.target.api.value;
    const [error, stock] = await getStockBlock(api);
    if (error !== null) {
      return;
    }
    if (stock === null) {
      return;
    }
    setStockBlockInfo(stock);
  }

  return (<>
    <div>Stock block</div>
    <Form onSubmit={handleUpdate}>
    </Form>
    <Table>
      <thead>
        <td>ID</td>
        <td>Acronym</td>
      </thead>
      <tbody>
        {stockBlockInfoState.map((stock: Stock, index: number) => (
          <tr key={stock.id}>
            <td>{stock.id}</td>
            <td>{stock.acrym}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  </>);
}
