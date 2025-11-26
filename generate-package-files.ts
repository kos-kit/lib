#!/usr/bin/env npm exec tsx --

import fs from "node:fs";
import path from "node:path";
import { stringify as stringifyYaml } from "yaml";

const VERSION = "2.0.116";

type PackageName = "models" | "sparql-client";

interface Package {
  devDependencies?: Record<string, string>;
  externalDependencies?: Record<string, string>;
  internalDependencies?: readonly PackageName[];
  linkableDependencies?: readonly string[];
  name: PackageName;
}

const externalDependencyVersions = {
  "@biomejs/biome": { "@biomejs/biome": "1.9.4" },
  "@rdfjs/term-set": { "@rdfjs/term-set": "^2.0.3" },
  "@rdfjs/types": { "@rdfjs/types": "^1.1.0" },
  "@tsconfig/strictest": { "@tsconfig/strictest": "^2.0.5" },
  "@tpluscode/rdf-ns-builders": { "@tpluscode/rdf-ns-builders": "^4.3.0" },
  "@types/n3": { "@types/n3": "^1.26.0" },
  "@types/rdfjs__term-set": { "@types/rdfjs__term-set": "^2.0.9" },
  "@vitest/coverage-v8": { "@vitest/coverage-v8": "^3.2.4" },
  depcheck: { depcheck: "^1.4.7" },
  oxigraph: { oxigraph: "0.4.7" },
  n3: { n3: "^1.26.0" },
  rimraf: { rimraf: "^6.0.1" },
  "purify-ts": { "purify-ts": "~2.1.0" },
  "rdfjs-resource": { "rdfjs-resource": "1.0.24" },
  typescript: { typescript: "5.8.2" },
  vitest: { vitest: "^3.2.4" },
};

const packages: readonly Package[] = [
  {
    externalDependencies: {
      ...externalDependencyVersions["@rdfjs/term-set"],
      ...externalDependencyVersions["@rdfjs/types"],
      "@shaclmate/runtime": "3.0.3",
      ...externalDependencyVersions["@tpluscode/rdf-ns-builders"],
      ...externalDependencyVersions["@types/rdfjs__term-set"],
      ...externalDependencyVersions["purify-ts"],
      ...externalDependencyVersions["rdfjs-resource"],
    },
    internalDependencies: ["sparql-client"],
    name: "models",
  },
  {
    devDependencies: {
      ...externalDependencyVersions["oxigraph"],
      "vitest-fetch-mock": "^0.3.0",
    },
    externalDependencies: {
      ...externalDependencyVersions["@rdfjs/types"],
      ...externalDependencyVersions["@types/n3"],
      ...externalDependencyVersions.n3,
    },
    name: "sparql-client",
  },
];

