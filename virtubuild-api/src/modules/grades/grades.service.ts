import { gradesRepository } from "@/database";

export class GradesService {
	public async listForUser(userId: number) {
		return gradesRepository.find({ where: { userId } });
	}

  public async listForActivity(activityId: number) {
    return gradesRepository.find({ where: { activityId }, relations: ["user", "activity"] });
  }
}


