import { formatDistanceToNowStrict } from "date-fns";

export const process = 'T3ZC9Qix3wYDwLrID5adSOW5AY1lhtJE1sH487C3iFE'

export const truncate = (text: string = "", size: number = 4) => {
  if (text.trim().length == 0) return;
  if (text.length < size) return text;
  return `${text.slice(0, size)}...${text.slice(-size)}`;
};

export const formatTimeRelative = (timestamp: number) => {
  const date = new Date(timestamp*1000);
  if (!date) return;

  const distance = formatDistanceToNowStrict(date, { addSuffix: true });
  return distance;
};

export const quotes = [
  'Arweave turns the fleeting web into a permanent archive, where every search uncovers history preserved forever.',
  'With Arweave, knowledge is no longer fragile—it’s etched into the fabric of time, ready to be discovered by anyone, anywhere.',
  'Searching Arweave is like unlocking a time capsule of human creativity, preserved without expiry.',
  'Every piece of data on Arweave is a chapter in the book of the internet, written once and kept for all generations.',
  'Arweave transforms digital memory into something timeless, where no idea or story is lost.',
  'Each query on Arweave reaches across decades, connecting the present with a permanent past.',
  'In Arweave’s permanent web, nothing is too small to matter—every byte contributes to eternity.',
  'Arweave is more than storage; it’s a living archive of humanity’s digital soul.',
  'With Arweave, history is not rewritten—it is preserved exactly as it happened.',
  'Searching Arweave is like speaking directly to the permanent memory of the internet.',
]
