import { MS_IN_HOUR } from "../common/Consts";

export class Collection {
  private lastUpdate: number;

  constructor() {
    this.lastUpdate = 0;
  }

  public get(key: any): any | null {
    return null;
  }

  protected updateTime() {
    this.lastUpdate = Date.now();
  }

  public isExpired(): boolean {
    return Date.now() - this.lastUpdate <= MS_IN_HOUR;
  }
}
