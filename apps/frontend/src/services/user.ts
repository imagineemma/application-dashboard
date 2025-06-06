import { honoClientUser } from "../lib/api";

export const getUserProfile = honoClientUser.index.$get;
export const getUserStatistics = honoClientUser.statistics.$get;
export const updateUser = honoClientUser.index.$put;
