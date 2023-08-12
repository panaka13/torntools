import { MILLION, MS_IN_HOUR } from "../internal/common/Consts";
import { dateToString, approximatelyEquals } from "../internal/common/Utility";

const BOOKIE_DETAIL_URL_PREFIX = "https://www.torn.com/page.php?sid=bookie#/your-bets/";

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

function regexExtract(input: string, pattern: string) {
  const regex = new RegExp(pattern);
  const matches = regex.exec(input);
  if (matches === null) {
    return null;
  }
  return matches[0];
}

function parseEvent(event: string): null | [number, number, number, string, BookieType, BookieStatus] {
  if (!(event.includes("bookie") && event.includes("your-bets"))) {
    return null;
  }
  let extract;

  extract = regexExtract(event, "your-bets/\\d+");
  if (extract == null) {
    return null;
  }
  const selection = parseInt(extract.substring(10, extract.length));

  extract = regexExtract(event, "[yY]our \\$\\S+");
  if (extract == null) {
    return null;
  }

  const bet = parseInt(extract.substring(6, extract.length).replaceAll(",", "")) / MILLION;

  extract = regexExtract(event, ">.*</a>");
  if (extract == null) {
    return null;
  }
  const description = extract.substring(1, extract.length - 4);

  let status = BookieStatus.None;
  if (event.includes("won")) {
    status = BookieStatus.Win;
  } else if (event.includes("lost")) {
    status = BookieStatus.Lose;
  } else if (event.includes("refunded")) {
    status = BookieStatus.Refund;
  } else {
    return null;
  }

  let won: number = 0;
  if (status === BookieStatus.Win) {
    if ((extract = regexExtract(event, "won \\$\\S+")) !== null) {
      won = parseInt(extract.substring(5, extract.length).replaceAll(",", "")) / MILLION;
    }
  }

  let bookieType: BookieType = BookieType.UNKNOWN;
  if (event.includes("3-Way Ordinary time")) {
    bookieType = BookieType.THREE_WAY_ORDINARY;
  } else if (event.includes("2-Way Full event")) {
    bookieType = BookieType.TWO_WAY_FULL;
  } else if (event.includes("Asian Handicap")) {
    bookieType = BookieType.ASIAN_HANDICAP;
  } else if (event.includes("Over/Under")) {
    bookieType = BookieType.OVER_UNDER;
  } else if (event.includes("Both Teams to Score")) {
    bookieType = BookieType.BTTS;
  };
  return [
    selection,
    bet,
    won,
    description,
    bookieType,
    status
  ];
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
    const tornDate = new Date(this.timestamp + MS_IN_HOUR);
    return dateToString(tornDate);
  }

  getStatusStr() {
    return BookieStatus[this.status];
  }

  getTypeStr() {
    return BookieType[this.type];
  }

  getDescription() {
    if (this.description != null && this.description !== "") {
      return this.description;
    } else {
      return BOOKIE_DETAIL_URL_PREFIX + this.selection.toString();
    }
  }

  tryAddDetailFromEvent(event: string) {
    const parseResult = parseEvent(event);
    if (parseResult === null) {
      return false;
    }
    const [selection, bet, won, description, bookieType, status] = parseResult;
    if (this.selection !== selection || this.bet !== bet || this.status !== status) {
      return false;
    }
    if (this.status === BookieStatus.Win && !approximatelyEquals(this.getResultValue(), won)) {
      return false;
    }
    if (this.description != null && this.description !== "" && this.type !== BookieType.UNKNOWN) {
      return false;
    }
    this.description = description;
    this.type = bookieType;
    return true;
  }
}

function isValidBookieResult(json: any) {
  if (json == null) {
    return false;
  }
  if (json.log == null || ![8461, 8462, 8463].includes(Number(json.log))) {
    return false;
  }
  if (json.timestamp == null || json.data == null) {
    return false;
  }
  const data = json.data;
  if (data.selection == null || data.odds == null || data.bet == null) {
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
  const status = getBookieStatus(json);
  const timestamp = json.timestamp * 1000;
  const selection = Number(json.data.selection[0]);
  const odds = parseFloat(json.data.odds);
  const bet = json.data.bet;

  return new BookieResult(id, timestamp, status, selection, bet, odds, 0);
}
