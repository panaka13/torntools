import { GetLogInfo, getEventInfo } from "../internal/client/TornLogClient";
import { type BookieResult, createBookieResult } from "../model/BookieResult";
import { SECOND_IN_DAY } from "../internal/common/Consts";

async function getBookieResultsImpl(api: string, user: number, from: number, to: number) {
  const bookieResults: BookieResult[] = [];
  {
    const [error, jsons] = await GetLogInfo(api, user, from, to, [8461, 8462, 8463]);
    if (error != null) {
      return [error, null];
    }
    for (const id in jsons) {
      const bookieResult = createBookieResult(id, jsons[id]);
      if (bookieResult != null) {
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
    const [error, jsons] = await getEventInfo(api, user, from, to);
    if (error != null) {
      return [error, null];
    }
    for (const eventId in jsons) {
      const event = jsons[eventId].event;
      for (let i = 0; i < bookieResults.length; i++) {
        if (bookieResults[i].tryAddDetailFromEvent(event)) {
          break;
        }
      }
    }
  }
  return [null, bookieResults];
}

export async function getBookieResults(api: string, user: number, date: Date) {
  const unixFrom = date.getTime() / 1000;
  const unixTo = date.getTime() / 1000 + SECOND_IN_DAY - 1;
  return await getBookieResultsImpl(api, user, unixFrom, unixTo);
}
