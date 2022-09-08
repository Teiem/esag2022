import { House, applyCode } from "./data";

const currentPoints = {} as Record<House["name"], number>;
export const realPoints = {} as Record<House["name"], number>;

export const setHouseScore = ({ name, points }: House) => {
    document.querySelector<HTMLElement>(`#${name} .points`)!.innerText = points.toString();
    currentPoints[name] = points;
    realPoints[name] = points;
    updateLS();
}

export const updateHouseScore = ({ name, points }: House) => {
    realPoints[name] = points;
    transitionPoints();
    updateLS();
}

const updateLS = () => {
    localStorage.setItem("points", JSON.stringify(realPoints));
};

const loadLS = () => {
    const points = localStorage.getItem("points");
    if (points) {
        const parsedPoints = JSON.parse(points) as Record<House["name"], number>;
        Object.entries(parsedPoints).forEach(([name, points]) => setHouseScore({ name: name as House["name"], points }));
    }
};
loadLS();

let inTransistion = false;
const transitionPoints = () => {
    if (inTransistion) return;
    inTransistion = true;

    requestAnimationFrame(() => {
        let somethingChanged = false;
        Object.entries(currentPoints)
            .filter(([name, points]) => {
                if (points !== realPoints[name]) return true;
                document.querySelector<HTMLElement>(`#${name}`)?.classList.remove("bouncing");
                return false;
            })
            .forEach(([name, points]) => {
                currentPoints[name] = points + Math.sign(realPoints[name] - points);
                document.querySelector<HTMLElement>(`#${name}`)?.classList.add("bouncing");
                document.querySelector<HTMLElement>(`#${name} .imgContainer`)!.animate(bounce, timeing);
                document.querySelector<HTMLElement>(`#${name} .points`)!.animate(bounce, timeing);
                // document.querySelector<HTMLElement>(`#${name}`)!.animate(flash, { ...timeing, easing: "ease-out" });
                setTimeout(() => document.querySelector<HTMLElement>(`#${name} .points`)!.innerText = currentPoints[name].toString(), timeing.duration / 2);
                somethingChanged = true;
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

const flash = [{
        filter: "brightness(1)",
    }, {
        filter: "brightness(1.1)",
    }, {
        filter: "brightness(1)",
        offset: 0.7,
    }
];

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

    house.querySelector<HTMLInputElement>('form')!.addEventListener('submit', async (e) => {
        const input = (e.target as HTMLElement).querySelector<HTMLInputElement>('input')!;
        const code = input.value;
        input.value = '';

        e.preventDefault();


        const error = house.querySelector<HTMLElement>('.error')!;

        const res = await applyCode(code, house.id);
        if (typeof res === "number") {
            updateHouseScore({ name: house.id as House["name"], points: realPoints[house.id as House["name"]] + res });
            house.classList.remove('selected');
            error.innerText = '';
            return
        }

        error.innerText = res;
    });
});