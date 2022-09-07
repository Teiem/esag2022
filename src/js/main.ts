import { House } from "./data";

export const updateHouseScore = ({ name, points }: House) => document.querySelector<HTMLElement>(`#${name} > .points`)!.innerText = points.toString();