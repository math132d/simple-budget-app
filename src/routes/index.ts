import { RouteRecordRaw } from "vue-router";

import Home from "@/views/home.vue";
import Budget from "@/views/budgets/budget.vue";
import BudgetList from "@/views/budgets/index.vue";
import AddBudget from "@/views/budgets/add.vue";
import AddExpense from "@/views/budgets/expense.vue";

export default [
  {
    path: "/",
    redirect: "/budgets",
  },
  {
    path: "/budgets",
    component: BudgetList,
    children: [
      {
        path: "add",
        component: AddBudget,
      },
      {
        path: ":id/expense",
        component: AddExpense,
      },
    ],
  },
  { path: "/budgets/:id/", component: Budget },
] as RouteRecordRaw[];
