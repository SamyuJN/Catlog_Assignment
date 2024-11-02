const fs = require('fs');
const BigNumber = require('bignumber.js');

async function main() {
    // Read and parse JSON input from a file
    const content = await fs.promises.readFile('input.json', 'utf8');
    const jsonInput = JSON.parse(content);

    const n = jsonInput.keys.n;
    const k = jsonInput.keys.k;

    const points = new Map();

    for (const key in jsonInput) {
        if (key !== "keys") {
            const point = jsonInput[key];
            const x = parseInt(key, 10);
            const base = point.base;
            const y = new BigNumber(point.value, base);
            points.set(x, y);
        }
    }

    const constantTerm = calculateConstantTerm(points, k);
    console.log("Constant term (c) of the polynomial:", constantTerm.toFixed());
}

function calculateConstantTerm(points, k) {
    let result = new BigNumber(0);

    points.forEach((yj, xj) => {
        let lj = new BigNumber(1);
        
        points.forEach((_, xm) => {
            if (xm !== xj) {
                lj = lj.multipliedBy(new BigNumber(-xm))
                        .dividedBy(new BigNumber(xj - xm));
            }
        });

        result = result.plus(yj.multipliedBy(lj));
    });

    return result;
}

main().catch(console.error);
