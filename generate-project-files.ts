import fs from "node:fs";
import path from "node:path";

const VERSION = "2.0.36";

type ProjectName =
  | "rdfjs-dataset-models"
  | "models"
  | "next-utils"
  | "rdf-resource"
  | "rdf-utils"
  | "search"
  | "sparql-models";

interface Project {
  devDependencies?: Record<string, string>;
  externalDependencies: Record<string, string>;
  internalDependencies: readonly ProjectName[];
  name: ProjectName;
}

const externalDependencyVersions = {
  "@rdfjs/types": "^1.1.0",
  "@tpluscode/rdf-ns-builders": "^4.3.0",
  "@types/n3": "^1.16.4",
  "iterator-helpers-polyfill": "^3.0.1",
  n3: "^1.17.3",
  "purify-ts": "~2.1.0",
  "purify-ts-helpers": "1.0.3",
};

const projects: readonly Project[] = [
  {
    devDependencies: {
      "@types/n3": externalDependencyVersions["@types/n3"],
      n3: externalDependencyVersions.n3,
    },
    externalDependencies: {
      "@rdfjs/types": externalDependencyVersions["@rdfjs/types"],
      "iterator-helpers-polyfill":
        externalDependencyVersions["iterator-helpers-polyfill"],
      "purify-ts": externalDependencyVersions["purify-ts"],
    },
    internalDependencies: ["rdf-resource", "rdf-utils"],
    name: "rdfjs-dataset-models",
  },
  {
    externalDependencies: {
      "@rdfjs/types": externalDependencyVersions["@rdfjs/types"],
      "@tpluscode/rdf-ns-builders":
        externalDependencyVersions["@tpluscode/rdf-ns-builders"],
      "purify-ts": externalDependencyVersions["purify-ts"],
      "purify-ts-helpers": externalDependencyVersions["purify-ts-helpers"],
    },
    internalDependencies: [],
    name: "models",
  },
  {
    externalDependencies: {
      "@rdfjs/types": externalDependencyVersions["@rdfjs/types"],
      "@types/n3": "^1.16.4",
      "@types/unbzip2-stream": "^1.4.3",
      "base-x": "^3.0.9",
      envalid: "^8.0.0",
      "jsonld-streaming-parser": "^3.4.0",
      mime: "^4.0.4",
      n3: "^1.17.3",
      "purify-ts": externalDependencyVersions["purify-ts"],
      "unbzip2-stream": "^1.4.3",
    },
    internalDependencies: [],
    name: "next-utils",
  },
  {
    externalDependencies: {
      "@rdfjs/types": externalDependencyVersions["@rdfjs/types"],
      "purify-ts": externalDependencyVersions["purify-ts"],
      "rdf-literal": "^1.3.2",
    },
    internalDependencies: ["rdf-utils"],
    name: "rdf-resource",
  },
  {
    externalDependencies: {
      "@tpluscode/rdf-ns-builders":
        externalDependencyVersions["@tpluscode/rdf-ns-builders"],
      "@rdfjs/term-set": "^1.1.0",
      "@rdfjs/types": externalDependencyVersions["@rdfjs/types"],
      "@types/rdfjs__term-set": "^1.0.2",
    },
    internalDependencies: [],
    name: "rdf-utils",
  },
  {
    externalDependencies: {
      "@rdfjs/types": externalDependencyVersions["@rdfjs/types"],
      "@types/lunr": "^2.3.7",
      axios: "^1.7.2",
      lunr: "^2.3.9",
    },
    internalDependencies: ["rdfjs-dataset-models", "models", "rdf-resource"],
    name: "search",
  },
  {
    devDependencies: {
      "@types/n3": externalDependencyVersions["@types/n3"],
      n3: externalDependencyVersions.n3,
    },
    externalDependencies: {
      "@rdfjs/types": externalDependencyVersions["@rdfjs/types"],
      "@tpluscode/rdf-ns-builders":
        externalDependencyVersions["@tpluscode/rdf-ns-builders"],
      "@types/sparql-http-client": "^3.0.2",
      pino: "^9.1.0",
      "purify-ts": externalDependencyVersions["purify-ts"],
      "sparql-http-client": "^3.0.0",
    },
    internalDependencies: ["rdfjs-dataset-models", "models", "rdf-resource"],
    name: "sparql-models",
  },
];

for (const project of projects) {
  const internalDependencies: Record<string, string> = {};
  for (const internalDependency of project.internalDependencies) {
    internalDependencies[`@kos-kit/${internalDependency}`] = VERSION;
  }

  const projectDirectoryPath = path.join(__dirname, "packages", project.name);

  fs.writeFileSync(
    path.join(projectDirectoryPath, "package.json"),
    `${JSON.stringify(
      {
        dependencies: {
          ...internalDependencies,
          ...project.externalDependencies,
        },
        devDependencies: project.devDependencies,
        engines: {
          node: ">=20",
        },
        main: "index.js",
        files: ["*.d.ts", "*.js"],
        license: "Apache-2.0",
        name: `@kos-kit/${project.name}`,
        scripts: {
          build: "tsc -b",
          check: "biome check",
          "check:write": "biome check --write",
          "check:write:unsafe": "biome check --write --unsafe",
          clean:
            "rimraf *.d.ts* *.js *.js.map __tests__/*.d.ts* __tests__/*.js __tests__/*.js.map tsconfig.tsbuildinfo",
          format: "biome format",
          "format:write": "biome format --write",
          "format:write:unsafe": "biome format --write --unsafe",
          rebuild: "run-s clean build",
          lint: "biome lint",
          "lint:write": "biome lint --write",
          "lint:write:unsafe": "biome lint --write --unsafe",
          test: "biome check && vitest run",
          "test:watch": "vitest watch",
          unlink: `npm unlink -g @kos-kit/${project.name}`,
          watch: "tsc -w --preserveWatchOutput",
        },
        repository: {
          type: "git",
          url: "git+https://github.com/kos-kit/lib",
        },
        type: "module",
        types: "index.d.ts",
        version: "2.0.36",
      },
      undefined,
      2,
    )}\n`,
  );

  for (const fileName of ["biome.json", "LICENSE", "tsconfig.json"]) {
    // const rootFilePath = path.resolve(__dirname, fileName);
    const projectFilePath = path.resolve(projectDirectoryPath, fileName);
    if (fs.existsSync(projectFilePath)) {
      continue;
    }
    fs.symlinkSync(`../../${fileName}`, projectFilePath);
  }
}
