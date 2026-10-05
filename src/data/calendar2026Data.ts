export interface OfficialHoliday {
  no: number;
  date: number;
  dayOfWeek: string;
  dayOfWeekTh: string;
  month: number; // 1-12
  monthNameEn: string;
  monthNameTh: string;
  occasionEn: string;
  occasionTh: string;
  isHoliday: boolean;
}

export interface MonthMeta {
  monthIndex: number; // 0-11
  monthNumber: number; // 1-12
  nameEn: string;
  nameTh: string;
  shortEn: string;
  shortTh: string;
  daysCount: number;
  startDayOfWeek: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  headerColor: string;
}

export const COMPANY_INFO = {
  nameTh: 'บริษัท ฉี เซิง คอนซัลติ้ง จำกัด',
  nameEn: 'QI SHENG CONSULTING CO.,LTD.',
  addressTh: '888/11 หมู่ 4 ต.มาบยางพร อ.ปลวกแดง จ.ระยอง 21140',
  addressEn: '888/11 Moo.4 Mabyangporn, Pluakdaeng, Rayong 21140',
  email: 'qishengkeji@hotmail.com',
  tel: '083-8300888',
  year: 2026,
  yearTh: 2569
};

export const CALENDAR_STATS = {
  totalDays: 365,
  workingDays: 247,
  publicHolidays: 14,
  weeklyHolidays: 104
};

// 14 Official Company Holidays in 2026 from QI SHENG CONSULTING CO.,LTD. document
export const OFFICIAL_HOLIDAYS_2026: OfficialHoliday[] = [
  {
    no: 1,
    date: 1,
    dayOfWeek: 'Thursday',
    dayOfWeekTh: 'พฤหัสบดี',
    month: 1,
    monthNameEn: 'Jan',
    monthNameTh: 'ม.ค.',
    occasionEn: "New Year's Day",
    occasionTh: 'วันขึ้นปีใหม่',
    isHoliday: true
  },
  {
    no: 2,
    date: 2,
    dayOfWeek: 'Friday',
    dayOfWeekTh: 'ศุกร์',
    month: 1,
    monthNameEn: 'Jan',
    monthNameTh: 'ม.ค.',
    occasionEn: "New Year's Day",
    occasionTh: 'วันขึ้นปีใหม่',
    isHoliday: true
  },
  {
    no: 3,
    date: 13,
    dayOfWeek: 'Monday',
    dayOfWeekTh: 'จันทร์',
    month: 4,
    monthNameEn: 'Apr',
    monthNameTh: 'เม.ย.',
    occasionEn: 'Songkran Festival Day',
    occasionTh: 'วันสงกรานต์',
    isHoliday: true
  },
  {
    no: 4,
    date: 14,
    dayOfWeek: 'Tuesday',
    dayOfWeekTh: 'อังคาร',
    month: 4,
    monthNameEn: 'Apr',
    monthNameTh: 'เม.ย.',
    occasionEn: 'Songkran Festival Day',
    occasionTh: 'วันสงกรานต์',
    isHoliday: true
  },
  {
    no: 5,
    date: 15,
    dayOfWeek: 'Wednesday',
    dayOfWeekTh: 'พุธ',
    month: 4,
    monthNameEn: 'Apr',
    monthNameTh: 'เม.ย.',
    occasionEn: 'Songkran Festival Day',
    occasionTh: 'วันสงกรานต์',
    isHoliday: true
  },
  {
    no: 6,
    date: 1,
    dayOfWeek: 'Friday',
    dayOfWeekTh: 'ศุกร์',
    month: 5,
    monthNameEn: 'May',
    monthNameTh: 'พ.ค.',
    occasionEn: 'National Labour Day',
    occasionTh: 'วันแรงงานแห่งชาติ',
    isHoliday: true
  },
  {
    no: 7,
    date: 12,
    dayOfWeek: 'Wednesday',
    dayOfWeekTh: 'พุธ',
    month: 8,
    monthNameEn: 'Aug',
    monthNameTh: 'ส.ค.',
    occasionEn: "Her Majesty The Queen's BirthDay",
    occasionTh: 'วันแม่แห่งชาติ ร.9',
    isHoliday: true
  },
  {
    no: 8,
    date: 1,
    dayOfWeek: 'Thursday',
    dayOfWeekTh: 'พฤหัสบดี',
    month: 10,
    monthNameEn: 'Oct',
    monthNameTh: 'ต.ค.',
    occasionEn: 'Chinese National Day',
    occasionTh: 'วันชาติจีน',
    isHoliday: true
  },
  {
    no: 9,
    date: 13,
    dayOfWeek: 'Tuesday',
    dayOfWeekTh: 'อังคาร',
    month: 10,
    monthNameEn: 'Oct',
    monthNameTh: 'ต.ค.',
    occasionEn: 'The date of the death of King Rama IX',
    occasionTh: 'วันคล้ายวันสวรรคต ร.9',
    isHoliday: true
  },
  {
    no: 10,
    date: 7,
    dayOfWeek: 'Monday',
    dayOfWeekTh: 'จันทร์',
    month: 12,
    monthNameEn: 'Dec',
    monthNameTh: 'ธ.ค.',
    occasionEn: "Father's Day (Observed)",
    occasionTh: 'ชดเชย วันคล้ายวันเฉลิมพระชนมพรรษาฯ และวันชาติ และวันพ่อแห่งชาติ',
    isHoliday: true
  },
  {
    no: 11,
    date: 28,
    dayOfWeek: 'Monday',
    dayOfWeekTh: 'จันทร์',
    month: 12,
    monthNameEn: 'Dec',
    monthNameTh: 'ธ.ค.',
    occasionEn: "New Year's Eve",
    occasionTh: 'วันสิ้นปี',
    isHoliday: true
  },
  {
    no: 12,
    date: 29,
    dayOfWeek: 'Tuesday',
    dayOfWeekTh: 'อังคาร',
    month: 12,
    monthNameEn: 'Dec',
    monthNameTh: 'ธ.ค.',
    occasionEn: "New Year's Eve",
    occasionTh: 'วันสิ้นปี',
    isHoliday: true
  },
  {
    no: 13,
    date: 30,
    dayOfWeek: 'Wednesday',
    dayOfWeekTh: 'พุธ',
    month: 12,
    monthNameEn: 'Dec',
    monthNameTh: 'ธ.ค.',
    occasionEn: "New Year's Eve",
    occasionTh: 'วันสิ้นปี',
    isHoliday: true
  },
  {
    no: 14,
    date: 31,
    dayOfWeek: 'Thursday',
    dayOfWeekTh: 'พฤหัสบดี',
    month: 12,
    monthNameEn: 'Dec',
    monthNameTh: 'ธ.ค.',
    occasionEn: "New Year's Eve",
    occasionTh: 'วันสิ้นปี',
    isHoliday: true
  }
];

