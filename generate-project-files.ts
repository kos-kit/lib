import fs from "node:fs";
import path from "node:path";
import { stringify as stringifyYaml } from "yaml";

const VERSION = "2.0.90";

type ProjectName =
  | "rdfjs-dataset-models"
  | "models"
  | "next-utils"
  | "search"
  | "sparql-builder"
  | "sparql-client"
  | "sparql-models";

interface Project {
  devDependencies?: Record<string, string>;
  externalDependencies?: Record<string, string>;
  files?: readonly string[];
  internalDependencies?: readonly ProjectName[];
  linkableDependencies?: readonly string[];
  name: ProjectName;
}

const externalDependencyVersions = {
  "@rdfjs/types": "^1.1.0",
  "@tpluscode/rdf-ns-builders": "^4.3.0",
  "@types/n3": "^1.21.1",
  oxigraph: "^0.4.0",
  n3: "^1.21.3",
  pino: "^9.1.0",
  "purify-ts": "~2.1.0",
  "purify-ts-helpers": "1.0.7",
  "rdfjs-resource": "1.0.7",
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
    name: "models",
  },
  {
    externalDependencies: {
      "@rdfjs/types": externalDependencyVersions["@rdfjs/types"],
      "@types/n3": externalDependencyVersions["@types/n3"],
      "@types/npmcli__promise-spawn": "6.0.3",
      "@types/unbzip2-stream": "^1.4.3",
      "base-x": "^3.0.9",
      envalid: "^8.0.0",
      "jsonld-streaming-parser": "^3.4.0",
      mime: "^4.0.4",
      pino: externalDependencyVersions["pino"],
      "@npmcli/promise-spawn": "^8.0.0",
      n3: externalDependencyVersions["n3"],
      "purify-ts": externalDependencyVersions["purify-ts"],
      "unbzip2-stream": "^1.4.3",
    },
    files: ["server/*.d.ts", "server/*.js", "*.d.ts", "*.js"],
    name: "next-utils",
  },
  {
    devDependencies: {
      "@types/n3": externalDependencyVersions["@types/n3"],
      n3: externalDependencyVersions.n3,
    },
    externalDependencies: {
      "@rdfjs/types": externalDependencyVersions["@rdfjs/types"],
      pino: externalDependencyVersions["pino"],
      "purify-ts": externalDependencyVersions["purify-ts"],
      "rdfjs-resource": externalDependencyVersions["rdfjs-resource"],
    },
    name: "rdfjs-dataset-models",
  },
  {
    externalDependencies: {
      "@rdfjs/types": externalDependencyVersions["@rdfjs/types"],
      "@types/lunr": "^2.3.7",
      lunr: "^2.3.9",
      "rdfjs-resource": externalDependencyVersions["rdfjs-resource"],
    },
    internalDependencies: ["rdfjs-dataset-models", "models"],
    name: "search",
  },
  {
    devDependencies: {
      "@kos-kit/sparql-client": VERSION,
      oxigraph: externalDependencyVersions["oxigraph"],
    },
    externalDependencies: {
      "@rdfjs/types": externalDependencyVersions["@rdfjs/types"],
      "@tpluscode/rdf-ns-builders":
        externalDependencyVersions["@tpluscode/rdf-ns-builders"],
    },
    name: "sparql-builder",
  },
  {
    devDependencies: {
      oxigraph: externalDependencyVersions["oxigraph"],
      "vitest-fetch-mock": "^0.3.0",
    },
    externalDependencies: {
      "@rdfjs/types": externalDependencyVersions["@rdfjs/types"],
      pino: externalDependencyVersions["pino"],
      "@types/n3": externalDependencyVersions["@types/n3"],
      n3: externalDependencyVersions.n3,
    },
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
      "rdfjs-resource": externalDependencyVersions["rdfjs-resource"],
    },
    internalDependencies: [
      "models",
      "rdfjs-dataset-models",
      "sparql-builder",
      "sparql-client",
    ],
    name: "sparql-models",
  },
];

for (const project of projects) {
  const internalDependencies: Record<string, string> = {};
  for (const internalDependency of project.internalDependencies ?? []) {
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
          "link-dependencies": "npm link purify-ts-helpers rdfjs-resource",
          lint: "biome lint",
          "lint:write": "biome lint --write",
          "lint:write:unsafe": "biome lint --write --unsafe",
          test: "biome check && vitest run",
          "test:coverage": "biome check && vitest run --coverage",
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
        version: "2.0.90",
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
        "@biomejs/biome": "1.9.4",
        "@tsconfig/strictest": "^2.0.5",
        "@types/node": "^22",
        "@vitest/coverage-v8": "^2.0.5",
        eslint: "^8",
        "npm-run-all": "^4.1.5",
        rimraf: "^6.0.1",
        tsx: "^4.16.2",
        typescript: "~5.6",
        vitest: "^2.0.5",
        yaml: "^2.5.0",
      },
      name: "@kos-kit/lib",
      optionalDependencies: {
        "@biomejs/cli-linux-x64": "1.9.4",
        "@rollup/rollup-linux-x64-gnu": "4.24.0",
      },
      private: true,
      scripts: {
        build: "npm run build --workspaces",
        check: "npm run check --workspaces",
        clean: "npm run clean --workspaces",
        "generate-project-files": "tsx generate-project-files.ts",
        link: "npm link --workspaces",
        "link-dependencies": "npm run link-dependencies --workspaces",
        lint: "npm run lint --workspaces",
        rebuild: "npm run rebuild --workspaces",
        test: "npm run test --if-present --workspaces",
        "test:coverage": "npm run test:coverage --if-present --workspaces",
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

// Continuous Integration workflow file
fs.writeFileSync(
  path.join(__dirname, ".github", "workflows", "continuous-integration.yml"),
  stringifyYaml({
    name: "Continuous Integration",
    on: {
      push: {
        "branches-ignore": ["main"],
      },
      workflow_dispatch: null,
    },
    jobs: {
      build: {
        name: "Build and test",
        "runs-on": "ubuntu-latest",
        steps: [
          {
            uses: "actions/checkout@v4",
          },
          {
            uses: "actions/setup-node@v4",
            with: {
              cache: "npm",
              "node-version": 20,
            },
          },
          {
            name: "Install dependencies",
            run: "npm ci",
          },
          {
            name: "Build",
            run: "npm run build",
          },
          {
            name: "Test",
            run: "npm run test:coverage",
          },
          ...projects
            .filter((project) =>
              fs.existsSync(
                path.join(__dirname, "packages", project.name, "__tests__"),
              ),
            )
            .map((project) => {
              return {
                if: "always()",
                uses: "davelosert/vitest-coverage-report-action@v2",
                with: {
                  "file-coverage-mode": "all",
                  name: project.name,
                  "json-final-path": `./packages/${project.name}/coverage/coverage-final.json`,
                  "json-summary-path": `./packages/${project.name}/coverage/coverage-summary.json`,
                },
              };
            }),
        ],
      },
    },
  }),
);
