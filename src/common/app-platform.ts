import {z} from 'zod';

export const AppPlatform = z.enum(['ios', 'android']);
export type AppPlatform = z.infer<typeof AppPlatform>;
