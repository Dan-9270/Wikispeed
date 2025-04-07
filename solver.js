const { MongoClient } = require("mongodb");

// BFS
function bfsShortestPath(graph, start, goal) {
    if (start === goal) return [start];

    const visited = new Set();
    const queue = [[start, [start]]];

    while (queue.length > 0) {
        const [current, path] = queue.shift();
        visited.add(current);

        for (const neighbor of graph[current] || []) {
            if (visited.has(neighbor)) continue;
            if (neighbor === goal) return [...path, neighbor];
            queue.push([neighbor, [...path, neighbor]]);
        }
    }

    return null;
}

// Permutations
function* permutations(arr) {
    const length = arr.length;
    const c = Array(length).fill(0);
    let i = 1, k, p;

    yield arr.slice();

    while (i < length) {
        if (c[i] < i) {
            k = i % 2 && c[i];
            [arr[i], arr[k]] = [arr[k], arr[i]];
            ++c[i];
            i = 1;
            yield arr.slice();
        } else {
            c[i] = 0;
            ++i;
        }
    }
}

// Calculer le coût
function computePathCost(path, shortestPaths) {
    let cost = 0;
    for (let i = 0; i < path.length - 1; i++) {
        const key = `${path[i]}|${path[i + 1]}`;
        if (!shortestPaths[key]) return Infinity;
        cost += shortestPaths[key].length - 1;
    }
    return cost;
}

// TSP
async function solveTSP(graph, start, toVisit) {
    const nodes = [start, ...toVisit];
    const shortestPaths = {};

    for (const a of nodes) {
        for (const b of nodes) {
            if (a !== b && !shortestPaths[`${a}|${b}`]) {
                const path = bfsShortestPath(graph, a, b);
                if (path) {
                    shortestPaths[`${a}|${b}`] = path;
                    shortestPaths[`${b}|${a}`] = [...path].reverse();
                }
            }
        }
    }

    let bestRoute = null;
    let bestCost = Infinity;

    for (const perm of permutations(toVisit)) {
        const route = [start, ...perm];
        const cost = computePathCost(route, shortestPaths);
        if (cost < bestCost) {
            bestCost = cost;
            bestRoute = route;
        }
    }

    return { bestRoute, bestCost };
}

// Main
async function main() {
    const uri = "mongodb://localhost:27017";
    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db("wiki");
    const articles = await db.collection("articles")
        .find({}, { projection: { _id: 0, title: 1, links: 1 } })
        .toArray();

    // Construction directe du graphe
    const graph = Object.fromEntries(
        articles.map(article => [article.title, article.links || []])
    );

    const start = "Antoine Meillet";
    const toVisit = ["Arménie", "langues indo-européennes", "Lucien Tesnière"];

    const { bestRoute, bestCost } = await solveTSP(graph, start, toVisit);

    if (bestRoute) {
        console.log("🗺️ Meilleur chemin trouvé :");
        bestRoute.forEach(step => console.log("➡️", step));
        console.log(`\n🧮 Coût total : ${bestCost} sauts`);
    } else {
        console.log("❌ Aucun chemin possible entre les articles donnés.");
    }

    await client.close();
}

main().catch(console.error);
