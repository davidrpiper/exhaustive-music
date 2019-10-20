/*
 * This was designed with eighth notes (quavers) in mind but actually the
 * note length is irrelevant, we're just generating a consecutive set of
 * notes/rests of the same length - they could represent any note lengths.
 */
const Eighth = {
    rest: 'r',
    note: 'n',
    tied: 't',
};

const Time = {
    oneFour: '1:4',
    twoFour: '2:4',
    threeFour: '3:4',
    fourFour: '4:4',
};

const TimeReverse = {
    ['1:4']: 'oneFour',
    ['2:4']: 'twoFour',
    ['3:4']: 'threeFour',
    ['4:4']: 'fourFour',
};

const getEighthNotesPerBar = time => {
    switch (time) {
        default:
            return 1;
        case Time.oneFour:
            return 2;
        case Time.twoFour:
            return 4;
        case Time.threeFour:
            return 6;
        case Time.fourFour:
            return 8;
    }
};

const getEighthNoteCount = (time, bars) => {
    return getEighthNotesPerBar(time) * (bars || 1);
};

/*
 * So I hear you like heap space...
 * This can't do 2 bars of 4:4 with an 8 GB heap.
 * And yes, I could have done it iteratively, but I wanted to try this out.
 */
const doGenerate = (current, last) => {
    if (current === last) {
        return [[Eighth.rest], [Eighth.note], [Eighth.tied]];
    }

    const nextResults = doGenerate(current + 1, last);

    const theseResults = [];

    nextResults.forEach(nextResult => {
        theseResults.push([Eighth.rest].concat(nextResult));
        theseResults.push([Eighth.note].concat(nextResult));
        theseResults.push([Eighth.tied].concat(nextResult));
    });

    return theseResults;
};

const generateNotes = (time, bars) => {
    const noteCount = getEighthNoteCount(time, bars);
    return doGenerate(1, noteCount);
};

const generateXNotes = (n) => {
    return doGenerate(1, n);
}

const defaultBars = 1;
const defaultTime = '4:4';

const dashB = process.argv.indexOf('-b');
const dashT = process.argv.indexOf('-t');
const dashN = process.argv.indexOf('-n');

const bars = dashB === -1 ? defaultBars : Number(process.argv[dashB + 1]) || defaultBars;
const time = dashT === -1 ? defaultTime : Time[TimeReverse[(process.argv[dashT + 1] || defaultTime)]];
const notes = dashN === -1 ? 0 : Number(process.argv[dashN + 1]) || 0;

const lines = notes ? generateXNotes(notes) : generateNotes(time, bars);

lines.forEach(line => {
    console.log(line.join(''));
});