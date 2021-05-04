import { Request, Response, Router } from "express";
import { getRepository } from "typeorm";
import { Task } from "../../entity/Task";
import { ResponseTaskDTO } from "../../dtos/task.dto";
import { ResponseObject } from "../../common/response/response.object";
import { formatResponse } from "../../common/utils";
import { HttpStatus } from "../../common/response/response.type";
import moment = require("moment");

const taskRoute = Router();
//把 api 相關內容放進 controller
//get 取得全部待辦事項
export const getTasks = async function (req: Request, res: Response) {
  //JWT
  const { id } = res.locals.jwtPayload;
  const filterType: string = String(req.query.filterType);
  const isFilterTypeValid = ["", "completed", "uncompleted"].includes(
    filterType
  );
  if (!isFilterTypeValid) {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      status: HttpStatus.UNAUTHORIZED,
      message: "failed getting data",
    });
  }
  let tasks;
  if (filterType === "completed") {
    tasks = await getRepository(Task).find({
      where: { completed: true, userId: id },
    });
    return res.status(HttpStatus.OK).json({ status: HttpStatus.OK, tasks });
    // const dtos = tasks.map((task: Task) => new ResponseTaskDTO(task));
    // console.log(dtos);
    // return formatResponse(dtos, HttpStatus.OK)
  } else if (filterType === "uncompleted") {
    tasks = await getRepository(Task).find({
      where: { completed: false, userId: id },
    });
    // const dtos = tasks.map((task: Task) => new ResponseTaskDTO(task));
    // console.log(dtos);
    return res.status(HttpStatus.OK).json({ status: HttpStatus.OK, tasks });
    // return formatResponse(dtos, HttpStatus.OK);
  } else if (filterType === "") {
    tasks = await getRepository(Task).find({ where: { userId: id } });
    return res.status(HttpStatus.OK).json({ status: HttpStatus.OK, tasks });
    // const dtos = tasks.map((task: Task) => new ResponseTaskDTO(task));
    // console.log(dtos);
    // return formatResponse( dtos, HttpStatus.OK)
  }
};

//post 新增待辦事項
export const createTasks = async function (req: Request, res: Response) {
  //JWT
  const { id } = res.locals.jwtPayload;
  const content = req.body.content;
  if (content != null && content !== undefined) {
    try {
      const data = {
        ...req.body,
        userId: id,
      };
      const content_create = getRepository(Task).create(data);
      const results = await getRepository(Task).save(content_create);
      return res
        .status(HttpStatus.OK)
        .json({ status: HttpStatus.OK, data: { results } });
    } catch (err) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        status: HttpStatus.UNAUTHORIZED,
        message: "'content' is required parameter.",
      });
    }
  } else {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      status: HttpStatus.UNAUTHORIZED,
      message: "'content' is undefined",
    });
  }
};

// patch 修改指定待辦事項資料
export const updateTasks = async function (req: Request, res: Response) {
  //JWT
  try {
    const { id } = res.locals.jwtPayload;
    const taskRepository = getRepository(Task);
    const task = await taskRepository.findOne({
      where: { id: req.params.id, userId: id },
    });
    if (req.body.content !== undefined) {
      task.content = req.body.content;
    }
    if (req.body.completed) {
      task.completed = req.body.completed;
      if (req.body.completed == true)
        task.completedAt = String(moment().format("MMMM Do YYYY, h:mm:ss a"));
    }
    const updatedTask = await taskRepository.save(task);
    const results = taskRepository.save(updatedTask);
    return res
      .status(HttpStatus.OK)
      .json({ status: HttpStatus.OK, data: { results } });
  } catch (err) {
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ status: HttpStatus.UNAUTHORIZED, message: "request went wrong" });
  }
};

//delete 刪除待辦事項
export const removeTasks = async function (req: Request, res: Response) {
  const { id } = res.locals.jwtPayload;
  const taskId = Number(req.params.id);
  const taskRepository = getRepository(Task);
  const { affected } = await taskRepository.delete({
    id: taskId,
    userId: id,
  });
  if (affected === 0) {
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ status: HttpStatus.UNAUTHORIZED, message: "delete went wrong" });
  } else {
    return res.status(HttpStatus.OK).json({ status: HttpStatus.OK, data: {} });
  }
};
export default taskRoute;
