import React from "react";
import { getBookieResults } from "../controller/BookieController";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { BookieResult } from "../model/BookieResult";

export function ViewBookieResult() {
  const [error, setError] = React.useState<string>("");
  const [text, setText] = React.useState<string>("hello world");
  const [bookieResultState, setBookieResults] = React.useState(Array<BookieResult>());

  async function handleUpdate(event: any) {
    event.preventDefault();
    let userid = Number(event.target.user.value);
    let api = event.target.api.value;
    let from = new Date(event.target.from.value);
    let to = new Date(event.target.to.value);
    const [error, bookieResults] = await getBookieResults(api, userid, from, to);
    setBookieResults(bookieResults);
  }

  return (
    <>
      <div>
        <Form onSubmit={handleUpdate}>
          <Form.Group controlId="BookieUser">
            <Form.Label>User</Form.Label>
            <Form.Control name="user" type="number" placeholder="userid" />
          </Form.Group>
          <Form.Group controlId="BookieAPIKey">
            <Form.Label>API-key</Form.Label>
            <Form.Control name="api" type="text" placeholder="API-key" />
            <Form.Text className="text-muted">Your limited API key</Form.Text>
          </Form.Group>
          <Form.Group controlId="BookieFrom">
            <Form.Label>From</Form.Label>
            <Form.Control name="from" type="date" />
          </Form.Group>
          <Form.Group controlId="BookieTo">
            <Form.Label>To</Form.Label>
            <Form.Control name="to" type="date" />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Date</th>
            <th>Game</th>
            <th>Description</th>
            <th>Type</th>
            <th>TBT</th>
            <th>Base</th>
            <th>Rate</th>
            <th>Win/Lose</th>
            <th>Net</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {bookieResultState.map((bookieResult: BookieResult, index: number) => (
            <tr>
              <td>{bookieResult.toTornTime()}</td>
              <td></td>
              <td>{bookieResult.getDescription()}</td>
              <td>{bookieResult.getTypeStr()}</td>
              <td></td>
              <td>{bookieResult.bet.toFixed(2)}</td>
              <td>{bookieResult.odds.toFixed(2)}</td>
              <td>{bookieResult.getStatusStr()}</td>
              <td>{bookieResult.getResultValue().toFixed(4)}</td>
              <td>{bookieResult.getWinningValue().toFixed(4)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
