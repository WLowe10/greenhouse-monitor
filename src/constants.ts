import { z } from "zod";

export const companySchema = z.object({
	filter: z.instanceof(RegExp).optional(),
	name: z.string(),
});

export const configSchema = z.object({
	filter: z.instanceof(RegExp).optional(),
	discordWebhook: z.string().url().optional(),
	companies: z.array(companySchema),
});

export type ConfigType = z.infer<typeof configSchema>;
