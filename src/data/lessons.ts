import type { Lesson } from "./types";

// Illustrative educational content, not live reporting. Edit content and review dates together.
export const lessons: Lesson[] = [
  {
    id: "decoder-inflation-01",
    slug: "inflation",
    kind: "decoder",
    title: "Prices are rising. But how fast?",
    topic: "Inflation",
    minutes: 4,
    headline: "Inflation slows, but everyday prices remain high",
    summary:
      "A slower inflation rate means prices are increasing more slowly. It does not necessarily mean prices are falling.",
    explanations: {
      Beginner: [
        "Inflation means the general price of goods and services rises over time. Your money then buys less. If your usual grocery basket costs more this year, that is one way you might notice it.",
        "When a headline says inflation has slowed, prices can still be going up. Think of a bike climbing a hill more slowly: it is still moving uphill. Falling prices are a different idea, called deflation.",
      ],
      Intermediate: [
        "The inflation rate measures how quickly a broad collection of prices changes. Lower inflation is called disinflation; a decline in the overall price level is deflation.",
        "A hypothetical basket rising from $100 to $105 has 5% inflation. If it rises to $107.10 the next year, inflation is 2%. Prices are higher in both years, even though the rate slowed.",
      ],
      Advanced: [
        "Inflation measures such as the Consumer Price Index track weighted baskets rather than every household’s exact spending. A lower annual rate may reflect slower recent increases or the comparison with last year’s prices.",
        "A single headline cannot tell you which prices changed or whether pay kept pace. Look at the time period, categories, and inflation-adjusted wages before drawing conclusions about purchasing power.",
      ],
    },
    terms: [
      {
        term: "Inflation",
        definition: "A broad increase in prices over time.",
      },
      {
        term: "Purchasing power",
        definition: "How much your money can buy.",
      },
      {
        term: "Disinflation",
        definition:
          "A decrease in the rate of inflation; prices may still rise.",
      },
    ],
    matters:
      "A budget can feel tighter even when inflation slows. Compare your own recurring costs and income rather than expecting every price to fall.",
    quiz: {
      id: "quiz-decoder-inflation-01",
      prompt: "If inflation drops from 5% to 2%, what does that usually mean?",
      options: [
        "All prices fall by 3%.",
        "Prices rise more slowly on average.",
        "Money suddenly buys more than last year.",
      ],
      correctIndex: 1,
      explanation:
        "The rate is still positive: average prices are rising, but more slowly. A falling overall price level would be deflation.",
    },
    sources: [
      {
        label: "BLS: Consumer Price Index questions",
        url: "https://www.bls.gov/cpi/questions-and-answers.htm",
      },
    ],
    contentReviewedAt: "2026-10-03",
  },
  {
    id: "decoder-federal-reserve-01",
    slug: "federal-reserve",
    kind: "decoder",
    title: "Why the Fed changes interest rates",
    topic: "Interest rates",
    minutes: 4,
    headline: "Federal Reserve raises its policy rate to address inflation",
    summary:
      "The Fed uses a short-term interest-rate target to influence borrowing, spending, and inflation.",
    explanations: {
      Beginner: [
        "Interest is the cost of borrowing money. The Federal Reserve, often called the Fed, is the U.S. central bank. It can change an important short-term rate that influences other borrowing costs.",
        "Higher rates can make some loans more expensive. People and businesses may borrow and spend less, easing price pressure. The effect takes time and is not guaranteed.",
      ],
      Intermediate: [
        "The Fed targets the federal funds rate, an overnight rate for lending between banks. Changes can influence credit cards, business borrowing, and savings yields, though lenders set their own terms.",
        "Raising rates generally restrains demand. The Fed balances price stability with maximum employment; tighter borrowing conditions can also slow hiring.",
      ],
      Advanced: [
        "Policy changes influence financial conditions through bank funding costs, asset prices, expectations, and other channels. The policy rate is not a rate consumers can directly borrow at.",
        "The effect depends on inflation expectations, existing debt contracts, and how quickly policy passes through to the economy. Long-term mortgage rates also reflect bond markets and need not move one-for-one with the Fed.",
      ],
    },
    terms: [
      {
        term: "Central bank",
        definition: "An institution that manages monetary policy.",
      },
      {
        term: "Policy rate",
        definition:
          "An interest-rate target used to influence financial conditions.",
      },
      {
        term: "Demand",
        definition: "The amount people are willing and able to buy.",
      },
    ],
    matters:
      "Variable-rate debt and savings yields may change. A fixed-rate loan generally keeps its agreed interest rate, even after a Fed decision.",
    quiz: {
      id: "quiz-decoder-federal-reserve-01",
      prompt: "Why might the Fed raise its policy rate?",
      options: [
        "To help restrain spending and inflation.",
        "To set every mortgage rate directly.",
        "To guarantee higher stock prices.",
      ],
      correctIndex: 0,
      explanation:
        "Higher borrowing costs can reduce demand and inflation pressure. The Fed does not directly set every loan rate or guarantee market outcomes.",
    },
    sources: [
      {
        label: "Federal Reserve: monetary policy",
        url: "https://www.federalreserve.gov/aboutthefed/fedexplained/monetary-policy.htm",
      },
    ],
    contentReviewedAt: "2026-10-03",
  },
  {
    id: "decoder-stock-market-01",
    slug: "stock-market",
    kind: "decoder",
    title: "Making sense of a market decline",
    topic: "Markets",
    minutes: 4,
    headline:
      "Major stock index declines as investors reassess company outlooks",
    summary:
      "A market index can fall when investors become less willing to pay for the businesses it tracks.",
    explanations: {
      Beginner: [
        "A stock is a small ownership share in a company. Its price changes as people buy and sell. An index tracks a group of investments to give a picture of part of the market.",
        "If an index falls, the group’s combined value has declined according to the index’s rules. It does not mean every stock fell or that every company stopped earning money.",
      ],
      Intermediate: [
        "Share prices reflect expectations about a company’s future and the price investors will pay for those expectations. Earnings news, economic uncertainty, and interest rates can change that price.",
        "Many popular indexes give larger companies more weight. A few large companies can move an index noticeably, so an index headline is not the same as a report on every stock.",
      ],
      Advanced: [
        "A stock price is influenced by expected future cash flows and the return investors require for risk. A higher required return can lower valuations even if expected earnings have not changed.",
        "Distinguish an index’s price return from total return, which includes dividends. Also check the index composition and period: one day’s movement does not establish a lasting trend.",
      ],
    },
    terms: [
      {
        term: "Stock",
        definition: "An ownership share in a company.",
      },
      {
        term: "Index",
        definition: "A measure that tracks a defined group of investments.",
      },
      {
        term: "Volatility",
        definition: "The amount and speed of price changes.",
      },
    ],
    matters:
      "A market headline can be useful context, but it is not a personal instruction to buy or sell. Different savings goals and time horizons expose people to different risks.",
    quiz: {
      id: "quiz-decoder-stock-market-01",
      prompt: "If a stock index falls, which statement is accurate?",
      options: [
        "Every company in the country lost money.",
        "The tracked group declined according to the index’s method.",
        "The index must rise tomorrow.",
      ],
      correctIndex: 1,
      explanation:
        "An index summarizes a particular group. Individual stocks can move differently, and the next move is unknown.",
    },
    sources: [
      {
        label: "Investor.gov: stocks",
        url: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/stocks",
      },
    ],
    contentReviewedAt: "2026-10-03",
  },
  {
    id: "decoder-recession-01",
    slug: "recession",
    kind: "decoder",
    title: "What a recession actually means",
    topic: "Economy",
    minutes: 4,
    headline: "Economic slowdown raises concerns about a recession",
    summary:
      "A recession involves a broad decline in economic activity, not just a bad day in the stock market.",
    explanations: {
      Beginner: [
        "The economy includes the work people do and the goods and services they produce and buy. A recession is a broad downturn that lasts more than a brief interruption.",
        "Businesses may sell less and reduce hiring. A weak month does not prove a recession. Economists look at several measures together.",
      ],
      Intermediate: [
        "Two quarters of falling real GDP is a common shorthand, but it is not the formal U.S. dating rule. GDP measures production; real GDP adjusts it for price changes.",
        "The NBER evaluates the depth, spread, and duration of declines across measures including employment, income, and production. Its dating decisions are often made after a downturn begins.",
      ],
      Advanced: [
        "Business-cycle dating considers multiple indicators because output and employment can send different signals and data are revised. The NBER identifies turning points rather than forecasting them.",
        "A recession headline should distinguish observed weakness from a forecast. The severity and impact differ by sector and household; a national label alone cannot describe an individual’s circumstances.",
      ],
    },
    terms: [
      {
        term: "Recession",
        definition:
          "A significant, broad decline in economic activity lasting more than a few months.",
      },
      {
        term: "GDP",
        definition:
          "The value of goods and services produced within a country.",
      },
      {
        term: "Real GDP",
        definition: "GDP adjusted for price changes.",
      },
    ],
    matters:
      "A slowdown can affect job openings and household income. Understanding the term helps you interpret the news without treating a forecast as a certainty.",
    quiz: {
      id: "quiz-decoder-recession-01",
      prompt: "What is the strongest basis for identifying a recession?",
      options: [
        "One falling stock price.",
        "A single expensive grocery bill.",
        "A broad, sustained decline across economic measures.",
      ],
      correctIndex: 2,
      explanation:
        "Recessions concern widespread economic activity. Neither one stock nor one price is enough to establish a broad downturn.",
    },
    sources: [
      {
        label: "NBER: business cycle dating",
        url: "https://www.nber.org/research/business-cycle-dating",
      },
    ],
    contentReviewedAt: "2026-10-03",
  },
  {
    id: "decoder-unemployment-01",
    slug: "unemployment",
    kind: "decoder",
    title: "Reading the jobs report",
    topic: "Jobs",
    minutes: 4,
    headline: "Unemployment rate rises as more people enter the job market",
    summary:
      "An unemployment rate can rise for different reasons. The headline needs context about job seeking and employment.",
    explanations: {
      Beginner: [
        "The unemployment rate describes the share of the labor force that is unemployed. In the usual survey definition, unemployed people have no job, are available to work, and have recently looked for work.",
        "Someone who is not working but is not looking usually is not counted in the labor force. So the unemployment rate is not the share of all people without jobs.",
      ],
      Intermediate: [
        "The labor force includes employed people and unemployed job seekers. The unemployment rate can rise if new job seekers enter faster than jobs are added, even without a wave of layoffs.",
        "The jobs report also contains payroll employment from a separate employer survey. Those measures answer different questions and can diverge in a given month.",
      ],
      Advanced: [
        "The headline unemployment rate, U-3, has a specific survey definition. Participation and broader measures of underemployment help describe people outside that headline number.",
        "Monthly estimates are subject to sampling uncertainty and revision. Look at several months, labor-force participation, and employment changes rather than attributing every rate movement to layoffs.",
      ],
    },
    terms: [
      {
        term: "Labor force",
        definition:
          "Employed people plus unemployed people actively seeking work.",
      },
      {
        term: "Unemployment rate",
        definition: "Unemployed people as a percentage of the labor force.",
      },
      {
        term: "Participation rate",
        definition:
          "The labor force as a share of the civilian noninstitutional population age 16 and older.",
      },
    ],
    matters:
      "National reports describe broad conditions, while opportunities vary by location and industry. The details are often more useful than a single headline number.",
    quiz: {
      id: "quiz-decoder-unemployment-01",
      prompt: "Who is generally counted as unemployed?",
      options: [
        "A person without a job who is available and recently looked for work.",
        "Every person who is retired.",
        "Every full-time student regardless of job seeking.",
      ],
      correctIndex: 0,
      explanation:
        "The usual definition requires availability and active job search. There are specific exceptions, such as some workers on temporary layoff.",
    },
    sources: [
      {
        label: "BLS: how unemployment is measured",
        url: "https://www.bls.gov/cps/cps_htgm.htm",
      },
    ],
    contentReviewedAt: "2026-10-03",
  },
  {
    id: "decoder-tariffs-01",
    slug: "tariffs",
    kind: "decoder",
    title: "Who pays a tariff?",
    topic: "Trade",
    minutes: 4,
    headline: "New import tariffs raise costs for some businesses",
    summary:
      "Tariffs are taxes on imported goods. Their costs can be shared across businesses and consumers.",
    explanations: {
      Beginner: [
        "A tariff is a tax on goods brought into a country. In the U.S., the importer is generally responsible for paying it to the government.",
        "An importer might raise prices, accept less profit, or negotiate with its supplier. This means a tariff can affect shoppers, but not every product price rises by exactly the tariff amount.",
      ],
      Intermediate: [
        "A hypothetical $100 imported item subject to a 10% tariff has a $10 duty, assuming $100 is its customs value and that duty applies. Other fees and rules may also matter.",
        "The economic cost can be divided among the importer, foreign supplier, downstream businesses, and consumers. Competition and alternative suppliers influence that division.",
      ],
      Advanced: [
        "The legal payer of a tariff and the party bearing its economic cost are different concepts. Cost incidence depends on demand, supply responses, exchange rates, and firms’ margins.",
        "Tariffs may protect some domestic producers while raising input costs for others. Product classifications, exemptions, and trade responses matter, so a broad headline is not a complete estimate of household effects.",
      ],
    },
    terms: [
      {
        term: "Tariff",
        definition: "A tax on imported goods.",
      },
      {
        term: "Importer",
        definition: "The party bringing goods into a country.",
      },
      {
        term: "Supply chain",
        definition: "The connected steps that produce and deliver a product.",
      },
    ],
    matters:
      "Tariffs can affect prices of goods and the materials used to make them. Check which goods are covered before assuming every purchase will cost more.",
    quiz: {
      id: "quiz-decoder-tariffs-01",
      prompt: "Who generally pays a U.S. import tariff to the government?",
      options: [
        "The shopper directly at the border.",
        "The importer.",
        "The foreign government automatically.",
      ],
      correctIndex: 1,
      explanation:
        "The importer generally pays the duty. The economic cost may then be shared through prices, profits, and supplier terms.",
    },
    sources: [
      {
        label: "Boston Fed: how tariff costs reach prices",
        url: "https://www.bostonfed.org/publications/current-policy-perspectives/2025/who-pays-for-tariffs.aspx",
      },
    ],
    contentReviewedAt: "2026-10-03",
  },
  {
    id: "decoder-government-debt-01",
    slug: "government-debt",
    kind: "decoder",
    title: "Debt and deficit are different",
    topic: "Government",
    minutes: 4,
    headline: "Government borrowing increases after an annual budget deficit",
    summary:
      "A deficit describes a budget gap over a period. Debt is the accumulated outstanding borrowing.",
    explanations: {
      Beginner: [
        "A government has a deficit when spending exceeds revenue over a period, such as a year. To help finance that gap, it borrows by issuing securities such as Treasury bonds.",
        "Debt is the outstanding borrowing at a point in time. A deficit is like adding to a balance; debt is the balance itself. They are related but not interchangeable.",
      ],
      Intermediate: [
        "Federal revenue includes taxes, while spending includes public programs and interest costs. Deficits generally add to borrowing needs; refinancing existing debt also leads to Treasury issuance.",
        "Debt held by the public and total federal debt are different measures. Total debt also includes holdings by certain government accounts. Check which measure a headline uses.",
      ],
      Advanced: [
        "Debt sustainability depends on borrowing costs, economic growth, revenue, and spending paths rather than one dollar figure alone. Debt relative to GDP provides scale but does not settle policy choices.",
        "The federal government differs from a household because it taxes and issues debt in its own currency. That does not eliminate resource constraints, interest costs, or risks from failing to meet obligations.",
      ],
    },
    terms: [
      {
        term: "Deficit",
        definition: "The amount spending exceeds revenue over a period.",
      },
      {
        term: "Debt",
        definition: "Outstanding borrowing at a point in time.",
      },
      {
        term: "Treasury security",
        definition: "A debt obligation issued by the U.S. Treasury.",
      },
    ],
    matters:
      "Government borrowing and interest costs influence budget choices. Knowing the difference helps you evaluate claims about taxes, spending, and public priorities.",
    quiz: {
      id: "quiz-decoder-government-debt-01",
      prompt: "Which statement distinguishes deficit from debt?",
      options: [
        "Both always mean the same thing.",
        "Debt is only one year’s spending.",
        "A deficit is a period’s budget gap; debt is outstanding borrowing.",
      ],
      correctIndex: 2,
      explanation:
        "A deficit is measured across a period. Debt is measured at a point in time and reflects accumulated outstanding borrowing.",
    },
    sources: [
      {
        label: "TreasuryDirect: public debt questions",
        url: "https://www.treasurydirect.gov/help-center/public-debt-faqs/",
      },
    ],
    contentReviewedAt: "2026-10-03",
  },
  {
    id: "decoder-corporate-earnings-01",
    slug: "corporate-earnings",
    kind: "decoder",
    title: "Profit is not the same as sales",
    topic: "Business",
    minutes: 4,
    headline: "Company reports higher sales but lower quarterly profit",
    summary:
      "A business can sell more while keeping less after its costs. Revenue and profit tell different stories.",
    explanations: {
      Beginner: [
        "Revenue is the money a business earns from sales before subtracting costs. Profit is what remains after the relevant expenses.",
        "Imagine a hypothetical school-shirt business. Selling $1,000 of shirts sounds good, but if supplies and other costs total $900, only $100 remains as profit.",
      ],
      Intermediate: [
        "A hypothetical company with $1 million in revenue and $900,000 in expenses has $100,000 in profit under this simplified example. Higher revenue does not guarantee higher margins.",
        "An earnings report gives financial results for a period. Compare revenue, expenses, profit, and management’s explanations rather than relying only on whether a headline says sales rose.",
      ],
      Advanced: [
        "Reported earnings depend on accounting rules, timing, and one-time items. Earnings per share can also change because the share count changes, not just because the business earns more.",
        "Distinguish profit from operating cash flow. A profitable sale on credit may not bring cash immediately, and adjusted earnings can exclude costs that matter. Read definitions and reconciliations before comparing figures.",
      ],
    },
    terms: [
      {
        term: "Revenue",
        definition: "Sales income before subtracting expenses.",
      },
      {
        term: "Profit",
        definition: "Income remaining after relevant expenses.",
      },
      {
        term: "Margin",
        definition: "Profit as a share of revenue.",
      },
    ],
    matters:
      "The distinction is useful for understanding a business, a part-time venture, or a headline. Sales alone do not tell you whether costs are under control.",
    quiz: {
      id: "quiz-decoder-corporate-earnings-01",
      prompt: "How can revenue rise while profit falls?",
      options: [
        "Costs rise faster than revenue.",
        "Profit and revenue are identical.",
        "Every sale has no expenses.",
      ],
      correctIndex: 0,
      explanation:
        "If costs grow faster than sales income, less money can remain even when revenue rises.",
    },
    sources: [
      {
        label: "SEC: beginners’ guide to financial statements",
        url: "https://www.sec.gov/investor/pubs/begfinstmtguide.htm",
      },
    ],
    contentReviewedAt: "2026-10-03",
  },
  {
    id: "decoder-crypto-volatility-01",
    slug: "crypto-volatility",
    kind: "decoder",
    title: "Why crypto prices swing",
    topic: "Crypto",
    minutes: 4,
    headline: "Crypto asset price swings sharply after a wave of trading",
    summary:
      "Crypto prices can move quickly. A price swing is not evidence of a guaranteed future return.",
    explanations: {
      Beginner: [
        "A crypto asset is a digital asset that uses cryptographic technology. Its price can change quickly as buyers and sellers react to news, confidence, and demand.",
        "A large price increase does not make an asset safe. A large decrease does not guarantee a rebound. Both are examples of volatility.",
      ],
      Intermediate: [
        "Some crypto markets have limited liquidity, meaning a large trade may move the price substantially. Leverage, or borrowed exposure, can amplify gains and losses.",
        "Risks include price changes, fraud, platform failures, and losing access to keys. Protections vary by asset and provider; a platform’s familiar design does not establish safety.",
      ],
      Advanced: [
        "Fragmented trading venues, leverage-driven liquidations, concentrated holdings, and changing liquidity can amplify moves. Assets marketed as stable can also face reserve, redemption, and market risks.",
        "Separate a token’s claimed use from the protections and obligations behind it. A price chart alone cannot establish value or the ability to recover funds if an intermediary fails.",
      ],
    },
    terms: [
      {
        term: "Volatility",
        definition: "The size and speed of changes in price.",
      },
      {
        term: "Liquidity",
        definition:
          "How easily an asset can be traded without substantially moving its price.",
      },
      {
        term: "Leverage",
        definition: "Using borrowing or other structures to increase exposure.",
      },
    ],
    matters:
      "Understanding volatility helps you recognize that dramatic headlines describe risk as well as movement. This lesson provides context, not a recommendation to trade.",
    quiz: {
      id: "quiz-decoder-crypto-volatility-01",
      prompt: "What does a sharp crypto price increase prove?",
      options: [
        "It will keep rising.",
        "It has no risk.",
        "Only that its price rose over that period.",
      ],
      correctIndex: 2,
      explanation:
        "Past price movement does not guarantee future returns or remove the risks of the asset and trading platform.",
    },
    sources: [
      {
        label: "FINRA: crypto assets",
        url: "https://www.finra.org/investors/investing/investment-products/crypto-assets",
      },
    ],
    contentReviewedAt: "2026-10-03",
  },
  {
    id: "decoder-mortgage-rates-01",
    slug: "mortgage-rates",
    kind: "decoder",
    title: "Why mortgage rates matter",
    topic: "Housing",
    minutes: 4,
    headline: "Rising mortgage rates increase monthly borrowing costs",
    summary:
      "A higher mortgage rate can increase the payment for a new loan of the same size and term.",
    explanations: {
      Beginner: [
        "A mortgage is a loan used to buy property, usually secured by that property. The interest rate affects how much you pay for borrowing, in addition to paying back the loan.",
        "When the rate is higher, a new loan of the same size and length usually costs more each month. The house price is only part of the affordability picture.",
      ],
      Intermediate: [
        "Monthly payments depend on the loan amount, interest rate, and term. Taxes, insurance, and fees add costs beyond principal and interest.",
        "An existing fixed-rate mortgage keeps its contracted rate. An adjustable-rate mortgage can change according to its contract. A headline about new-loan rates does not mean every existing payment changes.",
      ],
      Advanced: [
        "Mortgage rates reflect market interest rates, expected prepayments, credit risk, lender costs, and competition. They are influenced by financial conditions but are not set directly by the Fed.",
        "Compare loan terms and fees as well as the quoted rate. Annual percentage rate includes certain borrowing costs, while taxes and insurance remain separate considerations for a household budget.",
      ],
    },
    terms: [
      {
        term: "Mortgage",
        definition: "A property-secured loan used to finance real estate.",
      },
      {
        term: "Principal",
        definition: "The amount borrowed or the remaining loan balance.",
      },
      {
        term: "Fixed rate",
        definition:
          "An interest rate that stays the same for the agreed loan term.",
      },
    ],
    matters:
      "Borrowing costs affect housing budgets. Understand the complete payment before equating a home’s price with its monthly cost.",
    quiz: {
      id: "quiz-decoder-mortgage-rates-01",
      prompt:
        "Who is most directly affected by a rise in rates for new mortgages?",
      options: [
        "A borrower applying for a new mortgage.",
        "Every existing fixed-rate borrower automatically.",
        "Only people buying homes without a loan.",
      ],
      correctIndex: 0,
      explanation:
        "New borrowers face current loan offers. Existing fixed-rate borrowers keep their contracted rate unless they take a new loan or refinance.",
    },
    sources: [
      {
        label: "Freddie Mac: mortgage rates and affordability",
        url: "https://myhome.freddiemac.com/buying/mortgage-rates",
      },
    ],
    contentReviewedAt: "2026-10-03",
  },
  {
    id: "fundamentals-stocks-and-ownership-01",
    slug: "stocks-and-ownership",
    kind: "fundamentals",
    title: "Stocks and ownership",
    topic: "Investing",
    minutes: 3,
    summary: "Start with what a share actually represents.",
    paragraphs: [
      "Buying a stock means buying a small ownership share in a company. Shareholders may benefit from price increases or dividends, which are payments a company can make to its owners. Neither is guaranteed.",
      "Stocks can lose value, including the full amount invested. Owning shares is different from lending money to the company: owners generally have a claim after creditors if the company is liquidated.",
    ],
    example:
      "Hypothetical example: a company has 1,000 equal shares. Owning 10 gives you 1% ownership. That does not let you withdraw 1% of the company’s cash whenever you want.",
    terms: [
      {
        term: "Share",
        definition: "A unit of ownership in a company.",
      },
      {
        term: "Dividend",
        definition: "A payment a company may make to shareholders.",
      },
      {
        term: "Capital gain",
        definition:
          "An increase realized when an asset is sold for more than its purchase price.",
      },
    ],
    matters:
      "An ownership claim is different from a savings balance. The value of shares can change, and dividends can be reduced or stopped.",
    quiz: {
      id: "quiz-fundamentals-stocks-and-ownership-01",
      prompt: "What does owning a company’s stock represent?",
      options: [
        "A guaranteed loan repayment.",
        "A small ownership share.",
        "A guaranteed annual dividend.",
      ],
      correctIndex: 1,
      explanation:
        "A stock is ownership. Its price and any dividend can change; neither return is guaranteed.",
    },
    sources: [
      {
        label: "Investor.gov: stocks",
        url: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/stocks",
      },
    ],
    contentReviewedAt: "2026-10-03",
  },
  {
    id: "fundamentals-bonds-and-interest-01",
    slug: "bonds-and-interest",
    kind: "fundamentals",
    title: "Bonds and interest rates",
    topic: "Borrowing",
    minutes: 3,
    summary: "Understand lending, repayment, and changing rates.",
    paragraphs: [
      "A bond is a loan to an issuer, such as a government or company. The issuer agrees to terms for interest and repayment. If the issuer cannot meet those terms, the bondholder may lose money.",
      "Prices of existing fixed-rate bonds generally fall when market interest rates rise, and rise when rates fall. Investors compare the old bond’s payments with new alternatives. Maturity, or the repayment date, also matters.",
    ],
    example:
      "Hypothetical example: an old bond pays $30 a year on $1,000, while a comparable new bond pays $50. The old bond may sell for less because its payment is less attractive. This simplified example leaves out credit risk and maturity differences.",
    terms: [
      {
        term: "Bond",
        definition: "A debt obligation issued to borrow money.",
      },
      {
        term: "Coupon",
        definition: "The interest payment specified by a bond.",
      },
      {
        term: "Maturity",
        definition: "The date the bond’s principal is due to be repaid.",
      },
    ],
    matters:
      "Loans, savings, and bonds all involve interest, but have different rules and risks. A bond’s market price can change before it matures.",
    quiz: {
      id: "quiz-fundamentals-bonds-and-interest-01",
      prompt:
        "What generally happens to an existing fixed-rate bond’s price when market rates rise?",
      options: [
        "It is guaranteed to double.",
        "It cannot change.",
        "It tends to fall, with other factors held constant.",
      ],
      correctIndex: 2,
      explanation:
        "New bonds offering higher interest make the older fixed payments less attractive, so the existing bond’s price generally falls.",
    },
    sources: [
      {
        label: "Investor.gov: bonds",
        url: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/bonds-or-fixed-income-products/bonds",
      },
    ],
    contentReviewedAt: "2026-10-03",
  },
  {
    id: "fundamentals-purchasing-power-01",
    slug: "purchasing-power",
    kind: "fundamentals",
    title: "Inflation and purchasing power",
    topic: "Everyday money",
    minutes: 3,
    summary: "Learn why the same amount of money can buy less.",
    paragraphs: [
      "Purchasing power means how much money can buy. Inflation reduces it when prices rise. Not every price changes equally, so different households experience different budget pressures.",
      "Compare pay and savings growth with prices, not just with last year’s dollar amount. A higher income may still buy less if prices rise faster. A broad price index gives context rather than an exact measure of your personal costs.",
    ],
    example:
      "Hypothetical example: your weekly budget rises from $20 to $21, a 5% increase. If the same basket of purchases rises from $20 to $22, a 10% increase, your budget no longer covers that basket.",
    terms: [
      {
        term: "Purchasing power",
        definition: "The goods and services an amount of money can buy.",
      },
      {
        term: "Nominal",
        definition:
          "Measured in current dollars without adjusting for inflation.",
      },
      {
        term: "Real",
        definition: "Adjusted to account for price changes.",
      },
    ],
    matters:
      "Knowing the difference between dollars and buying power makes everyday budget comparisons more meaningful.",
    quiz: {
      id: "quiz-fundamentals-purchasing-power-01",
      prompt:
        "If income rises 5% while the prices you face rise 10%, what happens?",
      options: [
        "Your purchasing power falls.",
        "Your purchasing power doubles.",
        "Prices do not affect purchasing power.",
      ],
      correctIndex: 0,
      explanation:
        "Income grew more slowly than the cost of the basket. More dollars do not always mean greater buying power.",
    },
    sources: [
      {
        label: "BLS: Consumer Price Index questions",
        url: "https://www.bls.gov/cpi/questions-and-answers.htm",
      },
    ],
    contentReviewedAt: "2026-10-03",
  },
  {
    id: "fundamentals-credit-01",
    slug: "credit",
    kind: "fundamentals",
    title: "Credit and credit scores",
    topic: "Everyday money",
    minutes: 3,
    summary: "Separate your borrowing history from a credit score.",
    paragraphs: [
      "Credit lets you borrow with an agreement to repay. A credit report records parts of your borrowing history. A credit score summarizes information from a report using a scoring model.",
      "Different scoring models can give different results. Payment history and the amount of available revolving credit used are important inputs in many models. A score is not a measure of a person’s worth or total wealth.",
      "Reports can contain errors. Checking them and understanding the difference between a score and a report can help you identify problems. Loan offers also depend on factors beyond scores.",
    ],
    example:
      "Hypothetical example: a card has a $1,000 limit and a reported balance of $200. Its utilization is 20%. That ratio is one possible scoring input, not a promise of a particular score.",
    terms: [
      {
        term: "Credit report",
        definition: "A record of credit activity and account information.",
      },
      {
        term: "Credit score",
        definition: "A model-based summary of information in a credit report.",
      },
      {
        term: "Utilization",
        definition: "The share of available revolving credit being used.",
      },
    ],
    matters:
      "Credit information can affect borrowing terms and other applications. Understand the record behind a score rather than treating one number as your whole financial picture.",
    quiz: {
      id: "quiz-fundamentals-credit-01",
      prompt: "How do a credit report and a credit score differ?",
      options: [
        "They are exactly the same document.",
        "The report contains history; the score summarizes it using a model.",
        "A score measures all your savings.",
      ],
      correctIndex: 1,
      explanation:
        "A report contains credit information. A score uses a model to summarize selected information, and scores can differ between models.",
    },
    sources: [
      {
        label: "CFPB: credit reports and scores",
        url: "https://www.consumerfinance.gov/consumer-tools/credit-reports-and-scores/",
      },
    ],
    contentReviewedAt: "2026-10-03",
  },
  {
    id: "fundamentals-risk-and-diversification-01",
    slug: "risk-and-diversification",
    kind: "fundamentals",
    title: "Risk, diversification, and time",
    topic: "Investing",
    minutes: 3,
    summary: "Understand the trade-offs behind long-term investing.",
    paragraphs: [
      "Risk includes the possibility of losing money or falling short of a goal. Diversification means spreading exposure across different investments rather than depending on one company or asset.",
      "Diversification can reduce the impact of one holding doing badly. It cannot prevent every loss, especially when many investments decline together. Time horizon matters because money needed soon has less time to recover from losses.",
      "Compounding means earning a return on previous returns as well as on the original amount. It can also apply to borrowing costs. Investment returns vary, so a constant-rate example is a teaching tool, not a forecast.",
    ],
    example:
      "Hypothetical compounding example: $100 earns a fixed 5% per year with no fees, taxes, deposits, or withdrawals. It becomes $105 after one year and $110.25 after two. Real investments do not promise this steady result.",
    terms: [
      {
        term: "Diversification",
        definition: "Spreading investment exposure across different holdings.",
      },
      {
        term: "Time horizon",
        definition: "How long until you expect to need the money.",
      },
      {
        term: "Compounding",
        definition:
          "Earning returns on prior returns, or accruing interest on prior interest.",
      },
    ],
    matters:
      "Understanding risk and time helps you interpret financial claims. No allocation or long holding period guarantees a profit.",
    quiz: {
      id: "quiz-fundamentals-risk-and-diversification-01",
      prompt: "What can diversification do?",
      options: [
        "Eliminate every possible loss.",
        "Guarantee a fixed return.",
        "Reduce reliance on one holding without removing all risk.",
      ],
      correctIndex: 2,
      explanation:
        "Spreading exposure can reduce concentration risk. Broad market declines and other risks can still produce losses.",
    },
    sources: [
      {
        label: "Investor.gov: diversification",
        url: "https://www.investor.gov/introduction-investing/getting-started/asset-allocation",
      },
    ],
    contentReviewedAt: "2026-10-03",
  },
];

export const decoderLessons = lessons.filter(
  (lesson) => lesson.kind === "decoder",
);
export const fundamentalLessons = lessons.filter(
  (lesson) => lesson.kind === "fundamentals",
);
