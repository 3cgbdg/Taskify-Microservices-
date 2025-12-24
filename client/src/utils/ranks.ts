
export const rankThresholds: { name: string; minTasks: number }[] = [
    { name: "Noob", minTasks: 0 },
    { name: "Beginner", minTasks: 10 },
    { name: "Apprentice", minTasks: 25 },
    { name: "Practitioner", minTasks: 50 },
    { name: "Achiever", minTasks: 100 },
    { name: "Master", minTasks: 200 },
    { name: "Grandmaster", minTasks: 400 },
    { name: "Legend", minTasks: 800 },
    { name: "Epic Lord", minTasks: 1600 },
];





export function getRankByCompletedCount(count: number): string {
    for (let i = rankThresholds.length - 1; i >= 0; i--) {
        if (count >= rankThresholds[i].minTasks) {
            return rankThresholds[i].name;
        }
    }
    return rankThresholds[0].name;
}


