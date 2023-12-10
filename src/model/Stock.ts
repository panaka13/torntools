import { itemCollection } from "../internal/collection/ItemCollection";
import { MILLION, THOUSAND } from "../internal/common/Consts";

class StockBenefit {
  shareAmount: number;
  frequency: number;
  description: string;

  constructor(shareAmount: number, frequency: number) {
    this.shareAmount = shareAmount;
    this.frequency = frequency;
    this.description = "";
  }

  getBenefitValue(): number {
    return 0;
  }
}

class StockMoneyBenefit extends StockBenefit {
  money: number;

  constructor(shareAmount: number, money: number) {
    super(shareAmount, 31);
    this.money = money;
  }

  getBenefitValue(): number {
    return this.money;
  }
}

class StockItemBenefit extends StockBenefit {
  itemID: number;
  itemAmount: number;

  constructor(shareAmount: number, itemID: number, itemAmount: number) {
    super(shareAmount, 7);
    this.itemID = itemID;
    this.itemAmount = itemAmount;
  }

  getBenefitValue(): number {
    const item = itemCollection.findByID(this.itemID);
    if (item === null) {
      return 0;
    }
    return item.price * this.itemAmount;
  }
}

const stockBenefits: StockBenefit[] = [
  new StockMoneyBenefit(3 * MILLION, 50 * MILLION), // 1: TSB
  new StockBenefit(1.5 * MILLION, 7), // 2: TCI
  new StockBenefit(3 * MILLION, 7), // 3: SYS
  new StockItemBenefit(750 * THOUSAND, 368, 1), // 4: LAG
  new StockMoneyBenefit(3 * MILLION, 12 * MILLION), // 5: IOU
  new StockMoneyBenefit(500 * THOUSAND, 4 * MILLION), // 6: GRN
  new StockItemBenefit(150 * THOUSAND, 365, 1), // 7: THS
  new StockBenefit(100 * THOUSAND, 7), // 8: YAZ
  new StockMoneyBenefit(100 * THOUSAND, MILLION), // 9: TCT
  new StockMoneyBenefit(7.5 * MILLION, 80 * MILLION), // 10: CNC
  new StockBenefit(300 * THOUSAND, 7), // 11: MSG
  new StockMoneyBenefit(6 * MILLION, 25 * MILLION), // 12: TMI
  new StockBenefit(MILLION, 7), // 13: TCP
  new StockBenefit(MILLION, 7), // 14: TCP
  new StockItemBenefit(2 * MILLION, 367, 1), // 15: FHG
  new StockItemBenefit(500 * THOUSAND, 370, 1), // 16: SYM
  new StockItemBenefit(500 * THOUSAND, 369, 1), // 17: LSC
  new StockItemBenefit(MILLION, 366, 1), // 18: PRN
  new StockItemBenefit(MILLION, 364, 1), // 19: EWM
  new StockBenefit(MILLION, 7), // 20: TCM
  new StockBenefit(5 * MILLION, 7), // 21: ELT
  new StockBenefit(10 * MILLION, 31), // 22: HRG
  new StockBenefit(2.5 * MILLION, 7), // 23: TGP
  new StockItemBenefit(5 * MILLION, 818, 1), // 24: MUN
  new StockBenefit(MILLION, 7), // 25: WSU
  new StockBenefit(100 * THOUSAND, 7), // 26: IST
  new StockBenefit(3 * MILLION, 7), // 27: BAG
  new StockBenefit(100 * THOUSAND, 7), // 28: EVL
  new StockItemBenefit(350 * THOUSAND, 367, 2 / 3), // 29: MCS
  new StockBenefit(9 * MILLION, 7), // 30: WLT
  new StockBenefit(7.5 * MILLION, 31), // 31: TCC
  new StockItemBenefit(MILLION, 817, 1), // 32: ASS
  new StockBenefit(350 * THOUSAND, 7), // 33: CBD
  new StockBenefit(7.5 * MILLION, 7), // 34: LOS
  new StockBenefit(10 * MILLION, 7) // 35: PTS
];

export class Stock {
  id: number;
  name: string;
  acr: string;
  price: number;
  benefit: StockBenefit;
  description: string;

  constructor(id: number, name: string, acr: string, price: number, benefit: any) {
    this.id = id;
    this.name = name;
    this.acr = acr;
    this.price = price;
    this.benefit = stockBenefits[id - 1];
    this.description = benefit.description;
  }

  getROI() {
    const cost = this.price * this.benefit.shareAmount;
    const benefitValue = this.benefit.getBenefitValue();
    return benefitValue / cost / this.benefit.frequency * 365;
  }

  getBlockCost() {
    return this.price * this.benefit.shareAmount;
  }
}

export function parseStocks(json: any) {
  const stocks: Stock[] = [];
  for (const [, value] of Object.entries<any>(json)) {
    const stock = new Stock(value.stock_id, value.name, value.acronym, value.current_price, value.benefit);
    stocks.push(stock);
  }
  return stocks;
}
