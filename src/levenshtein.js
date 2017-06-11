/*
 * Calculate Levenshtein distance between two strings
 * based on https://people.cs.pitt.edu/~kirk/cs1501/Pruhs/Spring2006/assignments/editdistance/Levenshtein%20Distance.htm
 */


// thx https://stackoverflow.com/a/39243778/5022115
const matrix = (m, n) => {
    let result = [];
    for(let i = 0; i < n; i++) {
        result.push(new Array(m).fill(0));
    }
    return result;
};


const levenshtein = (s, t) => {
    s = s.toLowerCase();
    t = t.toLowerCase();

    const n = s.length;
    const m = t.length;

    if (n === 0 || m === 0) {
        return n + m;
    }

    const mat = matrix(m + 1, n + 1);

    for (let i = 0; i <= n; i++) {
        mat[i][0] = i;
    }

    for (let j = 0; j <= m; j++) {
        mat[0][j] = j;
    }

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
            const cost = !(s[i] === t[j]);  // true has value 1 when added, false 0

            mat[i + 1][j + 1] = Math.min(
                mat[i][j + 1] + 1,
                mat[i + 1][j] + 1,
                mat[i][j] + cost,
            );
        }
    }

    return mat[n][m];
};

export default levenshtein;