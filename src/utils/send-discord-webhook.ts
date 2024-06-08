import axios from "axios";
import type { GreenhouseJob } from "../greenhouse/monitor.js";

export type SendDiscordWebhookData = {
	company: string;
	job: GreenhouseJob;
};

export function sendDiscordWebhook(webhookUrl: string, { company, job }: SendDiscordWebhookData) {
	return axios.post(webhookUrl, {
		username: "Greenhouse Monitor",
		content: null,
		embeds: [
			{
				title: "New job detected",
				url: job.url,
				color: 3447003,
				timestamp: new Date().toISOString(),
				fields: [
					{
						name: "Company",
						value: company,
					},
					{
						name: "Title",
						value: job.title,
						inline: true,
					},
					{
						name: "Location",
						value: job.location,
						inline: true,
					},
				],
			},
		],
	});
}
