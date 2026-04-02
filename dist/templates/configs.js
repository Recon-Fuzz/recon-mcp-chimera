// Config file generators for Chimera fuzzing suites
export function generateFoundryToml() {
    return `[profile.default]
src = "src"
out = "out"
libs = ["lib"]
solc_version = "0.8.24"

[fuzz]
runs = 10000
max_test_rejects = 1000000
seed = "0x1"

[invariant]
runs = 256
depth = 128
fail_on_revert = false
`;
}
export function generateEchidnaYaml(contractName) {
    return `testMode: assertion
testLimit: 100000
seqLen: 100
deployer: "0x10000"
sender: ["0x20000", "0x30000"]
corpusDir: "echidna-corpus"
cryticArgs: ["--solc-remaps", "@chimera/=lib/chimera/src/"]
contractAddr: "0x00a329c0648769a73afac7f9381e08fb43dbea72"
prefix: "handler_"
filterBlacklist: true
filterFunctions: []
shrinkLimit: 5000
# Target contract
testContract: "CryticTester"
`;
}
export function generateMedusaJson(contractName) {
    const config = {
        fuzzing: {
            workers: 4,
            workerResetLimit: 50,
            timeout: 0,
            testLimit: 100000,
            callSequenceLength: 100,
            corpusDirectory: "medusa-corpus",
            coverageEnabled: true,
            deploymentOrder: ["CryticTester"],
            targetContracts: ["CryticTester"],
            constructorArgs: {},
            deployerAddress: "0x10000",
            senderAddresses: ["0x20000", "0x30000"],
            blockNumberDelayMax: 60480,
            blockTimestampDelayMax: 604800,
            testing: {
                stopOnFailedTest: true,
                stopOnFailedContractMatching: false,
                stopOnNoTests: true,
                testAllContracts: false,
                traceAll: false,
                assertionTesting: {
                    enabled: true,
                    testViewMethods: true,
                    panicCodeConfig: {
                        failOnCompilerInsertedPanic: false,
                        failOnAssertion: true,
                        failOnArithmeticUnderflow: false,
                        failOnDivideByZero: false,
                        failOnEnumCastOutOfBounds: false,
                        failOnIncorrectStorageAccess: false,
                        failOnPopEmptyArray: false,
                        failOnOutOfBoundsAccess: false,
                        failOnAllocateTooMuchMemory: false,
                        failOnCallUninitializedVariable: false,
                    },
                },
                propertyTesting: {
                    enabled: true,
                    testPrefixes: ["invariant_"],
                },
            },
        },
        compilation: {
            platform: "crytic-compile",
            platformConfig: {
                target: ".",
                solcVersion: "0.8.24",
                exportDirectory: "",
                args: ["--foundry-out-directory", "out"],
            },
        },
    };
    return JSON.stringify(config, null, 2) + "\n";
}
//# sourceMappingURL=configs.js.map