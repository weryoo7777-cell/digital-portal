export interface ExternalPortalItem {
  id: string;
  name: string;
  nameTh: string;
  agency: string;
  agencyTh: string;
  category: 'gov-tax' | 'banking' | 'corporate-dbd' | 'customs-trade';
  descriptionTh: string;
  descriptionEn: string;
  url: string;
  logoUrl?: string;
  badge?: string;
  badgeColor?: string;
  isPopular?: boolean;
  securityNote?: string;
}

export const EXTERNAL_PORTALS: ExternalPortalItem[] = [
  // 1. ระบบราชการและภาษี (Government & Tax)
  {
    id: 'gov-rd-efiling',
    name: 'RD New e-Filing Portal',
    nameTh: 'กรมสรรพากร — ระบบยื่นแบบภาษีออนไลน์ (New e-Filing)',
    agency: 'Revenue Department of Thailand',
    agencyTh: 'กรมสรรพากร',
    category: 'gov-tax',
    descriptionTh: 'ยื่นแบบแสดงรายการภาษีเงินได้นิติบุคคล (ภ.ง.ด.50/51), ภาษีมูลค่าเพิ่ม (ภ.พ.30) และภาษีหัก ณ ที่จ่าย (ภ.ง.ด.1/2/3/53)',
    descriptionEn: 'Official Internet tax filing portal for Corporate Income Tax, VAT, and Withholding Tax.',
    url: 'https://efiling.rd.go.th',
    logoUrl: 'https://www.google.com/s2/favicons?domain=efiling.rd.go.th&sz=128',
    badge: 'สรรพากร (RD)',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    isPopular: true,
    securityNote: 'ต้องใช้ Laser ID / รหัสผ่าน e-Filing หรือ Digital Certificate'
  },
  {
    id: 'gov-rd-etax',
    name: 'e-Tax Invoice & e-Receipt Portal',
    nameTh: 'ระบบตรวจสอบสถานะใบกำกับภาษีอิเล็กทรอนิกส์ (e-Tax)',
    agency: 'Revenue Department of Thailand',
    agencyTh: 'กรมสรรพากร',
    category: 'gov-tax',
    descriptionTh: 'ตรวจสอบรายชื่อผู้ประกอบการที่ได้รับอนุมัติจัดทำใบกำกับภาษีอิเล็กทรอนิกส์ และตรวจสอบความถูกต้องของลายมือชื่อดิจิทัล',
    descriptionEn: 'Verify electronic tax invoice issuers and validate PDF XML digital signature standards.',
    url: 'https://etax.rd.go.th',
    logoUrl: 'https://www.google.com/s2/favicons?domain=etax.rd.go.th&sz=128',
    badge: 'e-Tax สรรพากร',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    isPopular: true,
    securityNote: 'รองรับการอัปโหลดไฟล์ XML ตรวจสอบ Signature'
  },
  {
    id: 'gov-dbd-datawarehouse',
    name: 'DBD DataWarehouse+',
    nameTh: 'กรมพัฒนาธุรกิจการค้า — DBD DataWarehouse+ ตรวจสอบข้อมูลนิติบุคคล',
    agency: 'Department of Business Development (DBD)',
    agencyTh: 'กรมพัฒนาธุรกิจการค้า',
    category: 'corporate-dbd',
    descriptionTh: 'ค้นหาและตรวจสอบสถานะนิติบุคคล งบการเงินย้อนหลัง รายชื่อกรรมการ ทุนจดทะเบียน และสถานะการจดทะเบียนบริษัทคู่ค้า',
    descriptionEn: 'Company registry search, corporate financial statements, shareholder lists, and business verification.',
    url: 'https://datawarehouse.dbd.go.th',
    logoUrl: 'https://www.google.com/s2/favicons?domain=datawarehouse.dbd.go.th&sz=128',
    badge: 'DBD คลังข้อมูล',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    isPopular: true,
    securityNote: 'ใช้เลขทะเบียนนิติบุคคล 13 หลักในการค้นหา'
  },
  {
    id: 'gov-dbd-ereg',
    name: 'DBD e-Registration',
    nameTh: 'ระบบจดทะเบียนนิติบุคคลทางอิเล็กทรอนิกส์ (DBD e-Registration)',
    agency: 'Department of Business Development (DBD)',
    agencyTh: 'กรมพัฒนาธุรกิจการค้า',
    category: 'corporate-dbd',
    descriptionTh: 'ระบบยื่นคำขอจดทะเบียนจัดตั้งบริษัท เปลี่ยนแปลงกรรมการ แก้ไขวัตถุประสงค์ และเพิ่มทุนจดทะเบียนทางออนไลน์',
    descriptionEn: 'Online business registration and corporate amendment system.',
    url: 'https://ereg.dbd.go.th',
    logoUrl: 'https://www.google.com/s2/favicons?domain=ereg.dbd.go.th&sz=128',
    badge: 'DBD ทะเบียน',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    securityNote: 'ยืนยันตัวตนผ่าน ThaiD หรือ e-KYC DBD'
  },
  {
    id: 'gov-sso-eservice',
    name: 'SSO e-Services',
    nameTh: 'สำนักงานประกันสังคม — ระบบบริการอิเล็กทรอนิกส์ (สปส.)',
    agency: 'Social Security Office (SSO)',
    agencyTh: 'สำนักงานประกันสังคม',
    category: 'gov-tax',
    descriptionTh: 'ยื่นแบบแสดงรายการเงินสมทบประจำเดือน (สปส. 1-10), แจ้งเข้า-แจ้งออกผู้ประกันตน (สปส. 1-03) และชำระเงินสมทบผ่าน e-Payment',
    descriptionEn: 'Monthly social security contribution filing, employee onboarding/offboarding, and e-payment.',
    url: 'https://www.sso.go.th/eservices',
    logoUrl: 'https://www.google.com/s2/favicons?domain=sso.go.th&sz=128',
    badge: 'ประกันสังคม (สปส.)',
    badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    isPopular: true,
    securityNote: 'ต้องเข้าสู่ระบบด้วยรหัสสถานประกอบการ 10 หลัก'
  },
  {
    id: 'gov-customs-nsw',
    name: 'Thai Customs NSW Portal',
    nameTh: 'กรมศุลกากร — National Single Window (NSW) & e-Customs',
    agency: 'Thai Customs Department',
    agencyTh: 'กรมศุลกากร',
    category: 'customs-trade',
    descriptionTh: 'ระบบบริการเชื่อมโยงข้อมูลอิเล็กทรอนิกส์ ณ จุดเดียวสำหรับการนำเข้า-ส่งออกสินค้า, ติดตามสถานะใบขนสินค้า และชำระภาษีศุลกากร',
    descriptionEn: 'National Single Window for customs clearance, import/export declarations, and cargo tracking.',
    url: 'https://www.customs.go.th',
    logoUrl: 'https://www.google.com/s2/favicons?domain=customs.go.th&sz=128',
    badge: 'ศุลกากร (Customs)',
    badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
    isPopular: true,
    securityNote: 'ต้องติดตั้ง Digital Certificate (CA) จากผู้ให้บริการที่รับรอง'
  },
  {
    id: 'gov-doe-workpermit',
    name: 'e-WorkPermit System',
    nameTh: 'กรมการจัดหางาน — ระบบยื่นคำขอใบอนุญาตทำงานอิเล็กทรอนิกส์',
    agency: 'Department of Employment (DOE)',
    agencyTh: 'กรมการจัดหางาน กระทรวงแรงงาน',
    category: 'gov-tax',
    descriptionTh: 'ยื่นขอและต่ออายุใบอนุญาตทำงานสำหรับชาวต่างชาติ (Non-B / BOI) แจ้งการทำงานและเปลี่ยนแปลงสถานที่ทำงาน',
    descriptionEn: 'Foreign worker employment authorization and work permit management system.',
    url: 'https://e-workpermit.doe.go.th',
    logoUrl: 'https://www.google.com/s2/favicons?domain=doe.go.th&sz=128',
    badge: 'กรมการจัดหางาน',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    securityNote: 'ระบบเชื่อมโยงกับสำนักงานตรวจคนเข้าเมือง (สตม.)'
  },
  {
    id: 'gov-dft-eservice',
    name: 'DFT e-Services (C/O Online)',
    nameTh: 'กรมการค้าต่างประเทศ — ระบบออกหนังสือรับรองถิ่นกำเนิดสินค้า (C/O)',
    agency: 'Department of Foreign Trade (DFT)',
    agencyTh: 'กรมการค้าต่างประเทศ',
    category: 'customs-trade',
    descriptionTh: 'ขอหนังสือรับรองถิ่นกำเนิดสินค้า Form FTA (Form E, Form D, Form JTEPA) เพื่อขอลดหย่อนภาษีศุลกากรระหว่างประเทศ',
    descriptionEn: 'Issuance of Certificates of Origin (C/O) under FTA frameworks.',
    url: 'https://www.dft.go.th',
    logoUrl: 'https://www.google.com/s2/favicons?domain=dft.go.th&sz=128',
    badge: 'ค้าต่างประเทศ (DFT)',
    badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
    securityNote: 'ต้องลงทะเบียนผู้ส่งออกกับ DFT ก่อนใช้งาน'
  },

  // 2. สถาบันการเงินและธนาคารองค์กร (Corporate Banking)
  {
    id: 'bank-kbank',
    name: 'KBANK K-Corporate / K-Cash Connect Plus',
    nameTh: 'ธนาคารกสิกรไทย — บริการธนาคารออนไลน์เพื่อธุรกิจ (K-Corporate)',
    agency: 'Kasikornbank PCL',
    agencyTh: 'ธนาคารกสิกรไทย',
    category: 'banking',
    descriptionTh: 'จัดการโอนเงินองค์กร เงินเดือนพนักงาน (Payroll), ชำระภาษีและบิล (Bill Payment), บริการ Trade Finance และรับชำระเงิน',
    descriptionEn: 'Corporate cash management, payroll processing, tax payments, and trade finance.',
    url: 'https://www.kasikornbank.com/th/business/corporate',
    logoUrl: 'https://www.google.com/s2/favicons?domain=kasikornbank.com&sz=128',
    badge: 'KBANK Business',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    isPopular: true,
    securityNote: 'เข้าสู่ระบบด้วย Company ID, User ID และ 2FA Hard/Soft Token'
  },
  {
    id: 'bank-scb',
    name: 'SCB Business Anywhere',
    nameTh: 'ธนาคารไทยพาณิชย์ — SCB Business Anywhere',
    agency: 'Siam Commercial Bank PCL',
    agencyTh: 'ธนาคารไทยพาณิชย์',
    category: 'banking',
    descriptionTh: 'ดิจิทัลแบงก์กิ้งเพื่อธุรกิจ จัดการบัญชีนิติบุคคล โอนเงินอัตโนมัติ ชำระเงินคู่ค้า วงเงินสินเชื่อ และบริการ e-Withholding Tax',
    descriptionEn: 'Enterprise banking platform for funds transfer, vendor payments, and e-Withholding Tax.',
    url: 'https://businessanywhere.scb.co.th',
    logoUrl: 'https://www.google.com/s2/favicons?domain=scb.co.th&sz=128',
    badge: 'SCB Business',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    isPopular: true,
    securityNote: 'ควบคุมสิทธิ์ระดับ Maker / Checker ตามโครงสร้างองค์กร'
  },
  {
    id: 'bank-bbl',
    name: 'Bualuang i-Cash / Corporate iBanking',
    nameTh: 'ธนาคารกรุงเทพ — Bualuang i-Cash บริหารเงินสดสำหรับธุรกิจ',
    agency: 'Bangkok Bank PCL',
    agencyTh: 'ธนาคารกรุงเทพ',
    category: 'banking',
    descriptionTh: 'ระบบ Cash Management นิติบุคคลขนาดใหญ่และ SME รายงานสถานะทางการเงิน Real-time โอนเงินในและต่างประเทศ (SWIFT)',
    descriptionEn: 'Corporate liquidity management, domestic bulk payments, and international SWIFT wire transfers.',
    url: 'https://www.bangkokbank.com/th-TH/Business-Banking/Corporate-Banking/Cash-Management',
    logoUrl: 'https://www.google.com/s2/favicons?domain=bangkokbank.com&sz=128',
    badge: 'BBL i-Cash',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    isPopular: true,
    securityNote: 'รองรับการส่งคำสั่งโอนเงินแบบ Batch File Format'
  },
  {
    id: 'bank-ktb',
    name: 'Krungthai Business / Corporate Online',
    nameTh: 'ธนาคารกรุงไทย — Krungthai Business Online',
    agency: 'Krungthai Bank PCL',
    agencyTh: 'ธนาคารกรุงไทย',
    category: 'banking',
    descriptionTh: 'บริการชำระภาษีศุลกากรและสรรพากรแบบไร้รอยต่อ จ่ายเงินเดือนพนักงาน ข้อมูลเงินฝากและสินเชื่อเพื่อการพาณิชย์',
    descriptionEn: 'Corporate banking with direct integration into Thai customs and government tax gateways.',
    url: 'https://krungthai.com/th/corporate-banking',
    logoUrl: 'https://www.google.com/s2/favicons?domain=krungthai.com&sz=128',
    badge: 'KTB Corporate',
    badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
    securityNote: 'เชื่อมโยงกับระบบจัดซื้อจัดจ้างภาครัฐ (e-GP)'
  },
  {
    id: 'bank-ttb',
    name: 'ttb business one',
    nameTh: 'ทีเอ็มบีธนชาต — ttb business one ธนาคารดิจิทัลเพื่อธุรกิจ',
    agency: 'TMBThanachart Bank PCL',
    agencyTh: 'ธนาคารทหารไทยธนชาต',
    category: 'banking',
    descriptionTh: 'จัดการธุรกรรมการเงินธุรกิจครบวงจร รวมทั้งเงินฝาก สินเชื่อ โอนเงินในและต่างประเทศ และจัดการ FX Lock Rate',
    descriptionEn: 'Unified corporate digital banking with FX hedging and comprehensive treasury solutions.',
    url: 'https://www.ttbbank.com/th/business-one',
    logoUrl: 'https://www.google.com/s2/favicons?domain=ttbbank.com&sz=128',
    badge: 'ttb business one',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    securityNote: 'รองรับ Single Sign-on ผ่าน Token ความปลอดภัยสูง'
  },
  {
    id: 'bank-bay',
    name: 'Krungsri CashLink',
    nameTh: 'ธนาคารกรุงศรีอยุธยา — Krungsri CashLink',
    agency: 'Bank of Ayudhya PCL',
    agencyTh: 'ธนาคารกรุงศรีอยุธยา (MUFG Group)',
    category: 'banking',
    descriptionTh: 'ระบบจัดการกระแสเงินสดสำหรับธุรกิจในไทยและกลุ่มประเทศเอเชีย (MUFG Global Network) โอนเงินคู่ค้าข้ามแดน',
    descriptionEn: 'CashLink portal with deep connectivity to Japan & Asian regional banking corridors.',
    url: 'https://www.krungsri.com/th/business/cash-management/cashlink',
    logoUrl: 'https://www.google.com/s2/favicons?domain=krungsri.com&sz=128',
    badge: 'BAY CashLink',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    securityNote: 'เข้ารหัสความปลอดภัยระดับ TLS 1.3 / ISO 27001'
  },

  // 3. ข้อมูลอัตราแลกเปลี่ยน & ตลาดการเงิน (FX & Financial Markets)
  {
    id: 'fin-bot-fx',
    name: 'Bank of Thailand Foreign Exchange Rates',
    nameTh: 'ธนาคารแห่งประเทศไทย — อัตราแลกเปลี่ยนเงินตราต่างประเทศประจำวัน',
    agency: 'Bank of Thailand (BOT)',
    agencyTh: 'ธนาคารแห่งประเทศไทย',
    category: 'banking',
    descriptionTh: 'ตรวจสอบอัตราแลกเปลี่ยนถัวเฉลี่ยถ่วงน้ำหนักระหว่างธนาคาร (THB/USD, EUR, JPY, CNY) สำหรับใช้ในการบันทึกบัญชีภาษี',
    descriptionEn: 'Official daily reference foreign exchange rates for accounting standards and tax computations.',
    url: 'https://www.bot.or.th/th/statistics/exchange-rate.html',
    logoUrl: 'https://www.google.com/s2/favicons?domain=bot.or.th&sz=128',
    badge: 'ธปท. (BOT)',
    badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
    isPopular: true,
    securityNote: 'อัปเดตทุกวันทำการเวลา 18:00 น.'
  },
  {
    id: 'fin-setlink',
    name: 'SETLink Corporate Portal',
    nameTh: 'ตลาดหลักทรัพย์แห่งประเทศไทย — SETLink ข้อมูลองค์กรและตลาดทุน',
    agency: 'The Stock Exchange of Thailand (SET)',
    agencyTh: 'ตลาดหลักทรัพย์แห่งประเทศไทย',
    category: 'corporate-dbd',
    descriptionTh: 'ระบบบริการสำหรับบริษัทจดทะเบียน ข้อมูลการประชุมผู้ถือหุ้น กฎเกณฑ์กำกับดูแล และการเปิดเผยข้อมูลสำคัญ',
    descriptionEn: 'SETLink digital ecosystem for listed corporations, disclosure guidelines, and capital market filings.',
    url: 'https://www.setlink.set.or.th',
    logoUrl: 'https://www.google.com/s2/favicons?domain=set.or.th&sz=128',
    badge: 'ตลาดหลักทรัพย์ (SET)',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    securityNote: 'เฉพาะผู้แทนบริษัทที่ได้รับอนุญาต'
  }
];
