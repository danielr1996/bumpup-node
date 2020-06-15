const numeric = /^[0-9]+$/

export const compareIdentifiers = (a, b) => {
    const anum = numeric.test(a)
    const bnum = numeric.test(b)

    if (anum && bnum) {
        a = +a
        b = +b
    }

    return a === b ? 0
        : (anum && !bnum) ? -1
            : (bnum && !anum) ? 1
                : a < b ? -1
                    : 1
}

export const rcompareIdentifiers = (a, b) => compareIdentifiers(b, a)
