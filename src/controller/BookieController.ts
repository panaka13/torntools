import { GetLogInfo } from "../internal/client/TornLogClient";
import { BookieResult, createBookieResult } from "../model/BookieResult";
import { SECOND_IN_DAY } from "../internal/common/Consts";

async function getBookieResultsImpl(api: string, user: number, from: number, to: number) {
  const [error, jsons] = await GetLogInfo(api, user, from, to, [8461, 8462, 8463]);
  if (error) {
    return [error, null];
  }
  let bookieResults: Array<BookieResult> = [];
  for (const id in jsons) {
    let bookieResult = createBookieResult(id, jsons[id]);
    if (bookieResult !== null) {
      bookieResults.push(bookieResult);
    }
  }
  console.log(bookieResults.length);
  return [null, bookieResults];
}

export async function getBookieResults(api: string, user: number, from: Date, to: Date) {
  console.log(from);
  console.log(to);
  let unixFrom = from.getTime() / 1000;
  console.log(unixFrom);
  let unixTo = to.getTime() / 1000 + SECOND_IN_DAY - 1;
  console.log(unixTo);
  return getBookieResultsImpl(api, user, unixFrom, unixTo);
}
