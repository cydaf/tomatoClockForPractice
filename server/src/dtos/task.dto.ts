import { ResponseDTOBase } from "./dto.base";
import { Task } from "../entity/Task";

export class ResponseTaskDTO extends ResponseDTOBase {
  public readonly content!: string;
  public readonly completed!: boolean;
  public readonly completedAt!: string;
  public readonly user_id!: string;

  constructor(entity: Task) {
    super(entity);
    this.user_id = entity.userId;
    this.content = entity.content;
    this.completed = entity.completed;
    this.completedAt = entity.completedAt;
  }
}
