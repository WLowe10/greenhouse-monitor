import axios from "axios";
import { parse } from "node-html-parser";

const greenhouseBoardsUrl = "https://boards.greenhouse.io/embed/job_board";

export type GreenhouseJob = {
	id: string;
	url: string;
	title: string;
	location: string;
	departmentId: string | undefined;
	officeId: string | undefined;
};

export class GreenhouseMonitor {
	public async poll(companyName: string): Promise<GreenhouseJob[]> {
		const boardURL = `${greenhouseBoardsUrl}?for=${companyName}`;

		const response = await axios.get(boardURL, {
			headers: {
				"User-Agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
			},
		});

		return this.parseJobs(response.data);
	}

	private parseJobs(body: string): GreenhouseJob[] {
		const doc = parse(body);

		const jobs: GreenhouseJob[] = [];

		doc.querySelectorAll(".opening").forEach((opening) => {
			const departmentId = opening.getAttribute("department_id");
			const officeId = opening.getAttribute("office_id");

			// could also potentially just use the first child as the job link node, however, i'm not 100% sure if all greenhouse boards satisfy that
			const linkNode = opening.querySelector("a[target='_top']");

			if (!linkNode) return;

			const title = linkNode.text?.trim();

			if (!title) return;

			const href = linkNode.getAttribute("href");

			if (!href) return;

			const jobID = href.split("jid=")[1];

			if (!jobID) return;

			const location = opening.querySelector(".location")?.text;

			if (!location) return;

			jobs.push({
				id: jobID,
				url: href,
				title,
				location,
				departmentId,
				officeId,
			});
		});

		return jobs;
	}
}
