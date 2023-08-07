import { buildUrl } from "build-url-ts";
import { Console } from "console";

export async function queryTorn(url: string) {
  console.log(url);
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    let error = new Error("HTTP status: " + response.statusText);
    return [error, null];
  }
  let json = JSON.parse(await response.text());
  if (json.error) {
    let error = new Error("Torn status: " + json.error.error);
    return [error, null];
  }
  return [null, json];
}

export async function GetLogInfo(
  api: string,
  user: number,
  from: number,
  to: number,
  log_types: Array<number>
) {
  console.log(from);
  console.log(to);
  const url = buildUrl("https://api.torn.com/", {
    path: "user/" + user,
    queryParams: {
      selections: "log",
      key: api,
      log: log_types,
      from: from,
      to: to,
      comment: "panaka_13",
    },
  });
  const [error, json] = await queryTorn(url);
  if (error !== null) {
    return [error, json];
  }
  return [null, json.log];
}