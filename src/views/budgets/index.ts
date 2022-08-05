import { isBefore, isWithinInterval } from "date-fns";
import { getDatabase, readTransaction } from "../../services/database";
import {
  Period,
  periodInterval,
  breakdownsInPeriod,
} from "../../services/periodService";

interface Expense {
  id?: number;
  name: string;
  date: Date;
  value: number;
  budget_id: number;
}

interface Budget {
  id?: number;
  name: string;
  limitPerPeriod: number;
  period: Period;
  breakdown: Period;
}

interface BudgetViewModel {
  budget: Budget;
  breakdowns: Date[];
  usedThisPeriod: number;
  availibleThisBreakdown: number;
}

async function getExpenses(budget: Budget): Promise<Expense[]> {
  return new Promise(async (resolve, reject) => {
    const db = await getDatabase();

    let allExpenses: Expense[] = await readTransaction(
      db,
      "expenses",
      (store) => {
        const idx = store.index("budget_idx");
        return idx.getAll(IDBKeyRange.only(budget.id));
      }
    );

    const expensesInPeriod = allExpenses.filter((expense) => {
      return isWithinInterval(expense.date, periodInterval(budget.period));
    });

    resolve(expensesInPeriod);
  });
}

async function populateBudget(budget: Budget): Promise<BudgetViewModel> {
  const today = new Date();
  const breakdowns = breakdownsInPeriod(budget.breakdown, budget.period);
  const fundsPerBreakdown = budget.limitPerPeriod / breakdowns.length;

  const expectedExpenses =
    fundsPerBreakdown *
    (breakdowns.filter((date) => isBefore(date, today)).length - 1);

  const trueExpenses = (await getExpenses(budget)).reduce(
    (acc, cur) => acc + cur.value,
    0
  );

  const availibleThisBreakdown =
    fundsPerBreakdown - (trueExpenses - expectedExpenses);

  return new Promise((resolve, reject) => {
    resolve({
      budget,
      breakdowns,
      usedThisPeriod: trueExpenses,
      availibleThisBreakdown,
    });
  });
}

async function fetchBudget(id: number): Promise<Budget> {
  return new Promise(async (resolve, reject) => {
    const db = await getDatabase();

    let budget = await readTransaction(db, "budgets", (store) => {
      return store.get(id);
    });

    resolve(budget);
  });
}

export type { Expense, Budget, BudgetViewModel };
export { fetchBudget, populateBudget };
