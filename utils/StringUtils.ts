const firstNames = ['Nguyen Van', 'Tran Thi', 'Le Van', 'Pham Thi', 'Hoang Van'];
const lastNames = ['An', 'Binh', 'Cuong', 'Dung', 'Giang', 'Hoa', 'Khanh', 'Linh', 'Minh', 'Nam'];
const prefixes = ['090', '091', '093', '094', '096', '097', '098'];
const streets = ['Le Loi', 'Nguyen Hue', 'Tran Hung Dao', 'Pham Ngu Lao', 'Vo Van Tan'];
const districts = ['Quan 1', 'Quan 3', 'Quan 5', 'Binh Thanh', 'Phu Nhuan'];

const pickRandom = <T>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

export const randomString = (length: number = 8): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';

  for (let index = 0; index < length; index++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
};

export const randomFullName = (): string => {
  return `${pickRandom(firstNames)} ${pickRandom(lastNames)}`;
};

export const randomPhone = (): string => {
  const prefix = pickRandom(prefixes);
  const suffix = Math.floor(Math.random() * 9_000_000 + 1_000_000).toString();

  return `${prefix}${suffix}`;
};

export const randomEmail = (prefix: string = 'test'): string => {
  return `${prefix}_${randomString(6)}@example.com`;
};

export const randomAddress = (): string => {
  const number = Math.floor(Math.random() * 200 + 1);

  return `${number} ${pickRandom(streets)}, ${pickRandom(districts)}, TP.HCM`;
};