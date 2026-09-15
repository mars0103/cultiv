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

export const notifications: NotificationItem[] = [
  {
    id: "shopee",
    icon: "/images/hero/ellipse-shopee.png",
    title: "Compras online",
    value: "R$ 79,00",
    date: "27 de outubro",
    left: (525 / 1920) * 100,
    top: (475 / 996) * 100,
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
    top: (488 / 996) * 100,
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
    top: (698 / 996) * 100,
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
    top: (793 / 996) * 100,
    width: (315 / 1920) * 100,
    delay: 1.5,
  },
];
