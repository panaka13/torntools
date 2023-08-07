import { stat } from "fs";
import { MILLION, MS_IN_HOUR } from "../internal/common/Consts";
import { dateToString } from "../internal/common/Utility";

export enum BookieStatus {
  None = 0,
  Win = 1,
  Lose = 2,
  Refund = 3,
}

export class BookieResult {
  id: string;
  timestamp: number;
  status: BookieStatus;
  selection: number;
  bet: number;
  odds: number;
  deduction: number;

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
  console.log("pass");
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
