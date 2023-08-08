import { stat } from "fs";
import { MILLION, MS_IN_HOUR } from "../internal/common/Consts";
import { dateToString } from "../internal/common/Utility";

export enum BookieStatus {
  None = 0,
  Win = 1,
  Lose = 2,
  Refund = 3,
}

export enum BookieType {
  UNKNOWN = 0,
  TWO_WAY_FULL = 1,
  THREE_WAY_ORDINARY = 2,
  ASIAN_HANDICAP = 3,
  OVER_UNDER = 4,
  BTTS = 5,
}

// You won $2,600,000 on your $1,000,000 Viking (3-Way Ordinary time) bet on <a
// href = http://www.torn.com/\"http://www.torn.com/http://www.torn.com/page.php?sid=bookie#/your-bets/4076983\">
// Viking v Bodoe/Glimt</a>"

// "You lost your $500,000 Draw (3-Way Ordinary time) bet on <a
// href = http://www.torn.com/\"http://www.torn.com/http://www.torn.com/page.php?sid=bookie#/your-bets/4123800\">
// Bahia v America MG</a>"

// "Your $2,000,000 Geelong Cats (2-Way Full event) bet on <a
// href="page.php?sid=bookie#/your-bets/4078025" i-data="i_507_23307_165_14">Sydney Swans v Geelong Cats</a> was refunded"

function regexExtract(input: string, pattern: string) {
  let regex = new RegExp(pattern);
  let matches = regex.exec(input);
  if (matches === null) {
    return null;
  }
  return matches[0];
}

function parseEvent(event: string) {
  if (!(event.includes("bookie") && event.includes("your-bets"))) {
    return null;
  }
  let extract;
  if ((extract = regexExtract(event, "your-bets/\\d+")) !== null) {
    var selection = parseInt(extract.substring(10, extract.length));
  } else {
    return null;
  }
  if ((extract = regexExtract(event, "[yY]our \\$\\S+")) !== null) {
    var bet = parseInt(extract.substring(6, extract.length).replaceAll(",", "")) / MILLION;
  } else {
    return null;
  }
  if ((extract = regexExtract(event, ">.*</a>")) !== null) {
    var description = extract.substring(1, extract.length - 4);
  } else {
    return null;
  }
  if (event.includes("won")) {
    var status = BookieStatus.Win;
  } else if (event.includes("lost")) {
    var status = BookieStatus.Lose;
  } else if (event.includes("refunded")) {
    var status = BookieStatus.Refund;
  } else {
    return null;
  }
  if ((extract = regexExtract(event, "(.*) bet")) !== null) {
    var bookieType: BookieType;
    if (extract.includes("3-Way Ordinary time")) {
      bookieType = BookieType.THREE_WAY_ORDINARY;
    } else if (extract.includes("2-Way Full event")) {
      bookieType = BookieType.TWO_WAY_FULL;
    } else if (extract.includes("Asian Handicap")) {
      bookieType = BookieType.ASIAN_HANDICAP;
    } else if (extract.includes("Over/Under")) {
      bookieType = BookieType.OVER_UNDER;
    } else if (extract.includes("Both Teams to Score")) {
      bookieType = BookieType.BTTS;
    } else {
      bookieType = BookieType.UNKNOWN;
    }
  } else {
    return null;
  }
  let result: [number, number, string, BookieType, BookieStatus] = [
    selection,
    bet,
    description,
    bookieType,
    status,
  ];
  return result;
}

export class BookieResult {
  id: string;
  timestamp: number;
  status: BookieStatus;
  selection: number;
  bet: number;
  odds: number;
  deduction: number;
  description: string;
  type: BookieType;

  constructor(
    id: string,
    timestamp: number,
    status: BookieStatus,
    selection: number,
    bet: number,
    odds: number,
    deduction: number
  ) {
    this.id = id;
    this.timestamp = timestamp;
    this.status = status;
    this.selection = selection;
    this.bet = bet / MILLION;
    this.odds = odds;
    this.deduction = deduction;
    this.description = "";
    this.type = BookieType.UNKNOWN;
  }

  getResultValue() {
    switch (this.status) {
      case BookieStatus.Win:
        return this.bet * this.odds;
      case BookieStatus.Lose:
        return 0;
      case BookieStatus.Refund:
        return this.bet;
      default:
        return 0;
    }
  }

  getWinningValue() {
    return this.getResultValue() - this.bet;
  }

  toTornTime() {
    let tornDate = new Date(this.timestamp + MS_IN_HOUR);
    return dateToString(tornDate);
  }

  getStatusStr() {
    return BookieStatus[this.status];
  }

  getTypeStr() {
    return BookieType[this.type];
  }

  getDescription() {
    if (this.description) {
      return this.description;
    } else {
      return "https://www.torn.com/page.php?sid=bookie#/your-bets/" + this.selection.toString();
    }
  }

  tryAddDetailFromEvent(event: string) {
    let parseResult = parseEvent(event);
    if (parseResult === null) {
      return false;
    }
    let [selection, bet, description, bookieType, status] = parseResult;
    if (this.selection != selection || this.bet != bet || this.status != status) {
      return false;
    }
    this.description = description;
    this.type = bookieType;
    return true;
  }
}

function isValidBookieResult(json: any) {
  if (!json) {
    return false;
  }
  if (!(json.log && [8461, 8462, 8463].includes(json.log))) {
    return false;
  }
  if (!(json.timestamp && json.timestamp && json.data)) {
    return false;
  }
  let data = json.data;
  if (!(data.selection && data.odds && data.bet)) {
    return false;
  }
  if (data.selection.length < 1) {
    return false;
  }
  return true;
}

function getBookieStatus(json: any) {
  switch (json.log) {
    case 8462:
      return BookieStatus.Win;
    case 8461:
      return BookieStatus.Lose;
    case 8463:
      return BookieStatus.Refund;
    default:
      return BookieStatus.None;
  }
}

export function createBookieResult(id: string, json: any) {
  if (!isValidBookieResult(json)) {
    return null;
  }
  let status = getBookieStatus(json);
  let timestamp = json.timestamp * 1000;
  let selection = Number(json.data.selection[0]);
  let odds = json.data.odds;
  let bet = json.data.bet;

  return new BookieResult(id, timestamp, status, selection, bet, odds, 0);
}
