import fs from "node:fs";
import path from "node:path";

const VERSION = "2.0.55";

type ProjectName =
  | "rdfjs-dataset-models"
  | "models"
  | "next-utils"
  | "rdf-resource"
  | "rdf-utils"
  | "search"
  | "sparql-client"
  | "sparql-models";

interface Project {
  devDependencies?: Record<string, string>;
  externalDependencies: Record<string, string>;
  files?: readonly string[];
  internalDependencies: readonly ProjectName[];
  name: ProjectName;
}

const externalDependencyVersions = {
  "@rdfjs/types": "^1.1.0",
  "@tpluscode/rdf-ns-builders": "^4.3.0",
  "@types/n3": "^1.16.4",
  "iterator-helpers-polyfill": "^3.0.1",
  n3: "^1.17.3",
  pino: "^9.1.0",
  "purify-ts": "~2.1.0",
  "purify-ts-helpers": "1.0.3",
};

const projects: readonly Project[] = [
  {
    externalDependencies: {
      "@rdfjs/types": externalDependencyVersions["@rdfjs/types"],
      "@tpluscode/rdf-ns-builders":
        externalDependencyVersions["@tpluscode/rdf-ns-builders"],
      pino: externalDependencyVersions["pino"],
      "purify-ts": externalDependencyVersions["purify-ts"],
      "purify-ts-helpers": externalDependencyVersions["purify-ts-helpers"],
    },
    files: ["abc/*.d.ts", "abc/*.js", "*.d.ts", "*.js"],
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
    devDependencies: {
      "@types/n3": externalDependencyVersions["@types/n3"],
      n3: externalDependencyVersions.n3,
    },
    externalDependencies: {
      "@rdfjs/types": externalDependencyVersions["@rdfjs/types"],
      "iterator-helpers-polyfill":
        externalDependencyVersions["iterator-helpers-polyfill"],
      pino: externalDependencyVersions["pino"],
      "purify-ts": externalDependencyVersions["purify-ts"],
    },
    internalDependencies: ["rdf-resource", "rdf-utils"],
    name: "rdfjs-dataset-models",
  },
  {
    externalDependencies: {
      "@rdfjs/types": externalDependencyVersions["@rdfjs/types"],
      "@types/lunr": "^2.3.7",
      lunr: "^2.3.9",
    },
    internalDependencies: ["rdfjs-dataset-models", "models", "rdf-resource"],
    name: "search",
  },
  {
    devDependencies: {
      "vitest-fetch-mock": "^0.3.0",
    },
    externalDependencies: {
      "@rdfjs/types": externalDependencyVersions["@rdfjs/types"],
      pino: externalDependencyVersions["pino"],
      "@types/n3": "^1.16.4",
      n3: "^1.17.3",
    },
    internalDependencies: [],
    name: "sparql-client",
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
      pino: externalDependencyVersions["pino"],
      "purify-ts": externalDependencyVersions["purify-ts"],
    },
    internalDependencies: [
      "models",
      "rdf-resource",
      "rdfjs-dataset-models",
      "sparql-client",
    ],
    name: "sparql-models",
  },
];

for (const project of projects) {
  const internalDependencies: Record<string, string> = {};
  for (const internalDependency of project.internalDependencies) {
    internalDependencies[`@kos-kit/${internalDependency}`] = VERSION;
  }

  const projectDirectoryPath = path.join(__dirname, "packages", project.name);

  fs.mkdirSync(projectDirectoryPath, { recursive: true });

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
        files: project.files ?? ["*.d.ts", "*.js"],
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
        version: "2.0.55",
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

// Root package.json
fs.writeFileSync(
  path.join(__dirname, "package.json"),
  `${JSON.stringify(
    {
      devDependencies: {
        "@biomejs/biome": "1.8.3",
        "@tsconfig/strictest": "^2.0.5",
        "@types/node": "^20",
        eslint: "^8",
        "npm-run-all": "^4.1.5",
        rimraf: "^6.0.1",
        tsx: "^4.16.2",
        typescript: "~5.5",
        vitest: "^2.0.5",
      },
      name: "@kos-kit/lib",
      private: true,
      scripts: {
        build: "npm run build --workspaces",
        check: "npm run check --workspaces",
        clean: "npm run clean --workspaces",
        "generate-project-files": "tsx generate-project-files.ts",
        link: "npm link --workspaces",
        lint: "npm run lint --workspaces",
        rebuild: "npm run rebuild --workspaces",
        test: "npm run test --if-present --workspaces",
        unlink: "npm run unlink --workspaces",
        watch: "run-p watch:*",
        ...projects.reduce(
          (watchEntries, project) => {
            watchEntries[`watch:${project.name}`] =
              `npm run watch -w @kos-kit/${project.name}`;
            return watchEntries;
          },
          {} as Record<string, string>,
        ),
      },
      workspaces: projects.map((project) => `packages/${project.name}`),
    },
    undefined,
    2,
  )}\n`,
);
