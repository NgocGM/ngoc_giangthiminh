export const randomFullName = (): string => {
  const firstNames = ['Nguyen Van', 'Tran Thi', 'Le Van', 'Pham Thi', 'Hoang Van'];
  const lastNames = ['An', 'Binh', 'Cuong', 'Dung', 'Giang', 'Hoa', 'Khanh', 'Linh', 'Minh', 'Nam'];
  const first = firstNames[Math.floor(Math.random() * firstNames.length)];
  const last = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${first} ${last}`;
};

export const randomPhone = (): string => {
  const prefixes = ['090', '091', '093', '094', '096', '097', '098'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = Math.floor(Math.random() * 9_000_000 + 1_000_000).toString();
  return `${prefix}${suffix}`;
};

export const randomEmail = (prefix = 'test'): string => {
  const rand = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${rand}@example.com`;
};

export const randomAddress = (): string => {
  const streets = ['Le Loi', 'Nguyen Hue', 'Tran Hung Dao', 'Pham Ngu Lao', 'Vo Van Tan'];
  const districts = ['Quan 1', 'Quan 3', 'Quan 5', 'Binh Thanh', 'Phu Nhuan'];
  const num = Math.floor(Math.random() * 200 + 1);
  const street = streets[Math.floor(Math.random() * streets.length)];
  const district = districts[Math.floor(Math.random() * districts.length)];
  return `${num} ${street}, ${district}, TP.HCM`;
};
