import { House, applyCode } from "./data";

const currentPoints = {} as Record<House["name"], number>;
export const realPoints = {} as Record<House["name"], number>;

export const setHouseScore = ({ name, points }: House) => {
    document.querySelector<HTMLElement>(`#${name} .points`)!.innerText = points.toString();
    currentPoints[name] = points;
    realPoints[name] = points;
}

export const updateHouseScore = ({ name, points }: House) => {
    realPoints[name] = points;
    transitionPoints();
}

let inTransistion = false;
const transitionPoints = () => {
    if (inTransistion) return;
    inTransistion = true;

    requestAnimationFrame(() => {
        let somethingChanged = false;
        Object.entries(currentPoints)
            .filter(([name, points]) => points !== realPoints[name])
            .forEach(([name, points]) => {
                currentPoints[name] = points + Math.sign(realPoints[name] - points);
                document.querySelector<HTMLElement>(`#${name} .imgContainer`)!.animate(bounce, timeing);
                document.querySelector<HTMLElement>(`#${name} .points`)!.animate(bounce, timeing);
                setTimeout(() => document.querySelector<HTMLElement>(`#${name} .points`)!.innerText = currentPoints[name].toString(), timeing.duration / 2);
                somethingChanged = true;
                console.log("bounnce");
            });

        if (!somethingChanged) return inTransistion = false;

        setTimeout(() => {
            inTransistion = false;
            transitionPoints();
        }, timeing.duration);
    });
};

const bounce = [
    {
        transform: 'translateY(0px)',
    }, {
        transform: 'translateY(-1rem)',
    }, {
        transform: 'translateY(0px)',
    }
]

const timeing = {
    duration: 250,
    easing: 'ease-in-out',
};



document.querySelectorAll<HTMLElement>('.house').forEach(house => {
    house.addEventListener('click', (e) => {
        if ((e.target as HTMLElement).tagName === 'INPUT') return;

        house.classList.toggle('selected');
        Array(...document.querySelectorAll<HTMLElement>('.selected'))
            .filter(el => el !== house)
            .forEach(house => house.classList.toggle('selected'));
    });

    console.log(house.querySelector<HTMLInputElement>('input'));
    house.querySelector<HTMLInputElement>('form')!.addEventListener('submit', async (e) => {
        const input = (e.target as HTMLElement).querySelector<HTMLInputElement>('input')!;
        const code = input.value;
        input.value = '';

        e.preventDefault();



        const res = await applyCode(code, house.id);
        if (typeof res === "number") {
            // updateHouseScore({ name: house.id as House["name"], points: realPoints[house.id as House["name"]] + res });
            house.classList.remove('selected');
            return
        }

        const error = house.querySelector<HTMLElement>('.error')!;
        error.innerText = res;
    });
});