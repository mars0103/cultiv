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

// Positions are % of the Hero illustration box (Zen woman + phone), matching
// the Figma composition: uber sits by her shoulder, shopee by her raised
// hand, ifood lower-right, all floating around the meditating figure.
export const notifications: NotificationItem[] = [
  {
    id: "shopee",
    icon: "/images/hero/ellipse-shopee.png",
    title: "Compras online",
    value: "R$ 79,00",
    date: "27 de outubro",
    left: 44,
    top: 55,
    width: 15,
    delay: 0.6,
  },
  {
    id: "ifood",
    icon: "/images/hero/ellipse-ifood.png",
    title: "Alimentação",
    value: "R$ 58,00",
    date: "10 de setembro",
    left: 70,
    top: 74,
    width: 14,
    delay: 1.15,
  },
  {
    id: "uber",
    icon: "/images/hero/ellipse-uber.png",
    title: "Transporte",
    value: "R$ 23,00",
    date: "16 de setembro",
    left: 60,
    top: 45,
    width: 14.5,
    delay: 1.7,
  },
];
