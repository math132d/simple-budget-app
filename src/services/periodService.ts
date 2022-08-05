import {
  eachDayOfInterval,
  eachMonthOfInterval,
  eachWeekOfInterval,
  endOfDay,
  Interval,
  lastDayOfMonth,
  lastDayOfWeek,
  lastDayOfYear,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";

enum Period {
  Day,
  Week,
  Month,
  Year,
}

function wordFromPeriod(period: Period): String {
  return ["day", "week", "month", "year"][period];
}

function periodInterval(period: Period): Interval {
  switch (period) {
    case Period.Day:
      return getCurrentDayInterval();
    case Period.Week:
      return getCurrentWeekInterval();
    case Period.Month:
      return getCurrentMonthInterval();
    case Period.Year:
      return getCurrentYearInterval();
    default:
      throw new Error("Cannot get interval for period.");
  }
}

function breakdownsInPeriod(breakdown: Period, period: Period): Date[] {
  const interval = periodInterval(period);

  if (breakdown === period || breakdown === Period.Year)
    return [interval.end as Date];

  switch (breakdown) {
    case Period.Day:
      return eachDayOfInterval(interval);
    case Period.Week:
      return eachWeekOfInterval(interval);
    case Period.Month:
      return eachMonthOfInterval(interval);
    default:
      throw new Error("Invalid breakdown type");
  }
}

function getCurrentDayInterval(): Interval {
  const today = new Date();
  return {
    start: startOfDay(today),
    end: endOfDay(today),
  };
}

function getCurrentWeekInterval(): Interval {
  const today = new Date();
  return {
    start: startOfWeek(today),
    end: lastDayOfWeek(today),
  };
}

function getCurrentMonthInterval(): Interval {
  const today = new Date();
  return {
    start: startOfMonth(today),
    end: lastDayOfMonth(today),
  };
}

function getCurrentYearInterval(): Interval {
  const today = new Date();
  return {
    start: startOfYear(today),
    end: lastDayOfYear(today),
  };
}

export { wordFromPeriod, periodInterval, breakdownsInPeriod, Period };
