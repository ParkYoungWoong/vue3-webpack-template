import { versions, release } from 'process';

/** @description Check node.js version before running programme. */
export const checkNodejsVersion = (
    opts: Partial<{
        lowestVersion: number;
        highestVersion: number;
        isLTS: boolean;
    }> = {}
) => {
    const { lowestVersion = 16, isLTS = true, highestVersion } = opts;
    const [greatestVersion] = versions.node.split('.').map(v => +v);

    // Check the greatest version is equal to or higher than the lowest version.
    if (greatestVersion < lowestVersion) {
        throw new Error(`The Nodejs version should be >= ${lowestVersion}`);
    }

    // Check the greatest version is equal to or lower than the highest version.
    if (highestVersion && greatestVersion > highestVersion) {
        throw new Error(`The Nodejs version should be <= ${highestVersion}`);
    }

    // Check whether is LTS version or not.
    const { lts } = release;
    if (isLTS && (greatestVersion % 2 === 1 || !lts)) {
        throw new Error('Must use LTS version!');
    }

    console.log('The Nodejs version is valid!');
};
