import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Task } from "../../entity/Task";
import * as moment from "moment";
import { HttpStatus } from "../../common/response/response.type";

interface Report {
  date: string;
  createdTotal: number;
  completedTotal: number;
}
// calculate the numbers of days between two dates(count means: how many day)
const pastDate = (today: Date, count: number) => {
  let currentDate = new Date(today.valueOf());
  const currentTime = currentDate.getTime();
  const pastDate = formatTime(
    new Date(currentDate.setTime(currentTime - count * oneDay))
  );
  return pastDate;
};
// 若 task 為七天以內則 return
const FilterTask = (
  currentTime: number,
  Task: Task,
  status: string,
  days: number
) => {
  const date = Task[status];
  if (date != null) {
    const pastTime = date.getTime();
    const diffDays = Math.round(Math.abs((currentTime - pastTime) / oneDay));
    if (diffDays <= days) return Task; //更新後的 task
  }
};
// set today report json value
const setToday = (tasks: Array<Task>, today: Date, results, taskType) => {
  const countTask = tasks.filter((Task) =>
    FilterTask(today.getTime(), Task, taskType + "At", 1)
  );
  results["todayReport"][taskType + "Total"] = countTask.length;
};
// set weekly report json value
const setWeekly = (tasks: Array<Task>, today: Date, results, taskType) => {
  const countTask = tasks.filter((Task) =>
    FilterTask(today.getTime(), Task, taskType + "At", 7)
  );
  results["weeklyReport"][taskType + "Total"] = countTask.length;
};
// getReports API
export const getReports = async function (req: Request, res: Response) {
  const { id } = res.locals.jwtPayload;
  const taskRepository = getRepository(Task);
  //get Task all value
  const tasks = taskRepository.find({ where: { userId: id } });
  const reportStartDate = moment().subtract(6, "day").format("YYYY-MM-DD");
  //get completed = true value
  const createdTasksPromise = taskRepository.find({
    createdAt: MoreThan(reportStartDate),
    userId: id,
  });
  const completedTasksPromise = taskRepository.find({
    completedAt: MoreThan(reportStartDate),
    userId: id,
  });

  const [createdTasks, completedTasks] = await Promise.all([
    createdTasksPromise,
    completedTasksPromise,
  ]);
  const responseData = formatReport(createdTasks, completedTasks);
  return res
    .status(HttpStatus.OK)
    .json({ status: HttpStatus.OK, data: responseData });
};