export const MONTHS_2026: MonthMeta[] = [
  {
    monthIndex: 0,
    monthNumber: 1,
    nameEn: 'January',
    nameTh: 'มกราคม',
    shortEn: 'Jan',
    shortTh: 'ม.ค.',
    daysCount: 31,
    startDayOfWeek: 4, // Thu
    headerColor: 'bg-sky-600'
  },
  {
    monthIndex: 1,
    monthNumber: 2,
    nameEn: 'February',
    nameTh: 'กุมภาพันธ์',
    shortEn: 'Feb',
    shortTh: 'ก.พ.',
    daysCount: 28,
    startDayOfWeek: 0, // Sun
    headerColor: 'bg-amber-600'
  },
  {
    monthIndex: 2,
    monthNumber: 3,
    nameEn: 'March',
    nameTh: 'มีนาคม',
    shortEn: 'Mar',
    shortTh: 'มี.ค.',
    daysCount: 31,
    startDayOfWeek: 0, // Sun
    headerColor: 'bg-emerald-600'
  },
  {
    monthIndex: 3,
    monthNumber: 4,
    nameEn: 'April',
    nameTh: 'เมษายน',
    shortEn: 'Apr',
    shortTh: 'เม.ย.',
    daysCount: 30,
    startDayOfWeek: 3, // Wed
    headerColor: 'bg-sky-600'
  },
  {
    monthIndex: 4,
    monthNumber: 5,
    nameEn: 'May',
    nameTh: 'พฤษภาคม',
    shortEn: 'May',
    shortTh: 'พ.ค.',
    daysCount: 31,
    startDayOfWeek: 5, // Fri
    headerColor: 'bg-indigo-600'
  },
  {
    monthIndex: 5,
    monthNumber: 6,
    nameEn: 'June',
    nameTh: 'มิถุนายน',
    shortEn: 'Jun',
    shortTh: 'มิ.ย.',
    daysCount: 30,
    startDayOfWeek: 1, // Mon
    headerColor: 'bg-teal-600'
  },
  {
    monthIndex: 6,
    monthNumber: 7,
    nameEn: 'July',
    nameTh: 'กรกฎาคม',
    shortEn: 'Jul',
    shortTh: 'ก.ค.',
    daysCount: 31,
    startDayOfWeek: 3, // Wed
    headerColor: 'bg-blue-600'
  },
  {
    monthIndex: 7,
    monthNumber: 8,
    nameEn: 'August',
    nameTh: 'สิงหาคม',
    shortEn: 'Aug',
    shortTh: 'ส.ค.',
    daysCount: 31,
    startDayOfWeek: 6, // Sat
    headerColor: 'bg-cyan-600'
  },
  {
    monthIndex: 8,
    monthNumber: 9,
    nameEn: 'September',
    nameTh: 'กันยายน',
    shortEn: 'Sep',
    shortTh: 'ก.ย.',
    daysCount: 30,
    startDayOfWeek: 2, // Tue
    headerColor: 'bg-sky-700'
  },
  {
    monthIndex: 9,
    monthNumber: 10,
    nameEn: 'October',
    nameTh: 'ตุลาคม',
    shortEn: 'Oct',
    shortTh: 'ต.ค.',
    daysCount: 31,
    startDayOfWeek: 4, // Thu
    headerColor: 'bg-blue-700'
  },
  {
    monthIndex: 10,
    monthNumber: 11,
    nameEn: 'November',
    nameTh: 'พฤศจิกายน',
    shortEn: 'Nov',
    shortTh: 'พ.ย.',
    daysCount: 30,
    startDayOfWeek: 0, // Sun
    headerColor: 'bg-indigo-700'
  },
  {
    monthIndex: 11,
    monthNumber: 12,
    nameEn: 'December',
    nameTh: 'ธันวาคม',
    shortEn: 'Dec',
    shortTh: 'ธ.ค.',
    daysCount: 31,
    startDayOfWeek: 2, // Tue
    headerColor: 'bg-slate-700'
  }
];

export function getHolidayForDate(monthNumber: number, day: number): OfficialHoliday | undefined {
  return OFFICIAL_HOLIDAYS_2026.find(h => h.month === monthNumber && h.date === day);
}
