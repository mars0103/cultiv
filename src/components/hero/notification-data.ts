export type NotificationItem = {
  id: string;
  icon: string;
  title: string;
  value: string;
  date: string;
  /** position in % relative to the hero canvas (1920x996 reference) */
  left: number;
  top: number;
  /** width in % relative to the hero canvas width */
  width: number;
  delay: number;
};

// The phone mockup moved up (top 365 -> 310 in the 996-tall hero canvas);
// shift the cards up by the same amount so they stay scattered around it.
const PHONE_TOP_SHIFT = 70;

export const notifications: NotificationItem[] = [
  {
    id: "shopee",
    icon: "/images/hero/ellipse-shopee.png",
    title: "Compras online",
    value: "R$ 79,00",
    date: "27 de outubro",
    left: (525 / 1920) * 100,
    top: ((475 - PHONE_TOP_SHIFT) / 996) * 100,
    width: (315 / 1920) * 100,
    delay: 0.9,
  },
  {
    id: "ifood",
    icon: "/images/hero/ellipse-ifood.png",
    title: "Alimentação",
    value: "R$ 58,00",
    date: "10 de setembro",
    left: (1136 / 1920) * 100,
    top: ((488 - PHONE_TOP_SHIFT) / 996) * 100,
    width: (315 / 1920) * 100,
    delay: 1.1,
  },
  {
    id: "uber",
    icon: "/images/hero/ellipse-uber.png",
    title: "Transporte",
    value: "R$ 23,00",
    date: "16 de setembro",
    left: (440 / 1920) * 100,
    top: ((698 - PHONE_TOP_SHIFT) / 996) * 100,
    width: (315 / 1920) * 100,
    delay: 1.3,
  },
  {
    id: "airbnb",
    icon: "/images/hero/ellipse-airbnb.png",
    title: "Hospedagem",
    value: "R$ 345,00",
    date: "9 de outubro",
    left: (1193 / 1920) * 100,
    top: ((793 - PHONE_TOP_SHIFT) / 996) * 100,
    width: (315 / 1920) * 100,
    delay: 1.5,
  },
];
