import { honoClientCoverLetter } from "../lib/api";

export const getCoverLetterContent = honoClientCoverLetter[":id"].$post;
export const downloadCoverLetter = honoClientCoverLetter[":id"].download.$post;
