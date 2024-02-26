import { resolve as pathResolve } from 'path';

/**
 * @description Boxed method for the guidance of the root path of the project
 * @param suffix Suffix relative to the root of the project
 * @returns the correct path
 */
export function withBasePath(suffix = ''): string {
    return pathResolve(__dirname, `../../../${suffix}`);
}
