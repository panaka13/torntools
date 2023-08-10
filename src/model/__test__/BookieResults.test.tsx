import { BookieResult, BookieStatus, BookieType, createBookieResult } from "../BookieResult";

// You won $2,600,000 on your $1,000,000 Viking (3-Way Ordinary time) bet on <a
// href = http://www.torn.com/\"http://www.torn.com/http://www.torn.com/page.php?sid=bookie#/your-bets/4076983\">
// Viking v Bodoe/Glimt</a>"

// "You lost your $500,000 Draw (3-Way Ordinary time) bet on <a
// href = http://www.torn.com/\"http://www.torn.com/http://www.torn.com/page.php?sid=bookie#/your-bets/4123800\">
// Bahia v America MG</a>"

// "Your $2,000,000 Geelong Cats (2-Way Full event) bet on <a
// href="page.php?sid=bookie#/your-bets/4078025" i-data="i_507_23307_165_14">Sydney Swans v Geelong Cats</a> was refunded"

describe("test BookieResult", () => {
  let winBet: BookieResult;
  let loseBet: BookieResult;
  let refundBet: BookieResult;
  beforeEach(() => {
    winBet = new BookieResult(
      "winbet",
      1691451054 * 1000,
      BookieStatus.Win,
      4076983,
      1000000,
      2.6,
      0
    );
    loseBet = new BookieResult(
      "losebet",
      1691451054 * 1000,
      BookieStatus.Lose,
      4123800,
      500000,
      3.5,
      0
    );
    refundBet = new BookieResult(
      "refundbet",
      1691422254 * 1000,
      BookieStatus.Refund,
      4078025,
      2000000,
      1.8,
      0
    );
  });

  test("test getResultValue", () => {
    expect(winBet.getResultValue()).toBe(2.6);
    expect(loseBet.getResultValue()).toBe(0);
    expect(refundBet.getResultValue()).toBe(2);
  });

  test("test WinningValue", () => {
    expect(winBet.getWinningValue()).toBe(1.6);
    expect(loseBet.getWinningValue()).toBe(-0.5);
    expect(refundBet.getWinningValue()).toBe(0);
  });

  test("test toTornTime", () => {
    expect(winBet.toTornTime()).toBe("2023-08-08");
    expect(loseBet.toTornTime()).toBe("2023-08-08");
    expect(refundBet.toTornTime()).toBe("2023-08-07");
  });

  test("test getStatusStr", () => {
    expect(winBet.getStatusStr()).toBe("Win");
    expect(loseBet.getStatusStr()).toBe("Lose");
    expect(refundBet.getStatusStr()).toBe("Refund");
  });

  test("test addDetailFromEvent winDetail", () => {
    const winDetail =
      'You won $2,600,000 on your $1,000,000 Viking (3-Way Ordinary time) bet on <a\
href = http://www.torn.com/"http://www.torn.com/http://www.torn.com/page.php?sid=bookie#/your-bets/4076983">\
Viking v Bodoe/Glimt</a>';

    expect(winBet.tryAddDetailFromEvent(winDetail)).toBeTruthy();
    expect(winBet.description).toBe("Viking v Bodoe/Glimt");
    expect(winBet.type).toBe(BookieType.THREE_WAY_ORDINARY);
    expect(loseBet.tryAddDetailFromEvent(winDetail)).toBeFalsy();
    expect(loseBet.description).toBe("");
    expect(loseBet.type).toBe(BookieType.UNKNOWN);
    expect(refundBet.tryAddDetailFromEvent(winDetail)).toBeFalsy();
    expect(refundBet.description).toBe("");
    expect(refundBet.type).toBe(BookieType.UNKNOWN);
  });

  test("test addDetailFromEvent loseDetail", () => {
    const loseDetail =
      'You lost your $500,000 Under 45.5 Total (Over/Under 45.5 Total  Ordinary time) bet on <a\
href = http://www.torn.com/"http://www.torn.com/http://www.torn.com/page.php?sid=bookie#/your-bets/4123800">\
Bahia v America MG</a>';

    expect(winBet.tryAddDetailFromEvent(loseDetail)).toBeFalsy();
    expect(winBet.description).toBe("");
    expect(winBet.type).toBe(BookieType.UNKNOWN);
    expect(loseBet.tryAddDetailFromEvent(loseDetail)).toBeTruthy();
    expect(loseBet.description).toBe("Bahia v America MG");
    expect(loseBet.type).toBe(BookieType.OVER_UNDER);
    expect(refundBet.tryAddDetailFromEvent(loseDetail)).toBeFalsy();
    expect(refundBet.description).toBe("");
    expect(refundBet.type).toBe(BookieType.UNKNOWN);
  });

  test("test addDetailFromEvent refundDetail", () => {
    const refundDetail =
      'Your $2,000,000 Geelong Cats (2-Way Full event) bet on <a\
href="page.php?sid=bookie#/your-bets/4078025" i-data="i_507_23307_165_14">Sydney Swans v Geelong Cats</a> was refunded';

    expect(winBet.tryAddDetailFromEvent(refundDetail)).toBeFalsy();
    expect(winBet.description).toBe("");
    expect(winBet.type).toBe(BookieType.UNKNOWN);
    expect(loseBet.tryAddDetailFromEvent(refundDetail)).toBeFalsy();
    expect(loseBet.description).toBe("");
    expect(loseBet.type).toBe(BookieType.UNKNOWN);
    expect(refundBet.tryAddDetailFromEvent(refundDetail)).toBeTruthy();
    expect(refundBet.description).toBe("Sydney Swans v Geelong Cats");
    expect(refundBet.type).toBe(BookieType.TWO_WAY_FULL);
  });

  test("test addDetailFromEvent AsianHandicap", () => {
    const winDetail =
      'You won $2,600,000 on your $1,000,000 Viking (-0.5) (Asian Handicap 0.5 Full event) bet on <a\
href = http://www.torn.com/"http://www.torn.com/http://www.torn.com/page.php?sid=bookie#/your-bets/4076983">\
Viking v Bodoe/Glimt</a>';

    expect(winBet.tryAddDetailFromEvent(winDetail)).toBeTruthy();
    expect(winBet.description).toBe("Viking v Bodoe/Glimt");
    expect(winBet.type).toBe(BookieType.ASIAN_HANDICAP);
  });

  test("test addDetailFromEvent different Status", () => {
    const winDetail =
      'You lost your $1,000,000 Viking (3-Way Ordinary time) bet on <a\
href = http://www.torn.com/"http://www.torn.com/http://www.torn.com/page.php?sid=bookie#/your-bets/4076983">\
Viking v Bodoe/Glimt</a>';

    expect(winBet.tryAddDetailFromEvent(winDetail)).toBeFalsy();
    expect(winBet.description).toBe("");
    expect(winBet.type).toBe(BookieType.UNKNOWN);
  });

  test("test addDetailFromEvent twice does not have effect", () => {
    const winDetail =
      'You won $2,600,000 on your $1,000,000 Viking (3-Way Ordinary time) bet on <a\
href = http://www.torn.com/"http://www.torn.com/http://www.torn.com/page.php?sid=bookie#/your-bets/4076983">\
Viking v Bodoe/Glimt</a>';

    winBet.tryAddDetailFromEvent(winDetail);
    expect(winBet.tryAddDetailFromEvent(winDetail)).toBeFalsy();
  });

  test("test addDetailFromEvent winning money not match", () => {
    const winDetail =
      'You won $2,000,000 on your $1,000,000 Viking (3-Way Ordinary time) bet on <a\
href = http://www.torn.com/"http://www.torn.com/http://www.torn.com/page.php?sid=bookie#/your-bets/4076983">\
Viking v Bodoe/Glimt</a>';

    expect(winBet.tryAddDetailFromEvent(winDetail)).toBeFalsy();
  });
});

