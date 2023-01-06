export default class Timer {
    static now(): bigint;
    static calc(start: bigint, end: bigint, dec?: number): string;
    static convert(input: number, type: "ms" | "mi" | "ns", dec?: number): string;
    private static ms;
}