for (const package_ of packages) {
  const internalDependencies: Record<string, string> = {};
  for (const internalDependency of package_.internalDependencies ?? []) {
    internalDependencies[`@kos-kit/${internalDependency}`] = VERSION;
  }

  const packageDirectoryPath = path.join(__dirname, "packages", package_.name);

  const files = new Set<string>();
  for (const dirent of fs.readdirSync(packageDirectoryPath, {
    withFileTypes: true,
    recursive: true,
  })) {
    if (
      !dirent.name.endsWith(".ts") ||
      !dirent.isFile() ||
      dirent.path.startsWith(path.join(packageDirectoryPath, "node_modules")) ||
      dirent.path.startsWith(path.join(packageDirectoryPath, "__tests__"))
    ) {
      continue;
    }
    for (const fileNameGlob of ["*.js", "*.d.ts", "*.ttl"]) {
      files.add(
        path.join(
          path.relative(packageDirectoryPath, dirent.parentPath),
          fileNameGlob,
        ),
      );
    }
  }

  fs.mkdirSync(packageDirectoryPath, { recursive: true });

  fs.writeFileSync(
    path.join(packageDirectoryPath, "package.json"),
    `${JSON.stringify(
      {
        dependencies: {
          ...internalDependencies,
          ...package_.externalDependencies,
        },
        devDependencies: {
          ...package_.devDependencies,
          ...externalDependencyVersions["@biomejs/biome"],
          ...externalDependencyVersions["@tsconfig/strictest"],
          ...externalDependencyVersions["depcheck"],
          ...externalDependencyVersions["rimraf"],
          ...externalDependencyVersions["typescript"],
          ...externalDependencyVersions["vitest"],
          ...externalDependencyVersions["@vitest/coverage-v8"],
        },
        files: [...files].sort(),
        main: "index.js",
        license: "Apache-2.0",
        name: `@kos-kit/${package_.name}`,
        scripts: {
          build: "tsc -b",
          "build:noEmit": "tsc --noEmit",
          check: "biome check",
          "check:write": "biome check --write",
          "check:write:unsafe": "biome check --write --unsafe",
          clean:
            "rimraf -g **/*.d.ts* **/*.js **/*.js.map tsconfig.tsbuildinfo",
          depcheck: "depcheck .",
          dev: "tsc -w --preserveWatchOutput",
          "dev:noEmit": "tsc --noEmit -w --preserveWatchOutput",
          "link-dependencies": "npm link rdfjs-resource",
          test: "biome check && vitest run",
          "test:coverage": "biome check && vitest run --coverage",
          "test:watch": "vitest watch",
          unlink: `npm unlink -g @kos-kit/${package_.name}`,
        },
        repository: {
          type: "git",
          url: "git+https://github.com/kos-kit/lib",
        },
        type: "module",
        types: "index.d.ts",
        version: VERSION,
      },
      undefined,
      2,
    )}\n`,
  );

  for (const fileName of ["biome.json", "LICENSE"]) {
    // const rootFilePath = path.resolve(__dirname, fileName);
    const packageFilePath = path.resolve(packageDirectoryPath, fileName);
    if (fs.existsSync(packageFilePath)) {
      continue;
    }
    fs.symlinkSync(`../../${fileName}`, packageFilePath);
  }

  fs.writeFileSync(
    path.resolve(packageDirectoryPath, "tsconfig.json"),
    JSON.stringify(
      {
        compilerOptions: {
          baseUrl: "src",
          declaration: true,
          declarationMap: true,
          exactOptionalPropertyTypes: false,
          experimentalDecorators: true,
          forceConsistentCasingInFileNames: true,
          incremental: true,
          noUncheckedIndexedAccess: false,
          outDir: "dist",
          sourceMap: true,
        },
        extends: ["@tsconfig/strictest/tsconfig.json"],
        include: ["src/**/*.ts"],
      },
      undefined,
      2,
    ),
  );

  fs.writeFileSync(
    path.join(packageDirectoryPath, "__tests__", "tsconfig.json"),
    JSON.stringify(
      {
        compilerOptions: {
          baseUrl: ".",
          exactOptionalPropertyTypes: false,
          experimentalDecorators: true,
          forceConsistentCasingInFileNames: true,
          noEmit: true,
          noUncheckedIndexedAccess: false,
        },
        extends: [
          "@tsconfig/strictest/tsconfig.json",
          "@tsconfig/node18/tsconfig.json",
        ],
        include: ["./**/*.ts"],
      },
      undefined,
      2,
    ),
  );
}

// Root package.json
fs.writeFileSync(
  path.join(__dirname, "package.json"),
  `${JSON.stringify(
    {
      devDependencies: {
        tsx: "^4.16.2",
        turbo: "^2.5.5",
        yaml: "^2.5.0",
      },
      name: "shaclmate",
      optionalDependencies: {
        "@biomejs/cli-linux-x64": "1.9.4",
        "@rollup/rollup-linux-x64-gnu": "4.24.0",
      },
      packageManager: "npm@10.9.0",
      private: true,
      scripts: {
        build: "turbo run build",
        "build:packages": 'turbo run --filter "./packages/*" build',
        "build:noEmit": "turbo run build:noEmit",
        check: "biome check",
        "check:write": "biome check --write",
        "check:write:unsafe": "biome check --write --unsafe",
        clean: "turbo run clean",
        depcheck: "turbo run depcheck",
        dev: "turbo run dev dev:tests",
        "dev:noEmit": "turbo run dev:noEmit dev:tests",
        link: "npm link --workspaces",
        "link-dependencies": "turbo run link-dependencies",
        test: "turbo run test",
        "test:coverage": "turbo run test:coverage",
        unlink: "turbo run unlink",
      },
      workspaces: packages.map((package_) => `packages/${package_.name}`),
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
          ...packages
            .filter((package_) =>
              fs.existsSync(
                path.join(__dirname, "packages", package_.name, "__tests__"),
              ),
            )
            .map((package_) => {
              return {
                if: "always()",
                uses: "davelosert/vitest-coverage-report-action@v2",
                with: {
                  "file-coverage-mode": "all",
                  name: package_.name,
                  "json-final-path": `./packages/${package_.name}/coverage/coverage-final.json`,
                  "json-summary-path": `./packages/${package_.name}/coverage/coverage-summary.json`,
                },
              };
            }),
        ],
      },
    },
  }),
);