describe("test createBookieResult", () => {
  test("test lose result", () => {
    const json = JSON.parse(
      '{\
      "log":8461,\
      "title":"Bookie lose (new)",\
      "timestamp":1691593209,\
      "category":"Casino",\
      "data":{"selection":["4111322",867999794,7284579127],"odds":"3.42","bet":500000},\
      "params":{"italic":1,"color":"red"}\
    }'
    );
    const bookieResult = createBookieResult("test_id", json);
    expect(bookieResult).toBeTruthy();
    if (bookieResult !== null) {
      expect(bookieResult.bet).toBe(0.5);
      expect(bookieResult.selection).toBe(4111322);
      expect(bookieResult.status).toBe(BookieStatus.Lose);
      expect(bookieResult.odds).toBe(3.42);
      expect(bookieResult.timestamp).toBe(1691593209000);
      expect(bookieResult.deduction).toBe(0);
    }
  });

  test("test win result", () => {
    const json = JSON.parse(
      '{\
        "log":8462,\
        "title":"Bookie win (new)",\
        "timestamp":1691588949,\
        "category":"Casino",\
        "data":{"selection":["4153870",867359500,7281040187],\
        "odds":"3.50","bet":500000,"winnings":1750000,"deduction":""},\
        "params":{"italic":1,"color":"green"}\
      }'
    );
    const bookieResult = createBookieResult("test_id", json);
    expect(bookieResult).toBeTruthy();
    if (bookieResult !== null) {
      expect(bookieResult.bet).toBe(0.5);
      expect(bookieResult.selection).toBe(4153870);
      expect(bookieResult.status).toBe(BookieStatus.Win);
      expect(bookieResult.odds).toBe(3.5);
      expect(bookieResult.timestamp).toBe(1691588949000);
      expect(bookieResult.deduction).toBe(0);
    }
  });
});
