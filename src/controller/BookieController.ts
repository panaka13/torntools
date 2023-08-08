import { GetLogInfo, getEventInfo } from "../internal/client/TornLogClient";
import { BookieResult, createBookieResult } from "../model/BookieResult";
import { SECOND_IN_DAY } from "../internal/common/Consts";

async function getBookieResultsImpl(api: string, user: number, from: number, to: number) {
  let bookieResults: Array<BookieResult> = [];
  {
    const [error, jsons] = await GetLogInfo(api, user, from, to, [8461, 8462, 8463]);
    if (error) {
      return [error, null];
    }
    for (const id in jsons) {
      let bookieResult = createBookieResult(id, jsons[id]);
      if (bookieResult !== null) {
        bookieResults.push(bookieResult);
      }
    }
  }

  bookieResults.sort((a: BookieResult, b: BookieResult) => {
    if (a.timestamp < b.timestamp) {
      return -1;
    }
    if (a.timestamp > b.timestamp) {
      return 1;
    }
    return 0;
  });

  {
    let [error, jsons] = await getEventInfo(api, user, from, to);
    if (error) {
      return [error, null];
    }
    for (const eventId in jsons) {
      let event = jsons[eventId].event;
      for (var i = 0; i < bookieResults.length; i++) {
        if (bookieResults[i].tryAddDetailFromEvent(event)) {
          break;
        }
      }
    }
  }
  return [null, bookieResults];
}

export async function getBookieResults(api: string, user: number, from: Date, to: Date) {
  const unixFrom = from.getTime() / 1000;
  const unixTo = to.getTime() / 1000 + SECOND_IN_DAY - 1;
  return getBookieResultsImpl(api, user, unixFrom, unixTo);
}
